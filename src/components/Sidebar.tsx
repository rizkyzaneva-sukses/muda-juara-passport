"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { section: "MEMBERSHIP" },
  { label: "Edit Profil", href: "/profile", icon: "👤" },
  { label: "Data Bisnis", href: "/business", icon: "💼" },
  { label: "Cari Member", href: "/members", icon: "🔍" },
  { section: "PRODUK & LAYANAN" },
  { label: "Marketplace", href: "/marketplace", icon: "🛒" },
  { label: "Upload Produk", href: "/products/new", icon: "📦" },
  { section: "KEGIATAN" },
  { label: "Daftar Kegiatan", href: "/events", icon: "📅" },
  { section: "EDUKASI" },
  { label: "Video Pembelajaran", href: "/education", icon: "🎓" },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} sidebar min-h-screen text-white transition-all duration-300 flex flex-col fixed left-0 top-0 z-50`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-green-700/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD600] rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-[#0D3B12] text-sm">MJ</span>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">MUDA JUARA</h1>
              <p className="text-[10px] text-green-300">Wirausaha Muda</p>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-green-300 hover:text-white text-lg">
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item, i) => {
          if ("section" in item) {
            return !collapsed ? (
              <div key={i} className="px-3 pt-5 pb-2">
                <span className="text-[10px] font-bold text-green-400 tracking-wider">{item.section}</span>
              </div>
            ) : <div key={i} className="my-3 border-t border-green-700/50" />
          }
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition ${
                active
                  ? "bg-white/15 text-white font-semibold"
                  : "text-green-100 hover:bg-white/10"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-green-700/50">
        {!collapsed && (
          <div className="mb-3">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-green-300 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg py-2 text-sm transition ${collapsed ? "px-0" : ""}`}
        >
          {collapsed ? "🚪" : "🚪 Keluar"}
        </button>
      </div>
    </aside>
  )
}
