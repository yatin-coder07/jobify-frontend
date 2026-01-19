export const dynamic = "force-dynamic"

"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import JobCard from "@/components/JobCard"
import SkelitonLoading from "@/components/SkelitonLoading"
import { motion } from "framer-motion"

type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const Page = () => {
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
    const token = localStorage.getItem("access_token")

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
    <div className="min-h-screen bg-gray-50 py-24 px-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl"
      >
        {/* HEADER CARD */}
        <div className="mb-14 rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-gray-800">
            Explore Opportunities
          </h1>
          <p className="mt-3 max-w-2xl text-gray-500">
            Discover jobs that match your skills and interests. Use search to
            narrow down roles and apply confidently.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by role, company, or location..."
              className="w-full sm:w-96 rounded-xl border px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

     
        {loading ? (
          <SkelitonLoading />
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <p className="text-gray-500 text-lg">
              No jobs found matching your search.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Page
