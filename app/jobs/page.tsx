"use client"

export const dynamic = "force-dynamic"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import JobCard from "@/components/JobCard"
import SkelitonLoading from "@/components/SkelitonLoading"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"

type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
}

function JobsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchFromUrl = searchParams.get("search") || ""
  const [search, setSearch] = useState(searchFromUrl)
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSearch(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    async function fetchJobs() {
      setLoading(true)

      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/`
      )

      if (searchFromUrl) {
        url.searchParams.set("search", searchFromUrl)
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setJobs(data)
      setLoading(false)
    }

    fetchJobs()
  }, [searchFromUrl])

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

  return (
    <>
     
      <section className=" border-b border-slate-200 py-10 bg-blue-50">
        <div>
          <Navbar/>
        </div>
        <div className="max-w-[1440px] mx-auto px-6 mt-18">
          <div className="flex flex-col lg:flex-row items-end gap-4 bg-white p-2 rounded-2xl shadow-xl border border-slate-100 max-w-600">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-4">
                What and Where
              </label>
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="w-full h-14 rounded-xl bg-slate-100 px-5 font-medium focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

           

            <button className="w-full lg:w-auto px-10 h-14 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20">
              Find Jobs
            </button>
          </div>
        </div>
      </section>

     
      <main className="max-w-[1440px] mx-auto px-6 py-8 flex gap-8">
        
        <aside className="w-[300px] shrink-0 space-y-8 hidden md:block">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Filters</h2>
            <button className="text-sm font-semibold text-blue-600">
              Reset all
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Job Type</h3>
            {["Full-time", "Contract", "Part-time"].map((t) => (
              <label
                key={t}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input type="checkbox" className="size-5 rounded" />
                <span className="text-sm font-medium text-slate-600">
                  {t}
                </span>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Monthly Salary Range</h3>
            <input type="range" className="w-full accent-blue-600" />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold">Experience Level</h3>
            {["Entry Level", "Mid Level", "Senior Level"].map((l) => (
              <label key={l} className="flex items-center gap-3">
                <input type="checkbox" className="size-5 rounded" />
                <span className="text-sm font-medium text-slate-600">
                  {l}
                </span>
              </label>
            ))}
          </div>
        </aside>

        
        <section className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {jobs?.length ?? 0}
              </span>{" "}
              jobs
            </p>

            <select className="font-bold text-sm bg-transparent">
              <option>Most Recent</option>
              <option>Highest Salary</option>
              <option>Most Relevant</option>
            </select>
          </div>

{loading ? (
  <SkelitonLoading />
) : jobs && jobs.length > 0 ? (
  <div
    className="
      custom-scrollbar
      space-y-4
      overflow-y-auto
      pr-2
      h-[calc(100vh-340px)]
    "
  >
    {jobs.map((job) => (
      <JobCard key={job.id} job={job} />
    ))}
  </div>
) : (
  <div className="rounded-2xl bg-white p-14 text-center border">
    No jobs found
  </div>
)}


         
        
        </section>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<SkelitonLoading />}>
      <JobsContent />
    </Suspense>
  )
}
