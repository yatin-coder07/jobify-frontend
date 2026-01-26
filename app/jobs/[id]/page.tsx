"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/app/context/UserContext"
import SkelitonLoading from "@/components/SkelitonLoading"
import JobApplicationForm from "@/components/JobApplicationForm"
import EditJobForm from "@/components/EditJobForm"

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
import Navbar from "@/components/Navbar"

type Job = {
  id: number
  title: string
  location: string
  description: string
  created_at: string
  company_name?: string
  company_logo?: string | null
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

  useEffect(() => {
    if (!jobId) return

    async function fetchJob() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  const handleDeleteJob = async () => {
    if (!token) return

    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/delete/${jobId}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    router.push("/employer/jobs")
  }

  return (
    <>
    <Navbar/>
   <div className="mt-25 bg-slate-50">
     <div className="min-h-screen  pb-32">
     
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-screen-md mx-auto h-14 flex items-center justify-center font-bold">
          Job Details
        </div>
      </header>

      <main className="max-w-screen-md mx-auto">
        {/* HEADER */}
        <section className="p-4 pt-6 space-y-4">
         <div className="flex gap-4 items-start">
  <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
    {job.company_logo ? (
      <img
        src={job.company_logo}
        alt={job.company_name || "Company logo"}
        className="size-20 rounded-lg object-contain"
      />
    ) : (
      <div className="size-20 rounded-lg bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
        {job.company_name?.[0] ?? "C"}
      </div>
    )}
  </div>

  <div className="flex flex-col gap-1">
    <h1 className="text-2xl font-bold">{job.title}</h1>

    <p className="text-blue-600 font-semibold text-lg">
      {job.company_name ?? "Company"}
    </p>

    <p className="text-sm text-slate-500 flex items-center gap-1">
      Posted {new Date(job.created_at).toLocaleDateString()}
    </p>
  </div>
</div>

        </section>

        {/* SUMMARY GRID */}
   <section className="px-4 ">
  <div className="grid grid-cols-2 gap-3">
  
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-blue-600">
        <span className="material-symbols-outlined">payments</span>
      </div>
      <div>
        <h2 className="text-sm font-bold">$120k - $160k</h2>
        <p className="text-xs text-slate-500">Salary Range</p>
      </div>
    </div>

   
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-blue-600">
        <span className="material-symbols-outlined">home_work</span>
      </div>
      <div>
        <h2 className="text-sm font-bold">Remote</h2>
        <p className="text-xs text-slate-500">Work Mode</p>
      </div>
    </div>

  
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-blue-600">
        <span className="material-symbols-outlined">trending_up</span>
      </div>
      <div>
        <h2 className="text-sm font-bold">Senior Level</h2>
        <p className="text-xs text-slate-500">Experience</p>
      </div>
    </div>

  
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-blue-600">
        <span className="material-symbols-outlined">location_on</span>
      </div>
      <div>
        <h2 className="text-sm font-bold">{job.location}</h2>
        <p className="text-xs text-slate-500">Location</p>
      </div>
    </div>
  </div>
</section>


        {/* DESCRIPTION */}
        <section className="mt-6">
          <h2 className="px-4 text-xl font-bold">
            Job Description
          </h2>
          <p className="px-4 mt-3 text-slate-700 whitespace-pre-line">
            {job.description}
          </p>
        </section>

        {/* COMPANY */}
        <section className="mt-8 px-4">
          <div className="rounded-2xl border bg-white p-6">
            <h3 className="font-bold mb-2">
              About {job.company_name ?? "Company"}
            </h3>
            <p className="text-sm text-slate-600">
              Company profile details go here.
            </p>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-screen-md mx-auto flex gap-3 justify-end">
          {user?.role === "candidate" ? (
            <JobApplicationForm jobId={jobId} />
          ) : (
            <>
              <EditJobForm />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
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
                      className="bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
   </div>
 </> )
}

export default function JobDetailPage() {
  return (
    <Suspense fallback={<SkelitonLoading />}>
      <JobDetailContent />
    </Suspense>
  )
}
