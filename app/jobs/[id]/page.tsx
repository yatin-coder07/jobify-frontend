"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

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

function JobDetailContent() {
  const { user, loading } = useUser()
  const { id } = useParams()
  const router = useRouter()

  const jobId = id as string
  const [job, setJob] = useState<Job | null>(null)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null

  // 🔹 Fetch job details
  useEffect(() => {
    if (!jobId) return

    async function fetchJob() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      )

      if (!res.ok) return

      const data = await res.json()
      setJob(data)
    }

    fetchJob()
  }, [jobId, token])

  if (loading || !job) {
    return <SkelitonLoading />
  }

  // 🔹 Delete job (employer only)
  const handleDeleteJob = async () => {
    if (!token) return

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
    router.push("/employer/jobs")
  }

  return (
    <div className="min-h-screen bg-blue-50 py-16 px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900">
          {job.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📍 {job.location}</span>
          {job.company_name && <span>🏢 {job.company_name}</span>}
          <span>
            🗓️ {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Job Description
          </h2>
          <p className="whitespace-pre-line text-gray-700">
            {job.description}
          </p>
        </div>

        <div className="fixed bottom-10 right-10 flex gap-3">
          {user?.role === "candidate" ? (
            <JobApplicationForm jobId={jobId} />
          ) : (
            <>
              <EditJobForm />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="bg-red-600 px-6 py-2 text-white rounded-md">
                    Delete
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete this job?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
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

export default function JobDetailPage() {
  return (
    <Suspense fallback={<SkelitonLoading />}>
      <JobDetailContent />
    </Suspense>
  )
}
