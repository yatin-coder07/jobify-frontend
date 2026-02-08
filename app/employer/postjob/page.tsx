"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Navbar from "@/components/Navbar"


export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    experience_level: "entry",
    work_mode: "remote",
    job_type: "full-time",
    salary: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const token = localStorage.getItem("access_token")
    if (!token) {
      setError("You must be logged in to post a job.")
      setLoading(false)
      return
    }

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
      )

      if (!res.ok) throw new Error("Failed")

      setSuccess(true)
      setFormData({
        title: "",
        description: "",
        location: "",
        experience_level: "entry",
        work_mode: "remote",
        job_type: "full-time",
        salary: "",
      })
    } catch {
      setError("Failed to create job. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="h-full w-full bg-blue-100">
    <Navbar/>
    <div className="min-h-screen bg-slate-50 px-6 py-24">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 ">

        {/* MAIN FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-2xl border shadow-sm p-8 space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold">Basic Job Information</h2>
            <p className="text-slate-500 mt-1">
              Provide the essential details about the position.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-600 font-medium">
              Job posted successfully 🎉
            </p>
          )}

          {/* TITLE */}
          <div>
            <label className="text-sm font-semibold">Job Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Backend Engineer"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* EXPERIENCE + TYPE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
  <label className="text-sm font-semibold">Experience Level</label>

  <Select
    value={formData.experience_level}
    onValueChange={(value) =>
      setFormData({ ...formData, experience_level: value })
    }
  >
    <SelectTrigger className="mt-1 w-full rounded-xl bg-slate-50">
      <SelectValue placeholder="Select experience level" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="entry">Intern</SelectItem>
      <SelectItem value="mid">Entry Level</SelectItem>
      <SelectItem value="senior">Senior Level</SelectItem>
    </SelectContent>
  </Select>
</div>


           <div>
  <label className="text-sm font-semibold">Job Type</label>

  <Select
    value={formData.job_type}
    onValueChange={(value) =>
      setFormData({ ...formData, job_type: value })
    }
  >
    <SelectTrigger className="mt-1 w-full rounded-xl bg-slate-50">
      <SelectValue placeholder="Select job type" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="full-time">Full-time</SelectItem>
      <SelectItem value="part-time">Part-time</SelectItem>
      <SelectItem value="contract">Contract</SelectItem>
    </SelectContent>
  </Select>
</div>

          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
  <label className="text-sm font-semibold">Work Mode</label>

  <Select
    value={formData.work_mode}
    onValueChange={(value) =>
      setFormData({ ...formData, work_mode: value })
    }
  >
    <SelectTrigger className="mt-1 w-full rounded-xl bg-slate-50">
      <SelectValue placeholder="Select work mode" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="remote">Remote</SelectItem>
      <SelectItem value="onsite">On-site</SelectItem>
      <SelectItem value="hybrid">Hybrid</SelectItem>
    </SelectContent>
  </Select>
</div>


            <div>
              <label className="text-sm font-semibold">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Delhi / Remote / Worldwide"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border"
                required
              />
            </div>
          </div>

          
          <div>
            <label className="text-sm font-semibold">Salary Range</label>
            <input
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="₹8L – ₹15L / $80k – $120k"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border"
            />
          </div>

         
          <div>
            <label className="text-sm font-semibold">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={10}
              placeholder="Describe responsibilities, requirements, and expectations..."
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border resize-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

        
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border font-semibold"
              onClick={() =>
                setFormData({
                  title: "",
                  description: "",
                  location: "",
                  experience_level: "entry",
                  work_mode: "remote",
                  job_type: "full-time",
                  salary: "",
                })
              }
            >
             Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60 ${loading ? "animate-spin" : ""}`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>

        
        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <span className="text-xs font-bold text-green-600">LIVE PREVIEW</span>

            <h3 className="text-xl font-bold mt-4">
              {formData.title || "Job Title"}
            </h3>

            <p className="text-sm text-blue-600 mt-1">
              Jobify • {formData.location || "Location"}
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>📍 {formData.work_mode}</p>
              <p>🕒 {formData.job_type}</p>
              <p>💼 {formData.experience_level}</p>
              {formData.salary && <p>💰 {formData.salary}</p>}
            </div>

            <button
              disabled
              className="mt-6 w-full py-3 rounded-xl bg-slate-200 text-slate-400 font-bold"
            >
              Apply Now
            </button>

            <p className="text-[11px] text-center text-slate-400 mt-4 italic">
              Candidates will see this card in search results
            </p>
          </div>
        </aside>
      </div>
    </div>
    </div>
    </>
  )
}
