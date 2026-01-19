"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("role", data.role);
      window.location.href = "/login";
    } else {
      alert("Registration failed: " + (data.detail || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl bg-white p-10 shadow-lg"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Join Jobify and start your journey
          </p>
        </div>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />

        <input
          name="email"
          placeholder="Email"
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

        <select
          name="role"
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Register
        </button>

        <div className="pt-4 border-t text-center space-y-3">
          <p className="text-sm text-gray-500">
            Already have an account?
          </p>

          <Link href="/login">
            <button
              type="button"
              className="w-full rounded-lg border border-blue-600 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Login
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
