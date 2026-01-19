"use client";

import { useUser } from "@/app/context/UserContext";
import { easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const isEmployerDashboard = pathname.startsWith("/employer");

  function LogOut() {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }

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

            {/* CANDIDATE */}
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
              </>
            )}

            {/* EMPLOYER */}
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
