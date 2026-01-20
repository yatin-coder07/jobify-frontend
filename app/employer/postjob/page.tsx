"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const jobSchema = z.object({
  title: z
    .string()
    .min(3, "Job title must be at least 3 characters"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters"),
  location: z
    .string()
    .min(2, "Location is required"),
});

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const parsed = jobSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrors({ general: "You must be logged in to post a job." });
      return;
    }

    setSubmitting(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!res.ok) {
      setErrors({ general: "Failed to create job. Please try again." });
      setSubmitting(false);
      return;
    }

   router.push("/employer/jobs");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-32">
      <div className="mx-auto grid max-w-7xl gap-20 md:grid-cols-2">
        
        <div className="space-y-8">
          <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-gray-900">
            Post a Job
          </h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Create a job listing that reaches the right candidates. Clear job
            descriptions and locations help you attract better talent faster.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Write clear titles
              </h3>
              <p className="text-sm text-gray-500">
                Use specific job titles to attract the right applicants.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Be descriptive
              </h3>
              <p className="text-sm text-gray-500">
                Mention responsibilities, tools, and expectations clearly.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Location matters
              </h3>
              <p className="text-sm text-gray-500">
                Specify remote or on-site to avoid mismatches.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Job Details
          </h2>

          {errors.general && (
            <p className="mb-4 text-sm text-red-600">
              {errors.general}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the role, responsibilities, and requirements"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote / Delhi / Bangalore"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
