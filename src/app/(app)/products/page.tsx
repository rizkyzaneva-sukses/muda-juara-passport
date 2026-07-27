"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/products?mine=1").then(r => r.json()).then(d => setProducts(d.products || []))
  }, [])

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk Saya</h1>
        <Link href="/products/new" className="btn-primary">＋ Tambah Produk</Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <span className="text-4xl">📦</span>
          <p className="text-gray-500 mt-3">Belum ada produk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center text-2xl">
                {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover rounded-xl" /> : "📦"}
              </div>
              <div className="flex-1">
                <p className="font-bold">{p.name}</p>
                <p className="text-[#1B5E20] font-semibold">{formatPrice(Number(p.price))}</p>
                <span className="text-xs text-gray-400">{p.category}</span>
              </div>
              <Link href={`/products/${p.id}`} className="text-sm bg-gray-100 px-3 py-1.5 rounded-lg">Lihat</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
