"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [region, setRegion] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (search) params.set("search", search)
    if (region) params.set("region", region)
    const res = await fetch(`/api/members?${params}`)
    const d = await res.json()
    setMembers(d.users || [])
    setTotal(d.total || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Cari Member</h1>
        <p className="text-gray-500">{total} member terdaftar di MUDA JUARA</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, email, atau daerah..."
          className="flex-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]"
        />
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Filter daerah"
          className="w-40 px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]"
        />
        <button type="submit" className="btn-primary">🔍 Cari</button>
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-gray-500 mt-3">Tidak ada member ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm p-5 card-hover">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1B5E20] rounded-full flex items-center justify-center text-white font-bold">
                  {m.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.region || "Indonesia"}</p>
                </div>
              </div>
              {m.bio && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{m.bio}</p>}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                {m.businesses?.length > 0 && (
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    💼 {m.businesses[0].name}
                  </span>
                )}
                {m.instagram && (
                  <a href={`https://instagram.com/${m.instagram.replace("@", "")}`} target="_blank" rel="noopener" className="text-pink-500 hover:underline">
                    📷 {m.instagram}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-40">← Prev</button>
          <span className="px-4 py-2 text-sm text-gray-500">Halaman {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={members.length < 20} className="px-4 py-2 bg-white rounded-lg shadow-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  )
}
