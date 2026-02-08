"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useRouter } from "next/navigation"

const JobApplicationForm = ({ jobId }: { jobId: string }) => {
  const router = useRouter()

  const [formData, setFormData] = useState<{
    coverLetter: string
    resume: File | null
  }>({
    coverLetter: "",
    resume: null,
  })

  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setFormData((prev) => ({ ...prev, [name]: file }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // ✅ SIMPLE, SAFE VALIDATION
    if (formData.coverLetter.trim().length < 30) {
      setError("Cover letter must be at least 30 characters")
      return
    }

    if (!formData.resume) {
      setError("Resume is required")
      return
    }

    if (!token) {
      setError("You must be logged in to apply")
      return
    }

    setSubmitting(true)

    const data = new FormData()
    data.append("cover_letter", formData.coverLetter)
    data.append("resume", formData.resume)
    data.append("job", jobId)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/applications/apply/${jobId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      )

      if (!res.ok) {
        setError("Failed to submit application")
        setSubmitting(false)
        return
      }

      // ✅ CLIENT-SAFE NAVIGATION
      router.push("/jobs")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Apply Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Apply for this role
            </DialogTitle>
            <DialogDescription>
              Submit your resume and a short cover letter to proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label>Cover Letter</Label>
            <Textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Briefly explain why you're a good fit..."
              className="min-h-[120px]"
            />
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const file = e.dataTransfer.files?.[0]
              if (file) setFormData((p) => ({ ...p, resume: file }))
            }}
            onClick={() =>
              document.getElementById("resume-upload")?.click()
            }
            className={`rounded-xl border-2 border-dashed p-6 text-center transition
              ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }
            `}
          >
            {formData.resume ? (
              <p className="text-sm font-medium text-green-600">
                {formData.resume.name}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Drag & drop your resume here or click to upload
              </p>
            )}

            <input
              type="file"
              id="resume-upload"
              name="resume"
              hidden
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default JobApplicationForm
