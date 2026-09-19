import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type DeveloperItem, API_BASE, getDeveloperImage } from './types'
import DeveloperModal from './DeveloperModal'

export default function DevelopersTab() {
  const { token } = useAuth()
  const [developers, setDevelopers] = useState<DeveloperItem[]>([])
  const [isLoadingDevelopers, setIsLoadingDevelopers] = useState(false)
  const [developerSearch, setDeveloperSearch] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState<DeveloperItem | null>(null)

  const fetchDevelopers = async () => {
    try {
      setIsLoadingDevelopers(true)
      const res = await axios.get(`${API_BASE}/api/developers`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setDevelopers(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to load developers:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch developers list')
    } finally {
      setIsLoadingDevelopers(false)
    }
  }

  useEffect(() => {
    fetchDevelopers()
  }, [token])

  const handleOpenAdd = () => {
    setEditingDeveloper(null)
    setShowModal(true)
  }

  const handleOpenEdit = (dev: DeveloperItem) => {
    setEditingDeveloper(dev)
    setShowModal(true)
  }

  const handleDeleteDeveloper = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove developer "${name}"?`)) return
    try {
      const res = await axios.delete(`${API_BASE}/api/developers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast(`${name} removed successfully`)
        setDevelopers((prev) => prev.filter((d) => d._id !== id))
      }
    } catch (err: any) {
      console.error('Error deleting developer:', err)
      showErrorToast('Failed to delete developer')
    }
  }

  const handleModalSuccess = (savedDev: DeveloperItem) => {
    setDevelopers((prev) => {
      const exists = prev.some((d) => d._id === savedDev._id)
      if (exists) {
        return prev.map((d) => (d._id === savedDev._id ? savedDev : d))
      }
      return [savedDev, ...prev]
    })
  }

  const filteredDevelopers = developers.filter((d) => {
    const q = developerSearch.toLowerCase()
    return (
      d.name.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.bio.toLowerCase().includes(q) ||
      (d.team && d.team.toLowerCase().includes(q)) ||
      (d.location && d.location.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-4 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <span className="px-2.5 py-0.5 bg-[#fde047] border-2 border-slate-900 rounded text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
            ENGINEERING ROSTER
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 mt-1">
            Our Developers & Team ({developers.length})
          </h2>
          <p className="text-xs text-slate-600 font-bold">
            Live profiles showcased on the /about page with dual hover photo animations
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchDevelopers}
            disabled={isLoadingDevelopers}
            className="px-3 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg transition-all shadow-[2px_2px_0px_0px_#000]"
          >
            🔄
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-950 text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <span>+</span>
            <span>Add Developer</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
        <div className="relative flex-1">
          <input
            type="text"
            value={developerSearch}
            onChange={(e) => setDeveloperSearch(e.target.value)}
            placeholder="Search developer by name, role, tech, team..."
            className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          {developerSearch && (
            <button
              onClick={() => setDeveloperSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-[11px] font-bold text-slate-500">
          Showing {filteredDevelopers.length} of {developers.length}
        </div>
      </div>

      {/* Developers Grid */}
      {isLoadingDevelopers ? (
        <div className="py-14 text-center text-slate-600 text-xs font-bold">
          Loading team members...
        </div>
      ) : filteredDevelopers.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="text-3xl mb-2">👨‍💻</div>
          <h3 className="text-sm font-black text-slate-900 uppercase">No Developers Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold mb-4">
            {developerSearch
              ? 'No developers match your search query.'
              : 'Add your engineers, designers and leads so they appear live on the /about page!'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000]"
          >
            + Add First Developer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredDevelopers.map((dev) => (
            <div
              key={dev._id}
              className="bg-white border-2 border-slate-900 rounded-xl p-3.5 flex flex-col justify-between shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
            >
              <div>
                {/* Top Bar: Avatar with 2-Image Hover Effect + Info */}
                <div className="flex items-start gap-3 mb-2.5">
                  {(() => {
                    const defaultImg = getDeveloperImage(dev, false)
                    const hoverImg = getDeveloperImage(dev, true)
                    const hasHover = Boolean(hoverImg && hoverImg !== defaultImg)

                    return (
                      <div
                        className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_0px_#000] group/devphoto bg-slate-100 cursor-pointer"
                        title={hasHover ? '✨ Hover over this photo to preview the 2nd image!' : 'Profile photo'}
                      >
                        {defaultImg ? (
                          <>
                            <img
                              src={defaultImg}
                              alt={dev.name}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${
                                hasHover ? 'group-hover/devphoto:opacity-0' : ''
                              }`}
                            />
                            {hasHover && (
                              <img
                                src={hoverImg}
                                alt={`${dev.name} hover`}
                                className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover/devphoto:opacity-100 transition-opacity duration-300"
                              />
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-[#fde047] text-slate-900 font-black flex items-center justify-center text-lg">
                            {dev.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {hasHover && (
                          <span className="absolute bottom-0 right-0 px-1 py-0.5 bg-purple-600 text-[8px] font-black text-white rounded-tl border-t border-l border-slate-900 shadow-sm pointer-events-none">
                            2x📸
                          </span>
                        )}
                      </div>
                    )
                  })()}

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase truncate">
                      {dev.name}
                    </h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#fef08a] border border-slate-900 text-slate-950 text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000] truncate max-w-full">
                      {dev.role}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] text-slate-500 font-bold truncate">
                        📍 {dev.location || 'JAIPUR, INDIA'}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-slate-900/30 bg-slate-50 text-slate-600">
                        {getDeveloperImage(dev, true) !== getDeveloperImage(dev, false) ? '🎭 2 Images (Hover ready)' : '📸 1 Image'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-700 line-clamp-2 mb-3 bg-[#fafafa] p-2 rounded-lg border border-slate-900/20">
                  {dev.bio}
                </p>

                {/* Social Links Row */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {dev.github && (
                    <a
                      href={dev.github.startsWith('http') ? dev.github : `https://${dev.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-900 text-[10px] font-bold rounded"
                      title="GitHub"
                    >
                      🐙 GitHub
                    </a>
                  )}
                  {dev.linkedin && (
                    <a
                      href={dev.linkedin.startsWith('http') ? dev.linkedin : `https://${dev.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 border border-slate-900 text-[10px] font-bold rounded text-sky-900"
                      title="LinkedIn"
                    >
                      🔗 LinkedIn
                    </a>
                  )}
                  {dev.email && (
                    <a
                      href={`mailto:${dev.email}`}
                      className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-slate-900 text-[10px] font-bold rounded text-amber-900"
                      title="Email"
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>
              </div>

              {/* Bottom Row: Actions */}
              <div className="pt-2.5 border-t border-slate-900/20 flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-700 font-black">
                  ● Live on About Us
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(dev)}
                    className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border border-slate-900 text-slate-900 text-[11px] font-black rounded shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDeveloper(dev._id, dev.name)}
                    className="px-2 py-1 bg-rose-100 hover:bg-rose-200 border border-rose-600 text-rose-900 text-[11px] font-bold rounded cursor-pointer"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Developer Add/Edit Modal */}
      <DeveloperModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        editingDeveloper={editingDeveloper}
      />
    </div>
  )
}
