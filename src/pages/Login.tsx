import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../components/ui/Toast'

interface ProjectItem {
  _id: string
  title: string
  slug: string
  category: string
  shortDescription: string
  images: string[]
  createdAt: string
  demoUrl?: string
}

const CATEGORIES = [
  'Education',
  'Operations',
  'Analytics',
  'HR',
  'Sports',
  'Services',
  'SaaS',
  'Healthcare',
  'Custom'
]

export default function SuperAdminPortal() {
  const { login, user, token, isAuthenticated, logout } = useAuth()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  // New Project Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Education')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmittingProject, setIsSubmittingProject] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)

  // Fetch projects when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects()
    }
  }, [isAuthenticated])

  const fetchProjects = async () => {
    setIsLoadingProjects(true)
    try {
      const res = await axios.get(`${API_BASE}/api/projects`)
      if (res.data?.success) {
        setProjects(res.data.data || [])
      }
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // Handle Login
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!email.trim() || !password) {
      setAuthError('Please provide both admin email and password')
      return
    }

    setIsLoggingIn(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        showSuccessToast('SuperAdmin session authenticated!')
      } else {
        const errorMsg = res.message || 'Access Denied: Invalid credentials'
        setAuthError(errorMsg)
        showErrorToast(errorMsg)
      }
    } catch (err: any) {
      const msg = err?.message || 'Access Denied'
      setAuthError(msg)
      showErrorToast(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle image files selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle Features list
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

  // Submit New Project
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      showErrorToast('Title, short summary and full description are required')
      return
    }

    setIsSubmittingProject(true)
    setUploadProgress('Preparing & uploading images to ImageKit...')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('shortDescription', shortDescription)
      formData.append('description', description)
      formData.append('demoUrl', demoUrl)

      const validFeatures = features.map((f) => f.trim()).filter(Boolean)
      formData.append('features', JSON.stringify(validFeatures))

      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      const res = await axios.post(`${API_BASE}/api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data?.success) {
        showSuccessToast('Project & images uploaded to ImageKit successfully!')
        // Reset form
        setTitle('')
        setShortDescription('')
        setDescription('')
        setDemoUrl('')
        setFeatures([''])
        setSelectedFiles([])
        setPreviewUrls([])
        fetchProjects()
        setActiveTab('manage')
      } else {
        showErrorToast(res.data?.message || 'Failed to publish project')
      }
    } catch (err: any) {
      console.error('Project upload error:', err)
      showErrorToast(err.response?.data?.message || err.message || 'Upload failed')
    } finally {
      setIsSubmittingProject(false)
      setUploadProgress(null)
    }
  }

  // Delete Project
  const handleDeleteProject = async (id: string, projTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${projTitle}"?`)) {
      return
    }

    try {
      const res = await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Project deleted successfully')
        setProjects(projects.filter((p) => p._id !== id))
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete project')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0f172a] text-white">
      <div className="max-w-6xl mx-auto">
        {isAuthenticated && user ? (
          // ================= SUPERADMIN DASHBOARD =================
          <div>
            {/* Top Control Bar */}
            <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-400 text-slate-950 font-mono font-black text-xl rounded-xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_#fff]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-mono text-lg font-black text-white uppercase tracking-tight">
                      {user.name}
                    </h1>
                    <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-400 text-emerald-300 font-mono text-[10px] font-black uppercase rounded">
                      SUPERADMIN
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-mono text-xs font-bold uppercase transition-all"
                >
                  🌐 View Site
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 border border-rose-400 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-3 mb-6 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  activeTab === 'create'
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                    : 'bg-[#1e293b] text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                + Add New Project (ImageKit)
              </button>

              <button
                onClick={() => {
                  setActiveTab('manage')
                  fetchProjects()
                }}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  activeTab === 'manage'
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                    : 'bg-[#1e293b] text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                📁 Projects Archive ({projects.length})
              </button>
            </div>

            {/* ================= TAB 1: CREATE PROJECT FORM ================= */}
            {activeTab === 'create' && (
              <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white">
                      Publish New Project / Product
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      Upload project specs & screenshots directly to ImageKit cloud CDN
                    </p>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg">
                    CDN: ImageKit.io
                  </span>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. FeeFollowup SaaS"
                        className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Industry / Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono"
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
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Short Summary (One-liner card description) *
                    </label>
                    <input
                      type="text"
                      required
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="e.g. Comprehensive Automated Fee Follow-up & Transport Logistics for Educational Institutes."
                      className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Full Description / Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed breakdown of the project architecture, problem solved, workflow, and technology..."
                      className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                    ></textarea>
                  </div>

                  {/* Demo URL */}
                  <div>
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Live Demo / Website Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://feefollowup.com or demo link"
                      className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono"
                    />
                  </div>

                  {/* Features List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black font-mono uppercase tracking-wider text-slate-300">
                        Key Features / Capabilities
                      </label>
                      <button
                        type="button"
                        onClick={addFeatureInput}
                        className="text-xs font-mono font-bold text-cyan-400 hover:underline"
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
                            placeholder={`Feature #${idx + 1} (e.g. Multi-round route planner)`}
                            className="flex-1 px-3.5 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-hidden focus:border-cyan-400"
                          />
                          {features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeatureInput(idx)}
                              className="px-3 bg-rose-950/80 border border-rose-500 text-rose-300 rounded-lg text-xs font-mono hover:bg-rose-900"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ImageKit Images Uploader */}
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 bg-slate-900/60">
                    <label className="block text-xs font-black font-mono uppercase tracking-wider text-cyan-400 mb-2">
                      📸 Project Screenshots / Images (Saved to ImageKit)
                    </label>
                    <p className="text-xs font-mono text-slate-400 mb-4">
                      Select project mockups or screenshots (.png, .jpg, .webp). They will be automatically pushed to your ImageKit endpoint.
                    </p>

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-cyan-400 file:text-xs file:font-black file:font-mono file:uppercase file:bg-cyan-400 file:text-slate-950 hover:file:bg-cyan-300 cursor-pointer"
                    />

                    {/* Previews */}
                    {previewUrls.length > 0 && (
                      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {previewUrls.map((url, i) => (
                          <div
                            key={i}
                            className="relative group border-2 border-slate-700 rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center"
                          >
                            <img
                              src={url}
                              alt={`preview-${i}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-90 hover:opacity-100 shadow"
                              title="Remove"
                            >
                              ✕
                            </button>
                            <span className="absolute bottom-1.5 left-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">
                              Image #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {uploadProgress && (
                    <div className="p-3 bg-cyan-950/80 border border-cyan-400 rounded-xl text-xs font-mono text-cyan-300 animate-pulse flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400"></span>
                      {uploadProgress}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="w-full py-4 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-sm rounded-xl shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingProject
                      ? 'Uploading to ImageKit & Publishing...'
                      : 'Publish Project to Website'}
                  </button>
                </form>
              </div>
            )}

            {/* ================= TAB 2: MANAGE PROJECTS ================= */}
            {activeTab === 'manage' && (
              <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white">
                    Database Projects ({projects.length})
                  </h2>
                  <button
                    onClick={fetchProjects}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-xs font-mono hover:bg-slate-700"
                  >
                    🔄 Refresh
                  </button>
                </div>

                {isLoadingProjects ? (
                  <div className="py-12 text-center text-slate-400 font-mono text-sm">
                    Loading projects from database...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-12 text-center font-mono">
                    <p className="text-slate-400 text-sm mb-4">No custom projects added yet.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-2 bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl border border-cyan-300 shadow-[2px_2px_0px_0px_#fff]"
                    >
                      + Add Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj._id}
                        className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400 transition-all"
                      >
                        <div>
                          {/* Image preview */}
                          {proj.images && proj.images.length > 0 ? (
                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 border border-slate-800 bg-slate-950">
                              <img
                                src={proj.images[0]}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video w-full rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 font-mono text-xs mb-3">
                              No Image Uploaded
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-1.5">
                            <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-black uppercase rounded">
                              {proj.category}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {new Date(proj.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-white font-mono uppercase">
                            {proj.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-mono">
                            {proj.shortDescription}
                          </p>

                          {proj.images && proj.images.length > 0 && (
                            <div className="mt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                              <span>✓ ImageKit URL:</span>
                              <span className="truncate max-w-[200px] text-slate-400">
                                {proj.images[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                          <Link
                            to={`/products/${proj.slug}`}
                            target="_blank"
                            className="text-xs font-mono font-bold text-cyan-400 hover:underline"
                          >
                            View Live ↗
                          </Link>

                          <button
                            onClick={() => handleDeleteProject(proj._id, proj.title)}
                            className="px-3 py-1.5 bg-rose-950 border border-rose-600 text-rose-300 font-mono text-xs font-bold rounded-lg hover:bg-rose-900 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // ================= LOGIN FORM =================
          <div className="max-w-md mx-auto">
            <div className="bg-[#1e293b] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
              <div className="flex items-center gap-2 text-cyan-400 mb-3">
                <span className="text-lg">🔒</span>
                <span className="font-mono text-xs font-black tracking-widest uppercase">
                  RESTRICTED SYSTEM
                </span>
              </div>

              <h1 className="text-2xl font-black font-mono tracking-tight text-white uppercase mb-1">
                SuperAdmin Portal
              </h1>
              <p className="text-xs font-mono text-slate-400 mb-6">
                Authorized personnel only. Enter credentials to manage projects.
              </p>

              {authError && (
                <div className="mb-5 p-3.5 bg-rose-950/80 border-2 border-rose-500 text-rose-200 text-xs font-mono font-bold rounded-lg flex items-center gap-2">
                  <span>✕</span>
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white font-mono font-semibold focus:outline-hidden focus:border-cyan-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                    Access Key / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white font-mono font-semibold focus:outline-hidden focus:border-cyan-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full mt-2 py-3 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-xs sm:text-sm rounded-lg shadow-[4px_4px_0px_0px_rgba(34,211,238,0.4)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate Access'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
