"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { Briefcase, ClipboardList, Rocket, CheckCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const chartData = [
  { name: "Mon", applications: 2 },
  { name: "Tue", applications: 5 },
  { name: "Wed", applications: 3 },
  { name: "Thu", applications: 8 },
  { name: "Fri", applications: 6 },
];

export default function CandidateDashboard() {
  const user = useUser();

  return (
    <>
      <Navbar />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.7 }}
        className="pt-40 pb-52 px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-32">
          <div>
            <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-blue-600 sm:text-8xl lg:text-9xl">
              JOBIFY
            </h1>
            <p className="mt-10 max-w-xl text-lg text-gray-500">
              A purpose-built platform designed to help you navigate your job
              search with clarity, structure, and confidence.
            </p>
          
          </div>

          <div className="hidden lg:block">
            <Image
              src="/candidateDashboard.png"
              alt="Jobify candidate"
              width={520}
              height={520}
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
            Your dashboard gives you a clear overview of your progress and next
            steps.
          </p>
          <p className="text-gray-500">
            Stay consistent, apply thoughtfully, and build momentum with every
            action.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg"
          >
            <Link href="/jobs">Explore Jobs</Link>
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
        <div className="mx-auto max-w-7xl space-y-10">
        

          <div className="grid gap-8 md:grid-cols-3">
            {["Applied", "Under Review", "Shortlisted"].map((label) => (
              <div
                key={label}
                className="rounded-2xl bg-white p-8 shadow-lg"
              >
                <CheckCircle className="mb-4 h-6 w-6 text-blue-600" />
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-gray-700">
                  {label}
                </h4>
                <p className="mt-3 text-gray-500">
                  Jobs currently marked as {label.toLowerCase()} by employers.
                </p>
              </div>
            ))}
          </div>
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
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Designed to Support Long-Term Growth
          </h1>
          <p className="text-gray-500">
            Jobify isn’t just about applying to jobs — it’s about helping you
            build a sustainable and focused career path.
          </p>
          <p className="text-gray-500">
            Make informed decisions, stay organized, and move forward with
            confidence.
          </p>
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
        <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row">
         <div>
          <Image
              src="/candidateHero.png"
              alt="Application Tracking"
              width={350}
              height={350}
            />
         </div>

          <div className="flex-1 rounded-2xl bg-blue-600 p-12 text-white shadow-lg space-y-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Application Tracking
            </h4>
           <p className="mt-2 text-blue-100">
  Maintain a clear overview of all your job applications and track their
  progress in real time.
</p>

<p className="mt-2 text-blue-100">
  Stay organized with application statuses, submission dates, and employer
  responses — all in one place.
</p>

<h4 className="scroll-m-20 mt-6 text-xl font-semibold tracking-tight text-white">
  Stay Interview-Ready
</h4>

<p className="mt-2 text-blue-100">
  Never miss an update from employers across the country. Keep track of
  interview calls, follow-ups, and next steps with confidence.
</p>

<p className="mt-2 text-blue-100">
  With everything centralized, you can focus less on managing applications and
  more on preparing to succeed.
</p>
          </div>
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
        <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row">
          <div className="flex-1 space-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-700">
              Application Activity
            </h3>
            <p className="text-gray-500">
              Visual insights help you understand your job search behavior.
            </p>
            <p className="text-gray-500">
              Consistency and timing often play a critical role in responses.
            </p>
          </div>

          <div className="flex-1 rounded-2xl bg-white p-10 shadow-lg">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#2563EB"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          {[
            {
              title: "Explore Jobs",
              desc: "Discover roles from companies actively hiring talent.",
              icon: <Briefcase className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Track Progress",
              desc: "Monitor application stages and employer responses.",
              icon: <ClipboardList className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Get Hired Faster",
              desc: "Apply strategically and improve your interview chances.",
              icon: <Rocket className="h-8 w-8 text-blue-600" />,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="rounded-2xl border border-gray-200 bg-white p-12 shadow-lg hover:shadow-xl"
            >
              <div className="mb-5">{card.icon}</div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-gray-700">
                {card.title}
              </h4>
              <p className="mt-4 text-gray-500">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <footer className="border-t border-gray-200 py-20">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500 space-y-2">
          <div className="font-semibold">
            <span className="text-gray-700">Job</span>
            <span className="text-blue-600">ify</span>
          </div>
          <p>Helping you find the right opportunity.</p>
          <p>© {new Date().getFullYear()} Jobify. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
