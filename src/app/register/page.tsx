"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (form.password !== form.confirm) {
      setError("Password tidak cocok")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Auto login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      if (loginRes.ok) router.push("/dashboard")
      else router.push("/login")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D3B12] via-[#1B5E20] to-[#2E7D32] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD600] rounded-2xl mb-4">
            <span className="text-3xl font-extrabold text-[#0D3B12]">MJ</span>
          </div>
          <h1 className="text-3xl font-bold text-white">MUDA JUARA</h1>
          <p className="text-green-200 mt-1">Bergabung dengan Komunitas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Akun Baru</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
              <input type="text" value={form.name} onChange={update("name")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={update("email")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. Handphone</label>
              <input type="tel" value={form.phone} onChange={update("phone")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" placeholder="08xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" value={form.password} onChange={update("password")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" placeholder="Minimal 6 karakter" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password *</label>
              <input type="password" value={form.confirm} onChange={update("confirm")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#1B5E20] hover:bg-[#0D3B12] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#1B5E20] font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
