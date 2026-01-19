"use client";

import { useUser } from "@/app/context/UserContext";
import MyPostCard from "@/components/MyPostCard";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, Users, Rocket } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  postedAt: string;
};

export default function Page() {
  const user = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  useEffect(() => {
    async function fetchJobs() {
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/jobs/my-jobs/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setJobs(data);
    }

    fetchJobs();
  }, [token]);

  return (
    <>
      <Navbar />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7 }}
        className="pt-72 pb-52 px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-32">
          <div>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-gray-600 sm:text-8xl lg:text-9xl">
              EMPLOYER
            </h1>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-blue-600 sm:text-8xl lg:text-9xl">
              DASHBOARD
            </h1>
            <p className="mt-10 max-w-xl text-lg text-gray-500">
              A centralized workspace to manage job postings, review applicants,
              and make confident hiring decisions.
            </p>
            <p className="mt-4 max-w-xl text-gray-500">
              Everything you need to build strong teams, in one place.
            </p>
          </div>

          <div className="hidden lg:block">
            <Image
              src="/employerDashboard.png"
              alt="Employer dashboard"
              width={520}
              height={520}
              className="object-contain"
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-44 px-8"
      >
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-700">
            Welcome back, <span className="text-blue-600">{user?.username}</span>
          </h3>
          <p className="text-gray-500">
            Start hiring by posting a new role or managing your existing listings.
          </p>
          <p className="text-gray-500">
            Clear workflows lead to faster and better hires.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg"
          >
            <Link href="/employer/postjob">Post a Job</Link>
          </motion.button>
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-48 px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          {[
            {
              title: "Reach Top Talent",
              desc: "Publish job listings and attract skilled candidates actively seeking new roles.",
              icon: <Briefcase className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Manage Applications",
              desc: "Review applicants, shortlist profiles, and track hiring progress easily.",
              icon: <Users className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Hire Faster",
              desc: "Streamlined workflows help you move from posting to hiring without delays.",
              icon: <Rocket className="h-8 w-8 text-blue-600" />,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="rounded-2xl border border-gray-200 bg-white p-10 shadow-lg hover:shadow-xl"
            >
              <div className="mb-4">{card.icon}</div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-gray-700">
                {card.title}
              </h4>
              <p className="mt-3 text-gray-500">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-48 px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="scroll-m-20 border-b pb-3 text-3xl font-semibold tracking-tight text-gray-700 text-center">
            Your Posted Jobs
          </h2>

          <p className="mt-6 text-center text-gray-500 max-w-3xl mx-auto">
            Monitor all your active and past job postings, view engagement, and
            manage applicants efficiently.
          </p>

          <div className="mt-10 rounded-2xl bg-white p-10 shadow-lg">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center">
                You have not posted any jobs yet.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {jobs.map((job) => (
                  <MyPostCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-gray-200 py-20">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 space-y-2">
          <div className="font-semibold">
            <span className="text-gray-700">Job</span>
            <span className="text-blue-600">ify</span>
          </div>
          <p>Helping you hire better, faster.</p>
          <p>© {new Date().getFullYear()} Jobify. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
