"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import SkelitonLoading from "@/components/SkelitonLoading"
import Link from "next/link"

type Application = {
  id: number
  job_title: string
  job_location: string
  resume?: string
  applied_at: string
 
  status: "new" | "accepted" | "rejected"
}

type StatusFilter = "all" | "new" | "accepted" | "rejected"


export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [applicationStatus, setApplicationStatus] =
    useState<StatusFilter>("all")

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("access_token")

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/candidate/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) return

        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const deleteApplication = async (applicationId: number) => {
    const token = localStorage.getItem("access_token")
    setDeletingId(applicationId)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/delete/${applicationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (res.ok) {
      setApplications((prev) =>
        prev.filter((app) => app.id !== applicationId)
      )
    }

    setDeletingId(null)
  }

  if (loading) return <SkelitonLoading />

  const filteredApplications = applications.filter((app) => {
    if (applicationStatus === "all") return true
    return app.status === applicationStatus
  })

  if (applications.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light px-6 text-center">
        <Image src="/logo.png" alt="Jobify" width={80} height={80} />
        <h2 className="mt-6 text-2xl font-semibold text-slate-700">
          No applications yet
        </h2>
        <p className="mt-2 text-slate-500 max-w-md">
          Start applying to jobs and track them here.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* TOP BAR */}
      <div className="sticky top-0 z-20 bg-background-light/80 backdrop-blur border-b">
        <div className="flex items-center justify-between px-4 py-3">
         <Link href={"/"}>
          <span className="material-symbols-outlined cursor-pointer">
            arrow_back_ios
          </span>
         </Link>
          <h2 className="font-bold text-lg">My Applications</h2>
          <span className="material-symbols-outlined cursor-pointer">
            notifications
          </span>
        </div>

        <div className="flex gap-6 px-4 border-b overflow-x-auto hide-scrollbar">
          {[
            ["all", "All"],
            ["reviewed", "In Review"],
            ["accepted", "Accepted"],
            ["rejected", "Rejected"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setApplicationStatus(value as StatusFilter)
              }
              className={`pb-3 text-sm font-bold ${
                applicationStatus === value
                  ? "border-b-2 border-primary text-primary"
                  : "text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* APPLICATION LIST */}
      <div className="p-4 flex flex-col gap-3">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="rounded-xl bg-white p-4 shadow-sm border"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    app.status === "accepted"
                      ? "bg-green-100 text-green-600"
                      : app.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {app.status || "In Review"}
                </span>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {app.job_title}
                </p>

                <p className="text-sm text-slate-500">
                  {app.job_location} • Applied{" "}
                  {app.applied_at.slice(0, 10)}
                </p>
              </div>

              <div className="size-14 rounded-lg bg-slate-100 shrink-0" />
            </div>

            {/* ACTIONS */}
            <div className="mt-4 pt-3 border-t flex gap-2">
              {app.resume && (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-primary text-white">
                    View Resume
                  </Button>
                </a>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletingId === app.id}
                  >
                    {deletingId === app.id
                      ? "Withdrawing..."
                      : "Withdraw"}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Withdraw this application?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove your application
                      from the employer’s view.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        deleteApplication(app.id)
                      }
                    >
                      Yes, withdraw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      <div className="h-24" />
    </div>
  )
}
