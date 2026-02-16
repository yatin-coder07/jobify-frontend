"use client"

import Link from "next/link"
import { Users, Settings, LogOut, LayoutDashboard } from "lucide-react"

const SidebarComponent = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50">
      {/* HEADER */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="size-10 rounded-xl bg-[#0d7ff2] text-white flex items-center justify-center font-bold shadow">
          J
        </div>
        <h1 className="text-xl font-bold tracking-tight">Jobify</h1>
      </div>

      {/* NAV */}
      <nav className="flex flex-col px-4 py-4 space-y-1">
        <Link href="/employer/dashboard">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
        </Link>

        <Link href="/employer/applicants">
          <NavItem icon={<Users size={18} />} label="Candidates" />
        </Link>

        <NavItem icon={<Settings size={18} />} label="Settings" />
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
        <button
          onClick={() => {
            localStorage.removeItem("access_token")
            window.location.href = "/login"
          }}
          className="flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-red-500 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default SidebarComponent

function NavItem({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
      {icon}
      <span>{label}</span>
    </div>
  )
}
