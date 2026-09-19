import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type ProjectItem, CATEGORIES, API_BASE } from './types'

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Education')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [features, setFeatures] = useState<string[]>([''])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  // If id is provided, fetch project details for editing
  useEffect(() => {
    if (!id) return

    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get(`${API_BASE}/api/projects/${id}`)
        if (res.data?.success && res.data?.data) {
          const p: ProjectItem = res.data.data
          setTitle(p.title || '')
          setCategory(p.category || 'Education')
          setShortDescription(p.shortDescription || '')
          setDescription(p.description || '')
          setDemoUrl(p.demoUrl || '')
          setIsFeatured(Boolean(p.isFeatured))
          setFeatures(p.features && p.features.length > 0 ? p.features : [''])
          setExistingImages(p.images || [])
        }
      } catch (err: any) {
        console.error('Failed to load project details:', err)
        showErrorToast('Failed to load project details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id])

  // Feature handling
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features]
    updated[index] = val
    setFeatures(updated)
  }

  const addFeatureInput = () => {
    setFeatures([...features, ''])
  }

  const removeFeatureInput = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // File selection
  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setSelectedFiles((prev) => [...prev, ...newFiles])

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
    setPreviewUrls((prev) => [...prev, ...newPreviews])
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      showErrorToast('Title, short summary and full description are required')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(
      selectedFiles.length > 0
        ? 'Uploading new screenshots to ImageKit cloud & saving...'
        : 'Saving changes...'
    )

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('category', category)
      formData.append('shortDescription', shortDescription.trim())
      formData.append('description', description.trim())
      formData.append('demoUrl', demoUrl.trim())
      formData.append('isFeatured', String(isFeatured))

      const validFeatures = features.map((f) => f.trim()).filter(Boolean)
      formData.append('features', JSON.stringify(validFeatures))
      formData.append('existingImages', JSON.stringify(existingImages))

      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      if (id) {
        const res = await axios.put(`${API_BASE}/api/projects/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.success) {
          showSuccessToast('Project updated successfully!')
          navigate('/admin/projects')
        } else {
          showErrorToast(res.data?.message || 'Failed to update project')
        }
      } else {
        const res = await axios.post(`${API_BASE}/api/projects`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.success) {
          showSuccessToast('Project published with ImageKit cloud hosting!')
          navigate('/admin/projects')
        } else {
          showErrorToast(res.data?.message || 'Failed to publish project')
        }
      }
    } catch (err: any) {
      console.error('Project save error:', err)
      showErrorToast(err.response?.data?.message || err.message || 'Action failed')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(null)
    }
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-600 font-mono text-xs font-bold">
        Loading project editor...
      </div>
    )
  }

  return (
    <div className="font-mono max-w-4xl mx-auto">
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-900/15">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              {id ? (
                <>
                  <span className="text-amber-600">✏️ EDIT PROJECT</span>
                  <span className="text-slate-500 text-sm font-bold truncate max-w-[300px]">
                    ({title})
                  </span>
                </>
              ) : (
                'Publish New Project / Product'
              )}
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-1">
              {id
                ? 'Modify specifications, update features, or upload new ImageKit screenshots.'
                : 'Create and publish projects with automated ImageKit cloud hosting.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/projects"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 transition-all shadow-[2px_2px_0px_0px_#000]"
            >
              ✕ Back to Projects
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. FeeFollowup SaaS"
                className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Industry / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Short Summary */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Short Summary (One-liner card description) *
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="e.g. Comprehensive Automated Fee Follow-up & Transport Logistics for Educational Institutes."
              className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Full Description / Architecture Details *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed breakdown of the project architecture, problem solved, workflow, and technology..."
              className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none"
            />
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Live Demo / Website Link (Optional)
            </label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://timetablepro.webncode.in or demo link"
              className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none"
            />
          </div>

          {/* Feature in Homepage Showcase Window */}
          <div className="p-4 bg-[#fefce8] border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🌟</span>
                  <span className="text-xs font-black uppercase text-slate-900">
                    Feature in Homepage Hero Window (Live Showcase Carousel)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-bold">
                  When enabled, this project title, screenshot, description, and "Live Demo" link will cycle inside the 3D browser window on the website homepage (like Syllabus Tracker).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none border-2 border-slate-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-slate-900 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Key Features / Capabilities
              </label>
              <button
                type="button"
                onClick={addFeatureInput}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                + Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder={`Feature #${idx + 1} (e.g. Automated WhatsApp Reminder alerts)`}
                    className="flex-1 px-3.5 py-2.5 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm text-slate-900 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureInput(idx)}
                      className="px-3 bg-rose-100 border-2 border-rose-600 text-rose-900 rounded-lg text-xs font-bold hover:bg-rose-200 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Existing Images (When Editing) */}
          {existingImages.length > 0 && (
            <div className="p-4 bg-[#fafafa] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                Current ImageKit Images ({existingImages.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {existingImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative group rounded-lg overflow-hidden border-2 border-slate-900 bg-slate-200 aspect-video shadow-[2px_2px_0px_0px_#000]"
                  >
                    <img src={imgUrl} alt={`Screenshot ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded bg-rose-600 text-white font-black text-xs flex items-center justify-center border border-slate-900 shadow hover:bg-rose-700 cursor-pointer"
                      title="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Screenshots Upload with ImageKit */}
          <div className="p-4 bg-[#fafafa] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1">
              📸 Upload Screenshots (Direct ImageKit Upload)
            </label>
            <p className="text-xs text-slate-600 mb-3 font-bold">
              Upload high-resolution screenshots of the dashboard or UI. Files are automatically processed and stored in ImageKit.
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelection}
              className="block w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-slate-900 file:text-xs file:font-black file:uppercase file:bg-[#fde047] file:text-slate-900 hover:file:bg-[#facc15] file:shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative rounded-lg overflow-hidden border-2 border-slate-900 bg-slate-100 aspect-video shadow-[2px_2px_0px_0px_#000]"
                  >
                    <img src={url} alt={`Upload preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded bg-rose-600 text-white font-black text-xs flex items-center justify-center border border-slate-900 shadow hover:bg-rose-700 cursor-pointer"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between gap-3">
            <Link
              to="/admin/projects"
              className="px-5 py-3 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg text-xs font-black uppercase text-slate-800 shadow-[2px_2px_0px_0px_#000]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 rounded-lg text-xs font-black uppercase text-slate-950 shadow-[3px_3px_0px_0px_#000] disabled:opacity-60 flex items-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? '⏳' : '🚀'}</span>
              <span>
                {uploadProgress || (id ? 'Save Project Changes' : 'Publish to Live Catalog')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
