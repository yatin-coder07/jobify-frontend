"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Loader2, Lock, FileText, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";

const ResumeUploadHero = () => {
  const { user, loading: authLoading } = useUser();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF configuration.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid PDF configuration.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("original_file", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/resume/upload/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        const resumeId = data.id || data.resume_id; 

        setTimeout(() => {
          if (resumeId) {
            router.push(`/jobs?resumeId=${resumeId}`);
          } else {
            router.push("/jobs");
          }
        }, 2000);
      } else {
        setStatus("error");
        setError(data.message || "Pipeline ingestion failed.");
      }
    } catch (err) {
      setStatus("error");
      setError("An unexpected network fault occurred.");
    }
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32 overflow-hidden">
      {/* Structural ambient backdrops */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 -z-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* LEFT COLUMN: HERO MARKETING COPY */}
        <div className="space-y-6 lg:col-span-6 text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 text-xs font-bold text-blue-700 w-fit shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>Context-Aware Processing Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Drop your Resume. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Unlock targeted roles.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
            Our multi-modal vector pipeline instantly charts your core background chunks against real-time operational requirements. No keyword stuffing, just direct matching alignment.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-slate-400 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-500">verified</span> Vetted Placements
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-emerald-500">speed</span> Zero Intermediaries
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RE-ARCHITECTED INTERACTIVE WORKSPACE CARD */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-white rounded-[2rem] border border-slate-200/80 p-8 shadow-xl relative overflow-hidden"
          >
            <div
              onDragOver={user ? handleDragOver : undefined}
              onDragLeave={user ? handleDragLeave : undefined}
              onDrop={user ? handleDrop : undefined}
              className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 flex flex-col justify-center items-center min-h-[320px] ${
                !user
                  ? "border-slate-200 bg-slate-50/50"
                  : isDragging
                  ? "border-blue-500 bg-blue-50/40 shadow-inner"
                  : file
                  ? "border-emerald-300 bg-emerald-50/10"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/30"
              }`}
            >
              <AnimatePresence mode="wait">
                {authLoading ? (
                  <motion.div
                    key="auth-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-3"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verifying Session Gateway...</p>
                  </motion.div>
                ) : !user ? (
                  <motion.div
                    key="login-prompt"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 shadow-sm border">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Authentication Gate Active</h3>
                      <p className="text-sm text-slate-400 font-medium mt-1 max-w-xs mx-auto leading-relaxed">
                        Establish a candidate pipeline credential profile to authorize AI mapping computations.
                      </p>
                    </div>
                    <Button
                      onClick={() => router.push("/login")}
                      className="w-full sm:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 px-6 py-5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition active:scale-95 flex items-center gap-2 mx-auto"
                    >
                      <span>Authorize Profile</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-5 w-full"
                  >
                    {!file ? (
                      <>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 shadow-sm transition group-hover:scale-105 duration-200">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-800 tracking-tight">Drag and drop file context</p>
                          <p className="mt-1 text-xs font-medium text-slate-400">Strict payload alignment format: PDF</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-xl border-slate-200 text-slate-700 px-6 font-bold text-sm shadow-sm hover:bg-slate-50 transition active:scale-95"
                        >
                          Browse Directories
                        </Button>
                      </>
                    ) : (
                      <div className="w-full max-w-sm mx-auto space-y-6">
                        <div className="flex items-center gap-4 bg-white border p-4 rounded-xl shadow-sm text-left">
                          <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-emerald-600 shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase mt-0.5">Staged For Processing</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setFile(null)}
                            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                          >
                            Reset File
                          </button>
                          <Button
                            onClick={handleUpload}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/10 px-5 transition active:scale-95 flex items-center gap-1.5"
                          >
                            <span>Initialize Alignment</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                  </motion.div>
                )}

                {user && status === "uploading" && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4"
                  >
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
                    <div>
                      <p className="text-lg font-black text-slate-800 tracking-tight">Extracting Vector Blocks...</p>
                      <p className="text-xs font-medium text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                        Parsing text layers to structure cross-functional pipeline markers.
                      </p>
                    </div>
                  </motion.div>
                )}

                {user && status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 tracking-tight">Matrix Formed Successfully</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">Routing workspace parameters to listing vectors...</p>
                    </div>
                  </motion.div>
                )}

                {user && status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-5 max-w-xs mx-auto"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 tracking-tight">Pipeline Core Fault</p>
                      <p className="text-xs font-medium text-red-500 mt-1 leading-relaxed bg-red-50/50 p-2.5 rounded-lg border border-red-100/50">{error}</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setStatus("idle")}
                      className="rounded-xl text-xs font-bold px-4 border-slate-200"
                    >
                      Retry Block Ingestion
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {error && status === "idle" && (
              <p className="mt-3.5 text-center text-xs font-bold text-red-500 flex items-center justify-center gap-1.5 bg-red-50/60 py-2 rounded-lg border border-red-100/40">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ResumeUploadHero;