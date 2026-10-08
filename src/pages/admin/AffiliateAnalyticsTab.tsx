import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateItem, type AffiliateLeadItem } from './types'
import { showErrorToast, showSuccessToast } from '../../components/ui/Toast'
import ReviewLeadModal from './ReviewLeadModal'

interface LocationAnalyticsItem {
  city: string
  totalLeads: number
  wonLeads: number
  totalDealValue: number
  affiliatesCount: number
  affiliatesList: string[]
  topProducts: { name: string; count: number }[]
  organizations: {
    name: string
    contactPerson?: string
    affiliate: string
    status: string
    dealValue: number
    products?: string[]
    createdAt?: string
  }[]
}

interface ProductAnalyticsItem {
  productName: string
  pitchCount: number
  wonCount: number
  inDiscussionCount: number
  lostCount: number
  totalDealValue: number
  affiliatesCount: number
  affiliatesList: string[]
  citiesCount: number
  citiesList: string[]
  winRate: number
}

interface AffiliatePerformanceItem {
  affiliateId: string
  name: string
  email: string
  phone: string
  referralCode: string
  status: string
  totalLeads: number
  clicksCount: number
  citiesCount: number
  citiesList: string[]
  productsPitched: { name: string; count: number }[]
  totalPipeline: number
  wonValue: number
  wonCount: number
  conversionRate: number
  totalEarned: number
  totalPaid: number
  pendingPayout: number
}

interface AnalyticsData {
  overview: {
    totalAffiliates: number
    totalLeads: number
    totalClicks: number
    totalPipelineValue: number
    totalWonRevenue: number
    wonLeadsCount: number
    conversionRate: number
    totalCommissionsEarned: number
    totalCommissionsPaid: number
    uniqueCitiesCount: number
    uniqueProductsCount: number
  }
  locations: LocationAnalyticsItem[]
  products: ProductAnalyticsItem[]
  affiliates: AffiliatePerformanceItem[]
}

const PRODUCT_ICONS: Record<string, string> = {
  'School ERP Pro': '🏫',
  'Attendance Management System': '📱',
  'Timetable Pro': '⏱️',
  'Result Management System': '📊',
  'Web Builder Pro': '🌐',
  'Sports Academy Pro': '⚽',
  'Daily Test Pro': '📝',
  'Custom Software / App': '💻'
}

export default function AffiliateAnalyticsTab() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  
  // Raw leads and affiliates fallback state
  const [allLeads, setAllLeads] = useState<AffiliateLeadItem[]>([])
  const [allAffiliates, setAllAffiliates] = useState<AffiliateItem[]>([])

  // Active filters
  const [selectedAffiliateFilter, setSelectedAffiliateFilter] = useState<string>('All')
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All')
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeView, setActiveView] = useState<'all' | 'locations' | 'products' | 'partners'>('all')

  // Review & Set Sold Plan / Commission Modal State
  const [reviewModalLead, setReviewModalLead] = useState<AffiliateLeadItem | null>(null)
  const [reviewModalMode, setReviewModalMode] = useState<'approve' | 'reject' | null>(null)

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch pre-aggregated analytics from dedicated endpoint
      const res = await axios.get(`${API_BASE}/api/affiliates/analytics`, {
        headers: getAuthHeaders(),
        timeout: 10000
      })

      if (res.data?.success && res.data.data) {
        setAnalyticsData(res.data.data)
      }

      // 2. Also fetch raw leads for live interactive filtering ledger
      const [leadsRes, affsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/affiliates/leads`, { headers: getAuthHeaders() }),
        axios.get(`${API_BASE}/api/affiliates`, { headers: getAuthHeaders() })
      ])

      if (leadsRes.data?.success && Array.isArray(leadsRes.data.data)) {
        setAllLeads(leadsRes.data.data)
      }
      if (affsRes.data?.success && Array.isArray(affsRes.data.data)) {
        setAllAffiliates(affsRes.data.data)
      }
    } catch (err) {
      console.error('Failed to load affiliate analytics:', err)
      showErrorToast('Failed to load affiliate analytics. Please check server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Filtered Leads Ledger based on controls
  const filteredLeads = useMemo(() => {
    return allLeads.filter((l) => {
      // 1. Affiliate filter
      if (selectedAffiliateFilter !== 'All') {
        const affId = String(l.affiliate?._id || (typeof l.affiliate === 'string' ? l.affiliate : '')).trim()
        const affCode = String(l.affiliate?.referralCode || '').trim()
        const target = selectedAffiliateFilter.trim()
        if (affId !== target && affCode !== target) return false
      }

      // 2. City filter
      if (selectedCityFilter !== 'All') {
        const c = String(l.city || 'Unspecified Location').trim().toLowerCase()
        const target = selectedCityFilter.trim().toLowerCase()
        if (c !== target) return false
      }

      // 3. Product filter
      if (selectedProductFilter !== 'All') {
        const target = selectedProductFilter.trim().toLowerCase()
        const leadProds: string[] = []
        if (Array.isArray(l.products) && l.products.length > 0) {
          l.products.forEach(p => p && leadProds.push(String(p).trim().toLowerCase()))
        }
        if (l.product) {
          leadProds.push(String(l.product).trim().toLowerCase())
        }
        const hasMatch = leadProds.some(p => p === target || p.includes(target) || target.includes(p))
        if (!hasMatch) return false
      }

      // 4. Status filter
      if (selectedStatusFilter !== 'All') {
        const s = String(l.status || '').trim().toLowerCase()
        const target = selectedStatusFilter.trim().toLowerCase()
        if (s !== target) return false
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const org = String(l.organizationName || '').toLowerCase()
        const person = String(l.contactPerson || '').toLowerCase()
        const phone = String(l.phone || '').toLowerCase()
        const affName = String(l.affiliate?.name || '').toLowerCase()
        const affCode = String(l.affiliate?.referralCode || '').toLowerCase()
        const city = String(l.city || '').toLowerCase()
        if (!org.includes(q) && !person.includes(q) && !phone.includes(q) && !affName.includes(q) && !affCode.includes(q) && !city.includes(q)) {
          return false
        }
      }

      return true
    })
  }, [allLeads, selectedAffiliateFilter, selectedCityFilter, selectedProductFilter, selectedStatusFilter, searchQuery])

  // Unique lists for filter dropdowns (derived from complete dataset so options never vanish)
  const availableCities = useMemo(() => {
    const set = new Set<string>()
    allLeads.forEach(l => {
      if (l.city && l.city.trim()) set.add(l.city.trim())
    })
    return Array.from(set).sort()
  }, [allLeads])

  const availableProductsList = useMemo(() => {
    const set = new Set<string>()
    allLeads.forEach(l => {
      if (l.products && l.products.length > 0) {
        l.products.forEach(p => p && set.add(p.trim()))
      } else if (l.product) {
        set.add(l.product.trim())
      }
    })
    return Array.from(set).sort()
  }, [allLeads])

  // 1. Dynamic Overview KPI Metrics (recomputed from active filteredLeads)
  const dynamicOverview = useMemo(() => {
    const totalLeads = filteredLeads.length
    const totalPipelineValue = filteredLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0)
    const wonLeads = filteredLeads.filter(l => l.status === 'Deal Won' || l.status === 'Deal Confirmed')
    const totalWonRevenue = wonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0)
    const totalCommissionsEarned = filteredLeads.reduce((sum, l) => sum + (l.commissionAmount || 0), 0)
    const wonLeadsCount = wonLeads.length
    const conversionRate = totalLeads > 0 ? Number(((wonLeadsCount / totalLeads) * 100).toFixed(1)) : 0

    // Unique cities in filteredLeads
    const citiesSet = new Set<string>()
    filteredLeads.forEach(l => {
      citiesSet.add((l.city && l.city.trim()) ? l.city.trim() : 'Unspecified Location')
    })

    // Unique products in filteredLeads
    const productsSet = new Set<string>()
    filteredLeads.forEach(l => {
      const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
      prods.forEach(p => p && productsSet.add(p.trim()))
    })

    // Unique affiliates in filteredLeads
    const affiliatesSet = new Set<string>()
    filteredLeads.forEach(l => {
      const affId = l.affiliate?._id || (typeof l.affiliate === 'string' ? l.affiliate : '')
      if (affId) affiliatesSet.add(String(affId))
    })

    return {
      totalAffiliates: affiliatesSet.size || (selectedAffiliateFilter !== 'All' ? 1 : allAffiliates.length),
      totalLeads,
      totalClicks: analyticsData?.overview?.totalClicks ?? 0,
      totalPipelineValue,
      totalWonRevenue,
      wonLeadsCount,
      conversionRate,
      totalCommissionsEarned,
      totalCommissionsPaid: analyticsData?.overview?.totalCommissionsPaid ?? 0,
      uniqueCitiesCount: citiesSet.size,
      uniqueProductsCount: productsSet.size
    }
  }, [filteredLeads, selectedAffiliateFilter, allAffiliates.length, analyticsData])

  // 2. Dynamic Locations Breakdown (recomputed from active filteredLeads)
  const dynamicLocations = useMemo<LocationAnalyticsItem[]>(() => {
    const cityMap: Record<string, {
      city: string
      totalLeads: number
      wonLeads: number
      totalDealValue: number
      affiliates: Set<string>
      productsPitched: Record<string, number>
      organizations: any[]
    }> = {}

    filteredLeads.forEach(l => {
      const city = (l.city && l.city.trim()) ? l.city.trim() : 'Unspecified Location'
      if (!cityMap[city]) {
        cityMap[city] = {
          city,
          totalLeads: 0,
          wonLeads: 0,
          totalDealValue: 0,
          affiliates: new Set(),
          productsPitched: {},
          organizations: []
        }
      }
      cityMap[city].totalLeads += 1
      cityMap[city].totalDealValue += (l.dealValue || 0)
      if (l.status === 'Deal Won' || l.status === 'Deal Confirmed') {
        cityMap[city].wonLeads += 1
      }
      if (l.affiliate?.name) {
        cityMap[city].affiliates.add(l.affiliate.name)
      }
      if (l.organizationName) {
        cityMap[city].organizations.push({
          name: l.organizationName,
          contactPerson: l.contactPerson,
          affiliate: l.affiliate?.name || 'Unknown Partner',
          status: l.status,
          dealValue: l.dealValue || 0,
          products: (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro'],
          createdAt: l.createdAt
        })
      }
      const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
      prods.forEach(p => {
        if (p) {
          const cleanP = p.trim()
          cityMap[city].productsPitched[cleanP] = (cityMap[city].productsPitched[cleanP] || 0) + 1
        }
      })
    })

    return Object.values(cityMap).map(c => ({
      city: c.city,
      totalLeads: c.totalLeads,
      wonLeads: c.wonLeads,
      totalDealValue: c.totalDealValue,
      affiliatesCount: c.affiliates.size,
      affiliatesList: Array.from(c.affiliates),
      topProducts: Object.entries(c.productsPitched)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      organizations: c.organizations
    })).sort((a, b) => b.totalLeads - a.totalLeads)
  }, [filteredLeads])

  // 3. Dynamic Products Breakdown (recomputed from active filteredLeads)
  const dynamicProducts = useMemo<ProductAnalyticsItem[]>(() => {
    const prodMap: Record<string, {
      productName: string
      pitchCount: number
      wonCount: number
      inDiscussionCount: number
      lostCount: number
      totalDealValue: number
      affiliates: Set<string>
      cities: Set<string>
    }> = {}

    filteredLeads.forEach(l => {
      const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
      prods.forEach(p => {
        const prodName = (p || 'School ERP Pro').trim()
        if (!prodMap[prodName]) {
          prodMap[prodName] = {
            productName: prodName,
            pitchCount: 0,
            wonCount: 0,
            inDiscussionCount: 0,
            lostCount: 0,
            totalDealValue: 0,
            affiliates: new Set(),
            cities: new Set()
          }
        }
        prodMap[prodName].pitchCount += 1
        prodMap[prodName].totalDealValue += (l.dealValue || 0)
        if (l.status === 'Deal Won' || l.status === 'Deal Confirmed') {
          prodMap[prodName].wonCount += 1
        } else if (l.status === 'Lost') {
          prodMap[prodName].lostCount += 1
        } else {
          prodMap[prodName].inDiscussionCount += 1
        }
        if (l.affiliate?.name) prodMap[prodName].affiliates.add(l.affiliate.name)
        if (l.city && l.city.trim()) prodMap[prodName].cities.add(l.city.trim())
      })
    })

    return Object.values(prodMap).map(p => ({
      productName: p.productName,
      pitchCount: p.pitchCount,
      wonCount: p.wonCount,
      inDiscussionCount: p.inDiscussionCount,
      lostCount: p.lostCount,
      totalDealValue: p.totalDealValue,
      affiliatesCount: p.affiliates.size,
      affiliatesList: Array.from(p.affiliates),
      citiesCount: p.cities.size,
      citiesList: Array.from(p.cities),
      winRate: p.pitchCount > 0 ? Number(((p.wonCount / p.pitchCount) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.pitchCount - a.pitchCount)
  }, [filteredLeads])

  // 4. Dynamic Affiliates Performance Matrix (recomputed from active filteredLeads)
  const dynamicAffiliatesPerf = useMemo<AffiliatePerformanceItem[]>(() => {
    const relevantAffiliates = selectedAffiliateFilter !== 'All'
      ? allAffiliates.filter(a => String(a._id) === selectedAffiliateFilter || a.referralCode === selectedAffiliateFilter)
      : allAffiliates

    return relevantAffiliates.map(aff => {
      const affLeads = filteredLeads.filter(l => {
        const affId = l.affiliate?._id || (typeof l.affiliate === 'string' ? l.affiliate : '')
        return String(affId) === String(aff._id)
      })

      const affCities = new Set<string>()
      const affProductsMap: Record<string, number> = {}
      let affPipeline = 0
      let affWonValue = 0
      let affWonCount = 0

      affLeads.forEach(l => {
        if (l.city && l.city.trim()) affCities.add(l.city.trim())
        affPipeline += (l.dealValue || 0)
        if (l.status === 'Deal Won' || l.status === 'Deal Confirmed') {
          affWonCount += 1
          affWonValue += (l.dealValue || 0)
        }
        const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
        prods.forEach(p => {
          if (p) {
            const cleanP = p.trim()
            affProductsMap[cleanP] = (affProductsMap[cleanP] || 0) + 1
          }
        })
      })

      return {
        affiliateId: aff._id,
        name: aff.name,
        email: aff.email,
        phone: aff.phone || '',
        referralCode: aff.referralCode,
        status: aff.status,
        totalLeads: affLeads.length,
        clicksCount: aff.clicksCount || 0,
        citiesCount: affCities.size,
        citiesList: Array.from(affCities),
        productsPitched: Object.entries(affProductsMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        totalPipeline: affPipeline,
        wonValue: affWonValue,
        wonCount: affWonCount,
        conversionRate: affLeads.length > 0 ? Number(((affWonCount / affLeads.length) * 100).toFixed(1)) : 0,
        totalEarned: aff.stats?.totalEarned || 0,
        totalPaid: aff.stats?.totalPaid || 0,
        pendingPayout: aff.stats?.pendingPayout || 0
      }
    })
    .filter(a => {
      const isFilterActive = selectedCityFilter !== 'All' || selectedProductFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery.trim() !== ''
      return isFilterActive ? a.totalLeads > 0 : true
    })
    .sort((a, b) => b.totalLeads - a.totalLeads)
  }, [allAffiliates, filteredLeads, selectedAffiliateFilter, selectedCityFilter, selectedProductFilter, selectedStatusFilter, searchQuery])

  // Export report as CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      showErrorToast('No leads data to export')
      return
    }

    const headers = [
      'Organization / School',
      'Contact Person',
      'Phone',
      'City / Location',
      'Affiliate Partner',
      'Partner Code',
      'Products Pitched',
      'Deal Value (INR)',
      'Commission (INR)',
      'Status',
      'Date Submitted'
    ]

    const rows = filteredLeads.map((l) => {
      const prods = (l.products && l.products.length > 0) ? l.products.join('; ') : (l.product || 'School ERP Pro')
      return [
        `"${(l.organizationName || '').replace(/"/g, '""')}"`,
        `"${(l.contactPerson || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${(l.city || 'Unspecified').replace(/"/g, '""')}"`,
        `"${(l.affiliate?.name || 'Direct / Unknown').replace(/"/g, '""')}"`,
        `"${l.affiliate?.referralCode || ''}"`,
        `"${prods.replace(/"/g, '""')}"`,
        l.dealValue || 0,
        l.commissionAmount || 0,
        `"${l.status}"`,
        `"${new Date(l.createdAt || '').toLocaleDateString('en-IN')}"`
      ]
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wnc_affiliate_analytics_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showSuccessToast('Affiliate analytics report exported successfully!')
  }

  // Active Dynamic View Data
  const overview = dynamicOverview
  const locations = dynamicLocations
  const products = dynamicProducts
  const affiliatesPerf = dynamicAffiliatesPerf

  // Max calculations for progress bars
  const maxCityLeads = locations.length > 0 ? Math.max(...locations.map(l => l.totalLeads)) : 1
  const maxProductPitches = products.length > 0 ? Math.max(...products.map(p => p.pitchCount)) : 1

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded shadow-[1px_1px_0px_0px_#000]">
              PARTNER ECOSYSTEM INTELLIGENCE
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded">
              Live Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>📊 Affiliate Ecosystem Analytics</span>
          </h1>
          <p className="text-xs text-slate-600 font-bold max-w-3xl">
            Complete intelligence on where affiliates are generating leads (<span className="text-emerald-700">Territories & Cities</span>) and which software solutions are being demonstrated (<span className="text-blue-700">Product Showcase</span>).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAnalytics}
            title="Refresh Analytics"
            disabled={isLoading}
            className="p-2.5 bg-white border-2 border-slate-900 rounded-md font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-[#7dd3fc] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        
        {/* Total Leads */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500">🎯 Total Leads</span>
          <div className="mt-1">
            <span className="text-2xl font-black text-slate-900">{overview?.totalLeads ?? allLeads.length}</span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">
              {overview?.wonLeadsCount ?? 0} Deals Won
            </span>
          </div>
        </div>

        {/* Cities Covered */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-emerald-700">📍 Cities Reached</span>
          <div className="mt-1">
            <span className="text-2xl font-black text-emerald-800">{overview?.uniqueCitiesCount ?? locations.length}</span>
            <span className="block text-[9px] font-bold text-emerald-600 uppercase mt-0.5">
              Territorial Footprint
            </span>
          </div>
        </div>

        {/* Unique Products Pitched */}
        <div className="bg-[#eff6ff] border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-blue-700">📦 Products Pitched</span>
          <div className="mt-1">
            <span className="text-2xl font-black text-blue-800">{overview?.uniqueProductsCount ?? products.length}</span>
            <span className="block text-[9px] font-bold text-blue-600 uppercase mt-0.5">
              Active Catalogs
            </span>
          </div>
        </div>

        {/* Total Pipeline Value */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500">💼 Pipeline Value</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{(overview?.totalPipelineValue ?? 0).toLocaleString('en-IN')}
            </span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">
              Total In Discussion
            </span>
          </div>
        </div>

        {/* Confirmed Revenue */}
        <div className="bg-[#fef9c3] border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-amber-800">🏆 Won Revenue</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-900">
              ₹{(overview?.totalWonRevenue ?? 0).toLocaleString('en-IN')}
            </span>
            <span className="block text-[9px] font-bold text-amber-700 uppercase mt-0.5">
              Confirmed Deals
            </span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500">📈 Win Rate</span>
          <div className="mt-1">
            <span className="text-2xl font-black text-purple-700">
              {overview?.conversionRate ?? 0}%
            </span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">
              {overview?.totalClicks ?? 0} Link Clicks
            </span>
          </div>
        </div>

      </div>

      {/* 3. Navigation View Switcher (Tabs) */}
      <div className="flex overflow-x-auto no-scrollbar border-b-2 border-slate-900 gap-1.5 sm:gap-2 pb-[1px]">
        <button
          onClick={() => setActiveView('all')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeView === 'all'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🌐 Complete Overview
        </button>

        <button
          onClick={() => setActiveView('locations')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeView === 'locations'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          📍 Territories & Cities ({locations.length})
        </button>

        <button
          onClick={() => setActiveView('products')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeView === 'products'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          📦 Product Showcase ({products.length})
        </button>

        <button
          onClick={() => setActiveView('partners')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeView === 'partners'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🤝 Partner Territory Matrix ({affiliatesPerf.length})
        </button>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <span>⚡ Interactive Filter Controls</span>
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-900 font-mono ${
              filteredLeads.length === allLeads.length
                ? 'bg-slate-100 text-slate-800'
                : 'bg-[#fef08a] text-slate-950 shadow-[1px_1px_0px_0px_#000]'
            }`}>
              Showing {filteredLeads.length} of {allLeads.length} Leads
            </span>
          </div>

          {(selectedAffiliateFilter !== 'All' || selectedCityFilter !== 'All' || selectedProductFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedAffiliateFilter('All')
                setSelectedCityFilter('All')
                setSelectedProductFilter('All')
                setSelectedStatusFilter('All')
                setSearchQuery('')
              }}
              className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded hover:bg-rose-100 transition cursor-pointer"
            >
              Reset All Filters ✕
            </button>
          )}
        </div>

        {/* Active Filter Chips / Pills */}
        {(selectedAffiliateFilter !== 'All' || selectedCityFilter !== 'All' || selectedProductFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active:</span>

            {selectedProductFilter !== 'All' && (
              <span
                onClick={() => setSelectedProductFilter('All')}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-100 border border-blue-400 text-blue-950 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to remove product filter"
              >
                <span>📦 Product: {selectedProductFilter}</span>
                <span className="text-xs">✕</span>
              </span>
            )}

            {selectedCityFilter !== 'All' && (
              <span
                onClick={() => setSelectedCityFilter('All')}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 border border-emerald-400 text-emerald-950 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to remove city filter"
              >
                <span>📍 City: {selectedCityFilter}</span>
                <span className="text-xs">✕</span>
              </span>
            )}

            {selectedStatusFilter !== 'All' && (
              <span
                onClick={() => setSelectedStatusFilter('All')}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-purple-100 border border-purple-400 text-purple-950 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to remove status filter"
              >
                <span>🏷️ Status: {selectedStatusFilter}</span>
                <span className="text-xs">✕</span>
              </span>
            )}

            {selectedAffiliateFilter !== 'All' && (
              <span
                onClick={() => setSelectedAffiliateFilter('All')}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 border border-amber-400 text-amber-950 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to remove partner filter"
              >
                <span>🤝 Partner Filter</span>
                <span className="text-xs">✕</span>
              </span>
            )}

            {searchQuery && (
              <span
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-slate-200 border border-slate-400 text-slate-900 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to clear search"
              >
                <span>🔍 "{searchQuery}"</span>
                <span className="text-xs">✕</span>
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Partner Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Affiliate Partner
            </label>
            <select
              value={selectedAffiliateFilter}
              onChange={(e) => setSelectedAffiliateFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Partners ({allAffiliates.length})</option>
              {allAffiliates.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} [{a.referralCode}]
                </option>
              ))}
            </select>
          </div>

          {/* City / Location Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              City / Territory
            </label>
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Cities ({availableCities.length})</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Product Demonstrated
            </label>
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Products ({availableProductsList.length})</option>
              {availableProductsList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Lead Status
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="In Negotiation">In Negotiation</option>
              <option value="Deal Won">Deal Won</option>
              <option value="Deal Confirmed">Deal Confirmed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Search Org / Client
            </label>
            <input
              type="text"
              placeholder="e.g. DPS, Jaipur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* 5. VIEW: LOCATIONS / TERRITORIES ("Kitne jaghe leads di") */}
      {(activeView === 'all' || activeView === 'locations') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                <span>📍 Geographical Lead Footprint</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-100 border border-slate-900 text-emerald-800 rounded font-black">
                  {locations.length} Territories Active
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                Shows where affiliates have pitched clients, total leads per city, and top software solutions demanded in each region.
              </p>
            </div>
          </div>

          {locations.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center">
              <span className="text-3xl block">🗺️</span>
              <p className="text-xs font-black uppercase text-slate-800 mt-2">No location data found yet</p>
              <p className="text-[11px] text-slate-500 font-bold mt-1">
                When affiliates submit leads with their city or location, geographic footprint will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => {
                const leadPercent = Math.round((loc.totalLeads / (overview?.totalLeads || 1)) * 100)
                const isSelectedCity = selectedCityFilter.toLowerCase() === loc.city.toLowerCase()

                return (
                  <div
                    key={loc.city}
                    onClick={() => {
                      setSelectedCityFilter(isSelectedCity ? 'All' : loc.city)
                    }}
                    className={`bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all cursor-pointer relative overflow-hidden ${
                      isSelectedCity ? 'ring-2 ring-emerald-500 bg-[#f0fdf4]' : ''
                    }`}
                  >
                    {/* Top City Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg">📍</span>
                          <h3 className="text-base font-black uppercase text-slate-900 tracking-tight font-mono">
                            {loc.city}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mt-0.5">
                          {loc.affiliatesCount} Active Partner{loc.affiliatesCount !== 1 ? 's' : ''} Operating
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900 block font-mono">
                          {loc.totalLeads} <span className="text-[10px] font-bold text-slate-500 uppercase">Leads</span>
                        </span>
                        {loc.wonLeads > 0 && (
                          <span className="inline-block text-[9px] font-black uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                            {loc.wonLeads} Won
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar of Volume */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 mb-1">
                        <span>Share of Total Pipeline</span>
                        <span>{leadPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-900 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, (loc.totalLeads / maxCityLeads) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Deal Value */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] font-black uppercase text-slate-500">Pipeline Value:</span>
                      <span className="font-black text-slate-900">
                        ₹{loc.totalDealValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Top Pitched Products in this City */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200">
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                        📦 Products Pitched Here:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {loc.topProducts.slice(0, 3).map((tp) => (
                          <span
                            key={tp.name}
                            className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-50 border border-blue-300 text-blue-900 px-2 py-0.5 rounded"
                          >
                            <span>{PRODUCT_ICONS[tp.name] || '📦'}</span>
                            <span>{tp.name}</span>
                            <span className="text-[9px] bg-blue-200 px-1 rounded-full font-mono">
                              {tp.count}
                            </span>
                          </span>
                        ))}
                        {loc.topProducts.length > 3 && (
                          <span className="text-[10px] font-black text-slate-500 px-1 py-0.5">
                            +{loc.topProducts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active Partners */}
                    <div className="mt-2.5">
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                        🤝 Affiliates in {loc.city}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {loc.affiliatesList.slice(0, 3).map((affName) => (
                          <span
                            key={affName}
                            className="text-[10px] font-bold bg-slate-100 border border-slate-300 text-slate-800 px-1.5 py-0.5 rounded font-mono"
                          >
                            👤 {affName}
                          </span>
                        ))}
                        {loc.affiliatesList.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-500">
                            +{loc.affiliatesList.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Filter Click Hint */}
                    <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase">
                      <span>{isSelectedCity ? '✓ Filtering this city' : 'Click to filter table'}</span>
                      <span className="text-slate-400">→</span>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. VIEW: PRODUCTS SHOWCASE ("Kon kon se products dekhaye") */}
      {(activeView === 'all' || activeView === 'products') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                <span>📦 Software Products Pitch & Demand Intelligence</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 border border-slate-900 text-blue-900 rounded font-black">
                  {products.length} Products Demonstrated
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                Detailed metrics on which software modules affiliates are presenting to clients, frequency of demos, and win rates.
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center">
              <span className="text-3xl block">📦</span>
              <p className="text-xs font-black uppercase text-slate-800 mt-2">No product demo data found</p>
              <p className="text-[11px] text-slate-500 font-bold mt-1">
                When affiliates submit leads specifying which products they showed, product analytics will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((prod) => {
                const icon = PRODUCT_ICONS[prod.productName] || '💼'
                const isSelectedProduct = selectedProductFilter.toLowerCase() === prod.productName.toLowerCase()
                const pitchPercent = Math.round((prod.pitchCount / maxProductPitches) * 100)

                return (
                  <div
                    key={prod.productName}
                    onClick={() => {
                      setSelectedProductFilter(isSelectedProduct ? 'All' : prod.productName)
                    }}
                    className={`bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col justify-between ${
                      isSelectedProduct ? 'ring-2 ring-blue-500 bg-[#eff6ff]' : ''
                    }`}
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl p-1.5 bg-slate-100 border border-slate-900 rounded-lg">
                            {icon}
                          </span>
                          <div>
                            <h3 className="text-sm font-black uppercase text-slate-900 leading-tight font-mono">
                              {prod.productName}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mt-0.5">
                              {prod.affiliatesCount} Partner{prod.affiliatesCount !== 1 ? 's' : ''} Pitching
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pitch Counts */}
                      <div className="mt-4 flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            {prod.pitchCount}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                            Pitches / Demos
                          </span>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 rounded font-mono">
                          {prod.winRate}% Won
                        </span>
                      </div>

                      {/* Visual Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-slate-100 border border-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(10, pitchPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* Status Pills */}
                      <div className="mt-3 grid grid-cols-3 gap-1 text-center font-mono">
                        <div className="bg-emerald-50 border border-emerald-300 rounded p-1">
                          <span className="text-[9px] font-black uppercase text-emerald-800 block">Won</span>
                          <span className="text-xs font-black text-emerald-900">{prod.wonCount}</span>
                        </div>
                        <div className="bg-amber-50 border border-amber-300 rounded p-1">
                          <span className="text-[9px] font-black uppercase text-amber-800 block">Negotiating</span>
                          <span className="text-xs font-black text-amber-900">{prod.inDiscussionCount}</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-300 rounded p-1">
                          <span className="text-[9px] font-black uppercase text-rose-800 block">Lost</span>
                          <span className="text-xs font-black text-rose-900">{prod.lostCount}</span>
                        </div>
                      </div>

                      {/* Cities Where Pitched */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200">
                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                          📍 Regions Demanded:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {prod.citiesList.slice(0, 3).map((city) => (
                            <span
                              key={city}
                              className="text-[9px] font-bold bg-slate-100 border border-slate-300 text-slate-700 px-1.5 py-0.2 rounded"
                            >
                              {city}
                            </span>
                          ))}
                          {prod.citiesList.length > 3 && (
                            <span className="text-[9px] font-bold text-slate-500">
                              +{prod.citiesList.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Pipeline Value */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] font-black uppercase text-slate-500">Pipeline:</span>
                      <span className="font-black text-slate-900">
                        ₹{prod.totalDealValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. VIEW: PARTNER TERRITORY & PRODUCT MATRIX */}
      {(activeView === 'all' || activeView === 'partners') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
                <span>🤝 Partner Territory & Pitch Performance Matrix</span>
                <span className="text-xs px-2 py-0.5 bg-yellow-100 border border-slate-900 text-yellow-900 rounded font-black">
                  {affiliatesPerf.length} Affiliates Evaluated
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                See individual affiliates' geographical footprint, all products they have pitched to schools/clients, and deal outcomes.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
                    <th className="p-3">Partner Dossier</th>
                    <th className="p-3">📍 Territories Reached (Cities)</th>
                    <th className="p-3">📦 Products Pitched</th>
                    <th className="p-3 text-center">Leads Volume</th>
                    <th className="p-3 text-right">Pipeline Value</th>
                    <th className="p-3 text-right">Confirmed Deals</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-200 font-medium text-slate-800">
                  {affiliatesPerf.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs font-black uppercase text-slate-500">
                        No affiliate partners recorded yet
                      </td>
                    </tr>
                  ) : (
                    affiliatesPerf.map((aff) => {
                      const isFilterActive = selectedAffiliateFilter === aff.affiliateId || selectedAffiliateFilter === aff.referralCode

                      return (
                        <tr
                          key={aff.affiliateId}
                          className={`hover:bg-slate-50 transition-colors ${
                            isFilterActive ? 'bg-amber-50' : ''
                          }`}
                        >
                          {/* Dossier */}
                          <td className="p-3">
                            <div className="font-black text-slate-900 text-sm">
                              {aff.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-slate-100 border border-slate-900 rounded text-[10px] font-black text-slate-800">
                                🏷️ {aff.referralCode}
                              </span>
                              {aff.status === 'active' ? (
                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {aff.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                            {aff.phone && (
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                📞 {aff.phone}
                              </div>
                            )}
                          </td>

                          {/* Cities Reached */}
                          <td className="p-3 max-w-[220px]">
                            {aff.citiesList.length === 0 ? (
                              <span className="text-[10px] text-slate-400 italic">
                                No cities recorded
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {aff.citiesList.map((city) => (
                                  <span
                                    key={city}
                                    onClick={() => setSelectedCityFilter(city)}
                                    className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-black bg-[#ecfdf5] border border-emerald-400 text-emerald-900 px-1.5 py-0.5 rounded hover:bg-emerald-100 transition"
                                  >
                                    <span>📍</span>
                                    <span>{city}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Products Pitched */}
                          <td className="p-3 max-w-[280px]">
                            {aff.productsPitched.length === 0 ? (
                              <span className="text-[10px] text-slate-400 italic">
                                No products pitched
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {aff.productsPitched.map((p) => (
                                  <span
                                    key={p.name}
                                    onClick={() => setSelectedProductFilter(p.name)}
                                    className="cursor-pointer inline-flex items-center gap-1 text-[10px] font-black bg-[#eff6ff] border border-blue-300 text-blue-900 px-1.5 py-0.5 rounded hover:bg-blue-100 transition"
                                  >
                                    <span>{PRODUCT_ICONS[p.name] || '📦'}</span>
                                    <span>{p.name}</span>
                                    <span className="bg-blue-200 text-[9px] px-1 rounded-full">
                                      {p.count}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Leads Volume */}
                          <td className="p-3 text-center">
                            <span className="text-base font-black text-slate-900 block font-mono">
                              {aff.totalLeads}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 block">
                              {aff.clicksCount} Clicks
                            </span>
                          </td>

                          {/* Pipeline */}
                          <td className="p-3 text-right">
                            <div className="font-black text-slate-900">
                              ₹{aff.totalPipeline.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-purple-700 font-bold">
                              {aff.conversionRate}% Win Rate
                            </div>
                          </td>

                          {/* Confirmed Deals */}
                          <td className="p-3 text-right">
                            <div className="font-black text-emerald-700">
                              ₹{aff.wonValue.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold">
                              {aff.wonCount} Deals Won
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedAffiliateFilter(isFilterActive ? 'All' : aff.affiliateId)
                              }}
                              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 rounded shadow-[1px_1px_0px_0px_#000] hover:translate-y-[1px] transition cursor-pointer ${
                                isFilterActive
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-white text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              {isFilterActive ? 'Active Filter ✕' : 'Filter Leads 🔍'}
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. SECTION: LIVE LEADS DETAILED INSPECTION LEDGER */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
              <span>📋 Live Leads Exploration Ledger</span>
              <span className="text-xs px-2 py-0.5 bg-slate-200 border border-slate-900 text-slate-800 rounded font-black">
                {filteredLeads.length} Matches Found
              </span>
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Complete list of client leads matching your active filters with city, pitched products, and deal values.
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
                  <th className="p-3">Organization / Client</th>
                  <th className="p-3">📍 Territory / City</th>
                  <th className="p-3">🤝 Affiliate Partner</th>
                  <th className="p-3">📦 Products Demonstrated</th>
                  <th className="p-3 text-right">Deal Value</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Submitted</th>
                  <th className="p-3 text-center">Set Plan & Comm</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-200 font-medium text-slate-800">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs font-black uppercase text-slate-500">
                      No leads matching selected filters
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((l) => {
                    const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
                    const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Recent'

                    return (
                      <tr key={l._id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Org & Contact */}
                        <td className="p-3">
                          <div className="font-black text-slate-900 text-sm">
                            {l.organizationName}
                          </div>
                          <div className="text-[10px] text-slate-600 font-bold mt-0.5">
                            👤 {l.contactPerson} {l.phone ? `• 📞 ${l.phone}` : ''}
                          </div>
                        </td>

                        {/* City */}
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-50 border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded">
                            <span>📍</span>
                            <span>{l.city || 'Unspecified'}</span>
                          </span>
                        </td>

                        {/* Partner */}
                        <td className="p-3">
                          <div className="font-black text-slate-900">
                            {l.affiliate?.name || 'Unknown Partner'}
                          </div>
                          {l.affiliate?.referralCode && (
                            <span className="text-[10px] text-slate-500 font-bold">
                              [{l.affiliate.referralCode}]
                            </span>
                          )}
                        </td>

                        {/* Products */}
                        <td className="p-3 max-w-[280px]">
                          <div className="flex flex-wrap gap-1">
                            {prods.map((p) => (
                              <span
                                key={p}
                                className="inline-flex items-center gap-1 text-[10px] font-black bg-blue-50 border border-blue-300 text-blue-900 px-1.5 py-0.5 rounded"
                              >
                                <span>{PRODUCT_ICONS[p] || '📦'}</span>
                                <span>{p}</span>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Deal Value */}
                        <td className="p-3 text-right">
                          <div className="font-black text-slate-900">
                            ₹{(l.dealValue || 0).toLocaleString('en-IN')}
                          </div>
                          {l.commissionAmount > 0 && (
                            <div className="text-[10px] text-emerald-700 font-bold">
                              Comm: ₹{l.commissionAmount.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                            l.status === 'Deal Won' || l.status === 'Deal Confirmed'
                              ? 'bg-[#86efac] text-slate-950'
                              : l.status === 'Lost'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {l.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-3 text-right text-[10px] font-bold text-slate-500">
                          {dateStr}
                        </td>

                        {/* Direct Action: Set Plan, Deal Value & Commission */}
                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              setReviewModalLead(l)
                              setReviewModalMode('approve')
                            }}
                            className={`px-2.5 py-1 rounded font-black text-[10px] uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] hover:translate-y-[1px] transition cursor-pointer whitespace-nowrap ${
                              l.status === 'Deal Won' || l.status === 'Deal Confirmed'
                                ? 'bg-white text-slate-800 hover:bg-slate-100'
                                : 'bg-[#86efac] text-slate-950 hover:bg-[#6ee7b7]'
                            }`}
                          >
                            {l.status === 'Deal Won' || l.status === 'Deal Confirmed'
                              ? '✏️ Edit Deal'
                              : '💰 Set Plan & Comm'}
                          </button>
                        </td>

                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Super Admin: Review / Set Sold Plan & Award Commission Modal */}
      <ReviewLeadModal
        isOpen={Boolean(reviewModalLead && reviewModalMode)}
        onClose={() => {
          setReviewModalLead(null)
          setReviewModalMode(null)
        }}
        lead={reviewModalLead}
        mode={reviewModalMode}
        token={token}
        onSuccess={() => {
          fetchAnalytics()
        }}
      />

    </div>
  )
}
