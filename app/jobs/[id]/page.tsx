"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { redirect, useParams } from "next/navigation"

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
    }

    checkIfApplied()
  }, [jobId, token, user])

  if (loading || !job) {
    return <SkelitonLoading />
  }

  const handleDeleteJob = async () => {
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
  }

  return (
    <div className="min-h-screen bg-blue-50 py-16 px-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900">
          {job.title}
        </h1>

        <p className="mt-4 text-gray-500">📍 {job.location}</p>

        <p className="mt-6 text-gray-700 whitespace-pre-line">
          {job.description}
        </p>

        <div className="fixed bottom-10 right-10 flex gap-3">
          {user?.role === "candidate" ? (
            hasApplied ? (
              <button disabled className="bg-green-100 px-6 py-2 rounded-md">
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
                  <button className="bg-red-600 text-white px-6 py-2 rounded-md">
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteJob}>
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
