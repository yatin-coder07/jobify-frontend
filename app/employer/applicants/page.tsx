"use client"

export const dynamic = "force-dynamic"


import { useEffect, useState } from "react"
import SidebarComponent from "@/components/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SkelitonLoading from "@/components/SkelitonLoading"

import {
  Search,
 
  Bell,
  HelpCircle,

} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

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

export default function ApplicantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get("search") || ""

  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const [search, setSearch] = useState(searchFromUrl)

  /* ---------------- SEARCH HANDLER ---------------- */
  const handleSearchChange = (value: string) => {
    setSearch(value)

    if (value.trim()) {
      router.replace(`?search=${encodeURIComponent(value)}`, {
        scroll: false,
      })
    } else {
      router.replace("?", { scroll: false })
    }
  }

  useEffect(() => {
    setSearch(searchFromUrl)
  }, [searchFromUrl])

  /* ---------------- FETCH APPLICATIONS ---------------- */
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      const token = localStorage.getItem("access_token")

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/`
      )

      if (searchFromUrl) {
        url.searchParams.set("search", searchFromUrl)
      }

      try {
        const res = await fetch(url.toString(), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) throw new Error("Failed to fetch")

        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [searchFromUrl])

  /* ---------------- UPDATE STATUS ---------------- */
  const updateApplicationStatus = async (
    applicationId: number,
    newStatus: "accepted" | "rejected"
  ) => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    try {
      const res = await fetch(
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

      if (!res.ok) throw new Error("Failed to update")

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      )

      setOpenDropdownId(null)
    } catch (error) {
      console.error(error)
    }
  }

  /* ---------------- DELETE APPLICATION ---------------- */
  const handleDeleteApplication = async (applicationId: number) => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/${applicationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) throw new Error("Delete failed")

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
      <SidebarComponent />

      <main className="ml-64 flex-1 flex flex-col">
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

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                placeholder="Search by name or job title..."
                className="w-full bg-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-sm"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <p className="text-sm font-semibold text-slate-600">
            {applications.length} Total Applicants
          </p>

          {applications.map((app) => (
            <Card key={app.id} className="rounded-xl border">
              <CardHeader className="flex flex-row justify-between">
                <div>
                  <CardTitle>{app.job_title}</CardTitle>
                  <p className="text-sm text-slate-500">
                    📍 {app.job_location}
                  </p>
                </div>

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
                <Link
                  href={`/profile/candidate/${app.candidate_profile_id}`}
                  className="flex items-center gap-4"
                >
                  <img
                    src={app.candidate_profile_image || "/user-avatar.png"}
                    className="size-14 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-semibold">{app.candidate_name}</p>
                    <p className="text-xs text-slate-500">Applicant</p>
                  </div>
                </Link>

                {app.cover_letter && (
                  <p className="text-sm bg-slate-50 p-4 rounded-lg">
                    {app.cover_letter}
                  </p>
                )}

                <div className="flex gap-3">
                  {app.resume_url && (
                    <a href={app.resume_url} target="_blank">
                      <Button variant="outline">View Resume</Button>
                    </a>
                  )}

                  <Button
                    onClick={() =>
                      updateApplicationStatus(app.id, "accepted")
                    }
                    className="bg-green-500 hover:bg-green-700"
                  >
                    Accept
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      updateApplicationStatus(app.id, "rejected")
                    }
                  >
                    Reject
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteApplication(app.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
