"use client";

import { useUser } from "@/app/context/UserContext";
import { easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
 
  const [profileImage ,setProfileImage]=useState()

  function LogOut() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }


useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("access_token")

    if (!token) return

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/candidate/profile/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!res.ok) return

    const data = await res.json()
    setProfileImage(data.profile_image_url)
  }

  fetchProfile()
}, [])

  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        layout
        transition={{ layout: { duration: 0.45, ease: "easeInOut" } }}
        className="flex  justify-between w-[1500px] max-w-[95vw] bg-transparent"
      >
       
        <div className="bg-white rounded-xl shadow-md px-6 py-3">
          <Link href="/" className="text-xl font-semibold">
            <span className="text-black">Job</span>
            <span className="text-blue-600">ify</span>
          </Link>
        </div>

        
        <div className="bg-white rounded-xl shadow-md p-[7px] flex items-center">
          <div className="flex items-center gap-[7px] text-sm">

         
            {!user && (
              <>
                <Link href="/login">
                  <motion.button
                    className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold"
                    whileHover={{ backgroundColor: "#2563EB" }}
                  >
                    Login
                  </motion.button>
                </Link>

                <Link href="/register">
                  <motion.button
                    className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold"
                    whileHover={{ backgroundColor: "#2563EB" }}
                  >
                    Register
                  </motion.button>
                </Link>
              </>
            )}

          
            {user?.role === "candidate" && (
              <>
                <Link href="/applications">
                  <motion.button
                    className="h-10 px-4 rounded-lg text-gray-600 font-medium"
                    whileHover={{ backgroundColor: "#F3F4F6" }}
                  >
                    My Applications
                  </motion.button>
                </Link>

                <Link href="/jobs">
                  <motion.button
                    className="h-10 px-4 rounded-lg bg-blue-600 text-white font-semibold"
                    whileHover={{ backgroundColor: "#2563EB" }}
                  >
                    Find Jobs
                  </motion.button>
                </Link>

                <Link href="/login">
                  <motion.button
                    onClick={LogOut}
                    className="h-10 px-4 rounded-lg text-gray-600 font-medium"
                    whileHover={{ backgroundColor: "#EF4444", color: "#ffffff" }}
                  >
                    Logout
                  </motion.button>
                </Link>
                 {profileImage ? (
                   <Link href={"/profile/candidate"}>
                     <img
                      src={profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                   </Link>
                  ) : (
                    <Link href={"/profile/candidate"}>
                       <img
                      src="/user-avatar.png"
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    </Link>
                   

                  )}
              </>
            )}

            
            {user?.role === "employer" && (
              <>
                <Link href="/employer/applicants">
                  <motion.button
                    className="h-10 px-4 rounded-lg text-gray-600 font-medium"
                    whileHover={{ backgroundColor: "#F3F4F6" }}
                  >
                    Applicants
                  </motion.button>
                </Link>

                <Link href="/employer/postjob">
                  <motion.button
                    className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold"
                    whileHover={{ backgroundColor: "#2563EB" }}
                  >
                    Post Job
                  </motion.button>
                </Link>

                <Link href="/login">
                  <motion.button
                    onClick={LogOut}
                    className="h-10 px-4 rounded-md bg-blue-600 text-white font-semibold"
                    whileHover={{ backgroundColor: "#EF4444" }}
                    transition={{ ease: easeInOut }}
                  >
                    Logout
                  </motion.button>
                </Link>
               
              </>
            )}

          </div>
        </div>
      </motion.div>
    </nav>
  );
}
