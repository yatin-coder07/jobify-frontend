"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Loader2, Lock } from "lucide-react";
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
      setError("Please upload a PDF file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

// Replace your existing handleUpload function with this optimized version
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
      
      // ✨ FIX: Extract the unique resume id from the backend payload response
      const resumeId = data.id || data.resume_id; 

      setTimeout(() => {
        if (resumeId) {
          // Redirect with the context ID appended cleanly as a query string parameter
          router.push(`/jobs?resumeId=${resumeId}`);
        } else {
          router.push("/jobs");
        }
      }, 2000);
    } else {
      setStatus("error");
      setError(data.message || "Failed to upload resume");
    }
  } catch (err) {
    setStatus("error");
    setError("An unexpected error occurred");
  }
};
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 px-6 py-20 text-center text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-4xl font-black leading-tight md:text-6xl uppercase"
          >
            UPLOAD YOUR RESUME <br />
            <span className="text-blue-200">AI WILL SCAN IT</span> AND <br />
            RETURN U THE BEST JOBS
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`mx-auto max-w-xl rounded-3xl border-2 border-dashed p-12 transition-all ${
              !user 
                ? "border-white/20 bg-white/5" 
                : isDragging
                  ? "border-white bg-white/20"
                  : "border-white/30 bg-white/10 hover:border-white/50"
            }`}
            onDragOver={user ? handleDragOver : undefined}
            onDragLeave={user ? handleDragLeave : undefined}
            onDrop={user ? handleDrop : undefined}
          >
            <AnimatePresence mode="wait">
              {authLoading ? (
                <motion.div
                  key="auth-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10"
                >
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-white/50" />
                </motion.div>
              ) : !user ? (
                <motion.div
                  key="login-prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <Lock className="h-10 w-10 text-white/50" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">Login to Upload Resume</p>
                    <p className="mt-2 text-white/60">
                      You need to be logged in to use our AI job matching
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/login")}
                    className="rounded-full bg-white px-10 py-6 text-lg font-bold text-blue-600 hover:bg-blue-50"
                  >
                    Get Started
                  </Button>
                </motion.div>
              ) : status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {file ? file.name : "Drag & drop your resume here"}
                    </p>
                    <p className="mt-2 text-white/60">Supported format: PDF</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full px-8 py-6 text-lg font-bold"
                    >
                      Browse Files
                    </Button>
                    {file && (
                      <Button
                        onClick={handleUpload}
                        className="rounded-full bg-green-500 px-8 py-6 text-lg font-bold hover:bg-green-600"
                      >
                        Upload Now
                      </Button>
                    )}
                  </div>
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <Loader2 className="mx-auto h-16 w-16 animate-spin" />
                  <p className="text-2xl font-bold">Scanning your resume...</p>
                  <p className="text-white/60">Our AI is analyzing your skills</p>
                </motion.div>
              )}

              {user && status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
                  <p className="text-2xl font-bold">Analysis Complete!</p>
                  <p className="text-white/60">Finding the best matches for you...</p>
                </motion.div>
              )}

              {user && status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
                  <p className="text-2xl font-bold">Upload Failed</p>
                  <p className="text-white/60">{error}</p>
                  <Button
                    variant="secondary"
                    onClick={() => setStatus("idle")}
                    className="rounded-full"
                  >
                    Try Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {error && status === "idle" && (
            <p className="mt-4 text-red-300 font-medium">{error}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResumeUploadHero;
