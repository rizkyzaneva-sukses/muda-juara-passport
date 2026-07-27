"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const categories = ["Industri", "Jasa", "Kuliner", "Pertanian", "Property", "Retail", "Teknologi", "Fashion", "Lain-Lain"]

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "Jasa", location: "", imageUrl: "" })
  const [saving, setSaving] = useState(false)

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { product } = await res.json()
      router.push(`/products/${product.id}`)
    }
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-2xl">
      <Link href="/marketplace" className="text-sm text-[#1B5E20] hover:underline mb-4 inline-block">← Kembali</Link>
      <h1 className="text-2xl font-bold mb-6">Upload Produk Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk *</label>
          <input type="text" value={form.name} onChange={update("name")} className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Harga *</label>
            <input type="number" value={form.price} onChange={update("price")} className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]" placeholder="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select value={form.category} onChange={update("category")} className="w-full px-3 py-2.5 border rounded-lg outline-none">{categories.map(c => <option key={c}>{c}</option>)}</select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea value={form.description} onChange={update("description")} className="w-full px-3 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]" rows={4} placeholder="Jelaskan produk Anda..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <input type="text" value={form.location} onChange={update("location")} className="w-full px-3 py-2.5 border rounded-lg outline-none" placeholder="Kota, Provinsi" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Gambar (opsional)</label>
          <input type="url" value={form.imageUrl} onChange={update("imageUrl")} className="w-full px-3 py-2.5 border rounded-lg outline-none" placeholder="https://..." />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full py-3">
          {saving ? "Menyimpan..." : "📦 Upload Produk"}
        </button>
      </form>
    </div>
  )
}
