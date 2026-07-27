"use client"
import { useState, useEffect } from "react"

const categories = ["Industri", "Jasa", "Kuliner", "Pertanian", "Property", "Retail", "Teknologi", "Fashion", "Lain-Lain"]

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", address: "", category: "Jasa", website: "", phone: "", email: "", revenue: "" })
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => fetch("/api/business").then(r => r.json()).then(d => setBusinesses(d.businesses || []))
  useEffect(() => { load() }, [])

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    const method = editId ? "PUT" : "POST"
    const body = editId ? { ...form, id: editId } : form
    await fetch("/api/business", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    setForm({ name: "", description: "", address: "", category: "Jasa", website: "", phone: "", email: "", revenue: "" })
    setEditId(null)
    setShowForm(false)
    load()
    setSaving(false)
  }

  const handleEdit = (b: any) => {
    setForm({ name: b.name, description: b.description || "", address: b.address || "", category: b.category || "Jasa", website: b.website || "", phone: b.phone || "", email: b.email || "", revenue: b.revenue || "" })
    setEditId(b.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus bisnis ini?")) return
    await fetch("/api/business", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Bisnis</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", description: "", address: "", category: "Jasa", website: "", phone: "", email: "", revenue: "" }) }} className="btn-primary">
          {showForm ? "✕ Batal" : "＋ Tambah Bisnis"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">{editId ? "Update Bisnis" : "Tambah Bisnis Baru"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Nama Bisnis *</label><input type="text" value={form.name} onChange={update("name")} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]" required /></div>
            <div><label className="block text-sm font-medium mb-1">Kategori</label><select value={form.category} onChange={update("category")} className="w-full px-3 py-2 border rounded-lg outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Telepon</label><input type="tel" value={form.phone} onChange={update("phone")} className="w-full px-3 py-2 border rounded-lg outline-none" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Alamat</label><input type="text" value={form.address} onChange={update("address")} className="w-full px-3 py-2 border rounded-lg outline-none" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Deskripsi</label><textarea value={form.description} onChange={update("description")} className="w-full px-3 py-2 border rounded-lg outline-none" rows={3} /></div>
            <div><label className="block text-sm font-medium mb-1">Website</label><input type="text" value={form.website} onChange={update("website")} className="w-full px-3 py-2 border rounded-lg outline-none" placeholder="https://" /></div>
            <div><label className="block text-sm font-medium mb-1">Email Bisnis</label><input type="email" value={form.email} onChange={update("email")} className="w-full px-3 py-2 border rounded-lg outline-none" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Laporan Keuangan (Ringkas)</label><textarea value={form.revenue} onChange={update("revenue")} className="w-full px-3 py-2 border rounded-lg outline-none" rows={2} placeholder="Contoh: Omzet bulanan 50jt, profit 10jt" /></div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary mt-4">{saving ? "Menyimpan..." : editId ? "Update" : "Simpan"}</button>
        </div>
      )}

      {businesses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <span className="text-4xl">💼</span>
          <p className="text-gray-500 mt-3">Belum ada data bisnis</p>
          <p className="text-sm text-gray-400">Klik "Tambah Bisnis" untuk mulai</p>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">💼</div>
              <div className="flex-1">
                <p className="font-bold">{b.name}</p>
                <p className="text-sm text-gray-500">{b.category} • {b.address}</p>
                {b.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{b.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(b)} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">Edit</button>
                <button onClick={() => handleDelete(b.id)} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
