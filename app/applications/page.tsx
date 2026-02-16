"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import SkelitonLoading from "@/components/SkelitonLoading"
import { motion } from "framer-motion"

type Application = {
  id: number
  job_title: string
  job_location: string
  cover_letter: string
  resume?: string
  applied_at: string
}

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/candidate/`,
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

  const deleteApplication = async (applicationId: number) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/delete/${applicationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) return

    setApplications((prev) =>
      prev.filter((app) => app.id !== applicationId)
    )
    setDeleted(true)
  }

  if (loading) {
    return <SkelitonLoading />
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
        <Image
          src="/logo.png"
          alt="Jobify"
          width={80}
          height={80}
          className="mb-6 opacity-80"
        />
        <h2 className="text-2xl font-semibold text-gray-700">
          No applications yet
        </h2>
        <p className="mt-2 max-w-md text-gray-500">
          You haven’t applied to any jobs yet. Start exploring opportunities and
          your applications will appear here.
        </p>
      </div>
    )
  }
return (
  <div className="min-h-screen bg-gray-50">
    
    {/* HERO HEADER */}
    <section className="pt-32 pb-24 text-center px-6">
      <h1 className="scroll-m-20 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900">
        My Applications
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
        Track every role you’ve applied to, review your details, and manage
        your job search from one place.
      </p>
    </section>

    {/* CONTENT */}
    <section className="pb-32 px-6">
      <div className="mx-auto max-w-4xl">
        
        {applications.length === 0 ? (
          /* EMPTY STATE */
          <div className="mt-20 rounded-3xl bg-white shadow-lg p-16 text-center">
            <Image
              src="/logo.png"
              alt="Jobify"
              width={90}
              height={90}
              className="mx-auto mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              No applications yet
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              When you apply to jobs, they’ll appear here so you can track
              progress and revisit details anytime.
            </p>
          </div>
        ) : (
          /* APPLICATION LIST */
          <div className="space-y-10">
            {applications.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Card className="shadow-lg rounded-2xl">
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
                          Your Cover Letter
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
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${app.resume}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline">
                            View Resume
                          </Button>
                        </a>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            Withdraw Application
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Withdraw this application?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove your application
                              from the employer’s view.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteApplication(app.id)}
                            >
                              Yes, withdraw
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
