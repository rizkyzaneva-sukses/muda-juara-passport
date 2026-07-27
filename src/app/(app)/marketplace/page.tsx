"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const categories = ["", "Industri", "Jasa", "Kuliner", "Pertanian", "Property", "Retail", "Teknologi", "Fashion", "Lain-Lain"]

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (search) params.set("search", search)
    const res = await fetch(`/api/products?${params}`)
    const d = await res.json()
    setProducts(d.products || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [category])

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-gray-500">Jelajahi produk dari sesama member</p>
        </div>
        <Link href="/products/new" className="btn-primary">＋ Upload Produk</Link>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === c ? "bg-[#1B5E20] text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
            }`}
          >
            {c || "Semua"}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); load() }} className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="flex-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-[#4CAF50]"
        />
        <button type="submit" className="btn-primary">🔍</button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <span className="text-4xl">🛒</span>
          <p className="text-gray-500 mt-3">Belum ada produk</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">{p.name}</h3>
                <p className="text-[#1B5E20] font-bold text-sm mt-1">{formatPrice(Number(p.price))}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{p.user?.name}</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{p.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
