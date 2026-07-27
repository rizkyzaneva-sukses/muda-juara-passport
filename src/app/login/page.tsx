"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D3B12] via-[#1B5E20] to-[#2E7D32] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD600] rounded-2xl mb-4">
            <span className="text-3xl font-extrabold text-[#0D3B12]">MJ</span>
          </div>
          <h1 className="text-3xl font-bold text-white">MUDA JUARA</h1>
          <p className="text-green-200 mt-1">Komunitas Wirausaha Muda</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Masuk ke Akun Anda</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none transition"
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B5E20] hover:bg-[#0D3B12] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#1B5E20] font-semibold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
