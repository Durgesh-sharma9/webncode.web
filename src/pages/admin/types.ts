import aryan1 from '../../assets/team/aryan1.png'
import aryan2 from '../../assets/team/aryan2.png'
import pranav1 from '../../assets/team/pranav1.png'
import pranav2 from '../../assets/team/pranav2.png'
import dev1 from '../../assets/team/dev1.png'
import dev2 from '../../assets/team/dev2.png'

export interface ContactItem {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  status: 'new' | 'read' | 'contacted'
  createdAt: string
}

export interface ApplicationItem {
  _id: string
  fullName: string
  email: string
  mobile: string
  position: string
  currentCompany?: string
  currentRole?: string
  experience: string
  portfolioUrl?: string
  portfolio?: string
  city: string
  state?: string
  gender?: string
  noticePeriod?: string
  college?: string
  graduationYear?: string
  builtProduct?: string
  reason?: string
  linkedin?: string
  github?: string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
  createdAt: string
  resumeUrl?: string
  notes?: string
}

export interface ProjectItem {
  _id: string
  title: string
  slug: string
  category: string
  shortDescription: string
  description: string
  demoUrl?: string
  features: string[]
  tags: string[]
  images: string[]
  isFeatured?: boolean
  createdAt: string
}

export interface DeveloperItem {
  _id: string
  name: string
  role: string
  bio: string
  image?: string
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

export const CATEGORIES = [
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

export const getDeveloperImage = (dev: DeveloperItem, isHover = false) => {
  const name = (dev.name || '').trim().toLowerCase()
  if (name.includes('aryan')) {
    return isHover ? (dev.hoverImage || aryan2) : (dev.image || aryan1)
  }
  if (name.includes('pranav')) {
    return isHover ? (dev.hoverImage || pranav2) : (dev.image || pranav1)
  }
  if (name.includes('durgesh') || name.includes('dev')) {
    return isHover ? (dev.hoverImage || dev2) : (dev.image || dev1)
  }
  return isHover ? (dev.hoverImage || dev.image) : (dev.image || dev.hoverImage)
}

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
