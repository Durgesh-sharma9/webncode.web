import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type DeveloperItem, API_BASE, getDeveloperImage } from './types'

interface DeveloperModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (savedDev: DeveloperItem) => void
  editingDeveloper: DeveloperItem | null
}

export default function DeveloperModal({
  isOpen,
  onClose,
  onSuccess,
  editingDeveloper
}: DeveloperModalProps) {
  const { token } = useAuth()
  const [devName, setDevName] = useState('')
  const [devRole, setDevRole] = useState('FULL STACK DEVELOPER')
  const [devBio, setDevBio] = useState('')
  const [devLocation, setDevLocation] = useState('JAIPUR, INDIA')
  const [devTeam, setDevTeam] = useState('WnC TEAM')
  const [devLinkedin, setDevLinkedin] = useState('')
  const [devGithub, setDevGithub] = useState('')
  const [devTwitter, setDevTwitter] = useState('')
  const [devInstagram, setDevInstagram] = useState('')
  const [devEmail, setDevEmail] = useState('')

  const [devPhotoFile, setDevPhotoFile] = useState<File | null>(null)
  const [devPhotoPreview, setDevPhotoPreview] = useState<string>('')
  const [devHoverPhotoFile, setDevHoverPhotoFile] = useState<File | null>(null)
  const [devHoverPhotoPreview, setDevHoverPhotoPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingDeveloper) {
      setDevName(editingDeveloper.name)
      setDevRole(editingDeveloper.role)
      setDevBio(editingDeveloper.bio)
      setDevLocation(editingDeveloper.location || 'JAIPUR, INDIA')
      setDevTeam(editingDeveloper.team || 'WnC TEAM')
      setDevLinkedin(editingDeveloper.linkedin || '')
      setDevGithub(editingDeveloper.github || '')
      setDevTwitter(editingDeveloper.twitter || '')
      setDevInstagram(editingDeveloper.instagram || '')
      setDevEmail(editingDeveloper.email || '')
      setDevPhotoFile(null)
      setDevPhotoPreview(editingDeveloper.image || getDeveloperImage(editingDeveloper, false) || '')
      setDevHoverPhotoFile(null)
      setDevHoverPhotoPreview(editingDeveloper.hoverImage || getDeveloperImage(editingDeveloper, true) || '')
    } else {
      setDevName('')
      setDevRole('FULL STACK DEVELOPER')
      setDevBio('')
      setDevLocation('JAIPUR, INDIA')
      setDevTeam('WnC TEAM')
      setDevLinkedin('')
      setDevGithub('')
      setDevTwitter('')
      setDevInstagram('')
      setDevEmail('')
      setDevPhotoFile(null)
      setDevPhotoPreview('')
      setDevHoverPhotoFile(null)
      setDevHoverPhotoPreview('')
    }
  }, [editingDeveloper, isOpen])

  if (!isOpen) return null

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!devName.trim() || !devRole.trim() || !devBio.trim()) {
      showErrorToast('Name, Role, and Bio are required')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('name', devName.trim())
      formData.append('role', devRole.trim())
      formData.append('bio', devBio.trim())
      formData.append('location', devLocation.trim())
      formData.append('team', devTeam.trim())
      formData.append('linkedin', devLinkedin.trim())
      formData.append('github', devGithub.trim())
      formData.append('twitter', devTwitter.trim())
      formData.append('instagram', devInstagram.trim())
      formData.append('email', devEmail.trim())

      // Primary Default Photo
      if (devPhotoFile) {
        formData.append('photo', devPhotoFile)
      } else if (devPhotoPreview && devPhotoPreview.startsWith('http')) {
        formData.append('imageUrl', devPhotoPreview)
      }

      // Hover Photo (Shown on card hover)
      if (devHoverPhotoFile) {
        formData.append('hoverPhoto', devHoverPhotoFile)
      } else if (devHoverPhotoPreview && devHoverPhotoPreview.startsWith('http')) {
        formData.append('hoverImageUrl', devHoverPhotoPreview)
      }

      let res
      if (editingDeveloper?._id) {
        res = await axios.put(`${API_BASE}/api/developers/${editingDeveloper._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        showSuccessToast('Developer updated successfully with hover image!')
      } else {
        res = await axios.post(`${API_BASE}/api/developers`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        showSuccessToast('Developer created and published successfully!')
      }

      if (res.data?.success && res.data?.data) {
        onSuccess(res.data.data)
        onClose()
      }
    } catch (err: any) {
      console.error('Error saving developer:', err)
      showErrorToast(err.response?.data?.message || 'Failed to save developer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-mono">
      <div className="bg-white border-2 border-slate-900 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-[8px_8px_0px_0px_#000] my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900">
              {editingDeveloper ? 'Edit Developer' : 'Add New Developer'}
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              Team members will be showcased live on the /about page with dual hover animations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-slate-900 flex items-center justify-center font-black hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Name & Role Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                placeholder="e.g. ARYAN KUMAR SWAIN"
                className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={devRole}
                onChange={(e) => setDevRole(e.target.value)}
                placeholder="e.g. FULL STACK DEVELOPER"
                className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
              Short Bio & Specialization *
            </label>
            <textarea
              required
              rows={2}
              value={devBio}
              onChange={(e) => setDevBio(e.target.value)}
              placeholder="e.g. Develops robust frontend interfaces and scalable backend systems..."
              className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-medium text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none resize-none"
            />
          </div>

          {/* Location & Team Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Location
              </label>
              <input
                type="text"
                value={devLocation}
                onChange={(e) => setDevLocation(e.target.value)}
                placeholder="e.g. JAIPUR, INDIA"
                className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-800 mb-1">
                Team Tag / Category
              </label>
              <input
                type="text"
                value={devTeam}
                onChange={(e) => setDevTeam(e.target.value)}
                placeholder="e.g. WnC TEAM"
                className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
              />
            </div>
          </div>

          {/* Dual Photo Upload: Default Photo & Hover Photo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Dual Photo Setup (Normal & Hover Effect)
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Uploaded automatically to ImageKit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Photo 1: Default Primary View */}
              <div className="p-3 bg-[#fafafa] border-2 border-slate-900 rounded-xl flex flex-col justify-between shadow-[2px_2px_0px_0px_#000]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-black uppercase text-slate-900 flex items-center gap-1">
                      <span>📸 1. Default Photo</span>
                    </label>
                    <span className="text-[9px] font-bold bg-[#fef08a] px-1.5 py-0.5 rounded border border-slate-900">
                      Initial View
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-2 leading-tight">
                    Shown normally on the card before mouse hover.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-1">
                  {devPhotoPreview ? (
                    <div className="relative group/p1 shrink-0">
                      <img
                        src={devPhotoPreview}
                        alt="Primary Preview"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                      {devPhotoFile && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border border-slate-900 rounded-full" title="New file selected" />
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setDevPhotoFile(file)
                          setDevPhotoPreview(URL.createObjectURL(file))
                        }
                      }}
                      className="block w-full text-[11px] text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-2 file:border-slate-900 file:text-[10px] file:font-black file:uppercase file:bg-[#fde047] file:text-slate-900 hover:file:bg-[#facc15] file:shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                    />
                    {devPhotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setDevPhotoFile(null)
                          setDevPhotoPreview('')
                        }}
                        className="text-[9px] text-rose-600 hover:underline mt-1 font-bold block"
                      >
                        ✕ Clear Image 1
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo 2: Hover View */}
              <div className="p-3 bg-[#fafafa] border-2 border-slate-900 rounded-xl flex flex-col justify-between shadow-[2px_2px_0px_0px_#000]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-black uppercase text-slate-900 flex items-center gap-1">
                      <span>🎭 2. Hover Photo</span>
                    </label>
                    <span className="text-[9px] font-bold bg-[#e9d5ff] text-purple-950 px-1.5 py-0.5 rounded border border-slate-900">
                      Hover Effect
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-2 leading-tight">
                    Smoothly reveals when visitor hovers mouse over the card.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 mt-1">
                  {devHoverPhotoPreview ? (
                    <div className="relative group/p2 shrink-0">
                      <img
                        src={devHoverPhotoPreview}
                        alt="Hover Preview"
                        className="w-14 h-14 rounded-xl object-cover border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]"
                      />
                      {devHoverPhotoFile && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-500 border border-slate-900 rounded-full" title="New hover file selected" />
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-bold shrink-0">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setDevHoverPhotoFile(file)
                          setDevHoverPhotoPreview(URL.createObjectURL(file))
                        }
                      }}
                      className="block w-full text-[11px] text-slate-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-2 file:border-slate-900 file:text-[10px] file:font-black file:uppercase file:bg-[#e9d5ff] file:text-purple-950 hover:file:bg-[#d8b4fe] file:shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                    />
                    {devHoverPhotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setDevHoverPhotoFile(null)
                          setDevHoverPhotoPreview('')
                        }}
                        className="text-[9px] text-rose-600 hover:underline mt-1 font-bold block"
                      >
                        ✕ Clear Image 2
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Test Simulation */}
            {(devPhotoPreview || devHoverPhotoPreview) && (
              <div className="p-3 bg-[#fffbeb] border-2 border-slate-900 rounded-xl flex items-center justify-between gap-3 shadow-[1.5px_1.5px_0px_0px_#000]">
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase text-amber-900 flex items-center gap-1.5">
                    <span>✨ Live Hover Test Box</span>
                  </div>
                  <p className="text-[10px] text-amber-800">
                    Hover your mouse over the avatar on the right to test how Image 1 transitions to Image 2!
                  </p>
                </div>

                <div
                  className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_0px_#000] group/tester bg-white cursor-pointer"
                  title="Hover to test transition"
                >
                  <img
                    src={devPhotoPreview || devHoverPhotoPreview}
                    alt="Test normal"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      devHoverPhotoPreview ? 'group-hover/tester:opacity-0' : ''
                    }`}
                  />
                  {devHoverPhotoPreview && (
                    <img
                      src={devHoverPhotoPreview}
                      alt="Test hover"
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover/tester:opacity-100 transition-opacity duration-300"
                    />
                  )}
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] font-black text-white text-center py-0.5">
                    HOVER ME
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Links Accordion / Section */}
          <div>
            <div className="text-[11px] font-black uppercase text-slate-700 mb-2">
              🌐 Social Profiles & Links (Optional)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={devLinkedin}
                onChange={(e) => setDevLinkedin(e.target.value)}
                placeholder="LinkedIn URL (e.g. linkedin.com/in/...)"
                className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
              />
              <input
                type="text"
                value={devGithub}
                onChange={(e) => setDevGithub(e.target.value)}
                placeholder="GitHub URL (e.g. github.com/...)"
                className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
              />
              <input
                type="text"
                value={devTwitter}
                onChange={(e) => setDevTwitter(e.target.value)}
                placeholder="Twitter / X handle"
                className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
              />
              <input
                type="text"
                value={devInstagram}
                onChange={(e) => setDevInstagram(e.target.value)}
                placeholder="Instagram handle"
                className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
              />
            </div>
            <div className="mt-2">
              <input
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="Direct Work Email (e.g. developer@webncode.in)"
                className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs text-slate-900 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg text-xs font-black uppercase text-slate-800 shadow-[2px_2px_0px_0px_#000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 rounded-lg text-xs font-black uppercase text-slate-950 shadow-[2px_2px_0px_0px_#000] disabled:opacity-60 flex items-center gap-1.5"
            >
              <span>{isSubmitting ? '⏳' : '💾'}</span>
              <span>{isSubmitting ? 'Uploading to ImageKit...' : editingDeveloper ? 'Update Developer' : 'Publish Developer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
