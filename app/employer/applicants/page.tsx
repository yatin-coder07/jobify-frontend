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
  resume?: string
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) return

        const data = await res.json()
        setApplications(data)
      } catch (error) {
        console.error(error)
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
      <section className="pt-32 pb-24 text-center px-6">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="scroll-m-20 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-700"
        >
          Applicants
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-500"
        >
          Review candidates who applied to your job postings and take the next
          step toward building your team.
        </motion.p>
      </section>

      <section className="pb-32 px-6">
        <div className="mx-auto max-w-5xl">
          {applications.length === 0 ? (
            <div className="mt-20 rounded-3xl bg-white shadow-lg p-16 text-center">
              <Image
                src="/logo.png"
                alt="Jobify"
                width={90}
                height={90}
                className="mx-auto mb-6 opacity-80"
              />
              <h2 className="text-2xl font-semibold text-gray-800">
                No applicants yet
              </h2>
              <p className="mt-3 text-gray-500 max-w-md mx-auto">
                Once candidates apply to your jobs, their profiles will appear
                here for review.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="rounded-2xl shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-semibold">
                        {app.job_title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {app.job_location}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {app.cover_letter && (
                        <div>
                          <p className="font-semibold mb-2">
                            Cover Letter
                          </p>
                          <p className="text-sm text-gray-600 whitespace-pre-line max-h-40 overflow-y-auto rounded-xl border bg-gray-50 p-4">
                            {app.cover_letter}
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Applied on:</span>{" "}
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        {app.resume && (
                          <>
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline">
                                View Resume
                              </Button>
                            </a>

                            <a
                              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${app.resume}`}
                              download
                            >
                              <Button variant="outline" className="bg-blue-500 text-white">
                                Download Resume
                              </Button>
                            </a>
                          </>
                        )}
                      </div>
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
