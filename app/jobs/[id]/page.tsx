"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@/app/context/UserContext"
import SkelitonLoading from "@/components/SkelitonLoading"
import JobApplicationForm from "@/components/JobApplicationForm"
import EditJobForm from "@/components/EditJobForm"
import Navbar from "@/components/Navbar"
import { 
  Briefcase, 
  MapPin, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Rocket, 
  Trash2,
  CheckCircle2
} from "lucide-react"

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Job = {
  id: number
  title: string
  location: string
  description: string
  created_at: string
  company_name?: string
  company_logo?: string | null
  salary: string
  job_type: string
  experience_level: string
  work_mode: string
  has_applied?: boolean // Injected by backend to flag existing applications
}

function JobDetailContent() {
  const { user, loading } = useUser()
  const { id } = useParams()
  const router = useRouter()

  const jobId = id as string
  const [job, setJob] = useState<Job | null>(null)
  const [hasApplied, setHasApplied] = useState(false)

  // 🤖 AI Agent Workflow States
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)
  const [applicationId, setApplicationId] = useState<number | null>(null)
  const [editableCoverLetter, setEditableCoverLetter] = useState("")
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null

  useEffect(() => {
    if (!jobId) return

    async function fetchJob() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        )
        if (!res.ok) return
        const data = await res.json()
        setJob(data)
        // Set local applied check if backend returns flag or data structure implies it
        if (data.has_applied) {
          setHasApplied(true)
        }
      } catch (err) {
        console.error("Error fetching job parameters:", err)
      }
    }

    fetchJob()
  }, [jobId, token])

  if (loading || !job) {
    return <SkelitonLoading />
  }

  const handleDeleteJob = async () => {
    if (!token) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/delete/${jobId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (res.ok) {
        router.push("/employer/jobs")
      }
    } catch (err) {
      console.error("Error deleting job entry record:", err)
    }
  }

  // 🚀 Start Agent Workflow
  const handleApplyWithAi = async () => {
    if (!token || hasApplied) return
    setIsAiLoading(true)

    try {
      const formData = new FormData()
      const dummyFile = new File([new Blob(["Agent execution request"])], "resume.pdf", { type: "application/pdf" })
      formData.append("resume", dummyFile)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/apply/${jobId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await res.json()

      // Handle custom backend exception for duplication explicitly here
      if (res.status === 400 && (data.error?.includes("already applied") || data.includes("already applied"))) {
        setHasApplied(true)
        alert("You have already submitted an application for this vacancy.")
        return
      }

      if (!res.ok) {
        alert(data.error || "AI pipeline initialization failed.")
        return
      }

      setApplicationId(data.id)
      setEditableCoverLetter(data.cover_letter)
      setShowAiModal(true)
    } catch (err) {
      console.error(err)
      alert("Error starting AI workflow pipeline.")
    } finally {
      setIsAiLoading(false)
    }
  }

  // 🏁 Human-In-The-Loop Confirmation
  const handleConfirmAiSubmission = async (actionType: "APPROVE" | "REJECT") => {
    if (!token || !applicationId) return
    setIsSubmittingApproval(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/agent-confirm/${applicationId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: actionType,
            cover_letter: editableCoverLetter,
          }),
        }
      )

      if (res.ok) {
        if (actionType === "APPROVE") {
          setHasApplied(true)
          alert("🎉 Application submitted successfully via AI automation!")
          setShowAiModal(false)
          router.push("/candidate")
        } else {
          alert("Application canceled.")
          setShowAiModal(false)
        }
      } else {
        alert("Action processing error encountered.")
      }
    } catch (err) {
      console.error(err)
      alert("Error reaching verification gateway.")
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-blue-500/10">
      <Navbar />
      
      <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6">
        <header className="bg-white border border-slate-200/60 rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Position Profile</span>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{job.job_type}</span>
        </header>

        <main className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <section className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-transparent">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/60 shrink-0">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company_name || "Company logo"}
                    className="size-16 rounded-xl object-contain"
                  />
                ) : (
                  <div className="size-16 rounded-xl bg-slate-900 flex items-center justify-center text-xl font-black text-white">
                    {job.company_name?.[0] ?? "C"}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{job.title}</h1>
                <p className="text-blue-600 font-bold text-lg">
                  {job.company_name ?? "Global Enterprise Corp"}
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  Published on {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50/30 border-b border-slate-100">
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <Coins className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{job.salary}</h4>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Salary Scope</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{job.work_mode}</h4>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Work Context</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{job.experience_level}</h4>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Seniority</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{job.location}</h4>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Geography</p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Role Summary & Specifications</h3>
            <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50/40 p-4 rounded-xl border border-slate-100">
              {job.description}
            </p>
          </section>

          <section className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4">
            {job.company_logo && (
              <img
                src={job.company_logo}
                alt={job.company_name || "Company logo"}
                className="size-10 rounded-lg object-contain border bg-white p-1"
              />
            )}
            <p className="text-xs font-bold text-slate-500">
              Verified employer file profile pipeline synced directly via <span className="text-blue-600">{job.company_name ?? "Company"}</span> registry.
            </p>
          </section>
        </main>
      </div>

      {/* FIXED PLATFORM FOOTER HUB WORKSPACE CONTROLS */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-xl backdrop-blur-md bg-white/95">
        <div className="max-w-4xl mx-auto flex gap-3 justify-end items-center">
          {user?.role === "candidate" ? (
            <>
              {hasApplied ? (
                /* ✅ LOCKED DETECTED APPLIED STATE UI */
                <div className="flex items-center gap-2 px-6 h-11 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Application Already Submitted</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApplyWithAi}
                    disabled={isAiLoading}
                    className="flex items-center gap-2 px-5 h-11 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 duration-150"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing Direct Context Chunks...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                        <span>Apply with Neural AI</span>
                      </>
                    )}
                  </button>

                  <JobApplicationForm jobId={jobId} />
                </>
              )}
            </>
          ) : (
            <>
              <EditJobForm />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-2 px-5 h-11 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60 font-bold text-sm rounded-xl transition">
                    <Trash2 className="h-4 w-4" />
                    <span>Remove Posting</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black text-slate-900">Purge position record?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500 text-sm">
                      This parameters structural matrix index cannot be undone. Candidates currently evaluated inside the pipeline will lose core gateway connections.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-bold">Abort</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteJob}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                    >
                      Confirm Deletion
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </footer>

      {/* 🧠 Human-in-the-Loop AI Review Sheet Dialog */}
      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span>Review AI Tailored Structural Application</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400 font-medium">
              The Agent synthesized this cover letter by parsing your vector resume chunks against this job description context. You can edit this text directly before executing submission tools.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Synthesized Generation Draft Workspace
            </label>
            <textarea
              className="w-full h-80 p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 font-mono text-xs leading-relaxed outline-none resize-none bg-slate-50/50 text-slate-800 transition"
              value={editableCoverLetter}
              onChange={(e) => setEditableCoverLetter(e.target.value)}
              disabled={isSubmittingApproval}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={() => handleConfirmAiSubmission("REJECT")}
              disabled={isSubmittingApproval}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
            >
              Discard Draft
            </button>
            <button
              onClick={() => handleConfirmAiSubmission("APPROVE")}
              disabled={isSubmittingApproval}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition transform active:scale-95 duration-150"
            >
              {isSubmittingApproval ? (
                <>
                  <div className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Manifest...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-3.5 w-3.5" />
                  <span>Confirm & Deploy Application</span>
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
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