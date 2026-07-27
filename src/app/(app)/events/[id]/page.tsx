"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [myReg, setMyReg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  const load = async () => {
    const res = await fetch(`/api/events?id=${id}`)
    const d = await res.json()
    setEvent(d.event)
    // Check if I'm registered
    const reg = d.event?.registrations?.find((r: any) => r.status === "CONFIRMED")
    setMyReg(reg || null)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleRegister = async () => {
    setRegistering(true)
    const res = await fetch("/api/events/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: id }),
    })
    const data = await res.json()
    if (res.ok) {
      alert(`Pendaftaran berhasil! Kode tiket: ${data.ticketCode}`)
      load()
    } else {
      alert(data.error || "Gagal mendaftar")
    }
    setRegistering(false)
  }

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>
  if (!event) return <div className="p-6">Kegiatan tidak ditemukan</div>

  const filled = event._count?.registrations || 0
  const pct = Math.min(100, Math.round((filled / event.quota) * 100))

  return (
    <div className="p-6 max-w-3xl">
      <Link href="/events" className="text-sm text-[#1B5E20] hover:underline mb-4 inline-block">← Kembali</Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-br from-[#0D3B12] via-[#1B5E20] to-[#2E7D32] flex items-center justify-center text-white p-6">
          <div className="text-center">
            <span className={`text-xs px-3 py-1 rounded-full ${event.eventType === "ONLINE" ? "bg-blue-500" : "bg-[#FFD600] text-[#0D3B12]"}`}>
              {event.eventType}
            </span>
            <h1 className="text-2xl font-bold mt-3">{event.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">📅 Waktu</p>
              <p className="text-sm font-semibold">{new Date(event.startDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <p className="text-sm text-gray-600">{new Date(event.startDate).toLocaleTimeString("id-ID")} — {new Date(event.endDate).toLocaleTimeString("id-ID")}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">📍 Lokasi</p>
              <p className="text-sm font-semibold">{event.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">🎫 Kuota</p>
              <p className="text-sm font-semibold">{filled}/{event.quota} orang</p>
              <div className="bg-gray-200 rounded-full h-2 mt-2">
                <div className={`h-2 rounded-full ${pct > 80 ? "bg-red-400" : "bg-[#4CAF50]"}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">💰 Biaya</p>
              <p className="text-xl font-bold text-[#1B5E20]">
                {Number(event.price) === 0 ? "GRATIS" : `Rp ${Number(event.price).toLocaleString("id-ID")}`}
              </p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Deskripsi</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* Registration */}
          {myReg ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <span className="text-3xl">✅</span>
              <h3 className="font-bold text-green-700 mt-2">Anda sudah terdaftar!</h3>
              <div className="mt-3 bg-white rounded-lg p-4 inline-block">
                <p className="text-xs text-gray-500">Kode Tiket</p>
                <p className="text-2xl font-mono font-bold tracking-widest text-[#1B5E20]">{myReg.ticketCode}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">Tunjukkan kode ini saat hadir di lokasi</p>
            </div>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering || filled >= event.quota}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50"
            >
              {registering ? "Mendaftar..." : filled >= event.quota ? "Kuota Penuh" : "🎫 Daftar Sekarang"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
