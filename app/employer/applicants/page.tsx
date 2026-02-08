"use client"

import { useEffect, useState } from "react"
import SidebarComponent from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SkelitonLoading from "@/components/SkelitonLoading"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ChevronDown,
  Bell,
  HelpCircle,
  Menu,
  X,
  Check,
} from "lucide-react"
import Link from "next/link"

type Application = {
  id: number
  job_title: string
  job_location: string
  cover_letter: string
  resume_url?: string
  applied_at: string
  candidate_name?: string
  candidate_profile_image?: string
  candidate_profile_id?: number
  status: "new" | "accepted" | "rejected"
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -8 },
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)

 
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("access_token")

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        )

        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      } catch {
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])


  const updateApplicationStatus = async (
    applicationId: number,
    newStatus: "accepted" | "rejected"
  ) => {
    const token = localStorage.getItem("access_token")

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/${applicationId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      )

      setOpenDropdownId(null)
    } catch (error) {
      console.error(error)
    }
  }


  const handleDeleteApplication = async (applicationId: number) => {
    const token = localStorage.getItem("access_token")

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/${applicationId}/`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )

      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationId)
      )
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <SkelitonLoading />

  return (
    <div className="flex min-h-screen bg-background-light">
      {/* SIDEBAR */}
      <SidebarComponent />

      {/* MAIN */}
      <main className="ml-64 flex-1 min-w-0 flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Applicants</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-slate-100">
                <Bell size={18} />
              </button>
              <button className="p-2 rounded-full hover:bg-slate-100">
                <HelpCircle size={18} />
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search by name, role, or skill..."
                className="w-full bg-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2">
              {["Job Title", "Date Applied", "Status"].map((label) => (
                <button
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {label}
                  <ChevronDown size={14} />
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <p className="text-sm font-semibold text-slate-600">
            {applications.length} Total Applicants
          </p>

          {applications.map((app) => (
            <motion.div
              key={app.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Card className="rounded-xl border hover:shadow-lg transition">
                <CardHeader className="flex flex-row justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {app.job_title}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      📍 {app.job_location}
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white ${
                      app.status === "accepted"
                        ? "bg-green-600"
                        : app.status === "rejected"
                        ? "bg-red-600"
                        : "bg-blue-400"
                    }`}
                  >
                    {app.status}
                  </span>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/profile/candidate/${app.candidate_profile_id}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={
                          app.candidate_profile_image ||
                          "/user-avatar.png"
                        }
                        className="size-14 rounded-full border object-cover"
                      />
                      <div>
                        <p className="font-semibold">
                          {app.candidate_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Applicant
                        </p>
                      </div>
                    </Link>

                    {/* STATUS DROPDOWN */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === app.id ? null : app.id
                          )
                        }
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                      >
                        <Menu size={18} />
                      </button>

                      <AnimatePresence>
                        {openDropdownId === app.id && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-20"
                          >
                            <button
                              onClick={() =>
                                updateApplicationStatus(
                                  app.id,
                                  "accepted"
                                )
                              }
                              className="flex gap-2 px-4 py-2 hover:bg-green-50 w-full text-sm"
                            >
                              <Check size={16} /> Accepted
                            </button>
                            <button
                              onClick={() =>
                                updateApplicationStatus(
                                  app.id,
                                  "rejected"
                                )
                              }
                              className="flex gap-2 px-4 py-2 hover:bg-red-50 w-full text-sm"
                            >
                              <X size={16} /> Rejected
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {app.cover_letter && (
                    <p className="text-sm bg-slate-50 p-4 rounded-lg">
                      {app.cover_letter}
                    </p>
                  )}

                  {app.resume_url && (
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <a href={app.resume_url} target="_blank">
                          <Button variant="outline">
                            View Resume
                          </Button>
                        </a>
                        <a href={app.resume_url} download>
                          <Button className="bg-blue-500 text-white">
                            Download
                          </Button>
                        </a>
                      </div>

                      <button
                        onClick={() =>
                          handleDeleteApplication(app.id)
                        }
                        className="bg-red-500 text-white px-4 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
