"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import JobCard from "@/components/JobCard"
import SkelitonLoading from "@/components/SkelitonLoading"
import Navbar from "@/components/Navbar"
import { Sparkles, RefreshCw, Search, SlidersHorizontal, Layers, Inbox } from "lucide-react"

type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
  salary?: string
  experience_level?: string
  work_mode?: string
  match_score?: number
}

function JobsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchFromUrl = searchParams.get("search") || ""
  const resumeIdFromUrl = searchParams.get("resumeId") || ""

  const [search, setSearch] = useState(searchFromUrl)
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSearch(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("access_token") : null

    async function fetchJobs() {
      setLoading(true)
      let urlString = ""

      if (resumeIdFromUrl) {
        urlString = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/match/${resumeIdFromUrl}/`
      } else {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/`)
        if (searchFromUrl) {
          url.searchParams.set("search", searchFromUrl)
        }
        urlString = url.toString()
      }

      try {
        const res = await fetch(urlString, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (res.ok) {
          if (resumeIdFromUrl) {
            setJobs(data.matches || [])
          } else {
            setJobs(data || [])
          }
        } else {
          console.error("Server error mapping jobs data:", data)
          setJobs([])
        }
      } catch (err) {
        console.error("Network fault loading job listings:", err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [searchFromUrl, resumeIdFromUrl])

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

  const clearAiFilter = () => {
    setSearch("")
    router.replace("?", { scroll: false })
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-blue-500/10">
      <Navbar />

      {/* SEARCH AND AI STATUS HEADER CONTROL HUB */}
      <section className="border-b border-slate-200/80 bg-white pt-28 pb-10 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatePresence mode="wait">
            {resumeIdFromUrl && (
              <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 text-white shadow-xl border border-white/5 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f615,transparent_45%)] pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                    <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-base tracking-tight flex items-center gap-2">
                      Semantic Matching Active
                    </h3>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      Displaying prioritized positions dynamically scored for your vector profile parameters.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={clearAiFilter}
                  className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-xs font-bold transition duration-150 active:scale-95 border border-white/10 shrink-0 relative z-10"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> 
                  <span>Reset Matching Grid</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN INPUT COMPONENT CONTAINER */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 bg-slate-100/80 p-2 rounded-2xl border border-slate-200/40 max-w-3xl">
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={resumeIdFromUrl ? "Override AI and scan manually instead..." : "Job title, target focus, or core enterprise keyword..."}
                className="w-full h-14 rounded-xl bg-white border border-slate-200/60 pl-12 pr-4 font-medium text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition duration-150"
              />
            </div>
            <button className="px-8 h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition duration-150 active:scale-95 shrink-0">
              Execute Search
            </button>
          </div>
        </div>
      </section>

      {/* CORE CONTROL PLATFORM LAYOUT BLOCK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex gap-8">
        
        {/* ASIDE LEFT COLUMN: ADVANCED PROPERTY MATRIX FILTERS */}
        <aside className="w-[280px] shrink-0 space-y-7 hidden lg:block bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-black text-base tracking-tight flex items-center gap-2 text-slate-900">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <span>Workspace Filters</span>
            </h2>
            <button 
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition" 
              onClick={clearAiFilter}
            >
              Reset All
            </button>
          </div>

          {/* JOB CLASSIFICATION MATRIX */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Commitment Type</h3>
            <div className="space-y-2.5">
              {["Full-time", "Contract", "Part-time"].map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer group text-slate-600 hover:text-slate-900 select-none">
                  <input type="checkbox" className="size-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition cursor-pointer" />
                  <span className="text-sm font-semibold transition-colors duration-150">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* COMPOSITE SALARY THRESHOLD */}
          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Salary Parameters</h3>
            <div className="space-y-2">
              <input type="range" min="2000" max="25000" step="500" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900" />
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                <span>Base Base</span>
                <span>$25k / mo</span>
              </div>
            </div>
          </div>

          {/* EXPERIENCE CLASSIFICATION PARAMETERS */}
          <div className="space-y-3.5 pt-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Seniority Layer</h3>
            <div className="space-y-2.5">
              {["Entry Level", "Mid Level", "Senior Level"].map((l) => (
                <label key={l} className="flex items-center gap-3 cursor-pointer group text-slate-600 hover:text-slate-900 select-none">
                  <input type="checkbox" className="size-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 transition cursor-pointer" />
                  <span className="text-sm font-semibold transition-colors duration-150">{l}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: ACTIVE OUTPUT STREAM */}
        <section className="flex-1 space-y-5">
          <div className="flex items-center justify-between bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
            <p className="text-slate-500 font-medium text-sm flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-slate-400" />
              <span>
                Found <span className="font-bold text-slate-900">{jobs?.length ?? 0}</span> matching options
              </span>
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort Matrix:</span>
              <select className="font-bold text-xs bg-slate-50 border p-1.5 rounded-lg text-slate-700 outline-none focus:border-slate-300 cursor-pointer" defaultValue={resumeIdFromUrl ? "Most Relevant" : "Most Recent"}>
                <option>Most Recent</option>
                <option>Highest Salary</option>
                <option>Most Relevant</option>
              </select>
            </div>
          </div>

          {/* STREAM ITERATION LAYER */}
          {loading ? (
            <SkelitonLoading />
          ) : jobs && jobs.length > 0 ? (
            <div className="custom-scrollbar space-y-4 overflow-y-auto pr-1.5 h-[calc(100vh-340px)] pb-12 rounded-xl">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-16 text-center border border-slate-200/60 shadow-sm max-w-xl mx-auto mt-12 flex flex-col items-center justify-center space-y-4">
              <div className="h-14 w-14 bg-slate-50 border rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                <Inbox className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight text-lg">No Results Mapping</h3>
                <p className="text-slate-400 font-medium text-sm mt-1 max-w-xs mx-auto leading-relaxed">
                  No operational records coordinate with your target criteria. Refine your structural string tags or lower filters.
                </p>
              </div>
              <button 
                onClick={clearAiFilter}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs rounded-xl transition duration-150"
              >
                Reset Core Search Matrix
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<SkelitonLoading />}>
      <JobsContent />
    </Suspense>
  )
}