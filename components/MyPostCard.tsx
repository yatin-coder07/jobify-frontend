import Link from "next/link"
import { motion } from "framer-motion"

type Job = {
  id: number
  title: string
  location: string
  created_at: string
}

export default function MyPostsJobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <motion.div
        whileHover={{
          backgroundColor: "#f8fafc", // subtle blue-gray
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="
          group
          w-full
          cursor-pointer
          rounded-2xl
          border border-gray-200
          bg-white
          px-6
          py-5
          shadow-sm
        "
      >
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
              {job.title}
            </h3>

            <p className="text-sm text-gray-500">
              📍 {job.location}
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {new Date(job.created_at).toLocaleDateString()}
            </span>

            {/* Arrow */}
            <motion.span
              initial={{ x: 0, opacity: 0 }}
              whileHover={{ x: 4, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="text-blue-600"
            >
              →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
