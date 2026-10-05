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

export interface UpdateItem {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  category: 'Product' | 'Company' | 'Careers'
  featured: boolean
  createdAt?: string
  updatedAt?: string
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

export interface CategoryItem {
  _id: string
  name: string
  slug: string
  color?: string
  description?: string
  projectCount?: number
  order?: number
  createdAt?: string
}

export interface AffiliateItem {
  _id: string
  name: string
  email: string
  phone?: string
  referralCode: string
  payoutType?: 'percentage' | 'fixed'
  commissionRate: number
  fixedAmount?: number
  allowedProducts?: string[]
  status: 'active' | 'inactive' | 'suspended'
  clicksCount: number
  bankDetails?: {
    upiId?: string
    accountHolder?: string
    accountNumber?: string
    ifscCode?: string
    bankName?: string
  }
  notes?: string
  createdAt: string
  stats?: {
    clicks: number
    totalLeads: number
    dealsWon: number
    totalEarned: number
    totalPaid: number
    pendingPayout: number
  }
}

export interface AffiliateLeadItem {
  _id: string
  affiliate?: {
    _id: string
    name: string
    email: string
    referralCode: string
    payoutType?: 'percentage' | 'fixed'
    commissionRate: number
    fixedAmount?: number
    phone?: string
  }
  organizationName: string
  contactPerson: string
  phone: string
  email?: string
  city?: string
  product: string
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'In Negotiation' | 'Deal Won' | 'Lost'
  dealValue: number
  commissionAmount: number
  commissionStatus: 'Pending' | 'Approved' | 'Paid'
  source: 'manual_by_affiliate' | 'website_referral_link'
  notes?: string
  rejectionReason?: string
  createdAt: string
}

export interface AffiliatePayoutItem {
  _id: string
  affiliate?: {
    _id: string
    name: string
    email: string
    phone?: string
    bankDetails?: {
      upiId?: string
      accountHolder?: string
      accountNumber?: string
      ifscCode?: string
      bankName?: string
    }
    payoutType?: 'percentage' | 'fixed'
    commissionRate?: number
    fixedAmount?: number
  }
  amount: number
  paymentMethod: string
  payoutDetails?: string
  status: 'Pending' | 'Paid' | 'Rejected'
  transactionReference?: string
  notes?: string
  rejectionReason?: string
  requestedAt?: string
  paidAt?: string
  createdAt: string
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

export const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

export const AVAILABLE_PRODUCTS = [
  'School ERP Pro',
  'Timetable Pro',
  'Attendance Management System',
  'Result Management System',
  'Web Builder Pro',
  'Sports Academy Pro',
  'Daily Test Pro',
  'Custom Software / App'
]
