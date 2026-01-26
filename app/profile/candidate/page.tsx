"use client"

import Navbar from "@/components/Navbar"
import SkelitonLoading from "@/components/SkelitonLoading"
import { useEffect, useState } from "react"

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])

  

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("access_token")

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [profileRes, eduRes, expRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/education/`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/experience/`, { headers }),
      ])

      setProfile(await profileRes.json())
      setEducation(await eduRes.json())
      setExperience(await expRes.json())
    }

    fetchData()
  }, [])

  if (!profile) return <SkelitonLoading />

  const imageUrl =  profile.profile_image
  ? encodeURI(profile.profile_image)
  : "/user-avatar.png"

console.log(profile.profile_image)

  return (
    < >
   
    <main className="max-w-full mx-auto px-6 py-8 bg-blue-50 ">
         <nav className="mb-15"><Navbar/></nav>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

      
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

          
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
         
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-400" />

            <div className="px-6 pb-8">
              
              <div className="relative -mt-16 mb-4 flex justify-center lg:justify-start">
                <div
                  className="size-32 rounded-2xl border-4 border-white bg-cover bg-center shadow-xl"
                  style={{
                    backgroundImage: `url("${
                     imageUrl
                    }")`,
                  }}
                />
              </div>

            
              <h1 className="text-2xl font-bold text-center lg:text-left">
                {profile.full_name}
              </h1>

              
              <p className=" font-semibold text-lg mb-2 text-center lg:text-left text-blue-500">
                Software Developer
              </p>

            
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-6 justify-center lg:justify-start">
                <span className="material-symbols-outlined text-base">location_on</span>
                India • Open to Remote
              </div>

        
              <div className="flex flex-col gap-3">
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 bg-blue-400 text-white py-3 rounded-xl font-bold"
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download Resume
                  </a>
                )}

               
              </div>
            </div>
          </div>

          
         <div className="bg-white rounded-2xl border p-6 shadow-sm">
  <h4 className="font-bold mb-4">Portfolio & Socials</h4>

  <div className="flex flex-col gap-3">

   
    <a
      href={profile.portfolio_link || "#"}
      target="_blank"
      className="flex items-center gap-3 text-slate-600 hover:text-primary"
    >
      <span className="material-symbols-outlined">language</span>
      <span className="text-sm">
        {profile.portfolio_link
          ? profile.portfolio_link
          : "Portfolio not provided"}
      </span>
    </a>

   
    <a
      href={profile.linkedin_link || "#"}
      target="_blank"
      className="flex items-center gap-3 text-slate-600 hover:text-primary"
    >
      <span className="material-symbols-outlined">link</span>
      <span className="text-sm">
        {profile.linkedin_link
          ? profile.linkedin_link
          : "LinkedIn not provided"}
      </span>
    </a>

  </div>
</div>


        </aside>


        <div className="lg:col-span-8 space-y-8">

        
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">person</span>
              About Me
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {profile.bio ||
                "Passionate developer eager to build scalable applications, learn modern technologies, and contribute to impactful products."}
            </p>
          </section>

         
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">work</span>
              Work Experience
            </h2>

            {experience.length === 0 ? (
              <p className="text-slate-500">
                No professional experience added yet. Actively seeking opportunities 🚀
              </p>
            ) : (
              <div className="space-y-8">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-bold">{exp.role}</h3>
                      <span className="text-sm bg-blue-400 text-white font-semibold px-3 py-1 rounded-full">
                        {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                      </span>
                    </div>
                   <p className="text-primary font-medium">{exp.company_name}</p>

                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                {exp.role_description
                    ? exp.role_description
                    : "Role description not added yet."}
                </p>  
                  </div>
                ))}
              </div>
            )}
          </section>

         
          {profile.skills?.length > 0 && (
            <section className="bg-white rounded-2xl border p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">bolt</span>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
           
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-blue-400">school</span>
              
              Education
            </h2>

            {education.map(edu => (
              <div key={edu.id} className="flex items-start gap-5">
              
                <div className="flex gap-2">
                    <div >
                        <span className="material-symbols-outlined  bg-blue-200 p-3 rounded-xl text-blue-500">account_balance</span>
                    </div>
                 <div>
                     <h3 className="text-lg font-bold">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.institution}</p>
                  <p className="text-sm text-slate-400">
                    {edu.start_year} – {edu.is_current ? "Present" : edu.end_year}
                  </p>
                 </div>
                </div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </main></>
  )
}
