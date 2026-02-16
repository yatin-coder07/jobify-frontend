"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UpdateProfileForm({
  profile,
  onUpdated,
}: {
  profile?: any
  onUpdated?: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    portfolio_link: profile?.portfolio_link || "",
    linkedin_link: profile?.linkedin_link || "",
  })

  const [currentData, setCurrentData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    portfolio_link: profile?.portfolio_link || "",
    linkedin_link: profile?.linkedin_link || "",
    resume_url: profile?.resume_url || "",
    skills: profile?.skills || [],
    experiences: profile?.experiences || [],
    educations: profile?.educations || [],
  })

  const [skillInput, setSkillInput] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const fetchProfile = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      setCurrentData(data)
    }
    fetchProfile()
  }, [])

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setCurrentData({ ...currentData, [e.target.name]: e.target.value })
  }

 
  const addSkill = () => {
    if (!skillInput.trim()) return
    setCurrentData({
      ...currentData,
      skills: [...currentData.skills, { name: skillInput }],
    })
    setSkillInput("")
  }

  const removeSkill = (index: number) => {
    const updated = [...currentData.skills]
    updated.splice(index, 1)
    setCurrentData({ ...currentData, skills: updated })
  }


  const addExperience = () => {
    setCurrentData({
      ...currentData,
      experiences: [
        ...currentData.experiences,
        { role: "", company_name: "", role_description: "" },
      ],
    })
  }

  const updateExperience = (i: number, field: string, value: string) => {
    const updated = [...currentData.experiences]
    updated[i][field] = value
    setCurrentData({ ...currentData, experiences: updated })
  }


  const addEducation = () => {
    setCurrentData({
      ...currentData,
      educations: [
        ...currentData.educations,
        { degree: "", institution: "" },
      ],
    })
  }

  const updateEducation = (i: number, field: string, value: string) => {
    const updated = [...currentData.educations]
    updated[i][field] = value
    setCurrentData({ ...currentData, educations: updated })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files[0]) setResumeFile(e.dataTransfer.files[0])
  }

  const handleFileSelect = (e: any) => {
    if (e.target.files[0]) setResumeFile(e.target.files[0])
  }

  const handleSubmit = async () => {
    setLoading(true)
    const token = localStorage.getItem("access_token")
    const form = new FormData()

    form.append("full_name", currentData.full_name)
    form.append("bio", currentData.bio)
    form.append("portfolio_link", currentData.portfolio_link)
    form.append("linkedin_link", currentData.linkedin_link)

    currentData.skills.forEach((s: any) => form.append("skills", s.name))

    if (resumeFile) form.append("resume", resumeFile)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    )
    if(!res.ok){
      setLoading(false)
      alert("Failed to update profile")
      return
    }

    const data = await res.json()
    onUpdated?.(data)
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <Card className={`${open ? "block" : "hidden"} `}>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-center text-blue-400">
            Update Profile
          </CardTitle>
          <div>
            <button className="border rounded-full h-10 w-10 bg-red-400 text-white hover:bg-red-600 hover:text-white" onClick={() => setOpen(false)}>X</button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
         
          <div className="space-y-1">
            <label className="font-semibold text-sm">Username</label>
            <Input
              name="full_name"
              value={currentData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm">Bio</label>
            <Textarea
              name="bio"
              value={currentData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm">Portfolio</label>
            <Input
              name="portfolio_link"
              value={currentData.portfolio_link}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sm">LinkedIn</label>
            <Input
              name="linkedin_link"
              value={currentData.linkedin_link}
              onChange={handleChange}
            />
          </div>

          {/* SKILLS */}
          <div className="space-y-2">
            <label className="font-semibold text-sm">Skills</label>

            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill"
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentData.skills.map((s: any, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm cursor-pointer"
                  onClick={() => removeSkill(i)}
                >
                  {s.name} ✕
                </span>
              ))}
            </div>
          </div>

          
          <div className="space-y-3">
            <label className="font-semibold text-sm">Experience</label>

            {currentData.experiences.map((exp: any, i: number) => (
              <div key={i} className="space-y-2 border p-3 rounded-lg">
                <Input
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) =>
                    updateExperience(i, "role", e.target.value)
                  }
                />
                <Input
                  placeholder="Company"
                  value={exp.company_name}
                  onChange={(e) =>
                    updateExperience(i, "company_name", e.target.value)
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={exp.role_description}
                  onChange={(e) =>
                    updateExperience(i, "role_description", e.target.value)
                  }
                />
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addExperience}>
              + Add Experience
            </Button>
          </div>

          {/* EDUCATION */}
          <div className="space-y-3">
            <label className="font-semibold text-sm">Education</label>

            {currentData.educations.map((edu: any, i: number) => (
              <div key={i} className="space-y-2 border p-3 rounded-lg">
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(i, "degree", e.target.value)
                  }
                />
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(i, "institution", e.target.value)
                  }
                />
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addEducation}>
              + Add Education
            </Button>
          </div>

          
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
            />
            {resumeFile ? (
              <p className="font-semibold">📄 {resumeFile.name}</p>
            ) : (
              <p className="text-sm text-slate-500">
                Drag & drop resume here or click to upload
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 font-semibold"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>

            <Button
              variant="outline"
              className="w-full font-semibold"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <button
        className="bg-blue-400 text-white hover:bg-blue-600 font-semibold p-3 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        Update Profile
      </button>
    </>
  )
}
