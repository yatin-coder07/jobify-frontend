"use client";

import Navbar from "@/components/Navbar";
import SkelitonLoading from "@/components/SkelitonLoading";
import { useEffect, useState } from "react";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("access_token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [profileRes, jobsRes,] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/employer/profile/`,
          { headers }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/employer/my-jobs/`,
          { headers }
        ),
       
      ]);

      setProfile(await profileRes.json());
      setJobs(await jobsRes.json());
    }

    fetchData();
  }, []);

  if (!profile) return <SkelitonLoading />;

  const logoUrl = profile.logo
    ? encodeURI(profile.logo)
    : "/company-placeholder.png";

  return (
    <main className="max-w-full mx-auto px-6 py-8 bg-blue-50">
      <nav className="mb-15">
        <Navbar />
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* EMPLOYER CARD */}
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-400" />

            <div className="px-6 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-center lg:justify-start">
                <div
                  className="size-32 rounded-2xl border-4 border-white bg-cover bg-center shadow-xl"
                  style={{
                    backgroundImage: `url("${logoUrl}")`,
                  }}
                />
              </div>

              {/* Employer Name */}
              <h1 className="text-2xl font-bold text-center lg:text-left">
                {profile.user?.username}
              </h1>

             

              {/* Location */}
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-6 justify-center lg:justify-start">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                {profile.location}
              </div>
            </div>
          </div>

          {/* LINKS */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm">
            <h4 className="font-bold mb-4">Links</h4>

            <div className="flex flex-col gap-3">
              <a
                href={profile.website_link || "#"}
                target="_blank"
                className="flex items-center gap-3 text-slate-600 hover:text-primary"
              >
                <span className="material-symbols-outlined">language</span>
                <span className="text-sm">
                  {profile.website_link || "Website not provided"}
                </span>
              </a>

              <a
                href={profile.linkedin_link || "#"}
                target="_blank"
                className="flex items-center gap-3 text-slate-600 hover:text-primary"
              >
                <span className="material-symbols-outlined">link</span>
                <span className="text-sm">
                  {profile.linkedin_link || "LinkedIn not provided"}
                </span>
              </a>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          {/* ABOUT EMPLOYER */}
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">
                person
              </span>
              About Employer
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {profile.description ||
                "This employer has not added a personal description yet."}
            </p>
          </section>

          {/* COMPANY INFO (NEW CARD) */}
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">
                business
              </span>
              {profile.company_name}
            </h2>

            <p className="text-slate-600 leading-relaxed text-lg">
              {profile.about_company ||
                "Company information has not been added yet."}
            </p>
          </section>

          {/* JOB LIST */}
          <section className="bg-white rounded-2xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">
                work
              </span>
              Jobs Posted
            </h2>

            {jobs.length === 0 ? (
              <p className="text-slate-500">
                No jobs posted yet. Start hiring today 🚀
              </p>
            ) : (
              <div className="space-y-8">
                {jobs.map((job) => (
                  <div key={job.id}>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-lg font-bold">{job.title}</h3>
                      <span className="text-sm bg-blue-400 text-white font-semibold px-3 py-1 rounded-full">
                        {job.created_at}
                      </span>
                    </div>

                    <p className="text-primary font-medium">
                      {job.location} • {job.work_mode}
                    </p>

                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
