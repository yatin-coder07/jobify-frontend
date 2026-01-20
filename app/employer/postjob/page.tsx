"use client";

import { useState } from "react";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters"),
  location: z.string().min(2, "Location is required"),
});

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      location: "",
    });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

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

    try {
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
        throw new Error("Request failed");
      }

      // ✅ success
      setSuccess(true);
      resetForm();
    } catch (error) {
      setErrors({ general: "Failed to create job. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-32">
      <div className="mx-auto grid max-w-7xl gap-20 md:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="space-y-8">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Post a Job
          </h1>
          <p className="text-lg text-gray-500 max-w-xl">
            Create a job listing that reaches the right candidates faster.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Write clear titles</h3>
              <p className="text-sm text-gray-500">
                Specific titles attract better candidates.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Be descriptive</h3>
              <p className="text-sm text-gray-500">
                Mention responsibilities and expectations clearly.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Location matters</h3>
              <p className="text-sm text-gray-500">
                Specify remote or on-site clearly.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700 mb-6">
            Job Details
          </h2>

          {/* ❌ Error */}
          {errors.general && (
            <p className="mb-4 text-sm text-red-600">
              {errors.general}
            </p>
          )}

          {/* ✅ Success Alert */}
          {success && (
            <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4">
              <h3 className="font-semibold text-green-800">
                Job Posted Successfully 🎉
              </h3>
              <p className="text-sm text-green-700">
                Your job listing is now live and visible to candidates.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Frontend Developer"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe responsibilities and requirements"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-blue-500"
                placeholder="Remote / Delhi / Bangalore"
              />
              {errors.location && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Posting..." : "Post Job"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-lg border py-3 font-semibold hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
