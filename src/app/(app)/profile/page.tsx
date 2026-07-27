"use client"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      setUser(d.user)
      setForm(d.user || {})
    })
  }, [])

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p: any) => ({ ...p, [field]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    setMsg("")
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) setMsg("Profil berhasil disimpan! ✅")
      else setMsg("Gagal menyimpan profil")
    } catch { setMsg("Error menyimpan") }
    setSaving(false)
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Profil</h1>

      {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{msg}</div>}

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-[#1B5E20] rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Data Profil */}
        <div>
          <h3 className="font-bold text-lg mb-3 pb-2 border-b">Data Profil</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Panggilan *</label>
              <input type="text" value={form.name || ""} onChange={update("name")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select value={form.gender || ""} onChange={update("gender")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none">
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Handphone *</label>
              <input type="tel" value={form.phone || ""} onChange={update("phone")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" placeholder="08xxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daerah</label>
              <input type="text" value={form.region || ""} onChange={update("region")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" placeholder="Bandung" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio || ""} onChange={update("bio")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" rows={3} placeholder="Ceritakan tentang diri Anda..." />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input type="text" value={form.instagram || ""} onChange={update("instagram")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" placeholder="@username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input type="text" value={form.facebook || ""} onChange={update("facebook")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
              <input type="text" value={form.twitter || ""} onChange={update("twitter")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input type="text" value={form.website || ""} onChange={update("website")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" placeholder="https://" />
            </div>
          </div>
        </div>

        {/* Domisili */}
        <div>
          <h3 className="font-bold text-lg mb-3 pb-2 border-b">Data Domisili</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea value={form.address || ""} onChange={update("address")} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4CAF50] outline-none" rows={2} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">RT/RW</label><input type="text" value={form.rtRw || ""} onChange={update("rtRw")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Provinsi</label><input type="text" value={form.province || ""} onChange={update("province")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Kabupaten</label><input type="text" value={form.city || ""} onChange={update("city")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Kecamatan</label><input type="text" value={form.district || ""} onChange={update("district")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" /></div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? "Menyimpan..." : "💾 Simpan Profil"}
        </button>
      </div>
    </div>
  )
}
