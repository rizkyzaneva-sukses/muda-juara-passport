import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) return null

  const [user, businessCount, productCount, eventCount, regCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.id }, include: { businesses: true } }),
    prisma.business.count({ where: { userId: session.id } }),
    prisma.product.count({ where: { userId: session.id } }),
    prisma.event.count({ where: { isActive: true } }),
    prisma.eventRegistration.count({ where: { userId: session.id } }),
  ])

  const upcomingEvents = await prisma.event.findMany({
    where: { isActive: true, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    take: 3,
  })

  const profileComplete = user ? [user.phone, user.bio, user.region, user.address, user.instagram].filter(Boolean).length * 20 : 0

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali, {user?.name} 👋</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1B5E20] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-gray-400 text-xs">{user?.region || "Belumatur daerah"}</p>
          </div>
          <Link href="/profile" className="btn-primary text-sm">
            Edit Profil
          </Link>
        </div>
        {profileComplete < 100 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Kelengkapan Profil</span>
              <span className="font-semibold text-[#1B5E20]">{profileComplete}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#4CAF50] h-2 rounded-full transition-all" style={{ width: `${profileComplete}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Lengkapi profil untuk fitur lengkap</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Bisnis", value: businessCount, icon: "💼", color: "bg-blue-50 text-blue-600" },
          { label: "Produk", value: productCount, icon: "📦", color: "bg-purple-50 text-purple-600" },
          { label: "Kegiatan", value: eventCount, icon: "📅", color: "bg-orange-50 text-orange-600" },
          { label: "Tiket Saya", value: regCount, icon: "🎫", color: "bg-green-50 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 card-hover">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-lg mb-2`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Cari Member", href: "/members", icon: "🔍", desc: "Temukan rekan bisnis" },
          { label: "Marketplace", href: "/marketplace", icon: "🛒", desc: "Jelajahi produk" },
          { label: "Upload Produk", href: "/products/new", icon: "📦", desc: "Jual produk Anda" },
          { label: "Kegiatan", href: "/events", icon: "📅", desc: "Daftar acara" },
          { label: "Edukasi", href: "/education", icon: "🎓", desc: "Video pembelajaran" },
          { label: "Data Bisnis", href: "/business", icon: "💼", desc: "Kelola bisnis" },
        ].map((a) => (
          <Link key={a.href} href={a.href} className="bg-white rounded-xl shadow-sm p-4 card-hover flex items-center gap-3">
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="font-semibold text-sm">{a.label}</p>
              <p className="text-xs text-gray-400">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Kegiatan Mendatang</h3>
          <Link href="/events" className="text-sm text-[#1B5E20] font-semibold hover:underline">Lihat Semua →</Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">Belum ada kegiatan mendatang</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-[#1B5E20] rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-xs font-bold">{new Date(ev.startDate).toLocaleDateString("id-ID", { month: "short" })}</span>
                  <span className="text-lg font-bold">{new Date(ev.startDate).getDate()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{ev.title}</p>
                  <p className="text-xs text-gray-500">{ev.location} • {ev.eventType}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(ev.startDate).toLocaleDateString("id-ID")} - {new Date(ev.endDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <Link href={`/events/${ev.id}`} className="btn-primary text-xs py-1.5 px-3">
                  Detail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
