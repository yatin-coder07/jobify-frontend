"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Rocket,
  CheckCircle,
  Globe,
  ShieldCheck,
  Sparkles,
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ResumeUploadHero from "@/components/ResumeUploadHero";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function LandingPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
     <Navbar/>

      {/* HERO */}
      <ResumeUploadHero />
     
      {/* WHY JOBIFY */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-black mb-4">Why choosing <span className="text-blue-500">Jobify?</span></h2>
          <p className="text-slate-500 font-medium">
            A hiring experience built to be human, efficient, and transparent.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {[{
            title: "Verified Employers",
            desc: "Every company is vetted to ensure legitimate and safe opportunities.",
            icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
          },{
            title: "Smart Matching",
            desc: "AI-powered role suggestions based on skills and preferences.",
            icon: <Sparkles className="h-8 w-8 text-green-600" />,
          },{
            title: "Global Reach",
            desc: "Remote and relocation roles across 120+ countries.",
            icon: <Globe className="h-8 w-8 text-purple-600" />,
          }].map((f) => (
            <div key={f.title} className="text-center p-6">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{f.title}</h4>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex  justify-between items-center">
          <div>
            <h3 className="text-3xl font-black ">Explore Categories</h3>
            <p className="text-slate-500">High-growth industries hiring now</p>
          </div>
          <Link href="#" className="text-sm font-bold text-blue-600">
            Browse All →
          </Link>
        </div>
<div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
      <Code className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Technology</h4>
    <p className="text-slate-500">12,430 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
      <Palette className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Product Design</h4>
    <p className="text-slate-500">3,120 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
      <Landmark className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Fintech & Banking</h4>
    <p className="text-slate-500">5,890 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
      <Megaphone className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Digital Marketing</h4>
    <p className="text-slate-500">4,520 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
      <HeartPulse className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Healthcare</h4>
    <p className="text-slate-500">2,100 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
      <BarChart3 className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Data Science</h4>
    <p className="text-slate-500">1,840 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
      <Headset className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Customer Success</h4>
    <p className="text-slate-500">6,310 open positions</p>
  </motion.div>

  <motion.div
    whileHover={{ y: -8 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-xl"
  >
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
      <Grid className="h-8 w-8" />
    </div>
    <h4 className="text-xl font-bold mb-3">Other Roles</h4>
    <p className="text-slate-500">15,000+ open positions</p>
  </motion.div>
</div>

      </section>

      <section className="py-32 px-6">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-10 py-24 text-white shadow-2xl"
  >
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-center text-4xl md:text-5xl font-black mb-20"
    >
      Getting hired is simple
    </motion.h3>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="grid gap-16 md:grid-cols-3"
    >
     
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl">
          <UserPlus className="h-8 w-8" />
        </div>
        <h4 className="text-2xl font-black mb-3">Build Profile</h4>
        <p className="text-white/75 max-w-xs mx-auto">
          Create your digital resume and showcase your strongest skills.
        </p>
      </motion.div>

      
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl">
          <SearchCheck className="h-8 w-8" />
        </div>
        <h4 className="text-2xl font-black mb-3">Match & Apply</h4>
        <p className="text-white/75 max-w-xs mx-auto">
          Discover AI-matched roles that align with your ambitions.
        </p>
      </motion.div>

     
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        whileHover={{ y: -10, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-xl">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h4 className="text-2xl font-black mb-3">Land Your Job</h4>
        <p className="text-white/75 max-w-xs mx-auto">
          Interview directly and step confidently into your next role.
        </p>
      </motion.div>
    </motion.div>
  </motion.div>
</section>

  
     
      
      <footer className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500 space-y-3">
          <div className="text-xl font-bold text-slate-800">Jobify</div>
          <p>Connecting world-class talent with world-class companies.</p>
          <p>© {new Date().getFullYear()} Jobify. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
