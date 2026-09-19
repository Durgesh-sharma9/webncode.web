import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../components/ui/Toast'
import Logo from '../components/ui/Logo'
import onlyLogo from '../assets/onlylogoo.png'

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

interface FloatingLogo {
  id: number
  size: number
  side: 'left' | 'right'
  offset: string
  top: string
  opacity: number
  anim: string
  duration: string
  delay: string
}

const FLOATING_LOGOS: FloatingLogo[] = [
  // Left Side — offsets mixed from 15px to 400px, heights random
  { id: 1,  size: 44, side: 'left', offset: '18px',  top: '73%', opacity: 0.40, anim: 'floatSideA', duration: '5.8s', delay: '0s' },
  { id: 2,  size: 72, side: 'left', offset: '140px', top: '11%', opacity: 0.30, anim: 'floatSideB', duration: '7.2s', delay: '0.6s' },
  { id: 3,  size: 36, side: 'left', offset: '280px', top: '47%', opacity: 0.36, anim: 'floatSideC', duration: '5.5s', delay: '1.2s' },
  { id: 4,  size: 58, side: 'left', offset: '60px',  top: '88%', opacity: 0.38, anim: 'floatSideD', duration: '6.4s', delay: '0.4s' },
  { id: 5,  size: 90, side: 'left', offset: '22px',  top: '28%', opacity: 0.28, anim: 'floatSideA', duration: '8.0s', delay: '1.0s' },
  { id: 6,  size: 48, side: 'left', offset: '190px', top: '61%', opacity: 0.34, anim: 'floatSideB', duration: '6.6s', delay: '1.8s' },
  { id: 7,  size: 30, side: 'left', offset: '380px', top: '4%',  opacity: 0.38, anim: 'floatSideC', duration: '5.2s', delay: '0.2s' },
  { id: 8,  size: 62, side: 'left', offset: '95px',  top: '38%', opacity: 0.36, anim: 'floatSideD', duration: '6.0s', delay: '2.0s' },
  { id: 9,  size: 42, side: 'left', offset: '330px', top: '82%', opacity: 0.30, anim: 'floatSideA', duration: '7.4s', delay: '0.8s' },
  { id: 10, size: 80, side: 'left', offset: '50px',  top: '17%', opacity: 0.26, anim: 'floatSideB', duration: '8.2s', delay: '1.5s' },

  // Right Side — offsets mixed from 15px to 400px, heights random
  { id: 11, size: 54, side: 'right', offset: '25px',  top: '35%', opacity: 0.38, anim: 'floatSideC', duration: '6.0s', delay: '0.2s' },
  { id: 12, size: 76, side: 'right', offset: '170px', top: '7%',  opacity: 0.28, anim: 'floatSideD', duration: '7.8s', delay: '0.9s' },
  { id: 13, size: 38, side: 'right', offset: '310px', top: '69%', opacity: 0.36, anim: 'floatSideA', duration: '5.6s', delay: '1.6s' },
  { id: 14, size: 66, side: 'right', offset: '15px',  top: '91%', opacity: 0.40, anim: 'floatSideB', duration: '6.5s', delay: '0.5s' },
  { id: 15, size: 84, side: 'right', offset: '220px', top: '52%', opacity: 0.26, anim: 'floatSideC', duration: '8.4s', delay: '1.3s' },
  { id: 16, size: 46, side: 'right', offset: '75px',  top: '22%', opacity: 0.38, anim: 'floatSideD', duration: '6.2s', delay: '2.1s' },
  { id: 17, size: 32, side: 'right', offset: '390px', top: '79%', opacity: 0.34, anim: 'floatSideA', duration: '5.4s', delay: '0.4s' },
  { id: 18, size: 70, side: 'right', offset: '130px', top: '43%', opacity: 0.30, anim: 'floatSideB', duration: '7.0s', delay: '1.7s' },
  { id: 19, size: 50, side: 'right', offset: '260px', top: '15%', opacity: 0.36, anim: 'floatSideC', duration: '6.8s', delay: '0.6s' },
  { id: 20, size: 88, side: 'right', offset: '40px',  top: '58%', opacity: 0.24, anim: 'floatSideD', duration: '8.6s', delay: '1.1s' },
]

interface ScreenFloatingLogo {
  id: number
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  opacity: number
  anim: string
  duration: string
  delay: string
}

// Top Zone Floating Logos (Above the brand header - few, well-spaced)
const TOP_FLOATING_LOGOS: ScreenFloatingLogo[] = [
  { id: 201, size: 28, top: '18px', left: '6%',  opacity: 0.38, anim: 'floatTopA', duration: '5.8s', delay: '0s' },
  { id: 202, size: 44, top: '14px', right: '10%', opacity: 0.35, anim: 'floatTopB', duration: '6.6s', delay: '0.7s' },
  { id: 203, size: 22, top: '62px', left: '44%', opacity: 0.42, anim: 'floatTopA', duration: '5.2s', delay: '1.2s' },
  { id: 204, size: 36, top: '60px', right: '5%', opacity: 0.36, anim: 'floatTopB', duration: '6.0s', delay: '0.4s' },
]

// Bottom Zone Floating Logos (Below the card & trust badge - few, varied sizes)
const BOTTOM_FLOATING_LOGOS: ScreenFloatingLogo[] = [
  { id: 301, size: 56, bottom: '18px', left: '5%',  opacity: 0.30, anim: 'floatBottomA', duration: '7.0s', delay: '0.3s' },
  { id: 302, size: 72, bottom: '16px', right: '6%', opacity: 0.28, anim: 'floatBottomB', duration: '7.6s', delay: '0.8s' },
  { id: 303, size: 30, bottom: '22px', left: '45%', opacity: 0.42, anim: 'floatBottomA', duration: '5.4s', delay: '1.4s' },
  { id: 304, size: 46, bottom: '80px', left: '12%', opacity: 0.36, anim: 'floatBottomB', duration: '6.2s', delay: '0.5s' },
  { id: 305, size: 38, bottom: '86px', right: '14%', opacity: 0.34, anim: 'floatBottomA', duration: '6.6s', delay: '1.9s' },
  { id: 306, size: 24, bottom: '88px', left: '38%', opacity: 0.44, anim: 'floatBottomB', duration: '5.0s', delay: '0.6s' },
]

export default function SuperAdminPortal() {
  const { login, user, token, isAuthenticated, logout } = useAuth()
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Login form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Global Floating background logos toggle (synced with backend API & cached in localStorage)
  const [floatingLogosEnabled, setFloatingLogosEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('wnc_login_floating_logos')
    return saved !== null ? saved === 'true' : true
  })
  const [isUpdatingFloatingLogos, setIsUpdatingFloatingLogos] = useState(false)

  // Fetch global setting from backend API on mount
  useEffect(() => {
    let isMounted = true
    const fetchGlobalSetting = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/settings/floating-logos`)
        if (isMounted && res.data && typeof res.data.enabled === 'boolean') {
          setFloatingLogosEnabled(res.data.enabled)
          localStorage.setItem('wnc_login_floating_logos', String(res.data.enabled))
        }
      } catch (err) {
        console.warn('Could not fetch global floating logos setting from server:', err)
      }
    }
    fetchGlobalSetting()
    return () => {
      isMounted = false
    }
  }, [API_BASE])

  const toggleFloatingLogos = async () => {
    if (isUpdatingFloatingLogos) return
    const next = !floatingLogosEnabled
    // Immediate optimistic update
    setFloatingLogosEnabled(next)
    localStorage.setItem('wnc_login_floating_logos', String(next))
    setIsUpdatingFloatingLogos(true)

    try {
      await axios.post(
        `${API_BASE}/api/settings/floating-logos`,
        { enabled: next },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      )
      showSuccessToast(`Global floating <w> logos turned ${next ? 'ON' : 'OFF'} for all visitors!`)
    } catch (err) {
      console.error('Failed to sync global setting with server:', err)
      // Rollback if server failed
      setFloatingLogosEnabled(!next)
      localStorage.setItem('wnc_login_floating_logos', String(!next))
      showErrorToast('Failed to update global setting on server. Please try again.')
    } finally {
      setIsUpdatingFloatingLogos(false)
    }
  }

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
      setAuthError('Please provide both email and password')
      return
    }

    setIsLoggingIn(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        showSuccessToast('Successfully signed in!')
      } else {
        const errorMsg = res.message || 'Invalid email or password'
        setAuthError(errorMsg)
        showErrorToast(errorMsg)
      }
    } catch (err: any) {
      const msg = err?.message || 'Unable to sign in. Please check your credentials.'
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

  // ================= UN-AUTHENTICATED: NATURAL PLATFORM SIGN IN SCREEN =================
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col justify-center items-center px-4 py-6 sm:py-8 relative selection:bg-[#ff9e7d] overflow-x-hidden">
        {/* Subtle Background Micro-Grid */}
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Smooth Floating Keyframes for Side Flanks & Top/Bottom Zones */}
        <style>{`
          @keyframes floatSideA {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            33% { transform: translateY(-38px) translateX(16px) rotate(8deg); }
            66% { transform: translateY(24px) translateX(-12px) rotate(-6deg); }
          }
          @keyframes floatSideB {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            33% { transform: translateY(35px) translateX(-16px) rotate(-8deg); }
            66% { transform: translateY(-28px) translateX(14px) rotate(6deg); }
          }
          @keyframes floatSideC {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            40% { transform: translateY(-44px) translateX(-14px) rotate(-9deg); }
            70% { transform: translateY(22px) translateX(16px) rotate(7deg); }
          }
          @keyframes floatSideD {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            40% { transform: translateY(38px) translateX(18px) rotate(9deg); }
            70% { transform: translateY(-24px) translateX(-12px) rotate(-7deg); }
          }
          @keyframes floatTopA {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            35% { transform: translateY(-10px) translateX(12px) rotate(7deg); }
            70% { transform: translateY(8px) translateX(-10px) rotate(-6deg); }
          }
          @keyframes floatTopB {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            35% { transform: translateY(10px) translateX(-12px) rotate(-7deg); }
            70% { transform: translateY(-8px) translateX(10px) rotate(6deg); }
          }
          @keyframes floatBottomA {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            35% { transform: translateY(-16px) translateX(14px) rotate(8deg); }
            70% { transform: translateY(14px) translateX(-12px) rotate(-7deg); }
          }
          @keyframes floatBottomB {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            35% { transform: translateY(16px) translateX(-14px) rotate(-8deg); }
            70% { transform: translateY(-14px) translateX(12px) rotate(7deg); }
          }
        `}</style>

        {/* Top-Left Back Button (Corner of Screen) */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-[#ff9e7d] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all"
          >
            <span>←</span>
            <span>Back</span>
          </Link>
        </div>

        {/* Top & Bottom Floating Logos — mobile only (sm:hidden on desktop) */}
        {floatingLogosEnabled && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 sm:hidden">
            {/* Top Zone Logos (Above the header, clear of back button) */}
            {TOP_FLOATING_LOGOS.map((item) => (
              <div
                key={item.id}
                className="absolute pointer-events-none select-none"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  opacity: item.opacity,
                  animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                  animationDelay: item.delay,
                }}
              >
                <img
                  src={onlyLogo}
                  alt=""
                  className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
                />
              </div>
            ))}

            {/* Bottom Zone Logos (In the wide empty space below the card & trust badge) */}
            {BOTTOM_FLOATING_LOGOS.map((item) => (
              <div
                key={item.id}
                className="absolute pointer-events-none select-none"
                style={{
                  bottom: item.bottom,
                  left: item.left,
                  right: item.right,
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  opacity: item.opacity,
                  animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                  animationDelay: item.delay,
                }}
              >
                <img
                  src={onlyLogo}
                  alt=""
                  className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
                />
              </div>
            ))}
          </div>
        )}

        {/* Centered Sign In Form Container */}
        <div className="w-full max-w-md sm:max-w-lg relative z-10 flex flex-col items-start">
          {/* Desktop Floating Logos hugging Left and Right of the Box (hidden on mobile) */}
          {floatingLogosEnabled &&
            FLOATING_LOGOS.map((item) => (
              <div
                key={item.id}
                className="absolute pointer-events-none select-none z-0 hidden sm:block"
                style={{
                  top: item.top,
                  ...(item.side === 'left'
                    ? { right: `calc(100% + ${item.offset})` }
                    : { left: `calc(100% + ${item.offset})` }),
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  opacity: item.opacity,
                  animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                  animationDelay: item.delay,
                }}
              >
                <img
                  src={onlyLogo}
                  alt=""
                  className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
                />
              </div>
            ))}

          {/* Logo & Brand Header - Left aligned with card boundary */}
          <div className="w-full text-left mb-6 relative z-20">
            <div className="mb-3.5 inline-block hover:translate-y-[-1px] transition-transform">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900 uppercase leading-tight mt-1">
              Sign In
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base font-mono font-bold text-slate-600">
              Welcome back! Please enter your credentials to continue.
            </p>
          </div>

          {/* Form Card (Taller / Elongated with Generous Vertical Space, Solid z-20 Above Particles) */}
          <div className="w-full bg-white border-2 border-slate-900 rounded-2xl p-8 sm:p-12 py-10 sm:py-14 shadow-[6px_6px_0px_0px_#0f172a] min-h-[420px] sm:min-h-[460px] flex flex-col justify-center relative z-20">
            {authError && (
              <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs sm:text-sm font-mono font-bold rounded-xl flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#e11d48]">
                <span>✕</span>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-6 sm:space-y-7">
              {/* Email Input */}
              <div>
                <label className="block text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-slate-800 mb-2.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-[#fcfcfd] border-2 border-slate-900 rounded-xl text-sm sm:text-base text-slate-900 font-bold font-mono shadow-[2px_2px_0px_0px_#000] focus:bg-white focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none transition-all"
                />
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <label className="block text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-slate-800 mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pr-16 bg-[#fcfcfd] border-2 border-slate-900 rounded-xl text-sm sm:text-base text-slate-900 font-bold font-mono shadow-[2px_2px_0px_0px_#000] focus:bg-white focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 font-mono text-xs font-black uppercase px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 rounded-lg cursor-pointer transition-colors select-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 sm:py-4.5 bg-[#ff9e7d] hover:bg-[#ff8a65] border-2 border-slate-900 text-slate-900 font-mono font-black uppercase tracking-wider text-sm sm:text-base rounded-xl shadow-[4px_4px_0px_0px_#0f172a] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#0f172a] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></span>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security & System Trust Badge */}
          <div className="mt-4 text-center w-full relative z-20">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-3.5 py-1 rounded-full shadow-xs">
              <span className="text-emerald-600">●</span>
              <span>256-Bit Encrypted Secure Connection • Web n Code</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ================= AUTHENTICATED: LIGHT NEO-BRUTALIST SUPERADMIN PORTAL =================
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col md:flex-row relative selection:bg-[#ff9e7d]">
      {/* Background Dot Grid */}
      <div
        className="fixed inset-0 opacity-[0.09] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Mobile Top Header Bar (Only on small screens) */}
      <div className="md:hidden bg-[#ebebeb] border-b-2 border-slate-900 p-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src={onlyLogo} alt="Web n Code" className="h-7 w-auto object-contain" />
          <span className="rounded border border-slate-900 bg-amber-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-[1px_1px_0px_0px_#000]">
            SUPERADMIN
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-xs font-mono font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          {sidebarOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </div>

      {/* ================= DEDICATED LEFT SIDEBAR (EXTENDS TO TOP: md:h-screen md:sticky md:top-0) ================= */}
      <aside
        className={`${
          sidebarOpen
            ? 'fixed inset-0 z-50 flex flex-col justify-between w-full bg-[#ebebeb] border-r-2 border-slate-900 p-5 overflow-y-auto'
            : 'hidden'
        } md:flex md:flex-col md:justify-between md:w-72 md:shrink-0 md:bg-[#ebebeb] md:border-r-2 md:border-slate-900 md:p-5 md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto`}
      >
        <div>
          {/* Top Brand: Just the <w> Logo - no overflowing text */}
          <div className="pb-4 mb-5 border-b-2 border-slate-900/20 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src={onlyLogo}
                alt="Web n Code"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="px-2 py-0.5 rounded border border-slate-900 bg-amber-300 text-[10px] font-mono font-black shadow-[1.5px_1.5px_0px_0px_#000]">
                SUPERADMIN
              </span>
            </Link>

            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-xs font-mono font-black shadow-[1.5px_1.5px_0px_0px_#000]"
              >
                ✕ Close
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2.5">
            {/* 1. Client Enquiries / Leads */}
            <button
              onClick={() => {
                setActiveTab('contacts')
                fetchContacts()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all border-2 border-slate-900 cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-[#ff9e7d] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                  : 'bg-white text-slate-800 hover:bg-[#ffedd5] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📬</span>
                <span>Client Leads</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                  activeTab === 'contacts'
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#fefce8] text-slate-900'
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all border-2 border-slate-900 cursor-pointer ${
                activeTab === 'careers'
                  ? 'bg-[#c084fc] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                  : 'bg-white text-slate-800 hover:bg-[#f3e8ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👥</span>
                <span>Applications</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                  activeTab === 'careers'
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#fefce8] text-slate-900'
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
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all border-2 border-slate-900 cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#7dd3fc] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                  : 'bg-white text-slate-800 hover:bg-[#e0f2fe] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
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
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all border-2 border-slate-900 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-[#86efac] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                  : 'bg-white text-slate-800 hover:bg-[#dcfce7] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📁</span>
                <span>Projects</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 bg-white text-slate-900">
                {projects.length}
              </span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider text-slate-700 bg-white border-2 border-slate-900/40 hover:border-slate-900 hover:bg-white transition-all mt-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
            >
              <span>🌐</span>
              <span>Public Website ↗</span>
            </Link>

            {/* Floating Logos Toggle in SuperAdmin Sidebar */}
            <div className="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] mt-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                    Login Visuals (Global)
                  </div>
                  <div className="text-xs font-mono font-black text-slate-900">
                    &lt;w&gt; Floating Logos
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleFloatingLogos}
                  disabled={isUpdatingFloatingLogos}
                  className={`px-3 py-1 rounded-lg border-2 border-slate-900 font-mono text-xs font-black uppercase transition-all shadow-[1px_1px_0px_0px_#000] cursor-pointer disabled:opacity-60 ${
                    floatingLogosEnabled
                      ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-500'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {isUpdatingFloatingLogos ? '...' : floatingLogosEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="pt-4 mt-6 border-t-2 border-slate-900/20 space-y-3">
          <div className="p-3.5 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-black mb-0.5">
              Logged In As
            </div>
            <div className="text-xs font-mono font-black text-slate-900 truncate">
              {user.name}
            </div>
            <div className="text-[11px] font-mono text-slate-600 truncate">{user.email}</div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white border-2 border-slate-900 rounded-lg font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] transition-all cursor-pointer"
          >
            Sign Out / Exit
          </button>
        </div>
      </aside>

      {/* ================= RIGHT AREA: TOP NAVBAR + MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="hidden md:flex sticky top-0 z-30 bg-[#ebebeb] border-b-2 border-slate-900 px-6 py-3 items-center justify-between shadow-[0_2px_0_0_#000]">
          {/* Left: Breadcrumb / Active Status */}
          <div className="flex items-center gap-3">
            <span className="rounded border-2 border-slate-900 bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-[1.5px_1.5px_0px_0px_#000]">
              CONSOLE
            </span>
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-tight text-slate-900">
              {activeTab === 'contacts' && '📬 Client Enquiries & Leads'}
              {activeTab === 'careers' && '👥 Job Applications & Resumes'}
              {activeTab === 'create' && (editingProjectId ? '✏️ Edit Project' : '⚡ Add New Project')}
              {activeTab === 'manage' && '📁 Projects Directory'}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-600 pl-3 border-l-2 border-slate-900/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>

          {/* Right: Quick Floating Logos Toggle + Public Site + User + Sign Out */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleFloatingLogos}
              disabled={isUpdatingFloatingLogos}
              className={`px-3 py-1.5 border-2 border-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-60 ${
                floatingLogosEnabled
                  ? 'bg-amber-300 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              title="Toggle floating <w> logos globally for all visitors"
            >
              <span>
                {isUpdatingFloatingLogos
                  ? '⏳ Saving...'
                  : floatingLogosEnabled
                  ? '✨ <w> Logos: ON'
                  : '⚪ <w> Logos: OFF'}
              </span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-lg font-mono text-xs font-black uppercase text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all"
            >
              <span>🌐</span>
              <span>Public Site ↗</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000]">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div className="text-xs font-mono font-black text-slate-900 truncate max-w-[130px]">
                {user.name}
              </div>
            </div>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white border-2 border-slate-900 rounded-lg font-mono text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] active:translate-y-[2px] transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>


      {/* ================= MAIN CONTENT AREA (LIGHT NEO-BRUTALIST) ================= */}
      <main className="flex-1 p-4 sm:p-7 lg:p-10 overflow-y-auto max-w-6xl relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-slate-900">
          <div>
            <span className="rounded border-2 border-slate-900 bg-white px-3 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#0f172a]">
              SUPERADMIN DASHBOARD
            </span>

            <h1 className="mt-2 text-2xl sm:text-4xl font-black font-mono uppercase tracking-tight text-slate-900 flex items-center gap-3">
              {activeTab === 'contacts' && 'Client Enquiries & Leads'}
              {activeTab === 'careers' && 'Job Applications & Resumes'}
              {activeTab === 'create' && (editingProjectId ? 'Edit Project' : 'Project Studio')}
              {activeTab === 'manage' && 'Projects Directory'}
            </h1>
            <p className="text-xs sm:text-sm font-mono font-bold text-slate-600 mt-1">
              {activeTab === 'contacts' &&
                `Real-time lead messages received from website visitors (${contacts.length} total)`}
              {activeTab === 'careers' &&
                `Job applications, candidate profiles & PDF resumes submitted (${applications.length} total)`}
              {activeTab === 'create' &&
                'Create and publish projects with automated ImageKit cloud hosting'}
              {activeTab === 'manage' && `Managing all ${projects.length} portfolio items`}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Quick Floating Logos Toggle Button */}
            <button
              type="button"
              onClick={toggleFloatingLogos}
              disabled={isUpdatingFloatingLogos}
              className={`px-3 py-1.5 border-2 border-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-60 ${
                floatingLogosEnabled
                  ? 'bg-amber-300 text-slate-950 hover:bg-amber-400'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              title="Toggle floating <w> logos globally for all visitors"
            >
              <span>
                {isUpdatingFloatingLogos
                  ? '⏳ Saving...'
                  : floatingLogosEnabled
                  ? '✨ <w> Logos (Global): ON'
                  : '⚪ <w> Logos (Global): OFF'}
              </span>
            </button>

            <span className="px-3.5 py-1.5 bg-emerald-100 border-2 border-slate-900 text-emerald-950 font-mono text-xs font-black rounded-lg flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Connected & Live
            </span>
          </div>
        </div>

        {/* ================= TAB 1: CLIENT ENQUIRIES / LEADS ================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {/* Filter & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search by client name, email, phone or message keywords..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                />
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
                {contactSearch && (
                  <button
                    onClick={() => setContactSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchContacts}
                  className="px-4 py-2.5 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  🔄 Refresh Leads
                </button>
              </div>
            </div>

            {/* Leads List */}
            {isLoadingContacts ? (
              <div className="py-20 text-center text-slate-600 font-mono text-sm font-bold">
                Fetching latest inquiries...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-12 text-center font-mono shadow-[4px_4px_0px_0px_#0f172a]">
                <div className="text-4xl mb-3">📬</div>
                <h3 className="text-base font-black text-slate-900 uppercase">No Enquiries Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
                  {contactSearch
                    ? 'No enquiries match your search query.'
                    : 'When visitors fill out the Contact Us form on your website, their messages will immediately appear here!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredContacts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#0f172a] transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-slate-900/15">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#7dd3fc] text-slate-900 font-black font-mono flex items-center justify-center text-base shrink-0 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-mono font-black text-slate-900 uppercase tracking-tight">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 font-bold mt-0.5">
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
                            className="px-3.5 py-1.5 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 font-mono text-xs font-black uppercase rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        )}

                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${item.email}?subject=Web%20n%20Code%20Technologies%20-%20Enquiry%20Response`}
                          className="px-3 py-1.5 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all"
                        >
                          <span>✉️ Email</span>
                        </a>

                        <button
                          onClick={() => handleDeleteContact(item._id, item.name)}
                          className="px-2.5 py-1.5 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 font-mono text-xs font-bold rounded-lg transition-all cursor-pointer"
                          title="Delete Enquiry"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Contact Info Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">
                          Client Email
                        </span>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-slate-900 font-bold hover:text-[#ff9e7d] transition-colors"
                        >
                          {item.email}
                        </a>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">
                          Phone Number
                        </span>
                        <a
                          href={`tel:${item.phone}`}
                          className="text-slate-900 font-bold hover:text-[#ff9e7d] transition-colors"
                        >
                          {item.phone}
                        </a>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="p-4 bg-[#fefce8] border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                      <span className="text-[10px] font-mono uppercase font-black tracking-wider text-amber-800 block mb-1">
                        Client Message / Project Requirements:
                      </span>
                      <p className="text-sm font-mono text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">
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
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border-2 border-slate-900 p-4 rounded-xl shadow-[4px_4px_0px_0px_#0f172a]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={careerSearch}
                  onChange={(e) => setCareerSearch(e.target.value)}
                  placeholder="Search candidate name, email, mobile, position, company..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                />
                <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
                {careerSearch && (
                  <button
                    onClick={() => setCareerSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={careerFilterPosition}
                  onChange={(e) => setCareerFilterPosition(e.target.value)}
                  className="px-3 py-2.5 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer outline-none"
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
                  className="px-4 py-2.5 bg-[#c084fc] hover:bg-[#a855f7] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Applications List */}
            {isLoadingApplications ? (
              <div className="py-20 text-center text-slate-600 font-mono text-sm font-bold">
                Loading applicant records...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-12 text-center font-mono shadow-[4px_4px_0px_0px_#0f172a]">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-base font-black text-slate-900 uppercase">No Applications Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
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
                    className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#0f172a] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#0f172a] transition-all"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-slate-900/15">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-3 py-1 bg-[#c084fc] text-slate-900 font-mono font-black text-xs uppercase rounded-md border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]">
                            {app.position}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#fafafa] border-2 border-slate-900/30 text-slate-800 font-mono text-[11px] font-bold rounded">
                            Exp: {app.experience}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#fafafa] border-2 border-slate-900/30 text-slate-800 font-mono text-[11px] font-bold rounded">
                            Notice: {app.noticePeriod}
                          </span>
                        </div>

                        <h3 className="text-xl font-mono font-black text-slate-900 uppercase">
                          {app.fullName}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-600 font-bold mt-1">
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
                            className="px-3.5 py-2 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 font-mono text-xs font-black uppercase rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-all"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        )}

                        {app.mobile && (
                          <a
                            href={`tel:${app.mobile}`}
                            className="px-3 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000]"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${app.email}?subject=Web%20n%20Code%20Application%20Update%20-%20${encodeURIComponent(app.position)}`}
                          className="px-3 py-2 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000]"
                        >
                          <span>✉️ Email</span>
                        </a>

                        <button
                          onClick={() => handleDeleteApplication(app._id, app.fullName)}
                          className="px-3 py-2 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 font-mono text-xs font-bold rounded-lg cursor-pointer"
                          title="Delete Application"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Contact & Links Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">Email</span>
                        <a href={`mailto:${app.email}`} className="text-slate-900 font-bold truncate block hover:underline">
                          {app.email}
                        </a>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">Mobile</span>
                        <a href={`tel:${app.mobile}`} className="text-slate-900 font-bold block hover:underline">
                          {app.mobile}
                        </a>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">Current Company</span>
                        <span className="text-slate-900 font-bold truncate block">
                          {app.currentCompany || 'N/A'} {app.currentRole ? `(${app.currentRole})` : ''}
                        </span>
                      </div>

                      <div className="p-3 bg-[#fafafa] rounded-xl border-2 border-slate-900/30 font-mono text-xs">
                        <span className="text-slate-500 uppercase block font-black text-[10px]">Academic Details</span>
                        <span className="text-slate-900 font-bold truncate block">
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
                          className="px-3 py-1 bg-white hover:bg-[#7dd3fc] border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-colors"
                        >
                          <span>🔗 LinkedIn Profile ↗</span>
                        </a>
                      )}
                      {app.github && (
                        <a
                          href={app.github.startsWith('http') ? app.github : `https://${app.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-white hover:bg-slate-200 border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-colors"
                        >
                          <span>🐙 GitHub Profile ↗</span>
                        </a>
                      )}
                      {app.portfolio && (
                        <a
                          href={app.portfolio.startsWith('http') ? app.portfolio : `https://${app.portfolio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-white hover:bg-[#c084fc] border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 transition-colors"
                        >
                          <span>🎨 Portfolio Website ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Product Builder Responses */}
                    <div className="space-y-3 p-4 bg-[#f8fafc] border-2 border-slate-900 rounded-xl font-mono text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                      <div>
                        <span className="text-slate-500 font-black uppercase text-[10px] block">
                          Built a Software Product Before?
                        </span>
                        <span className="text-slate-900 font-black text-sm">{app.builtProduct || 'N/A'}</span>
                      </div>

                      {app.projectLinks && (
                        <div>
                          <span className="text-slate-500 font-black uppercase text-[10px] block">
                            Project Links:
                          </span>
                          <p className="text-slate-800 font-semibold whitespace-pre-wrap">{app.projectLinks}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-slate-500 font-black uppercase text-[10px] block">
                          Why join Web n Code?
                        </span>
                        <p className="text-slate-800 font-semibold whitespace-pre-wrap leading-relaxed">
                          {app.whyJoin}
                        </p>
                      </div>
                    </div>

                    {/* Resume Card with Direct Download/View Link */}
                    <div className="mt-4 pt-4 border-t-2 border-slate-900/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-700 font-bold">
                        <span className="text-base">📄</span>
                        <span>Candidate Resume:</span>
                        <span className="text-slate-900 underline">{app.resumeName || 'resume.pdf'}</span>
                      </div>

                      <div>
                        {app.resumeUrl ? (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#ff9e7d] hover:bg-[#ff8a65] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 transition-all cursor-pointer"
                          >
                            <span>📥 View / Download Resume (PDF) ↗</span>
                          </a>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-600 border-2 border-slate-900/40 bg-[#fafafa] px-3 py-1.5 rounded-lg font-bold">
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

        {/* ================= TAB 3: CREATE / EDIT PROJECT STUDIO (LIGHT THEME) ================= */}
        {activeTab === 'create' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-900/15">
              <div>
                <h2 className="text-xl sm:text-2xl font-mono font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  {editingProjectId ? (
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
                <p className="text-xs font-mono font-bold text-slate-600 mt-1">
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
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                  >
                    ✕ Cancel Edit
                  </button>
                )}
                <span className="hidden sm:inline-block px-3 py-1 bg-[#7dd3fc] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                  CDN: ImageKit.io
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. FeeFollowup SaaS"
                    className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-700 mb-2">
                    Industry / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none font-mono cursor-pointer"
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
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-700 mb-2">
                  Short Summary (One-liner card description) *
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Comprehensive Automated Fee Follow-up & Transport Logistics for Educational Institutes."
                  className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-700 mb-2">
                  Full Description / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of the project architecture, problem solved, workflow, and technology..."
                  className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-700 mb-2">
                  Live Demo / Website Link (Optional)
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://feefollowup.com or demo link"
                  className="w-full px-4 py-3 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm font-bold text-slate-900 focus:bg-white shadow-[2px_2px_0px_0px_#000] outline-none font-mono"
                />
              </div>

              {/* Key Features */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black font-mono uppercase tracking-wider text-slate-700">
                    Key Features / Capabilities
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureInput}
                    className="text-xs font-mono font-bold text-blue-700 hover:underline cursor-pointer"
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
                        className="flex-1 px-3.5 py-2.5 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-sm text-slate-900 font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureInput(idx)}
                          className="px-3 bg-rose-100 border-2 border-rose-600 text-rose-900 rounded-lg text-xs font-mono font-bold hover:bg-rose-200 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
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
                <div className="p-4 bg-[#fafafa] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
                  <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-900 mb-2">
                    Current ImageKit Images ({existingImages.length})
                  </label>
                  <p className="text-xs font-mono text-slate-600 mb-3 font-bold">
                    Click ✕ on any image you want to remove:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {existingImages.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative group border-2 border-slate-900 rounded-lg overflow-hidden bg-slate-100 aspect-video flex items-center justify-center shadow-[2px_2px_0px_0px_#000]"
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
              <div className="border-2 border-dashed border-slate-900 rounded-xl p-6 bg-[#fafafa]">
                <label className="block text-xs font-black font-mono uppercase tracking-wider text-slate-900 mb-1">
                  📸 {editingProjectId ? 'Upload Additional Screenshots (ImageKit)' : 'Project Screenshots (Saved directly to ImageKit CDN)'}
                </label>
                <p className="text-xs font-mono text-slate-600 mb-4 font-bold">
                  Select screenshots or UI mockups (.png, .jpg, .webp).
                </p>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-xs font-mono text-slate-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-2 file:border-slate-900 file:text-xs file:font-black file:font-mono file:uppercase file:bg-[#7dd3fc] file:text-slate-900 hover:file:bg-[#38bdf8] file:shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                />

                {previewUrls.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewUrls.map((url, i) => (
                      <div
                        key={i}
                        className="relative group border-2 border-slate-900 rounded-xl overflow-hidden bg-white aspect-video flex items-center justify-center shadow-[3px_3px_0px_0px_#000]"
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
                <div className="p-3.5 bg-cyan-50 border-2 border-cyan-500 rounded-xl text-xs font-mono font-bold text-cyan-900 animate-pulse flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  {uploadProgress}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingProject}
                className="w-full py-4 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono font-black uppercase tracking-wider text-sm rounded-lg shadow-[4px_4px_0px_0px_#0f172a] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0f172a] transition-all disabled:opacity-50 cursor-pointer"
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

        {/* ================= TAB 4: MANAGE PROJECTS ARCHIVE (LIGHT THEME) ================= */}
        {activeTab === 'manage' && (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-900/15">
              <h2 className="text-xl sm:text-2xl font-mono font-black uppercase tracking-tight text-slate-900">
                All Projects ({projects.length})
              </h2>
              <button
                onClick={fetchProjects}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                🔄 Refresh
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="py-12 text-center text-slate-600 font-mono text-sm font-bold">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center font-mono">
                <p className="text-slate-600 text-sm mb-4 font-bold">No custom projects added yet.</p>
                <button
                  onClick={() => {
                    resetProjectForm()
                    setActiveTab('create')
                  }}
                  className="px-4 py-2.5 bg-[#7dd3fc] hover:bg-[#38bdf8] text-slate-900 font-black text-xs uppercase rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] cursor-pointer"
                >
                  + Add Your First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    className="bg-[#fafafa] border-2 border-slate-900 rounded-xl p-4 flex flex-col justify-between shadow-[4px_4px_0px_0px_#0f172a] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#0f172a] transition-all"
                  >
                    <div>
                      {proj.images && proj.images.length > 0 ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 border-2 border-slate-900 bg-white">
                          <img
                            src={proj.images[0]}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-lg bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-slate-600 font-mono text-xs font-bold mb-3">
                          No Image Uploaded
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 bg-[#ff9e7d] border-2 border-slate-900 text-slate-900 font-mono text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000]">
                          {proj.category}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 font-bold">
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 font-mono uppercase">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-mono font-medium">
                        {proj.shortDescription}
                      </p>

                      {proj.images && proj.images.length > 0 && (
                        <div className="mt-2 text-[10px] font-mono text-slate-700 flex items-center gap-1 font-bold">
                          <span className="text-emerald-700">✓ ImageKit CDN:</span>
                          <span className="truncate max-w-[180px] text-slate-500">
                            {proj.images[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-slate-900/15 flex items-center justify-between gap-2">
                      <Link
                        to={`/products/${proj.slug}`}
                        target="_blank"
                        className="text-xs font-mono font-black text-blue-700 hover:underline"
                      >
                        View Live ↗
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(proj)}
                          className="px-3 py-1.5 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-1 cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id, proj.title)}
                          className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 border-2 border-rose-600 text-rose-900 font-mono text-xs font-bold rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer"
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
    </div>
  )
}
