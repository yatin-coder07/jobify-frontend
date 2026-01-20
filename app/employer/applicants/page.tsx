"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SkelitonLoading from "@/components/SkelitonLoading"
import { motion } from "framer-motion"
import Image from "next/image"

type Application = {
  id: number
  job_title: string
  job_location: string
  cover_letter: string
  resume_url?: string
  applied_at: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/employer/`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        )

        if (!res.ok) {
          setApplications([])
          return
        }

        const data = await res.json()
        setApplications(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(error)
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  if (loading) {
    return <SkelitonLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <section className="pt-32 pb-24 text-center px-6">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-800"
        >
          Applicants
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-500"
        >
          Review candidates who applied to your job postings.
        </motion.p>
      </section>

      {/* CONTENT */}
      <section className="pb-32 px-6">
        <div className="mx-auto max-w-5xl">
          {applications.length === 0 ? (
            /* ✅ EMPTY STATE */
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center text-center space-y-6">
                <Image
                  src="/logo.png"
                  alt="Jobify"
                  width={100}
                  height={100}
                  className="opacity-70"
                />

                <h2 className="text-2xl font-semibold text-gray-700">
                  No applications yet
                </h2>

                <p className="max-w-md text-gray-500 text-sm leading-relaxed">
                  When candidates apply to your job postings, their
                  applications will appear here for review.
                </p>
              </div>
            </div>
          ) : (
            /* ✅ APPLICATION LIST */
            <div className="space-y-10">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-2xl font-semibold text-gray-900">
                        {app.job_title}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        📍 {app.job_location}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Cover Letter */}
                      {app.cover_letter && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">
                            ✉️ Cover Letter
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-line rounded-xl border bg-gray-50 p-4 max-h-40 overflow-y-auto">
                            {app.cover_letter}
                          </p>
                        </div>
                      )}

                      {/* Applied Date */}
                      <p className="text-sm">
                        <span className="font-semibold text-blue-600">
                          Applied on:
                        </span>{" "}
                        <span className="text-gray-600">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </p>

                      {/* Resume Actions */}
                      {app.resume_url && (
                        <div className="flex gap-4">
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline">
                              View Resume
                            </Button>
                          </a>

                          <a href={app.resume_url} download>
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                              Download Resume
                            </Button>
                          </a>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
