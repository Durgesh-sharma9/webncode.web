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
  description?: string
  features?: string[]
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

  // Dashboard sidebar & view state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create')
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  // New & Edit Project Form State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Education')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [features, setFeatures] = useState<string[]>([''])
  const [existingImages, setExistingImages] = useState<string[]>([])
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

  // Reset form to blank
  const resetForm = () => {
    setEditingProjectId(null)
    setTitle('')
    setCategory('Education')
    setShortDescription('')
    setDescription('')
    setDemoUrl('')
    setFeatures([''])
    setExistingImages([])
    setSelectedFiles([])
    setPreviewUrls([])
    setUploadProgress(null)
  }

  // Trigger Edit Mode for a Project
  const handleEditProject = (proj: ProjectItem) => {
    setEditingProjectId(proj._id)
    setTitle(proj.title)
    setCategory(proj.category || 'Education')
    setShortDescription(proj.shortDescription)
    setDescription(proj.description || '')
    setDemoUrl(proj.demoUrl || '')
    setFeatures(proj.features && proj.features.length > 0 ? proj.features : [''])
    setExistingImages(proj.images || [])
    setSelectedFiles([])
    setPreviewUrls([])
    setActiveTab('create')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
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

  // Submit New or Edited Project
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !shortDescription.trim() || !description.trim()) {
      showErrorToast('Title, short summary and full description are required')
      return
    }

    setIsSubmittingProject(true)
    setUploadProgress(
      selectedFiles.length > 0
        ? 'Uploading new screenshots to ImageKit cloud & saving...'
        : 'Saving changes...'
    )

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('category', category)
      formData.append('shortDescription', shortDescription)
      formData.append('description', description)
      formData.append('demoUrl', demoUrl)

      const validFeatures = features.map((f) => f.trim()).filter(Boolean)
      formData.append('features', JSON.stringify(validFeatures))

      // Append retained existing images
      formData.append('existingImages', JSON.stringify(existingImages))

      // Append new files for ImageKit upload
      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      if (editingProjectId) {
        // UPDATE PROJECT (PUT)
        const res = await axios.put(`${API_BASE}/api/projects/${editingProjectId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.success) {
          showSuccessToast('Project updated successfully!')
          resetForm()
          fetchProjects()
          setActiveTab('manage')
        } else {
          showErrorToast(res.data?.message || 'Failed to update project')
        }
      } else {
        // CREATE PROJECT (POST)
        const res = await axios.post(`${API_BASE}/api/projects`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.success) {
          showSuccessToast('Project & images uploaded to ImageKit successfully!')
          resetForm()
          fetchProjects()
          setActiveTab('manage')
        } else {
          showErrorToast(res.data?.message || 'Failed to publish project')
        }
      }
    } catch (err: any) {
      console.error('Project save error:', err)
      showErrorToast(err.response?.data?.message || err.message || 'Action failed')
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

  // ================= UN-AUTHENTICATED: STANDALONE LOGIN SCREEN =================
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400 text-slate-950 font-mono font-black text-2xl mb-4 border-2 border-white shadow-[4px_4px_0px_0px_#fff]">
              W
            </div>
            <h1 className="text-2xl font-black font-mono tracking-tight text-white uppercase">
              Web n Code Portal
            </h1>
            <p className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-widest">
              🔒 SuperAdmin Security Gateway
            </p>
          </div>

          <div className="bg-[#0f172a] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {authError && (
              <div className="mb-5 p-3.5 bg-rose-950/90 border-2 border-rose-500 text-rose-200 text-xs font-mono font-bold rounded-xl flex items-center gap-2">
                <span>✕</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  SuperAdmin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-hidden focus:border-cyan-400"
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
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3.5 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all disabled:opacity-50"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In as SuperAdmin'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs font-mono text-slate-500 hover:text-slate-400">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ================= AUTHENTICATED: STANDALONE SUPERADMIN WITH SIDEBAR =================
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0f172a] border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-xs font-black uppercase text-cyan-400">
            WNC SuperAdmin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono"
        >
          {sidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* ================= DEDICATED LEFT SIDEBAR ================= */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:flex flex-col justify-between w-full md:w-64 shrink-0 bg-[#0f172a] border-r border-slate-800 p-5 z-40`}
      >
        <div>
          {/* Brand Header */}
          <div className="pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-cyan-400 text-slate-950 font-mono font-black rounded-lg flex items-center justify-center border border-white">
                W
              </div>
              <div>
                <h2 className="font-mono text-sm font-black text-white uppercase tracking-tight">
                  SuperAdmin
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Online Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('create')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === 'create'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>⚡</span>
              <span>Add New Project</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('manage')
                fetchProjects()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border ${
                activeTab === 'manage'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span>📁</span>
                <span>Projects Archive</span>
              </div>
              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
                {projects.length}
              </span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-900/30 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all mt-4"
            >
              <span>🌐</span>
              <span>Open Public Site ↗</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-black mb-1">
              Logged in as:
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">{user.name}</div>
            <div className="text-[11px] font-mono text-slate-500 truncate">{user.email}</div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 border border-rose-400 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
          >
            Sign Out / Exit
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto max-w-5xl">
        {/* Top View Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black font-mono uppercase tracking-tight text-white">
              {activeTab === 'create' ? 'Project Studio' : 'Projects Directory'}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {activeTab === 'create'
                ? 'Create & publish new projects with ImageKit CDN media'
                : `Managing ${projects.length} projects stored in database`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              ImageKit CDN: Active
            </span>
          </div>
        </div>

        {/* TAB 1: CREATE OR EDIT PROJECT FORM */}
        {activeTab === 'create' && (
          <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white flex items-center gap-2">
                  {editingProjectId ? (
                    <>
                      <span className="text-amber-400">✏️ EDIT PROJECT</span>
                      <span className="text-slate-400 text-sm font-normal truncate max-w-[300px]">
                        ({title})
                      </span>
                    </>
                  ) : (
                    'Publish New Project / Product'
                  )}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  {editingProjectId
                    ? 'Modify project specifications, update features, or upload new ImageKit media.'
                    : 'Upload project specs & screenshots directly to ImageKit cloud CDN'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-mono text-slate-300 transition-all"
                  >
                    ✕ Cancel Edit
                  </button>
                )}
                <span className="hidden sm:inline-block px-3 py-1 bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg">
                  CDN: ImageKit.io
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
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

              {/* Existing Images (When Editing) */}
              {editingProjectId && existingImages.length > 0 && (
                <div className="p-4 bg-slate-900/90 border-2 border-slate-700 rounded-xl">
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    Current ImageKit Images ({existingImages.length})
                  </label>
                  <p className="text-xs font-mono text-slate-400 mb-3">
                    Click ✕ on any image you want to remove from this project:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative group border border-slate-700 rounded-lg overflow-hidden bg-slate-950 aspect-video flex items-center justify-center"
                      >
                        <img
                          src={imgUrl}
                          alt={`current-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ImageKit Images Uploader (Add New Images) */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 bg-slate-950/50">
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-cyan-400 mb-2">
                  📸 {editingProjectId ? 'Upload Additional Screenshots (ImageKit)' : 'Project Screenshots / Media (Saved to ImageKit)'}
                </label>
                <p className="text-xs font-mono text-slate-400 mb-4">
                  Select screenshots or UI mockups (.png, .jpg, .webp). Uploads directly to ImageKit cloud CDN.
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs font-mono text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-2 file:border-cyan-400 file:text-xs file:font-black file:font-mono file:uppercase file:bg-cyan-400 file:text-slate-950 hover:file:bg-cyan-300 cursor-pointer"
                />

                {previewUrls.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewUrls.map((url, i) => (
                      <div
                        key={i}
                        className="relative group border-2 border-slate-700 rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center"
                      >
                        <img
                          src={url}
                          alt={`preview-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {uploadProgress && (
                <div className="p-3.5 bg-cyan-950/80 border border-cyan-400 rounded-xl text-xs font-mono text-cyan-300 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {uploadProgress}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingProject}
                className="w-full py-4 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-sm rounded-xl shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all disabled:opacity-50"
              >
                {isSubmittingProject
                  ? 'Saving to ImageKit & Database...'
                  : editingProjectId
                  ? '💾 Update Project & Save Changes'
                  : 'Publish Project to Website'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MANAGE PROJECTS */}
        {activeTab === 'manage' && (
          <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white">
                All Projects ({projects.length})
              </h2>
              <button
                onClick={fetchProjects}
                className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono hover:bg-slate-700"
              >
                🔄 Refresh
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="py-12 text-center text-slate-400 font-mono text-sm">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center font-mono">
                <p className="text-slate-400 text-sm mb-4">No custom projects added yet.</p>
                <button
                  onClick={() => {
                    resetForm()
                    setActiveTab('create')
                  }}
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
                    className="bg-slate-900/90 border-2 border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400 transition-all"
                  >
                    <div>
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
                          <span className="truncate max-w-[180px] text-slate-500">
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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="px-3 py-1.5 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg hover:bg-cyan-900 transition-all flex items-center gap-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id, proj.title)}
                          className="px-3 py-1.5 bg-rose-950 border border-rose-600 text-rose-300 font-mono text-xs font-bold rounded-lg hover:bg-rose-900 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

