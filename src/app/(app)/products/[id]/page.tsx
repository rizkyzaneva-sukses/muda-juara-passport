"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products?search=`).then(r => r.json()).then(d => {
      const found = d.products?.find((p: any) => p.id === id)
      setProduct(found)
      setLoading(false)
    })
  }, [id])

  const handleDelete = async () => {
    if (!confirm("Hapus produk ini?")) return
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    router.push("/marketplace")
  }

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>
  if (!product) return <div className="p-6">Produk tidak ditemukan</div>

  return (
    <div className="p-6 max-w-3xl">
      <Link href="/marketplace" className="text-sm text-[#1B5E20] hover:underline mb-4 inline-block">← Kembali ke Marketplace</Link>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl">📦</span>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{product.category}</span>
              <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
              <p className="text-2xl font-bold text-[#1B5E20] mt-1">{formatPrice(Number(product.price))}</p>
            </div>
          </div>

          {product.description && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-2">Deskripsi</h3>
              <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
            <span>📍 {product.location || product.user?.region || "Indonesia"}</span>
            <span>•</span>
            <span>👤 {product.user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
