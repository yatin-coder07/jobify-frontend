"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


export default function CreateEmployerProfile() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [location, setLocation] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("/user-avatar.png");
  const [logoError, setLogoError] = useState<string | null>(null);

  const [profileExists, setProfileExists] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/employer/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setProfileExists(true);
    });
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload a valid image file");
      return;
    }

    setLogoError(null);
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (logoError) {
      alert("Fix validation errors before submitting");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("description", description);
    formData.append("about_company", aboutCompany);
    formData.append("location", location);
    formData.append("website_link", websiteLink);
    formData.append("linkedin_link", linkedinLink);
    if (logo) formData.append("logo", logo);

    const method = profileExists ? "PUT" : "POST";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/employer/profile/`,
      {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

   if (!res.ok) {
  alert("Failed to create employer profile");
  setSubmitting(false);
  return;
}

// ✅ show success dialog instead of redirect
setSubmitting(false);
setShowSuccess(true);

  };

  return (
    
    <main className="bg-[#f8fafc] min-h-screen pb-32 font-display">
      {/* HEADER (same as candidate) */}
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

      {/* BODY */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold mb-6">Company Info</h2>

        {/* LOGO (same avatar UI) */}
        <div className="flex justify-center mb-8">
          <label className="relative cursor-pointer">
            <div
              className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-sm bg-cover bg-center"
              style={{ backgroundImage: `url(${logoPreview})` }}
            />
            <div className="absolute bottom-0 right-0 bg-[#0d7ff2] text-white p-1.5 rounded-full shadow-lg border-2 border-white">
              ✎
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </label>
        </div>

        {/* COMPANY NAME */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Company Name
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-[#0d7ff2]"
            placeholder="e.g. Jobify Inc."
          />
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            Short Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-[#0d7ff2] resize-none"
            placeholder="What is your role in the company?"
          />
        </div>

        {/* ABOUT COMPANY */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            About Company
          </label>
          <textarea
            value={aboutCompany}
            onChange={(e) => setAboutCompany(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-[#0d7ff2] resize-none"
            placeholder="Culture, mission, values..."
          />
        </div>

        {/* LOCATION */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300"
            placeholder="e.g. Bangalore, India"
          />
        </div>

        {/* WEBSITE */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Website
          </label>
          <input
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300"
            placeholder="https://company.com"
          />
        </div>

        {/* LINKEDIN */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            LinkedIn Page
          </label>
          <input
            value={linkedinLink}
            onChange={(e) => setLinkedinLink(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300"
            placeholder="your linkedin profile link"
          />
        </div>
      </div>

      {/* BOTTOM CTA (same as candidate) */}
      <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 pb-6">
        <div className="max-w-3xl mx-auto flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3.5 bg-[#0d7ff2] text-white font-semibold rounded-xl hover:bg-[#0d7ff2]/90 shadow-lg shadow-blue-500/30"
          >
            {submitting ? "Submitting..." : "Publish Profile →"}
          </button>
        </div>
      </div>
      <AlertDialog open={showSuccess}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        🎉 Profile Published Successfully
      </AlertDialogTitle>
      <AlertDialogDescription>
        Your company profile is now live. You can start posting jobs and
        attracting candidates right away.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogAction
      className="bg-[#0d7ff2]"
      onClick={() => {
        setShowSuccess(false);
        router.push("/profile/employer");
      }}
    >
      Go to Company Profile →
    </AlertDialogAction>
  </AlertDialogContent>
</AlertDialog>

    </main>
  );
}
