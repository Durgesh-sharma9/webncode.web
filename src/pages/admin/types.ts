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
    primaryMethod?: 'upi' | 'bank'
    upiId?: string
    accountHolder?: string
    accountNumber?: string
    ifscCode?: string
    bankName?: string
    accountType?: string
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
    availableBalance?: number
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
  products?: string[]
  status: 'New' | 'In Discussion' | 'Contacted' | 'Demo Scheduled' | 'In Negotiation' | 'Deal Confirmed' | 'Deal Won' | 'Lost'
  confirmationNotes?: string
  dealValue: number
  commissionAmount: number
  commissionStatus: 'Pending' | 'Approved' | 'Paid'
  source: 'manual_by_affiliate' | 'website_referral_link'
  notes?: string
  adminNotes?: string
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

export const PROJECT_OPTIONS = [
  'School ERP Pro',
  'Web Builder Pro',
  'Timetable Pro',
  'Attendance Management System',
  'Result Management System',
  'Sports Academy Pro',
  'Daily Test Pro',
  'Custom Software / App'
]

export interface ProductPlan {
  _id?: string
  projectName: string
  planName: string
  price: number
  billingCycle: string
  defaultCommissionRate?: number
  description?: string
  features?: string[]
  status?: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export interface ProductPlanItem {
  name: string
  price: number
  billing: string
  description?: string
}

export const PRODUCT_CATALOG: ProductPlanItem[] = [
  { name: 'School ERP Pro', price: 50000, billing: '/ Year', description: 'Complete enterprise K-12 school ERP suite' },
  { name: 'Attendance Management System', price: 20000, billing: '/ Year', description: 'RFID, Biometric & App attendance system' },
  { name: 'Timetable Pro', price: 15000, billing: '/ Year', description: 'Automated AI timetable scheduling engine' },
  { name: 'Result Management System', price: 15000, billing: '/ Year', description: 'Automated report card & marksheet generator' },
  { name: 'Web Builder Pro', price: 25000, billing: '/ Year', description: 'Custom institutional web portal' },
  { name: 'Sports Academy Pro', price: 30000, billing: '/ Year', description: 'Sports academy management & tournament app' },
  { name: 'Daily Test Pro', price: 15000, billing: '/ Year', description: 'Online exam & MCQ mock test engine' },
  { name: 'Custom Software / App', price: 75000, billing: 'Starting', description: 'Custom full-stack web or mobile application' }
]

export const getProductPrice = (productName: string, plansList?: ProductPlan[]): number => {
  if (plansList && plansList.length > 0) {
    const clean = (productName || '').trim().toLowerCase()
    const found = plansList.find((p) => {
      const combo = `${p.projectName} - ${p.planName}`.toLowerCase()
      return p.planName.toLowerCase() === clean || combo === clean || clean.includes(p.planName.toLowerCase()) || p.projectName.toLowerCase() === clean
    })
    if (found) return found.price
  }
  const item = PRODUCT_CATALOG.find((p) => p.name.toLowerCase() === (productName || '').toLowerCase())
  return item ? item.price : 25000
}

export const calculateProductsPrice = (products: string[], plansList?: ProductPlan[]): number => {
  if (!products || products.length === 0) return 0
  return products.reduce((sum, p) => sum + getProductPrice(p, plansList), 0)
}

export interface AffiliateCouponItem {
  _id: string
  code: string
  discountType: 'percentage' | 'flat'
  discountValue: number
  affiliate?: {
    _id: string
    name: string
    email: string
    referralCode?: string
    phone?: string
  } | null
  applicableProducts: string[]
  maxUses: number
  usedCount: number
  expiryDate?: string | null
  isActive: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

