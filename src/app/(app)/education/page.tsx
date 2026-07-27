"use client"
import { useState, useEffect } from "react"

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function EducationPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Form state for admin
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", youtubeUrl: "", categoryName: "", categorySlug: "", duration: "" })

  useEffect(() => {
    fetch("/api/education").then(r => r.json()).then(d => {
      setCategories(d.categories || [])
      setLoading(false)
    })
  }, [])

  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }))

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.categorySlug || form.categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    await fetch("/api/education/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, categorySlug: slug }),
    })
    setForm({ title: "", description: "", youtubeUrl: "", categoryName: "", categorySlug: "", duration: "" })
    setShowForm(false)
    // Reload
    const res = await fetch("/api/education")
    const d = await res.json()
    setCategories(d.categories || [])
  }

  const filteredCategories = activeCategory
    ? categories.filter(c => c.slug === activeCategory)
    : categories

  const allCategories = [
    { name: "Semua", slug: "" },
    { name: "Visi & Misi", slug: "visi-misi" },
    { name: "Produk & Layanan", slug: "produk" },
    { name: "Pemasaran", slug: "pemasaran" },
    { name: "Branding", slug: "branding" },
    { name: "Keuangan", slug: "keuangan" },
    { name: "Leadership", slug: "leadership" },
    { name: "Tim Bisnis", slug: "tim-bisnis" },
    { name: "Perijinan", slug: "perijinan" },
    { name: "Sistem Bisnis", slug: "sistem-bisnis" },
    { name: "Scale Up", slug: "scale-up" },
    { name: "Investing", slug: "investing" },
  ]

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Video Pembelajaran</h1>
          <p className="text-gray-500">Belajar wirausaha dari para ahli</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? "✕ Batal" : "＋ Tambah Video"}
        </button>
      </div>

      {/* Admin Form */}
      {showForm && (
        <form onSubmit={handleAddVideo} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-3">
          <h3 className="font-bold">Tambah Video YouTube</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">Judul Video *</label><input type="text" value={form.title} onChange={update("title")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">URL YouTube *</label><input type="url" value={form.youtubeUrl} onChange={update("youtubeUrl")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" placeholder="https://youtube.com/watch?v=..." required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Nama Kategori *</label><input type="text" value={form.categoryName} onChange={update("categoryName")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" placeholder="e.g. Pemasaran" required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Durasi</label><input type="text" value={form.duration} onChange={update("duration")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" placeholder="12:30" /></div>
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">Deskripsi</label><textarea value={form.description} onChange={update("description")} className="w-full px-3 py-2 border rounded-lg text-sm outline-none" rows={2} /></div>
          <button type="submit" className="btn-primary">💾 Simpan Video</button>
        </form>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {allCategories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCategory(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === c.slug ? "bg-[#1B5E20] text-white" : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${extractYoutubeId(selectedVideo.youtubeUrl)}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{selectedVideo.title}</h3>
              {selectedVideo.description && <p className="text-sm text-gray-500 mt-1">{selectedVideo.description}</p>}
              <button onClick={() => setSelectedVideo(null)} className="mt-3 text-sm text-gray-400 hover:text-gray-600">✕ Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <span className="text-4xl">🎓</span>
          <p className="text-gray-500 mt-3">Belum ada video</p>
          <p className="text-sm text-gray-400">Klik "Tambah Video" untuk menambahkan</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id}>
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                📚 {cat.name}
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{cat.videos.length} video</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.videos.map((video: any) => {
                  const ytId = extractYoutubeId(video.youtubeUrl)
                  return (
                    <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden card-hover cursor-pointer" onClick={() => setSelectedVideo(video)}>
                      <div className="aspect-video bg-gray-100 relative">
                        {ytId ? (
                          <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">🎬</div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">▶</div>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{video.duration}</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                        {video.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{video.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
