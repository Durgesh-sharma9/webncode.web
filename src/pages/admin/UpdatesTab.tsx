import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type UpdateItem, API_BASE } from './types'

const CATEGORY_COLORS: Record<string, string> = {
  Product: 'bg-blue-100 border-blue-700 text-blue-900',
  Company: 'bg-purple-100 border-purple-700 text-purple-900',
  Careers: 'bg-green-100 border-green-700 text-green-900',
}

const getCatColor = (cat: string) =>
  CATEGORY_COLORS[cat] ?? 'bg-slate-100 border-slate-700 text-slate-900'

export default function UpdatesTab() {
  const { token } = useAuth()
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<UpdateItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form Fields
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState<'Product' | 'Company' | 'Careers'>('Product')
  const [formDate, setFormDate] = useState('')
  const [formExcerpt, setFormExcerpt] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formFeatured, setFormFeatured] = useState(false)

  const fetchUpdates = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${API_BASE}/api/updates`)
      if (res.data?.success && Array.isArray(res.data.data)) {
        setUpdates(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to load updates:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch updates')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [])

  const openAddModal = () => {
    setEditingItem(null)
    setFormTitle('')
    setFormCategory('Product')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormExcerpt('')
    setFormContent('')
    setFormFeatured(false)
    setIsModalOpen(true)
  }

  const openEditModal = (item: UpdateItem) => {
    setEditingItem(item)
    setFormTitle(item.title)
    setFormCategory(item.category)
    setFormDate(item.date)
    setFormExcerpt(item.excerpt)
    setFormContent(item.content)
    setFormFeatured(Boolean(item.featured))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim() || !formExcerpt.trim() || !formContent.trim()) {
      showErrorToast('Title, short excerpt, and full content are required')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        date: formDate || new Date().toISOString().split('T')[0],
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        featured: formFeatured,
      }

      if (editingItem) {
        const res = await axios.put(
          `${API_BASE}/api/updates/${editingItem._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.data?.success) {
          showSuccessToast('Update modified successfully!')
          setUpdates((prev) =>
            prev.map((u) => (u._id === editingItem._id ? res.data.data : u))
          )
          closeModal()
        }
      } else {
        const res = await axios.post(`${API_BASE}/api/updates`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data?.success) {
          showSuccessToast('New update published successfully!')
          setUpdates((prev) => [res.data.data, ...prev])
          closeModal()
        }
      }
    } catch (err: any) {
      console.error('Failed to save update:', err)
      showErrorToast(err.response?.data?.message || 'Failed to save update')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFeatured = async (item: UpdateItem) => {
    try {
      const next = !item.featured
      const res = await axios.patch(
        `${API_BASE}/api/updates/${item._id}/feature`,
        { featured: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        showSuccessToast(
          next
            ? `"${item.title}" marked as Featured!`
            : `"${item.title}" removed from Featured`
        )
        setUpdates((prev) =>
          prev.map((u) => (u._id === item._id ? { ...u, featured: next } : u))
        )
      }
    } catch (err) {
      console.error('Failed to toggle featured status:', err)
      showErrorToast('Failed to toggle featured status')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete update "${title}"?`)) {
      return
    }

    try {
      const res = await axios.delete(`${API_BASE}/api/updates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data?.success) {
        showSuccessToast('Update deleted successfully!')
        setUpdates((prev) => prev.filter((u) => u._id !== id))
      }
    } catch (err: any) {
      console.error('Failed to delete update:', err)
      showErrorToast(err.response?.data?.message || 'Failed to delete update')
    }
  }

  // Filter and Search logic
  const filteredUpdates = updates.filter((u) => {
    const matchCat = activeCategory === 'All' || u.category === activeCategory
    const matchFeat = !featuredOnly || Boolean(u.featured)
    const matchSearch =
      !search.trim() ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      u.content.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchFeat && matchSearch
  })

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header Card */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
              System Updates & Newsfeed
            </h2>
            <span className="px-2 py-0.5 text-xs font-black bg-amber-200 border border-slate-900 rounded-md">
              {updates.length} TOTAL
            </span>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            Publish, edit, and feature announcements, product updates, and career opportunities for all visitors.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-[#ff9e7d] hover:bg-[#ff8a61] text-slate-900 border-2 border-slate-900 px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
        >
          <span>+ Add New Update</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#0f172a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Product', 'Company', 'Careers'].map((cat) => {
            const count =
              cat === 'All'
                ? updates.length
                : updates.filter((u) => u.category === cat).length
            const isSelected = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#64748b]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white'
                      : 'bg-slate-200 text-slate-800 border-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Featured Checkbox */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-800 cursor-pointer select-none bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <span>⭐ Featured Only</span>
          </label>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search updates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-900 px-3 py-1.5 text-xs font-bold text-slate-800 rounded-lg placeholder-slate-400 focus:outline-none focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Updates Cards List */}
      {isLoading ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-12 text-center shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-black uppercase text-slate-600">Loading dynamic updates...</p>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-12 text-center shadow-[4px_4px_0px_0px_#0f172a]">
          <span className="text-3xl">📭</span>
          <h3 className="text-base font-black uppercase text-slate-900 mt-2">No updates found</h3>
          <p className="text-xs font-bold text-slate-500 mt-1">
            {search || activeCategory !== 'All' || featuredOnly
              ? 'Try changing your search filters or category selection.'
              : 'Click "+ Add New Update" above to post your first announcement.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredUpdates.map((item) => (
            <div
              key={item._id}
              className="bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#0f172a] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Category, Date, Featured Toggle */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border tracking-wider ${getCatColor(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                    <time className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {item.date}
                    </time>
                  </div>

                  <button
                    onClick={() => handleToggleFeatured(item)}
                    title="Click to toggle featured on Homepage"
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border transition-all flex items-center gap-1 ${
                      item.featured
                        ? 'bg-amber-300 border-amber-800 text-amber-950 shadow-[1px_1px_0px_0px_#000]'
                        : 'bg-slate-100 border-slate-400 text-slate-500 hover:bg-amber-100'
                    }`}
                  >
                    <span>{item.featured ? '⭐ FEATURED' : '☆ NOT FEATURED'}</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs font-bold text-slate-700 leading-relaxed line-clamp-3 mb-3">
                  {item.excerpt}
                </p>

                {/* Content teaser */}
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 mb-4 text-[11px] font-medium text-slate-600 line-clamp-2">
                  {item.content}
                </div>
              </div>

              {/* Card Bottom: Action buttons */}
              <div className="pt-3 border-t-2 border-slate-900/10 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  Slug: {item.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-700 px-3 py-1 rounded text-xs font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000] hover:translate-y-[-1px] transition-all"
                  >
                    <span>✏️ Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="inline-flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-700 px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000] hover:translate-y-[-1px] transition-all"
                  >
                    <span>🗑️ Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            className="bg-white border-2 border-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[8px_8px_0px_0px_#0f172a]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-slate-900/15">
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <span>{editingItem ? '✏️ EDIT ANNOUNCEMENT' : '✨ NEW ANNOUNCEMENT'}</span>
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {editingItem
                    ? `Updating "${editingItem.title}"`
                    : 'Create and publish a new update for the public site.'}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-lg text-slate-900 font-black hover:bg-rose-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Web Builder Pro Launched"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 px-3.5 py-2 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as 'Product' | 'Company' | 'Careers')
                    }
                    className="w-full bg-slate-50 border-2 border-slate-900 px-3.5 py-2 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:bg-white"
                  >
                    <option value="Product">Product (Blue)</option>
                    <option value="Company">Company (Purple)</option>
                    <option value="Careers">Careers (Green)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Announcement Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-900 px-3.5 py-2 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Short Excerpt / Teaser *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="A concise 1-2 sentence overview displayed in newsfeed cards..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 px-3.5 py-2 text-xs font-bold text-slate-900 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Full Article / Content *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Full announcement content displayed when user clicks 'Read Article'..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 px-3.5 py-2 text-xs font-medium text-slate-900 rounded-lg focus:outline-none focus:bg-white"
                />
              </div>

              {/* Featured toggle */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-950">
                    Feature on Homepage ("What's New")
                  </h4>
                  <p className="text-[11px] font-bold text-amber-800">
                    Featured updates appear directly on the website homepage.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 border border-slate-900"></div>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t-2 border-slate-900/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#ff9e7d] hover:bg-[#ff8a61] text-slate-900 border-2 border-slate-900 px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Save Changes' : 'Publish Announcement'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
