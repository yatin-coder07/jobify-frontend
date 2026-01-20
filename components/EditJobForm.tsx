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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const EditJobForm = () => {
  const { id } = useParams()
  const router = useRouter()
  const jobId = id as string

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
  })

  const fetchJobDetails = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) {
      console.error("Failed to fetch job details")
      return
    }

    const data = await res.json()
    setFormData({
      title: data.title,
      location: data.location,
      description: data.description,
    })
  }

  const editJob = async (e: React.FormEvent) => {
    e.preventDefault()

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/${jobId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    )

    if (!res.ok) {
      console.error("Failed to update job details")
      return
    }

    alert("Job updated successfully")
    router.push(`/jobs/${jobId}`) // ✅ CORRECT CLIENT NAVIGATION
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="bg-green-500 text-white h-10 text-lg hover:bg-green-600"
          onClick={fetchJobDetails}
        >
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={editJob}>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details below. Click save when you’re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="h-32 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditJobForm
