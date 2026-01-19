export const dynamic = "force-dynamic"

"use client"

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

import { useUser } from "@/app/context/UserContext"
import { useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"
import SkelitonLoading from "@/components/SkelitonLoading"
import JobApplicationForm from "@/components/JobApplicationForm"
import EditJobForm from "@/components/EditJobForm"

type Job = {
  id: number
  title: string
  location: string
  description: string
  created_at: string
  company_name?: string
}

const JobDetailPage = () => {
  const { user, loading } = useUser()
  const { id } = useParams()
  const jobId = id as string

  const [job, setJob] = useState<Job | null>(null)
  const [hasApplied, setHasApplied] = useState(false)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null

  useEffect(() => {
    if (!jobId) return

    async function fetchJob() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) return

      const data = await res.json()
      setJob(data)
    }

    fetchJob()
  }, [jobId, token])

  useEffect(() => {
    if (!jobId || user?.role !== "candidate") return

    async function checkIfApplied() {
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

        const applications = await res.json()

        const applied = applications.some(
          (app: any) => app.job === Number(jobId)
        )

        setHasApplied(applied)
      } catch (error) {
        console.error("Error checking application status", error)
      }
    }

    checkIfApplied()
  }, [jobId, token, user])

  if (loading || !job) {
    return <SkelitonLoading />
  }

  const handleDeleteJob = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/delete/${jobId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) return

      redirect("/employer/jobs")
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 py-16 px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-lg">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span>📍 {job.location}</span>

            {job.company_name && (
              <span>🏢 {job.company_name}</span>
            )}

            <span>
              🗓️ Posted on{" "}
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="space-y-5 leading-relaxed text-gray-700">
          <h2 className="text-xl font-semibold text-gray-800">
            Job Description
          </h2>

          <p className="whitespace-pre-line text-gray-600">
            {job.description}
          </p>
        </div>

        <div className="fixed bottom-10 right-10 z-50 flex gap-3">
          {user?.role === "candidate" ? (
            hasApplied ? (
              <button
                disabled
                className="h-11 rounded-md bg-green-100 px-6 text-green-700 text-lg font-semibold cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                ✅ Applied
              </button>
            ) : (
              <JobApplicationForm jobId={jobId} />
            )
          ) : (
            <>
              <EditJobForm />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="h-11 rounded-md bg-red-600 px-6 text-white text-lg hover:bg-red-700 shadow-md">
                    Delete
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete this job?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All applications for this job will also be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDeleteJob}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
