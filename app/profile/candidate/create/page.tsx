"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCandidateProfile() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("/user-avatar.png");

  const[resumePreview,setResumePreview]=useState<string |null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
const [resumeError, setResumeError] = useState<string | null>(null);
const [profileExists, setProfileExists] = useState(false);
const [portfolioLink, setPortfolioLink] = useState("");
const [linkedinLink, setLinkedinLink] = useState("");

const [linkError, setLinkError] = useState<string | null>(null);


const [education , setEducation]=useState({
     institution: "",
    degree: "",
    start_year: "",
    end_year: "",
    is_current: false,
})


  const [showExperience, setShowExperience] = useState(false);

 const [experience, setExperience] = useState({
  company_name: "",
  role: "",
  role_description: "",
  start_date: "",
  end_date: "",
  is_current: false,
});

const[submitting, setSubmitting]=useState(false)

useEffect(() => {
  const token = localStorage.getItem("access_token");

  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (res.ok) setProfileExists(true);
    });
}, []);

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
    setImageError("Please upload a valid image file");
    return;}
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setResumeError(null);

  if (!e.target.files?.[0]) return;

  const file = e.target.files[0];

  if (file.type !== "application/pdf") {
    setResumeError("Only PDF files are allowed");
    return;
  }

  setResume(file);
  setResumePreview(file.name)
};

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

 
  const handleSubmit = async () => {
    
    if (imageError || resumeError) {
      alert("Please fix validation errors before submitting");
      return;
    }
    setSubmitting(true)

    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("bio", bio);
    formData.append("portfolio_link", portfolioLink);
formData.append("linkedin_link", linkedinLink);
    skills.forEach((s) => formData.append("skills", s));
    if (profileImage) formData.append("profile_image", profileImage);
    if (resume) formData.append("resume", resume);

    const method = profileExists ? "PUT" : "POST";

    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`,
      {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!profileRes.ok) {
  const err = await profileRes.json();
  console.log(err);
  alert("Failed to create profile");
  setSubmitting(false);
  return;
}


   const educationRes= await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/education/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        institution: education.institution,
        degree: education.degree,
        start_year: education.start_year,
        end_year: education.is_current ? null : education.end_year,
      }),
    })
    if(!educationRes.ok){
        alert("error submitting Education fields")
        setSubmitting(false);
       return;
    }

    if (showExperience) {
     const experienceRes= await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/experience/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: experience.company_name,
            role_description: experience.role_description,
            role: experience.role,
            start_date: experience.start_date,
            end_date: experience.is_current ? null : experience.end_date,
            is_current: experience.is_current,
          }),
        }
      );
       if(!experienceRes.ok){
        alert("error submitting Experinece fields")
        setSubmitting(false);
         return;
    }
    }

    router.push("/profile/candidate");
  };

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-32 font-display">
     
      <div className="sticky top-0 z-50 bg-[#f8fafc]/95 backdrop-blur border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
            ←
          </button>
          <h1 className="text-base font-bold flex-1 text-center pr-10">
            Complete Profile
          </h1>
        </div>

       
        <div className="px-4 pb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-slate-500">Profile Strength</span>
            <span className="text-xs font-bold text-[#0d7ff2]">20%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#0d7ff2] w-1/5 rounded-full" />
          </div>
        </div>
      </div>

    
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold mb-6">Personal Info</h2>

     
        <div className="flex justify-center mb-8">
          <label className="relative cursor-pointer">
            <div
              className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm bg-cover bg-center"
              style={{ backgroundImage: `url(${profilePreview})` }}
            />
          
            <div className="absolute bottom-0 right-0 bg-[#0d7ff2] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
              ✎
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {imageError && (
  <p className="mt-2 text-sm text-red-500 text-center">
    {imageError}
  </p>
)}

        </div>

        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-[#0d7ff2]"
            placeholder="e.g. Jane Doe"
          />
        </div>

        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-[#0d7ff2] resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

     
        <h2 className="text-lg font-bold mb-4">Skills</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300"
            placeholder="Add skill (e.g. React)"
          />
          <button
            onClick={addSkill}
            className="px-4 py-3 bg-[#0d7ff2] text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d7ff2]/10 text-[#0d7ff2] border border-[#0d7ff2]/20 text-sm"
            >
              {skill}
              <button onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
        </div>

        <div className="mb-5">
  <label className="block text-sm font-medium mb-1.5">
    Portfolio Link
  </label>
  <input
    value={portfolioLink}
    onChange={(e) => setPortfolioLink(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300"
    placeholder="https://your-portfolio.com"
  />
</div>

<div className="mb-6">
  <label className="block text-sm font-medium mb-1.5">
    LinkedIn Profile
  </label>
  <input
    value={linkedinLink}
    onChange={(e) => setLinkedinLink(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300"
    placeholder="https://linkedin.com/in/username"
  />
</div>

{linkError && (
  <p className="text-sm text-red-500 mb-4">{linkError}</p>
)}


        <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold mb-6">Education</h2>

        <input
          className="w-full mb-3 px-4 py-3 rounded-lg border"
          placeholder="Institution"
          value={education.institution}
          onChange={(e) =>
            setEducation({ ...education, institution: e.target.value })
          }
        />

        <input
          className="w-full mb-3 px-4 py-3 rounded-lg border"
          placeholder="Degree"
          value={education.degree}
          onChange={(e) =>
            setEducation({ ...education, degree: e.target.value })
          }
        />

        <div className="flex gap-3 mb-3">
          <input
            type="number"
            className="flex-1 px-4 py-3 rounded-lg border"
            placeholder="Start Year"
            value={education.start_year}
            onChange={(e) =>
              setEducation({ ...education, start_year: e.target.value })
            }
          />
          {!education.is_current && (
            <input
              type="number"
              className="flex-1 px-4 py-3 rounded-lg border"
              placeholder="End Year"
              value={education.end_year}
              onChange={(e) =>
                setEducation({ ...education, end_year: e.target.value })
              }
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={education.is_current}
            onChange={(e) =>
              setEducation({ ...education, is_current: e.target.checked })
            }
          />
          Currently studying here
        </label>

        <button
          className="mt-8 text-primary font-semibold bg-white  border-2 border-dashed border-gray-300 rounded-lg hover:bg-blue-50 h-10 w-full"
          onClick={() => setShowExperience((prev) => !prev)}
        >
          + Add Experience
        </button>

        {showExperience && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Experience</h2>

            <input
              className="w-full mb-3 px-4 py-3 rounded-lg border"
              placeholder="Company Name"
              value={experience.company_name}
              onChange={(e) =>
                setExperience({
                  ...experience,
                  company_name: e.target.value,
                })
              }
            />

            <input
              className="w-full mb-3 px-4 py-3 rounded-lg border"
              placeholder="Role"
              value={experience.role}
              onChange={(e) =>
                setExperience({ ...experience, role: e.target.value })
              }
            />
            <textarea
  className="w-full mb-4 px-4 py-3 rounded-lg border resize-none"
  rows={4}
  placeholder="Describe your role and responsibilities"
  value={experience.role_description}
  onChange={(e) =>
    setExperience({ ...experience, role_description: e.target.value })
  }
/>

            <div className="flex gap-3 mb-3">
              <input
                type="date"
                className="flex-1 px-4 py-3 rounded-lg border"
                value={experience.start_date}
                onChange={(e) =>
                  setExperience({
                    ...experience,
                    start_date: e.target.value,
                  })
                }
              />
              {!experience.is_current && (
                <input
                  type="date"
                  className="flex-1 px-4 py-3 rounded-lg border"
                  value={experience.end_date}
                  onChange={(e) =>
                    setExperience({
                      ...experience,
                      end_date: e.target.value,
                    })
                  }
                />
              )}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={experience.is_current}
                onChange={(e) =>
                  setExperience({
                    ...experience,
                    is_current: e.target.checked,
                  })
                }
              />
              Currently working here
            </label>
          </div>
        )}
      </div>
        
        <h2 className="text-lg font-bold mb-4">Resume</h2>
{!resume && (
 
     <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 cursor-pointer text-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0d7ff2] flex items-center justify-center mx-auto mb-3">
            ⬆
          </div>
          <p className="text-sm font-medium">Tap to upload resume</p>
          <p className="text-xs text-slate-500">PDF, DOCX (Max 5MB)</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
           onChange={handleResumeChange}
          />
       
  </label>
)}

       
        {resumeError && (
  <p className="mt-2 text-sm text-red-500 font-medium">
    {resumeError}
  </p>
)}
{resume && (
  <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className="flex items-center gap-3">
      
      <div className="w-10 h-10 rounded bg-blue-50 text-primary flex items-center justify-center">
        📄
      </div>

  
      <div>
        <p className="text-sm font-medium text-slate-900">
          {resumePreview}
        </p>
        <p className="text-xs text-slate-500">PDF Document</p>
      </div>
    </div>


    <button
      onClick={() => {
        setResume(null);
        setResumePreview(null);
      }}
      className="text-sm text-red-500 hover:text-red-600 font-medium"
    >
      Remove
    </button>
  </div>
)}


      </div>

     
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 pb-6">
        <div className="max-w-3xl mx-auto flex gap-3">
         
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3.5 bg-[#0d7ff2] text-white font-semibold rounded-xl hover:bg-[#0d7ff2]/90 shadow-lg shadow-blue-500/30"
          >
          {submitting ? (
    <>
      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Submitting...
    </>
  ) : (
    "Publish Profile →"
  )}
          </button>
        </div>
      </div>
    </main>
  );
}
