import { useState, FormEvent } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type CategoryItem, API_BASE } from './types'

const PRESET_COLORS = [
  '#60a5fa', // Blue
  '#fb923c', // Orange
  '#c084fc', // Purple
  '#34d399', // Emerald
  '#f59e0b', // Amber
  '#f472b6', // Pink
  '#38bdf8', // Sky
  '#4ade80', // Green
  '#a78bfa', // Violet
  '#94a3b8', // Slate
]

interface CategoryModalProps {
  categories: CategoryItem[]
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}

export default function CategoryModal({
  categories,
  isOpen,
  onClose,
  onUpdated
}: CategoryModalProps) {
  const { token } = useAuth()
  const [newCatName, setNewCatName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isEditingSaving, setIsEditingSaving] = useState(false)

  if (!isOpen) return null

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newCatName.trim()
    if (!trimmed) {
      showErrorToast('Category name is required')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await axios.post(
        `${API_BASE}/api/categories`,
        { name: trimmed, color: selectedColor },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        showSuccessToast(`Category "${trimmed}" created successfully!`)
        setNewCatName('')
        onUpdated()
      }
    } catch (err: any) {
      console.error('Failed to create category:', err)
      showErrorToast(err.response?.data?.message || 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat._id)
    setEditingName(cat.name)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleSaveEdit = async (id: string) => {
    const trimmed = editingName.trim()
    if (!trimmed) {
      showErrorToast('Category name cannot be empty')
      return
    }

    try {
      setIsEditingSaving(true)
      const res = await axios.put(
        `${API_BASE}/api/categories/${id}`,
        { name: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        showSuccessToast(`Category updated to "${trimmed}"! All assigned projects synced.`)
        setEditingId(null)
        setEditingName('')
        onUpdated()
      }
    } catch (err: any) {
      console.error('Failed to update category:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update category')
    } finally {
      setIsEditingSaving(false)
    }
  }

  const handleDelete = async (cat: CategoryItem) => {
    const msg =
      cat.projectCount && cat.projectCount > 0
        ? `"${cat.name}" has ${cat.projectCount} project(s) assigned. Deleting it will reassign those projects to "Services". Proceed?`
        : `Are you sure you want to delete category "${cat.name}"?`

    if (!window.confirm(msg)) return

    try {
      const res = await axios.delete(`${API_BASE}/api/categories/${cat._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast(`Category "${cat.name}" deleted`)
        onUpdated()
      }
    } catch (err: any) {
      console.error('Failed to delete category:', err)
      showErrorToast(err.response?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs font-mono"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-slate-900 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 shadow-[8px_8px_0px_0px_#0f172a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900/15 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏷️</span>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                Manage Project Categories
              </h3>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Create, rename, or delete categories. Assigned projects automatically sync.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-lg text-slate-900 font-black hover:bg-rose-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Add New Category Form */}
        <form
          onSubmit={handleCreateCategory}
          className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6"
        >
          <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-2">
            + Create New Category
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              required
              placeholder="e.g. FinTech, Real Estate, E-Commerce..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 bg-white border-2 border-slate-900 px-3.5 py-2 text-xs font-bold text-slate-900 rounded-lg focus:outline-none placeholder-slate-400"
            />

            {/* Color preview picker */}
            <div className="flex items-center gap-1 bg-white border-2 border-slate-900 px-2 py-1.5 rounded-lg">
              {PRESET_COLORS.slice(0, 5).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-5 h-5 rounded-full border border-slate-900 transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-slate-900' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 border-2 border-slate-900 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-700 pb-1">
            <span>Existing Categories ({categories.length})</span>
            <span>Projects Assigned</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-slate-50 border-2 border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 hover:bg-white transition-colors"
              >
                {editingId === cat._id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 bg-white border-2 border-slate-900 px-2.5 py-1 text-xs font-bold text-slate-900 rounded-md outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(cat._id)}
                      disabled={isEditingSaving}
                      className="px-2.5 py-1 bg-emerald-300 hover:bg-emerald-400 border border-slate-900 text-slate-900 text-xs font-black rounded-md shadow-[1px_1px_0px_0px_#000]"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-900 text-slate-800 text-xs font-black rounded-md"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-900 shrink-0"
                        style={{ backgroundColor: cat.color || '#7dd3fc' }}
                      />
                      <span className="text-xs font-black uppercase text-slate-900 truncate">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-800 text-[11px] font-black text-slate-800 shadow-[1px_1px_0px_0px_#000]">
                        {cat.projectCount || 0}
                      </span>

                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1 hover:bg-amber-100 border border-slate-700 rounded text-[11px] font-bold text-amber-900 shadow-[1px_1px_0px_0px_#000]"
                        title="Rename Category"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1 hover:bg-rose-100 border border-slate-700 rounded text-[11px] font-bold text-rose-900 shadow-[1px_1px_0px_0px_#000]"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t-2 border-slate-900/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-[2px_2px_0px_0px_#000]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
