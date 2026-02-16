"use client"

import React, { useState } from "react"
import Link from "next/link"

const Page = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [error, setError] = useState("")
  const[loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      setError(data.detail || "Login failed")
      return
    }

    localStorage.setItem("access_token", data.access)
    localStorage.setItem("role", data.role)

    const profileCheckUrl =
      data.role === "employer"
        ? "/api/auth/employer/profile/check/"
        : "/api/auth/candidate/profile/check/"

    const checkRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${profileCheckUrl}`,
      {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      }
    )

    if (checkRes.status === 404 && data.role === "candidate") {
      window.location.href = "/"
    }else if (checkRes.status === 404 && data.role === "employer") {
      window.location.href = "/employer/dashboard"
    }else if(checkRes.status === 200 && data.role === "employer"){
      window.location.href = "/profile/employer/create"
    }else{
      window.location.href = "/profile/candidate/create"
    }
   setLoading(false)
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-10 shadow-lg"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Login to continue your journey with Jobify
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />

        <button
          type="submit"
          className={`w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 ${loading ? "cursor-not-allowed opacity-50 " : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="pt-4 border-t text-center space-y-3">
          <p className="text-sm text-gray-500">
            New to Jobify?
          </p>

          <Link href="/register">
            <button
              type="button"
              className="w-full rounded-lg border border-blue-600 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Create your account
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Page
