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

interface DeveloperItem {
  _id: string
  name: string
  role: string
  bio: string
  image: string
  hoverImage?: string
  location?: string
  flag?: string
  team?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  email?: string
  order?: number
  createdAt?: string
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
  const [activeTab, setActiveTab] = useState<'contacts' | 'careers' | 'developers' | 'create' | 'manage'>('contacts')

  // Developers state
  const [developers, setDevelopers] = useState<DeveloperItem[]>([])
  const [isLoadingDevelopers, setIsLoadingDevelopers] = useState(false)
  const [developerSearch, setDeveloperSearch] = useState('')
  const [editingDeveloperId, setEditingDeveloperId] = useState<string | null>(null)
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
  const [isSubmittingDeveloper, setIsSubmittingDeveloper] = useState(false)
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)

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
      fetchDevelopers()
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

  const fetchDevelopers = async () => {
    setIsLoadingDevelopers(true)
    try {
      const res = await axios.get(`${API_BASE}/api/developers`)
      if (res.data?.success) {
        setDevelopers(res.data.data || [])
      }
    } catch (err) {
      console.error('Error loading developers:', err)
    } finally {
      setIsLoadingDevelopers(false)
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

  // Filtered developers
  const filteredDevelopers = developers.filter((d) => {
    const q = developerSearch.toLowerCase().trim()
    if (!q) return true
    return (
      d.name.toLowerCase().includes(q) ||
      d.role.toLowerCase().includes(q) ||
      d.bio.toLowerCase().includes(q) ||
      (d.location && d.location.toLowerCase().includes(q))
    )
  })

  // ================= DEVELOPER MANAGEMENT HANDLERS =================
  const handleOpenAddDeveloper = () => {
    setEditingDeveloperId(null)
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
    setShowDeveloperModal(true)
  }

  const handleEditDeveloper = (dev: DeveloperItem) => {
    setEditingDeveloperId(dev._id)
    setDevName(dev.name)
    setDevRole(dev.role)
    setDevBio(dev.bio)
    setDevLocation(dev.location || 'JAIPUR, INDIA')
    setDevTeam(dev.team || 'WnC TEAM')
    setDevLinkedin(dev.linkedin || '')
    setDevGithub(dev.github || '')
    setDevTwitter(dev.twitter || '')
    setDevInstagram(dev.instagram || '')
    setDevEmail(dev.email || '')
    setDevPhotoFile(null)
    setDevPhotoPreview(dev.image || '')
    setShowDeveloperModal(true)
  }

  const handleSaveDeveloper = async (e: FormEvent) => {
    e.preventDefault()
    if (!devName.trim() || !devRole.trim() || !devBio.trim()) {
      showErrorToast('Name, Role, and Bio are required')
      return
    }

    try {
      setIsSubmittingDeveloper(true)
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

      if (devPhotoFile) {
        formData.append('photo', devPhotoFile)
      } else if (devPhotoPreview && !devPhotoPreview.startsWith('blob:')) {
        formData.append('imageUrl', devPhotoPreview)
      }

      if (editingDeveloperId) {
        await axios.put(`${API_BASE}/api/developers/${editingDeveloperId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        showSuccessToast('Developer updated successfully!')
      } else {
        await axios.post(`${API_BASE}/api/developers`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        })
        showSuccessToast('Developer added! Now live on About page.')
      }

      setShowDeveloperModal(false)
      fetchDevelopers()
    } catch (err: any) {
      console.error('Error saving developer:', err)
      showErrorToast(err.response?.data?.message || 'Failed to save developer')
    } finally {
      setIsSubmittingDeveloper(false)
    }
  }

  const handleDeleteDeveloper = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) {
      return
    }
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

            {/* 3. Developers & Team (NEW) */}
            <button
              onClick={() => {
                setActiveTab('developers')
                fetchDevelopers()
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-mono text-xs font-black uppercase tracking-wider transition-all border-2 border-slate-900 cursor-pointer ${
                activeTab === 'developers'
                  ? 'bg-[#fde047] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                  : 'bg-white text-slate-800 hover:bg-[#fefce8] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👨‍💻</span>
                <span>Developers</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-900 ${
                  activeTab === 'developers'
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#fefce8] text-slate-900'
                }`}
              >
                {developers.length}
              </span>
            </button>

            {/* 4. Add Project */}
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
              {activeTab === 'developers' && '👨‍💻 Developers & Team'}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-slate-900">
          <div>
            <span className="rounded border-2 border-slate-900 bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono shadow-[1.5px_1.5px_0px_0px_#0f172a]">
              SUPERADMIN DASHBOARD
            </span>

            <h1 className="mt-1.5 text-xl sm:text-3xl font-black font-mono uppercase tracking-tight text-slate-900 flex items-center gap-2.5">
              {activeTab === 'contacts' && 'Client Enquiries & Leads'}
              {activeTab === 'careers' && 'Job Applications & Resumes'}
              {activeTab === 'developers' && 'Our Developers & Team'}
              {activeTab === 'create' && (editingProjectId ? 'Edit Project' : 'Project Studio')}
              {activeTab === 'manage' && 'Projects Directory'}
            </h1>
            <p className="text-xs font-mono font-bold text-slate-600 mt-0.5">
              {activeTab === 'contacts' &&
                `Real-time lead messages received from website visitors (${contacts.length} total)`}
              {activeTab === 'careers' &&
                `Job applications, candidate profiles & PDF resumes submitted (${applications.length} total)`}
              {activeTab === 'developers' &&
                `Manage team members showcased live on the About Us page (${developers.length} total)`}
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

        {/* ================= COMPACT QUICK KPI STATS BAR ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('contacts')}
            className={`p-3 rounded-xl border-2 border-slate-900 transition-all text-left cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-[#ff9e7d] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-[#fff7ed] shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-slate-700 uppercase">Leads</span>
              <span className="text-sm">📬</span>
            </div>
            <div className="mt-1 text-2xl font-mono font-black text-slate-950">
              {contacts.length}
            </div>
            <div className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">
              Client Enquiries
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('careers')}
            className={`p-3 rounded-xl border-2 border-slate-900 transition-all text-left cursor-pointer ${
              activeTab === 'careers'
                ? 'bg-[#c084fc] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-[#faf5ff] shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-slate-700 uppercase">Applicants</span>
              <span className="text-sm">👥</span>
            </div>
            <div className="mt-1 text-2xl font-mono font-black text-slate-950">
              {applications.length}
            </div>
            <div className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">
              Job Resumes
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('developers')}
            className={`p-3 rounded-xl border-2 border-slate-900 transition-all text-left cursor-pointer ${
              activeTab === 'developers'
                ? 'bg-[#fde047] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-[#fefce8] shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-slate-700 uppercase">Developers</span>
              <span className="text-sm">👨‍💻</span>
            </div>
            <div className="mt-1 text-2xl font-mono font-black text-slate-950">
              {developers.length}
            </div>
            <div className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">
              Live on /about
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`p-3 rounded-xl border-2 border-slate-900 transition-all text-left cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-[#86efac] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-[#f0fdf4] shadow-[2px_2px_0px_0px_#000]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-slate-700 uppercase">Projects</span>
              <span className="text-sm">📁</span>
            </div>
            <div className="mt-1 text-2xl font-mono font-black text-slate-950">
              {projects.length}
            </div>
            <div className="text-[10px] font-mono text-slate-600 font-bold mt-0.5">
              Portfolio Items
            </div>
          </button>
        </div>

        {/* ================= TAB 1: CLIENT ENQUIRIES / LEADS (COMPACT DENSE) ================= */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {/* Filter & Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search leads by name, email, phone, requirements..."
                  className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                />
                <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
                {contactSearch && (
                  <button
                    onClick={() => setContactSearch('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-500 hidden sm:inline">
                  Showing {filteredContacts.length} of {contacts.length}
                </span>
                <button
                  onClick={fetchContacts}
                  className="px-3 py-2 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Leads List */}
            {isLoadingContacts ? (
              <div className="py-14 text-center text-slate-600 font-mono text-xs font-bold">
                Fetching latest inquiries...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center font-mono shadow-[3px_3px_0px_0px_#0f172a]">
                <div className="text-3xl mb-2">📬</div>
                <h3 className="text-sm font-black text-slate-900 uppercase">No Enquiries Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
                  {contactSearch
                    ? 'No enquiries match your search query.'
                    : 'When visitors fill out the Contact form on your website, leads will appear here immediately!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredContacts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
                  >
                    {/* Header Row: Avatar, Name, Date, Quick Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-900/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#ff9e7d] text-slate-900 font-black font-mono flex items-center justify-center text-xs shrink-0 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-mono font-black text-slate-900 uppercase tracking-tight">
                              {item.name}
                            </h3>
                            <span className="text-[10px] font-mono text-slate-500 font-bold">
                              {new Date(item.createdAt).toLocaleString([], {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-700 mt-0.5">
                            <span className="font-bold">📧 {item.email}</span>
                            {item.phone && (
                              <>
                                <span className="text-slate-400">•</span>
                                <span className="font-bold">📱 {item.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Communication Actions */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                        {item.phone && (
                          <a
                            href={getWhatsAppLink(item.phone, item.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 font-mono text-[11px] font-black uppercase rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        )}

                        {item.phone && (
                          <a
                            href={`tel:${item.phone}`}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${item.email}?subject=Web%20n%20Code%20Technologies%20-%20Enquiry%20Response`}
                          className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                        >
                          <span>✉️ Email</span>
                        </a>

                        <button
                          onClick={() => handleDeleteContact(item._id, item.name)}
                          className="px-2 py-1 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 font-mono text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                          title="Delete Lead"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Compact Message Box */}
                    <div className="mt-2.5 p-2.5 bg-[#fefce8] border border-slate-900/50 rounded-lg">
                      <div className="text-[10px] font-mono uppercase font-black tracking-wider text-amber-800 mb-0.5">
                        Requirements / Message:
                      </div>
                      <p className="text-xs font-mono text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: JOB APPLICATIONS & RESUMES (COMPACT DENSE) ================= */}
        {activeTab === 'careers' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={careerSearch}
                  onChange={(e) => setCareerSearch(e.target.value)}
                  placeholder="Search candidate name, email, mobile, position, company..."
                  className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
                />
                <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
                {careerSearch && (
                  <button
                    onClick={() => setCareerSearch('')}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={careerFilterPosition}
                  onChange={(e) => setCareerFilterPosition(e.target.value)}
                  className="px-2.5 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer outline-none"
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
                  className="px-3 py-2 bg-[#c084fc] hover:bg-[#a855f7] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Applications List */}
            {isLoadingApplications ? (
              <div className="py-14 text-center text-slate-600 font-mono text-xs font-bold">
                Loading applicant records...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center font-mono shadow-[3px_3px_0px_0px_#0f172a]">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-sm font-black text-slate-900 uppercase">No Applications Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
                  {careerSearch || careerFilterPosition !== 'All'
                    ? 'No candidates match your filters.'
                    : 'Applications submitted through /careers will show up here along with their experience, builder answers, and resume PDFs!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredApplications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
                  >
                    {/* Header Row: Name, Position, Experience, Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-900/20">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#c084fc] text-slate-900 font-mono font-black text-[10px] uppercase rounded border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                            {app.position}
                          </span>
                          <h3 className="text-base font-mono font-black text-slate-900 uppercase">
                            {app.fullName}
                          </h3>
                          <span className="px-1.5 py-0.5 bg-[#fafafa] border border-slate-900/40 text-slate-700 font-mono text-[10px] font-bold rounded">
                            Exp: {app.experience}
                          </span>
                          <span className="px-1.5 py-0.5 bg-[#fafafa] border border-slate-900/40 text-slate-700 font-mono text-[10px] font-bold rounded">
                            Notice: {app.noticePeriod}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-600 font-bold mt-1">
                          <span>📍 {app.city}, {app.state}</span>
                          <span>•</span>
                          <span>Gender: {app.gender}</span>
                          <span>•</span>
                          <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Direct Actions */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {app.mobile && (
                          <a
                            href={getWhatsAppLink(app.mobile, app.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 font-mono text-[11px] font-black uppercase rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                          >
                            <span>💬 WhatsApp</span>
                          </a>
                        )}

                        {app.mobile && (
                          <a
                            href={`tel:${app.mobile}`}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]"
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${app.email}?subject=Web%20n%20Code%20Application%20Update%20-%20${encodeURIComponent(app.position)}`}
                          className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]"
                        >
                          <span>✉️ Email</span>
                        </a>

                        {app.resumeUrl && (
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#ff9e7d] hover:bg-[#ff8a65] border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                          >
                            <span>📥 PDF Resume ↗</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleDeleteApplication(app._id, app.fullName)}
                          className="px-2 py-1 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 font-mono text-[11px] font-bold rounded-lg cursor-pointer"
                          title="Delete Application"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Compact Contact & Candidate Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-2.5 font-mono text-[11px]">
                      <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                        <span className="text-slate-500 uppercase block font-black text-[9px]">Email</span>
                        <a href={`mailto:${app.email}`} className="text-slate-900 font-bold truncate block hover:underline">
                          {app.email}
                        </a>
                      </div>

                      <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                        <span className="text-slate-500 uppercase block font-black text-[9px]">Mobile</span>
                        <a href={`tel:${app.mobile}`} className="text-slate-900 font-bold block hover:underline">
                          {app.mobile}
                        </a>
                      </div>

                      <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                        <span className="text-slate-500 uppercase block font-black text-[9px]">Current Org</span>
                        <span className="text-slate-900 font-bold truncate block">
                          {app.currentCompany || 'N/A'} {app.currentRole ? `(${app.currentRole})` : ''}
                        </span>
                      </div>

                      <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                        <span className="text-slate-500 uppercase block font-black text-[9px]">Academics</span>
                        <span className="text-slate-900 font-bold truncate block">
                          {app.college ? `${app.college} (${app.graduationYear || ''})` : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Social & Portfolio Links + Builder Notes */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {app.linkedin && (
                        <a
                          href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-white hover:bg-[#7dd3fc] border border-slate-900 text-slate-900 font-mono text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                        >
                          <span>🔗 LinkedIn ↗</span>
                        </a>
                      )}
                      {app.github && (
                        <a
                          href={app.github.startsWith('http') ? app.github : `https://${app.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-900 text-slate-900 font-mono text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                        >
                          <span>🐙 GitHub ↗</span>
                        </a>
                      )}
                      {app.portfolio && (
                        <a
                          href={app.portfolio.startsWith('http') ? app.portfolio : `https://${app.portfolio}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 bg-white hover:bg-[#c084fc] border border-slate-900 text-slate-900 font-mono text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                        >
                          <span>🎨 Portfolio ↗</span>
                        </a>
                      )}
                    </div>

                    {/* Product Builder Responses Preview */}
                    <div className="p-2.5 bg-[#f8fafc] border border-slate-900/40 rounded-lg font-mono text-xs">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-slate-500 font-black uppercase text-[10px]">Built Product:</span>
                        <span className="text-slate-900 font-black">{app.builtProduct || 'N/A'}</span>
                        {app.projectLinks && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-700 truncate max-w-sm">🔗 {app.projectLinks}</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-800 text-[11px] leading-relaxed line-clamp-2">
                        <span className="font-bold text-slate-500">Why WnC: </span>
                        {app.whyJoin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: DEVELOPERS & TEAM (COMPACT DENSE) ================= */}
        {activeTab === 'developers' && (
          <div className="space-y-4">
            {/* Filter, Count & Add Developer Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={developerSearch}
                  onChange={(e) => setDeveloperSearch(e.target.value)}
                  placeholder="Search developers by name, role, bio, location..."
                  className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
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

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDevelopers}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 font-mono text-xs font-bold rounded-lg transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                  title="Refresh team members"
                >
                  🔄 Refresh
                </button>

                <button
                  onClick={handleOpenAddDeveloper}
                  className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
                >
                  <span>➕</span>
                  <span>Add Developer</span>
                </button>
              </div>
            </div>

            {/* Developers Grid */}
            {isLoadingDevelopers ? (
              <div className="py-14 text-center text-slate-600 font-mono text-xs font-bold">
                Loading team members...
              </div>
            ) : filteredDevelopers.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center font-mono shadow-[3px_3px_0px_0px_#0f172a]">
                <div className="text-3xl mb-2">👨‍💻</div>
                <h3 className="text-sm font-black text-slate-900 uppercase">No Developers Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold mb-4">
                  {developerSearch
                    ? 'No team members match your search.'
                    : 'Add your engineers, designers and leads so they appear live on the /about page!'}
                </p>
                <button
                  onClick={handleOpenAddDeveloper}
                  className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000]"
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
                      {/* Top Bar: Avatar + Name + Role + Team */}
                      <div className="flex items-start gap-3 mb-2.5">
                        {dev.image ? (
                          <img
                            src={dev.image}
                            alt={dev.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-slate-900 shrink-0 shadow-[2px_2px_0px_0px_#000]"
                            onError={(e) => {
                              // fallback
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#fde047] border-2 border-slate-900 text-slate-900 font-black font-mono flex items-center justify-center text-base shrink-0 shadow-[2px_2px_0px_0px_#000]">
                            {dev.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-mono font-black text-slate-900 uppercase truncate">
                            {dev.name}
                          </h4>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-[#fef08a] border border-slate-900 text-slate-950 font-mono text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000] truncate max-w-full">
                            {dev.role}
                          </span>
                          <div className="text-[10px] font-mono text-slate-500 font-bold mt-1 truncate">
                            📍 {dev.location || 'JAIPUR, INDIA'}
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs font-mono text-slate-700 line-clamp-2 mb-3 bg-[#fafafa] p-2 rounded-lg border border-slate-900/20">
                        {dev.bio}
                      </p>

                      {/* Social Links Row */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {dev.github && (
                          <a
                            href={dev.github.startsWith('http') ? dev.github : `https://${dev.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-900 text-[10px] font-mono font-bold rounded"
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
                            className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 border border-slate-900 text-[10px] font-mono font-bold rounded text-sky-900"
                            title="LinkedIn"
                          >
                            🔗 LinkedIn
                          </a>
                        )}
                        {dev.email && (
                          <a
                            href={`mailto:${dev.email}`}
                            className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-slate-900 text-[10px] font-mono font-bold rounded text-amber-900"
                            title="Email"
                          >
                            ✉️ Email
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Status + Edit/Delete */}
                    <div className="pt-2.5 border-t border-slate-900/20 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live on /about
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditDeveloper(dev)}
                          className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-mono text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDeveloper(dev._id, dev.name)}
                          className="px-2 py-1 bg-rose-100 hover:bg-rose-200 border-2 border-rose-600 text-rose-900 font-mono text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: CREATE / EDIT PROJECT STUDIO (LIGHT THEME) ================= */}
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

      {/* ================= ADD / EDIT DEVELOPER MODAL ================= */}
      {showDeveloperModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 w-full max-w-2xl shadow-[6px_6px_0px_0px_#000] my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b-2 border-slate-900/15">
              <div>
                <span className="px-2 py-0.5 bg-[#fde047] border border-slate-900 text-slate-900 font-mono text-[10px] font-black uppercase rounded shadow-[1px_1px_0px_0px_#000]">
                  TEAM PROFILE
                </span>
                <h3 className="text-lg sm:text-xl font-mono font-black text-slate-900 uppercase tracking-tight mt-1">
                  {editingDeveloperId ? '✏️ Edit Developer' : '➕ Add New Developer'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDeveloperModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 font-mono font-bold flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveDeveloper} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={devName}
                    onChange={(e) => setDevName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={devRole}
                    onChange={(e) => setDevRole(e.target.value)}
                    placeholder="e.g. FULL STACK DEVELOPER"
                    className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
                  />
                  {/* Quick role suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['FULL STACK DEVELOPER', 'FRONTEND ENGINEER', 'BACKEND ENGINEER', 'UI/UX DESIGNER'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setDevRole(r)}
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 hover:bg-amber-100 border border-slate-900 rounded text-slate-700 cursor-pointer"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                  Bio / One-liner Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={devBio}
                  onChange={(e) => setDevBio(e.target.value)}
                  placeholder="e.g. Architecting high-performance cloud applications, scalable APIs, and reactive interfaces."
                  className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={devLocation}
                    onChange={(e) => setDevLocation(e.target.value)}
                    placeholder="e.g. JAIPUR, INDIA"
                    className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                    Team Tag / Category
                  </label>
                  <input
                    type="text"
                    value={devTeam}
                    onChange={(e) => setDevTeam(e.target.value)}
                    placeholder="e.g. WnC TEAM"
                    className="w-full px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white shadow-[1.5px_1.5px_0px_0px_#000] outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload with ImageKit */}
              <div className="p-3 bg-[#fafafa] border-2 border-slate-900 rounded-xl">
                <label className="block text-[11px] font-mono font-black uppercase tracking-wider text-slate-800 mb-1">
                  📸 Profile Photo (Direct ImageKit Upload)
                </label>
                <div className="flex items-center gap-3 mt-2">
                  {devPhotoPreview ? (
                    <img
                      src={devPhotoPreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-200 border-2 border-slate-900 flex items-center justify-center text-xs font-mono text-slate-500 font-bold">
                      No Photo
                    </div>
                  )}

                  <div className="flex-1">
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
                      className="block w-full text-xs font-mono text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-2 file:border-slate-900 file:text-xs file:font-black file:font-mono file:uppercase file:bg-[#fde047] file:text-slate-900 hover:file:bg-[#facc15] file:shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      PNG, JPG, or WEBP (Max 5MB). Uploaded automatically to ImageKit.
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links Accordion / Section */}
              <div>
                <div className="text-[11px] font-mono font-black uppercase text-slate-700 mb-2">
                  🌐 Social Profiles & Links (Optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={devLinkedin}
                    onChange={(e) => setDevLinkedin(e.target.value)}
                    placeholder="LinkedIn URL (e.g. linkedin.com/in/...)"
                    className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono text-slate-900 focus:bg-white outline-none"
                  />
                  <input
                    type="text"
                    value={devGithub}
                    onChange={(e) => setDevGithub(e.target.value)}
                    placeholder="GitHub URL (e.g. github.com/...)"
                    className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono text-slate-900 focus:bg-white outline-none"
                  />
                  <input
                    type="text"
                    value={devTwitter}
                    onChange={(e) => setDevTwitter(e.target.value)}
                    placeholder="Twitter / X handle or URL"
                    className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono text-slate-900 focus:bg-white outline-none"
                  />
                  <input
                    type="email"
                    value={devEmail}
                    onChange={(e) => setDevEmail(e.target.value)}
                    placeholder="Contact Email"
                    className="px-3 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-mono text-slate-900 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t-2 border-slate-900/15 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeveloperModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg text-xs font-mono font-bold text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDeveloper}
                  className="px-5 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 text-slate-900 font-mono text-xs font-black uppercase rounded-lg shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingDeveloper ? 'Saving Developer...' : editingDeveloperId ? 'Save Changes' : 'Add to /about Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

