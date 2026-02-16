"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Calendar, Bookmark } from "lucide-react"

type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
}

type Props = {
  job: Job
}

const JobCard = ({ job }: Props) => {
  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5"
      >
        <div className="flex gap-6">
          <div className="size-20 shrink-0 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2">
            <span className="text-sm font-bold text-slate-400">
              LOGO
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h4>
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Company Name
                </p>
              </div>

              <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                <Bookmark size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                <MapPin size={14} />
                {job.location}
              </span>

              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                Full-time
              </span>
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {job.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
              <Calendar size={14} />
              {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default JobCard
