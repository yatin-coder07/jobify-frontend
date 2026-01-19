"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Calendar } from "lucide-react"

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
    <Link href={`/jobs/${job.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="
          group
          h-full
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-md
          hover:shadow-xl
          cursor-pointer
        "
      >
        <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
          {job.title}
        </h2>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm text-gray-600">
          {job.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar size={14} />
            <span>
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <span className="text-sm font-semibold text-blue-600 transition-all group-hover:translate-x-1">
            View Details →
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

export default JobCard
