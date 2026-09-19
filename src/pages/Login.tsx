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

interface ContactItem {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  createdAt: string
}

interface ApplicationItem {
  _id: string
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  gender: string
  linkedin?: string
  github?: string
  portfolio?: string
  position: string
  experience: string
  currentCompany?: string
  currentRole?: string
  noticePeriod: string
  builtProduct: string
  projectLinks?: string
  whyJoin: string
  college?: string
  course?: string
  currentYear?: string
  graduationYear?: string
  resumeName: string
  resumeUrl?: string
  createdAt: string
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

  // Dashboard navigation state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacts' | 'careers' | 'create' | 'manage'>('contacts')

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
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

  // Contact submissions state
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [contactSearch, setContactSearch] = useState('')

  // Career applications state
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)
  const [careerSearch, setCareerSearch] = useState('')
  const [careerFilterPosition, setCareerFilterPosition] = useState('All')

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProjects()
      fetchContacts()
      fetchApplications()
    }
  }, [isAuthenticated, token])

  // ================= DATA FETCHERS =================
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

  const fetchContacts = async () => {
    setIsLoadingContacts(true)
    try {
      const res = await axios.get(`${API_BASE}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        setContacts(res.data.data || [])
      }
    } catch (err) {
      console.error('Error loading contacts:', err)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  const fetchApplications = async () => {
    setIsLoadingApplications(true)
    try {
      const res = await axios.get(`${API_BASE}/api/careers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        setApplications(res.data.data || [])
      }
    } catch (err) {
      console.error('Error loading applications:', err)
    } finally {
      setIsLoadingApplications(false)
    }
  }

  // ================= DELETION HANDLERS =================
  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete enquiry from "${name}"?`)) {
      return
    }
    try {
      const res = await axios.delete(`${API_BASE}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Enquiry deleted successfully')
        setContacts((prev) => prev.filter((c) => c._id !== id))
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete enquiry')
    }
  }

  const handleDeleteApplication = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete job application for "${name}"?`)) {
      return
    }
    try {
      const res = await axios.delete(`${API_BASE}/api/careers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Application deleted successfully')
        setApplications((prev) => prev.filter((a) => a._id !== id))
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete application')
    }
  }

  // ================= PROJECT FORM HANDLERS =================
  const resetProjectForm = () => {
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
      formData.append('existingImages', JSON.stringify(existingImages))

      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      if (editingProjectId) {
        const res = await axios.put(`${API_BASE}/api/projects/${editingProjectId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })

        if (res.data?.success) {
          showSuccessToast('Project updated successfully!')
          resetProjectForm()
          fetchProjects()
          setActiveTab('manage')
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
          showSuccessToast('Project & images uploaded to ImageKit successfully!')
          resetProjectForm()
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

  // ================= AUTH LOGIN SUBMISSION =================
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

  // Helper for WhatsApp Click-to-Chat
  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '')
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber
    const msg = encodeURIComponent(`Hi ${name}, this is Web n Code Technologies regarding your submission on our website.`)
    return `https://wa.me/${fullNumber}?text=${msg}`
  }

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    )
  })

  // Filtered applications
  const filteredApplications = applications.filter((a) => {
    const matchesPos =
      careerFilterPosition === 'All' ||
      a.position.toLowerCase().includes(careerFilterPosition.toLowerCase())
    const q = careerSearch.toLowerCase()
    const matchesSearch =
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.mobile.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      (a.currentCompany && a.currentCompany.toLowerCase().includes(q))
    return matchesPos && matchesSearch
  })

  // ================= UN-AUTHENTICATED: STANDALONE LOGIN SCREEN =================
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
                className="w-full mt-2 py-3.5 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-xs sm:text-sm rounded-xl shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all disabled:opacity-50 cursor-pointer"
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

  // ================= AUTHENTICATED: STANDALONE SUPERADMIN PORTAL =================
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#0f172a] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
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
        } md:flex flex-col justify-between w-full md:w-64 shrink-0 bg-[#0f172a] border-r border-slate-800 p-5 z-40 md:min-h-screen sticky md:top-0 h-auto`}
      >
        <div>
          {/* Brand Header */}
          <div className="pb-6 mb-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-400 text-slate-950 font-mono font-black rounded-xl flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_#fff]">
                W
              </div>
              <div>
                <h2 className="font-mono text-sm font-black text-white uppercase tracking-tight">
                  SuperAdmin
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Live Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* 1. Client Enquiries / Leads */}
            <button
              onClick={() => {
                setActiveTab('contacts')
                fetchContacts()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📬</span>
                <span>Client Leads</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'contacts'
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {contacts.length}
              </span>
            </button>

            {/* 2. Job Applications & Resumes */}
            <button
              onClick={() => {
                setActiveTab('careers')
                fetchApplications()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                activeTab === 'careers'
                  ? 'bg-purple-400 text-slate-950 border-purple-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👥</span>
                <span>Applications</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'careers'
                    ? 'bg-slate-950 text-purple-300'
                    : 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                }`}
              >
                {applications.length}
              </span>
            </button>

            {/* 3. Add Project */}
            <button
              onClick={() => {
                resetProjectForm()
                setActiveTab('create')
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">⚡</span>
              <span>Add Project</span>
            </button>

            {/* 4. Projects Archive */}
            <button
              onClick={() => {
                setActiveTab('manage')
                fetchProjects()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[3px_3px_0px_0px_#fff]'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📁</span>
                <span>Projects ({projects.length})</span>
              </div>
            </button>

            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-900/30 border border-slate-800 hover:text-white hover:bg-slate-800 transition-all mt-4"
            >
              <span>🌐</span>
              <span>Public Website ↗</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-black mb-1">
              Admin Authenticated
            </div>
            <div className="text-xs font-mono font-bold text-white truncate">{user.name}</div>
            <div className="text-[11px] font-mono text-slate-500 truncate">{user.email}</div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 border border-rose-400 rounded-xl font-mono text-xs font-black uppercase tracking-wider text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            Sign Out / Exit
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 p-4 sm:p-7 lg:p-10 overflow-y-auto max-w-6xl">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-white flex items-center gap-3">
              {activeTab === 'contacts' && (
                <>
                  <span className="p-1.5 bg-amber-400/20 border border-amber-400 text-amber-300 rounded-xl text-xl">
                    📬
                  </span>
                  <span>Client Enquiries & Leads</span>
                </>
              )}
              {activeTab === 'careers' && (
                <>
                  <span className="p-1.5 bg-purple-400/20 border border-purple-400 text-purple-300 rounded-xl text-xl">
                    👥
                  </span>
                  <span>Job Applications & Resumes</span>
                </>
              )}
              {activeTab === 'create' && (
                <>
                  <span className="p-1.5 bg-cyan-400/20 border border-cyan-400 text-cyan-300 rounded-xl text-xl">
                    ⚡
                  </span>
                  <span>{editingProjectId ? 'Edit Project' : 'Project Studio'}</span>
                </>
              )}
              {activeTab === 'manage' && (
                <>
                  <span className="p-1.5 bg-cyan-400/20 border border-cyan-400 text-cyan-300 rounded-xl text-xl">
                    📁
                  </span>
                  <span>Projects Directory</span>
                </>
              )}
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {activeTab === 'contacts' &&
                `Real-time lead messages received from website visitors (${contacts.length} total)`}
              {activeTab === 'careers' &&
                `Job applications, candidate profiles & PDF resumes submitted (${applications.length} total)`}
              {activeTab === 'create' &&
                'Create and publish projects with automated ImageKit cloud hosting'}
              {activeTab === 'manage' &&
                `Managing all ${projects.length} portfolio items`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              MongoDB & ImageKit Connected
            </span>
          </div>
        </div>

        {/* ================= TAB 1: CLIENT ENQUIRIES / LEADS ================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Filter & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0f172a] border-2 border-slate-800 p-4 rounded-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search by client name, email, phone or message keywords..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-hidden focus:border-amber-400"
                />
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
                {contactSearch && (
                  <button
                    onClick={() => setContactSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchContacts}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  🔄 Refresh Leads
                </button>
              </div>
            </div>

            {/* Leads List */}
            {isLoadingContacts ? (
              <div className="py-20 text-center text-slate-400 font-mono text-sm">
                Fetching latest inquiries...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-12 text-center font-mono">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-base font-bold text-white uppercase">No Enquiries Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {contactSearch
                    ? 'No enquiries match your search query.'
                    : 'When visitors fill out the Contact Us form on your website, their messages will immediately appear here!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContacts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-amber-400/80 transition-all shadow-lg"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-base shrink-0 border border-white shadow-[2px_2px_0px_0px_#fff]">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-base font-mono font-black text-white uppercase tracking-tight">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                            <span>🕒 {new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Communication Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.phone && (
                          <a
                            href={getWhatsAppLink(item.phone, item.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#fff] flex items-center gap-1.5 transition-all"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        )}

                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${item.email}?subject=Web%20n%20Code%20Technologies%20-%20Enquiry%20Response`}
                          className="px-3 py-1.5 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg hover:bg-cyan-900 transition-all flex items-center gap-1.5"
                        >
                          <span>✉️ Email</span>
                        </a>

                        <button
                          onClick={() => handleDeleteContact(item._id, item.name)}
                          className="px-2.5 py-1.5 bg-rose-950/80 border border-rose-600 hover:bg-rose-900 text-rose-300 font-mono text-xs font-bold rounded-lg transition-all cursor-pointer"
                          title="Delete Enquiry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Contact Info Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">
                          Client Email
                        </span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-cyan-400 font-semibold hover:underline"
                        >
                          {item.email}
                        </a>
                      </div>

                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">
                          Phone Number
                        </span>
                        <a
                          href={`tel:${item.phone}`}
                          className="text-emerald-400 font-semibold hover:underline"
                        >
                          {item.phone}
                        </a>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider text-amber-400 block mb-1.5">
                        Client Message / Requirements:
                      </span>
                      <p className="text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: JOB APPLICATIONS & RESUMES ================= */}
        {activeTab === 'careers' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0f172a] border-2 border-slate-800 p-4 rounded-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={careerSearch}
                  onChange={(e) => setCareerSearch(e.target.value)}
                  placeholder="Search candidate name, email, mobile, position, company..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-hidden focus:border-purple-400"
                />
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
                {careerSearch && (
                  <button
                    onClick={() => setCareerSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={careerFilterPosition}
                  onChange={(e) => setCareerFilterPosition(e.target.value)}
                  className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-hidden focus:border-purple-400"
                >
                  <option value="All">All Roles / Positions</option>
                  <option value="Frontend">Frontend Roles</option>
                  <option value="Backend">Backend Roles</option>
                  <option value="Full">Full Stack</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="QA">Quality Assurance</option>
                  <option value="Open">Open Applications</option>
                </select>

                <button
                  onClick={fetchApplications}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Applications List */}
            {isLoadingApplications ? (
              <div className="py-20 text-center text-slate-400 font-mono text-sm">
                Loading applicant records...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-12 text-center font-mono">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-base font-bold text-white uppercase">No Applications Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {careerSearch || careerFilterPosition !== 'All'
                    ? 'No candidates match your filters.'
                    : 'Applications submitted through /careers will show up here along with their experience, builder answers, and resume PDFs!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredApplications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-purple-400/80 transition-all shadow-xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-3 py-1 bg-purple-400 text-slate-950 font-mono font-black text-xs uppercase rounded-md shadow-[2px_2px_0px_0px_#fff]">
                            {app.position}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold rounded">
                            Exp: {app.experience}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold rounded">
                            Notice: {app.noticePeriod}
                          </span>
                        </div>

                        <h3 className="text-lg font-mono font-black text-white uppercase">
                          {app.fullName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 mt-1">
                          <span>📍 {app.city}, {app.state}</span>
                          <span>•</span>
                          <span>Gender: {app.gender}</span>
                          <span>•</span>
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Direct Actions (WhatsApp, Call, Email, Delete) */}
                      <div className="flex flex-wrap items-center gap-2">
                        {app.mobile && (
                          <a
                            href={getWhatsAppLink(app.mobile, app.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-black uppercase rounded-xl shadow-[2px_2px_0px_0px_#fff] flex items-center gap-1.5 transition-all"
                          >
                            <span>💬 WhatsApp Candidate</span>
                          </a>
                        )}

                        {app.mobile && (
                          <a
                            href={`tel:${app.mobile}`}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-mono text-xs font-bold rounded-xl"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${app.email}?subject=Web%20n%20Code%20Application%20Update%20-%20${encodeURIComponent(app.position)}`}
                          className="px-3 py-2 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-xl hover:bg-cyan-900"
                        >
                          <span>✉️ Email</span>
                        </a>

                        <button
                          onClick={() => handleDeleteApplication(app._id, app.fullName)}
                          className="px-3 py-2 bg-rose-950/80 border border-rose-600 hover:bg-rose-900 text-rose-300 font-mono text-xs font-bold rounded-xl cursor-pointer"
                          title="Delete Application"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Contact & Links Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">Email</span>
                        <a href={`mailto:${app.email}`} className="text-cyan-400 font-semibold truncate block">
                          {app.email}
                        </a>
                      </div>

                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">Mobile</span>
                        <a href={`tel:${app.mobile}`} className="text-emerald-400 font-semibold block">
                          {app.mobile}
                        </a>
                      </div>

                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">Current Company</span>
                        <span className="text-slate-200 font-semibold truncate block">
                          {app.currentCompany || 'N/A'} {app.currentRole ? `(${app.currentRole})` : ''}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-bold text-[10px]">Academic Background</span>
                        <span className="text-slate-200 font-semibold truncate block">
                          {app.college ? `${app.college} - ${app.course || ''} (${app.graduationYear || ''})` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Social & Portfolio Links */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {app.linkedin && (
                        <a
                          href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs rounded-lg flex items-center gap-1.5"
                        >
                          <span>🔗 LinkedIn Profile ↗</span>
                        </a>
                      )}
                      {app.github && (
                        <a
                          href={app.github.startsWith('http') ? app.github : `https://${app.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs rounded-lg flex items-center gap-1.5"
                        >
                          <span>🐙 GitHub Profile ↗</span>
                        </a>
                      )}
                      {app.portfolio && (
                        <a
                          href={app.portfolio.startsWith('http') ? app.portfolio : `https://${app.portfolio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 font-mono text-xs rounded-lg flex items-center gap-1.5"
                        >
                          <span>🎨 Portfolio Website ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Product Builder Responses */}
                    <div className="space-y-3 p-4 bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs">
                      <div>
                        <span className="text-slate-500 font-bold uppercase text-[10px] block">
                          Built a Software Product Before?
                        </span>
                        <span className="text-amber-400 font-bold">{app.builtProduct || 'N/A'}</span>
                      </div>

                      {app.projectLinks && (
                        <div>
                          <span className="text-slate-500 font-bold uppercase text-[10px] block">
                            Project Links:
                          </span>
                          <p className="text-slate-300 whitespace-pre-wrap">{app.projectLinks}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-500 font-bold uppercase text-[10px] block">
                          Why join Web n Code?
                        </span>
                        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {app.whyJoin}
                        </p>
                      </div>
                    </div>

                    {/* Resume Card with Direct Download/View Link */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                        <span className="text-base">📄</span>
                        <span className="font-bold">Resume:</span>
                        <span className="text-slate-400">{app.resumeName || 'resume.pdf'}</span>
                      </div>

                      <div>
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 border-2 border-white text-slate-950 font-mono text-xs font-black uppercase rounded-xl shadow-[3px_3px_0px_0px_#fff] flex items-center gap-2 transition-all"
                          >
                            <span>📥 View / Download Resume (PDF) ↗</span>
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-500 border border-slate-800 bg-slate-900 px-3 py-1.5 rounded-lg">
                            Attached in HR notification email
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: CREATE / EDIT PROJECT STUDIO ================= */}
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
                    onClick={resetProjectForm}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-mono text-slate-300 transition-all cursor-pointer"
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
                    className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-hidden focus:border-cyan-400 font-mono cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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

              {/* Key Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black font-mono uppercase tracking-wider text-slate-300">
                    Key Features / Capabilities
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-xs font-mono font-bold text-cyan-400 hover:underline cursor-pointer"
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
                        className="flex-1 px-3.5 py-2.5 bg-slate-900 border-2 border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-hidden focus:border-cyan-400"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="px-3 bg-rose-950/80 border border-rose-500 text-rose-300 rounded-lg text-xs font-mono hover:bg-rose-900 cursor-pointer"
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
                    Click ✕ on any image you want to remove:
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
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700 cursor-pointer"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ImageKit Images Uploader */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 bg-slate-950/50">
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-cyan-400 mb-2">
                  📸 {editingProjectId ? 'Upload Additional Screenshots (ImageKit)' : 'Project Screenshots (Saved directly to ImageKit CDN)'}
                </label>
                <p className="text-xs font-mono text-slate-400 mb-4">
                  Select screenshots or UI mockups (.png, .jpg, .webp).
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
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow cursor-pointer"
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
                className="w-full py-4 bg-cyan-400 border-2 border-cyan-300 text-slate-950 font-mono font-black uppercase tracking-wider text-sm rounded-xl shadow-[4px_4px_0px_0px_#fff] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#fff] transition-all disabled:opacity-50 cursor-pointer"
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

        {/* ================= TAB 4: MANAGE PROJECTS ARCHIVE ================= */}
        {activeTab === 'manage' && (
          <div className="bg-[#0f172a] border-2 border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-xl font-mono font-black uppercase tracking-tight text-white">
                All Projects ({projects.length})
              </h2>
              <button
                onClick={fetchProjects}
                className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono hover:bg-slate-700 cursor-pointer"
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
                    resetProjectForm()
                    setActiveTab('create')
                  }}
                  className="px-4 py-2 bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl border border-cyan-300 shadow-[2px_2px_0px_0px_#fff] cursor-pointer"
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
                          className="px-3 py-1.5 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-lg hover:bg-cyan-900 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id, proj.title)}
                          className="px-3 py-1.5 bg-rose-950 border border-rose-600 text-rose-300 font-mono text-xs font-bold rounded-lg hover:bg-rose-900 transition-all cursor-pointer"
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
