"use client"

import SidebarComponent from "@/components/Sidebar"
import {
  Users,
  FileText,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [employerProfile, setEmployerProfile] = useState<any>(null)
  const [employerJobs, setEmployerJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const formattedDate = new Date(employerJobs[0]?.created_at || "").toLocaleDateString("en-IN", {
  year: "numeric",
  month: "short",
  day: "numeric",
})


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        window.location.href = "/login"
        return
      }

      const [jobs, apps, profile] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/my-jobs/`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/employer/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json()),
      ])

      setEmployerJobs(jobs)
      setApplicants(apps)
      console.log(apps)
      setEmployerProfile(profile)
      setLoading(false)
    }

    fetchData().catch(() => {})
  }, [])

  if (loading) return null

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 overflow-x-hidden">
      {/* FIXED SIDEBAR */}
      <SidebarComponent />

      {/* MAIN CONTENT (OFFSET BY SIDEBAR WIDTH) */}
      <main className="ml-64 flex-1 w-full min-w-0">
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
          <div className="w-full px-8 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Employer Dashboard</h2>
              <p className="text-sm text-slate-500">
                Welcome back, here's what's happening.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold">
                {employerProfile?.company_name}
              </p>
              <img
                src={employerProfile?.logo || "/user-avatar.png"}
                className="h-10 w-10 rounded-full object-cover border"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="w-full px-8 py-8 space-y-8 max-w-none">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Posts"
              value={employerJobs.length}
              icon={<FileText size={18} />}
            />
            <StatCard
              title="Applications"
              value={applicants.length}
              icon={<Users size={18} />}
            />
            <StatCard
              title="Interviews"
              value={24}
              primary
              icon={<Calendar size={18} />}
            />
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* JOBS */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Active Job Posts</h3>
                <Link href="/employer/postjob">
                  <button className="bg-[#0d7ff2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0b66c2] transition">
                    + Post Job
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Job</th>
                      <th className="px-6 py-4 text-center">Location</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {employerJobs.map((job, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold">
                          <Link href={`/jobs/${job.id}`}>
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {job.location}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-500">
                          {formattedDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Recent Applicants</h3>
              <div className="bg-white rounded-2xl border shadow-sm divide-y">
                {applicants.slice(0, 5).map((app, i) => (
                  <div key={i} className="p-4 flex items-center gap-4">
                    <img
                      src={app.candidate_profile_image || "/user-avatar.png"}
                      className="size-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">
                        {app.candidate_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {app.job_title}
                      </p>
                    </div>
                    <Link
                      href={`/profile/candidate/${app.candidate_profile_id}`}
                      className="text-xs font-bold text-[#0d7ff2]"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, primary, icon }: any) {
  return (
    <div
      className={`p-6 rounded-2xl border shadow-sm ${
        primary ? "bg-[#0d7ff2] text-white" : "bg-white"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <span
          className={`p-4 rounded-lg ${
            primary ? "bg-white/20" : "bg-blue-100 text-blue-600"
          }`}
        >
          {icon}
        </span>
      </div>
    </div>
  )
}
