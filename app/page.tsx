"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  Globe,
  Code,
  Palette,
  Landmark,
  Megaphone,
  HeartPulse,
  BarChart3,
  Headset,
  Grid,
  UserPlus,
  SearchCheck,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ResumeUploadHero from "@/components/ResumeUploadHero";

// Framer Motion Variants for Staggered Entrances
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

const containerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function LandingPage() {
  return (
    <main className="bg-slate-50 text-slate-900 antialiased overflow-x-hidden">
      <Navbar />

      {/* HERO WRAPPER */}
      <div className="relative border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-50">
        <ResumeUploadHero />
      </div>
      
      {/* WHY JOBIFY VALUE PROPOSITION */}
      <section className="mx-auto max-w-7xl px-6 py-28 relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen Job Searching
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Why choosing <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Jobify?</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg mt-4 leading-relaxed">
            A hiring platform engineered to bypass structural clutter, bringing direct human placement loops to global positions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {[
            {
              title: "Verified Corporate Accounts",
              desc: "Every enterprise recruiter is heavily vetted through automated domain clearing channels to eliminate shadow ghost positions.",
              icon: <ShieldCheck className="h-7 w-7 text-blue-600" />,
              border: "hover:border-blue-200",
              glow: "bg-blue-500/5"
            },
            {
              title: "Autonomous Agent Matching",
              desc: "Context-aware vector matches process your target background directly against active functional requirements in seconds.",
              icon: <Sparkles className="h-7 w-7 text-emerald-600" />,
              border: "hover:border-emerald-200",
              glow: "bg-emerald-500/5"
            },
            {
              title: "Border-Free Scalability",
              desc: "Unlock structural infrastructure parameters handling global compliance, payroll support pipelines, and cross-border placement workflows.",
              icon: <Globe className="h-7 w-7 text-purple-600" />,
              border: "hover:border-purple-200",
              glow: "bg-purple-500/5"
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              variants={fadeUpVariant}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm transition-all duration-300 relative overflow-hidden group ${f.border}`}
            >
              <div className={`absolute top-0 left-0 w-full h-full ${f.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100/80 group-hover:scale-110 transition-transform duration-300 relative z-10">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-200 relative z-10">{f.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* EXPLORE HIGH-GROWTH CATEGORIES */}
      <section className="bg-white border-y border-slate-200 py-28 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Explore Active Categories</h3>
              <p className="text-slate-500 text-base mt-2 font-medium">Enterprise clusters actively staffing cross-functional teams.</p>
            </div>
            <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 group shrink-0 transition-colors">
              Browse All Verticals 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: "Technology", count: "12,430 open positions", icon: <Code className="h-6 w-6" />, style: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300" },
              { label: "Product Design", count: "3,120 open positions", icon: <Palette className="h-6 w-6" />, style: "bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300" },
              { label: "Fintech & Banking", count: "5,890 open positions", icon: <Landmark className="h-6 w-6" />, style: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-300" },
              { label: "Digital Marketing", count: "4,520 open positions", icon: <Megaphone className="h-6 w-6" />, style: "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300" },
              { label: "Healthcare", count: "2,100 open positions", icon: <HeartPulse className="h-6 w-6" />, style: "bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300" },
              { label: "Data Science", count: "1,840 open positions", icon: <BarChart3 className="h-6 w-6" />, style: "bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-300" },
              { label: "Customer Success", count: "6,310 open positions", icon: <Headset className="h-6 w-6" />, style: "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300" },
              { label: "Other Roles", count: "15,000+ open positions", icon: <Grid className="h-6 w-6" />, style: "bg-slate-100/80 text-slate-600 border-slate-200 hover:border-slate-400" },
            ].map((cat, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${cat.style}`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl font-bold shadow-inner ${cat.style.split(' ')[0]}`}>
                  {cat.icon}
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{cat.label}</h4>
                <p className="text-slate-400 text-sm font-medium">{cat.count}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PIPELINE INFOGRAPHIC PROCESS */}
      <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-8 py-20 md:py-24 text-white shadow-2xl relative"
        >
          {/* Subtle grid accent background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-20 relative z-10">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Getting hired is simple
            </h3>
            <p className="text-blue-200/70 font-medium text-sm md:text-base mt-3">
              We stripped away repetitive documentation steps to let you pipeline intent natively.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariant}
            className="grid gap-12 md:grid-cols-3 relative z-10"
          >
            {[
              {
                title: "Build Profile",
                desc: "Securely upload your text resume or vector profile matrix block to let the parser organize your history details instantly.",
                icon: <UserPlus className="h-7 w-7" />,
              },
              {
                title: "Match & Apply",
                desc: "Review dynamically tailored job suggestions matching your criteria, then activate our co-pilot workspace flow with one tap.",
                icon: <SearchCheck className="h-7 w-7" />,
              },
              {
                title: "Land Your Job",
                desc: "Connect directly into live communication panels with vetted staff targets, minimizing down-time steps entirely.",
                icon: <PartyPopper className="h-7 w-7" />,
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-center group p-4"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-white shadow-xl backdrop-blur-sm border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="text-xl font-black mb-3 text-white tracking-tight">{step.title}</h4>
                <p className="text-slate-300/80 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="border-t border-slate-200 bg-white py-16 relative z-10">
        <div className="mx-auto max-w-7xl px-6 text-center space-y-4">
          <div className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Jobify
          </div>
          <p className="text-slate-400 font-medium text-sm max-w-md mx-auto">
            Connecting technical experts with enterprise workflows globally.
          </p>
          <div className="h-px w-12 bg-slate-200 mx-auto my-4" />
          <p className="text-slate-400 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} Jobify. All platforms reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}