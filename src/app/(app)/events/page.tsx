"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"all" | "mine">("all")

  const load = async () => {
    setLoading(true)
    const params = tab === "mine" ? "?mine=1" : ""
    const res = await fetch(`/api/events${params}`)
    const d = await res.json()
    setEvents(d.events || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [tab])

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daftar Kegiatan</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("all")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "all" ? "bg-[#1B5E20] text-white" : "bg-white shadow-sm"}`}>Semua Kegiatan</button>
        <button onClick={() => setTab("mine")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "mine" ? "bg-[#1B5E20] text-white" : "bg-white shadow-sm"}`}>Kegiatan Saya</button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <span className="text-4xl">📅</span>
          <p className="text-gray-500 mt-3">{tab === "mine" ? "Belum ada kegiatan yang diikuti" : "Belum ada kegiatan"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const filled = ev._count?.registrations || 0
            const pct = Math.min(100, Math.round((filled / ev.quota) * 100))
            const isPast = new Date(ev.endDate) < new Date()
            return (
              <Link key={ev.id} href={`/events/${ev.id}`} className="block bg-white rounded-xl shadow-sm p-5 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-[#1B5E20] rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-xs font-bold">{new Date(ev.startDate).toLocaleDateString("id-ID", { month: "short" })}</span>
                    <span className="text-xl font-bold">{new Date(ev.startDate).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{ev.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isPast ? "bg-gray-100 text-gray-500" : ev.eventType === "ONLINE" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                        {ev.eventType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">📍 {ev.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ev.startDate).toLocaleDateString("id-ID")} {new Date(ev.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      {" — "}
                      {new Date(ev.endDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${pct > 80 ? "bg-red-400" : "bg-[#4CAF50]"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{filled}/{ev.quota} orang</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-[#1B5E20]">
                      {Number(ev.price) === 0 ? "GRATIS" : `Rp ${Number(ev.price).toLocaleString("id-ID")}`}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
