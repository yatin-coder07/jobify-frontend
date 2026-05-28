"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Calendar, Bookmark, Sparkles } from "lucide-react"

// Extended type definition to support dynamic AI match fields seamlessly
type Job = {
  id: number
  title: string
  description: string
  location: string
  created_at: string
  salary?: string
  experience_level?: string
  work_mode?: string
  match_score?: number // The dynamic percentage value from your semantic database match
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
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h4>
                  
                  {/* ✨ AI Match Badge displayed whenever a match_score exists */}
                  {job.match_score !== undefined && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-0.5 text-xs font-black text-white shadow-sm shadow-indigo-500/20">
                      <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
                      {job.match_score}% Match
                    </span>
                  )}
                </div>
                
                <p className="mt-1 text-sm font-semibold text-slate-600">
                  Company Name
                </p>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // Prevents clicking the bookmark icon from triggering the link redirect
                }}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
              >
                <Bookmark size={18} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                <MapPin size={14} />
                {job.location}
              </span>

              {/* Dynamic fallbacks if your database has varied string contents */}
              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                {job.work_mode || "Full-time"}
              </span>

              {job.experience_level && (
                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {job.experience_level}
                </span>
              )}

              {job.salary && (
                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-100">
                  {job.salary}
                </span>
              )}
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