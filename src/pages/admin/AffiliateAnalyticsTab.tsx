import { useState, useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateItem, type AffiliateLeadItem } from './types'
import { showErrorToast, showSuccessToast } from '../../components/ui/Toast'
import ReviewLeadModal from './ReviewLeadModal'

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
  
  // Raw leads and affiliates data
  const [allLeads, setAllLeads] = useState<AffiliateLeadItem[]>([])
  const [allAffiliates, setAllAffiliates] = useState<AffiliateItem[]>([])

  // Main View Switcher: 'leads' | 'sales' | 'locations' | 'partners'
  const [activeView, setActiveView] = useState<'leads' | 'sales' | 'locations' | 'partners'>('leads')

  // Multi-Select Affiliate Filter: empty array means ALL partners (default)
  const [selectedAffiliateIds, setSelectedAffiliateIds] = useState<string[]>([])
  const [isAffiliateDropdownOpen, setIsAffiliateDropdownOpen] = useState(false)
  const [affiliateSearchText, setAffiliateSearchText] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Secondary Filters
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All')
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Review & Set Sold Plan / Commission Modal State
  const [reviewModalLead, setReviewModalLead] = useState<AffiliateLeadItem | null>(null)
  const [reviewModalMode, setReviewModalMode] = useState<'approve' | 'reject' | null>(null)

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAffiliateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
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

  // Check if "All Partners" is active
  const isAllAffiliatesSelected = selectedAffiliateIds.length === 0

  // Toggle single affiliate in multi-select
  const toggleAffiliateSelection = (id: string) => {
    setSelectedAffiliateIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Set single affiliate selection (exclusive)
  const selectSingleAffiliate = (id: string) => {
    setSelectedAffiliateIds([id])
    setIsAffiliateDropdownOpen(false)
  }

  // Clear to All
  const resetToAllAffiliates = () => {
    setSelectedAffiliateIds([])
    setIsAffiliateDropdownOpen(false)
  }

  // Select all affiliates
  const selectAllAffiliates = () => {
    setSelectedAffiliateIds(allAffiliates.map((a) => a._id))
  }

  // Filtered Leads based on active selection (Affiliates, City, Product, Status, Search)
  const filteredLeads = useMemo(() => {
    return allLeads.filter((l) => {
      // 1. Multi-Affiliate filter
      if (!isAllAffiliatesSelected) {
        const affId = String(l.affiliate?._id || (typeof l.affiliate === 'string' ? l.affiliate : '')).trim()
        const affCode = String(l.affiliate?.referralCode || '').trim()
        const matches = selectedAffiliateIds.some((target) => target === affId || target === affCode)
        if (!matches) return false
      }

      // 2. City filter
      if (selectedCityFilter !== 'All') {
        const c = String(l.city || 'Unspecified Location').trim().toLowerCase()
        if (c !== selectedCityFilter.trim().toLowerCase()) return false
      }

      // 3. Product filter
      if (selectedProductFilter !== 'All') {
        const target = selectedProductFilter.trim().toLowerCase()
        const leadProds: string[] = []
        if (Array.isArray(l.products) && l.products.length > 0) {
          l.products.forEach((p) => p && leadProds.push(String(p).trim().toLowerCase()))
        }
        if (l.product) {
          leadProds.push(String(l.product).trim().toLowerCase())
        }
        const hasMatch = leadProds.some((p) => p === target || p.includes(target) || target.includes(p))
        if (!hasMatch) return false
      }

      // 4. Status filter
      if (selectedStatusFilter !== 'All') {
        const s = String(l.status || '').trim().toLowerCase()
        if (s !== selectedStatusFilter.trim().toLowerCase()) return false
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
  }, [allLeads, isAllAffiliatesSelected, selectedAffiliateIds, selectedCityFilter, selectedProductFilter, selectedStatusFilter, searchQuery])

  // Filtered Affiliates matching the selection
  const activeAffiliatesList = useMemo(() => {
    if (isAllAffiliatesSelected) return allAffiliates
    return allAffiliates.filter((a) => selectedAffiliateIds.includes(a._id) || selectedAffiliateIds.includes(a.referralCode))
  }, [allAffiliates, isAllAffiliatesSelected, selectedAffiliateIds])

  // =========================================================================
  // LEADS ANALYTICS METRICS (Computed from active filteredLeads)
  // =========================================================================
  const leadStats = useMemo(() => {
    const total = filteredLeads.length
    const won = filteredLeads.filter((l) => l.status === 'Deal Won').length
    const reported = filteredLeads.filter((l) => l.status === 'Deal Confirmed').length
    const lost = filteredLeads.filter((l) => l.status === 'Lost').length
    const inDiscussion = filteredLeads.filter(
      (l) => l.status !== 'Deal Won' && l.status !== 'Deal Confirmed' && l.status !== 'Lost'
    ).length
    const conversionRate = total > 0 ? Number(((won / total) * 100).toFixed(1)) : 0

    // City distribution
    const cityMap: Record<string, { total: number; won: number }> = {}
    filteredLeads.forEach((l) => {
      const city = l.city && l.city.trim() ? l.city.trim() : 'Unspecified'
      if (!cityMap[city]) cityMap[city] = { total: 0, won: 0 }
      cityMap[city].total += 1
      if (l.status === 'Deal Won' || l.status === 'Deal Confirmed') cityMap[city].won += 1
    })
    const cityRanking = Object.entries(cityMap)
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.total - a.total)

    // Product distribution
    const prodMap: Record<string, number> = {}
    filteredLeads.forEach((l) => {
      const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
      prods.forEach((p) => {
        if (p) prodMap[p] = (prodMap[p] || 0) + 1
      })
    })
    const productRanking = Object.entries(prodMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return {
      total,
      won,
      reported,
      lost,
      inDiscussion,
      conversionRate,
      cityRanking,
      productRanking,
      uniqueCitiesCount: cityRanking.length
    }
  }, [filteredLeads])

  // Pipeline Status Pie / Donut Chart Data
  const statusPieData = useMemo(() => {
    const total = leadStats.total
    if (total === 0) {
      return {
        gradient: 'conic-gradient(#e2e8f0 0deg 360deg)',
        slices: []
      }
    }

    const wonAngle = (leadStats.won / total) * 360
    const reportedAngle = (leadStats.reported / total) * 360
    const discAngle = (leadStats.inDiscussion / total) * 360
    const lostAngle = (leadStats.lost / total) * 360

    const a1 = wonAngle
    const a2 = a1 + reportedAngle
    const a3 = a2 + discAngle
    const a4 = a3 + lostAngle

    const gradient = `conic-gradient(
      #86efac 0deg ${a1}deg,
      #fde047 ${a1}deg ${a2}deg,
      #93c5fd ${a2}deg ${a3}deg,
      #fca5a5 ${a3}deg ${a4}deg
    )`

    const slices = [
      {
        label: 'Won Deals',
        count: leadStats.won,
        pct: Math.round((leadStats.won / total) * 100),
        color: '#86efac',
        dot: 'bg-[#86efac]'
      },
      {
        label: 'Reported',
        count: leadStats.reported,
        pct: Math.round((leadStats.reported / total) * 100),
        color: '#fde047',
        dot: 'bg-[#fde047]'
      },
      {
        label: 'In Discussion',
        count: leadStats.inDiscussion,
        pct: Math.round((leadStats.inDiscussion / total) * 100),
        color: '#93c5fd',
        dot: 'bg-[#93c5fd]'
      },
      {
        label: 'Cancelled',
        count: leadStats.lost,
        pct: Math.round((leadStats.lost / total) * 100),
        color: '#fca5a5',
        dot: 'bg-[#fca5a5]'
      }
    ]

    return { gradient, slices }
  }, [leadStats])

  // =========================================================================
  // SALES ANALYTICS METRICS (Computed from closed won leads & active affiliates)
  // =========================================================================
  const salesStats = useMemo(() => {
    const wonLeads = filteredLeads.filter((l) => l.status === 'Deal Won' || l.status === 'Deal Confirmed')
    const wonCount = wonLeads.length
    const totalWonRevenue = wonLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0)
    const totalEarnedCommission = wonLeads.reduce((sum, l) => sum + (l.commissionAmount || 0), 0)
    
    // Wallet balances from the selected affiliates
    const totalPaidCommission = activeAffiliatesList.reduce((sum, a) => sum + (a.stats?.totalPaid || 0), 0)
    const pendingPayout = activeAffiliatesList.reduce((sum, a) => sum + (a.stats?.pendingPayout || 0), 0)
    const availableBalance = activeAffiliatesList.reduce((sum, a) => sum + (a.stats?.availableBalance || 0), 0)
    const netRetainedRevenue = Math.max(0, totalWonRevenue - totalEarnedCommission)

    const avgDealSize = wonCount > 0 ? Math.round(totalWonRevenue / wonCount) : 0
    const avgCommissionPerDeal = wonCount > 0 ? Math.round(totalEarnedCommission / wonCount) : 0

    // Product-Wise Sales Breakdown
    const prodSalesMap: Record<string, { count: number; revenue: number; commission: number }> = {}
    wonLeads.forEach((l) => {
      const prods = (l.products && l.products.length > 0) ? l.products : [l.product || 'School ERP Pro']
      prods.forEach((p) => {
        if (!p) return
        if (!prodSalesMap[p]) prodSalesMap[p] = { count: 0, revenue: 0, commission: 0 }
        prodSalesMap[p].count += 1
        prodSalesMap[p].revenue += (l.dealValue || 0) / prods.length
        prodSalesMap[p].commission += (l.commissionAmount || 0) / prods.length
      })
    })

    const productSalesList = Object.entries(prodSalesMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: Math.round(data.revenue),
        commission: Math.round(data.commission)
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // City Sales Breakdown
    const citySalesMap: Record<string, { count: number; revenue: number }> = {}
    wonLeads.forEach((l) => {
      const city = l.city && l.city.trim() ? l.city.trim() : 'Unspecified'
      if (!citySalesMap[city]) citySalesMap[city] = { count: 0, revenue: 0 }
      citySalesMap[city].count += 1
      citySalesMap[city].revenue += (l.dealValue || 0)
    })
    const citySalesList = Object.entries(citySalesMap)
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    // Monthly Sales Trend (Last 6 Months)
    const now = new Date()
    const monthlyTrends: { label: string; wonDeals: number; revenue: number; monthKey: string }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-US', { month: 'short' })
      monthlyTrends.push({ label, wonDeals: 0, revenue: 0, monthKey })
    }

    wonLeads.forEach((l) => {
      const created = l.createdAt ? new Date(l.createdAt) : new Date()
      const mKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`
      const match = monthlyTrends.find((m) => m.monthKey === mKey)
      if (match) {
        match.wonDeals += 1
        match.revenue += (l.dealValue || 0)
      }
    })

    const maxMonthlyRevenue = Math.max(...monthlyTrends.map((m) => m.revenue), 1)

    return {
      wonLeads,
      wonCount,
      totalWonRevenue,
      totalEarnedCommission,
      totalPaidCommission,
      pendingPayout,
      availableBalance,
      netRetainedRevenue,
      avgDealSize,
      avgCommissionPerDeal,
      productSalesList,
      citySalesList,
      monthlyTrends,
      maxMonthlyRevenue
    }
  }, [filteredLeads, activeAffiliatesList])

  // Unique lists for secondary filters
  const availableCities = useMemo(() => {
    const set = new Set<string>()
    allLeads.forEach((l) => {
      if (l.city && l.city.trim()) set.add(l.city.trim())
    })
    return Array.from(set).sort()
  }, [allLeads])

  const availableProductsList = useMemo(() => {
    const set = new Set<string>()
    allLeads.forEach((l) => {
      if (l.products && l.products.length > 0) {
        l.products.forEach((p) => p && set.add(p.trim()))
      } else if (l.product) {
        set.add(l.product.trim())
      }
    })
    return Array.from(set).sort()
  }, [allLeads])

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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `wnc_affiliate_analytics_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showSuccessToast('Analytics report exported successfully!')
  }

  // Filtered affiliate list inside the dropdown search
  const filteredAffiliatesInDropdown = useMemo(() => {
    if (!affiliateSearchText.trim()) return allAffiliates
    const q = affiliateSearchText.toLowerCase()
    return allAffiliates.filter(
      (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.referralCode.toLowerCase().includes(q)
    )
  }, [allAffiliates, affiliateSearchText])

  return (
    <div className="space-y-4 sm:space-y-5 font-mono text-slate-900">
      
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded shadow-[1px_1px_0px_0px_#000]">
              SUPER ADMIN INTELLIGENCE
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded">
              Live Feed • {allAffiliates.length} Partners
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>📊 Affiliate Sales & Leads Analytics</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="p-2 bg-white border-2 border-slate-900 rounded-md font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            title="Refresh analytics data"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#7dd3fc] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Navigation View Switcher (Just like Affiliate Portal Analytics) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex overflow-x-auto no-scrollbar border-b-2 border-slate-900 gap-1.5 sm:gap-2 pb-[1px] w-full sm:w-auto">
          {/* Primary View 1: Leads Analytics */}
          <button
            onClick={() => setActiveView('leads')}
            className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'leads'
                ? 'bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>📋</span>
            <span>Leads Analytics</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white border border-slate-900 rounded-full font-mono">
              {filteredLeads.length}
            </span>
          </button>

          {/* Primary View 2: Sales Analytics */}
          <button
            onClick={() => setActiveView('sales')}
            className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'sales'
                ? 'bg-[#fde047] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>💰</span>
            <span>Sales & Revenue</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white border border-slate-900 rounded-full font-mono">
              ₹{salesStats.totalWonRevenue.toLocaleString('en-IN')}
            </span>
          </button>

          {/* View 3: Territories / Cities */}
          <button
            onClick={() => setActiveView('locations')}
            className={`shrink-0 px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'locations'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>📍</span>
            <span>Territories ({leadStats.uniqueCitiesCount})</span>
          </button>

          {/* View 4: Partner Directory */}
          <button
            onClick={() => setActiveView('partners')}
            className={`shrink-0 px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'partners'
                ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🤝</span>
            <span>Partner Directory ({allAffiliates.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Universal Filter Controls Toolbar (All Filters Together) */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <span>⚡ Filter Controls</span>
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-900 font-mono ${
              filteredLeads.length === allLeads.length
                ? 'bg-slate-100 text-slate-800'
                : 'bg-[#fef08a] text-slate-950 shadow-[1px_1px_0px_0px_#000]'
            }`}>
              Showing {filteredLeads.length} of {allLeads.length} Leads
            </span>
          </div>

          {(selectedAffiliateIds.length > 0 || selectedCityFilter !== 'All' || selectedProductFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedAffiliateIds([])
                setSelectedCityFilter('All')
                setSelectedProductFilter('All')
                setSelectedStatusFilter('All')
                setSearchQuery('')
              }}
              className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded hover:bg-rose-100 transition cursor-pointer font-bold"
            >
              Reset All Filters ✕
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {(selectedAffiliateIds.length > 0 || selectedCityFilter !== 'All' || selectedProductFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 pb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active:</span>

            {selectedAffiliateIds.length > 0 && (
              <span
                onClick={() => setSelectedAffiliateIds([])}
                className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 border border-amber-400 text-amber-950 px-2 py-0.5 rounded cursor-pointer hover:bg-rose-100 hover:text-rose-900 transition"
                title="Click to remove partner filter"
              >
                <span>🤝 Partners ({selectedAffiliateIds.length})</span>
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

        {/* 5-Column Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          
          {/* 1. Affiliate Partner Dropdown / Multi-Select */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Affiliate Partner
            </label>
            <button
              type="button"
              onClick={() => setIsAffiliateDropdownOpen(!isAffiliateDropdownOpen)}
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer flex items-center justify-between text-left truncate"
            >
              <span className="truncate">
                {isAllAffiliatesSelected
                  ? `All Partners (${allAffiliates.length})`
                  : selectedAffiliateIds.length === 1
                  ? (allAffiliates.find((a) => a._id === selectedAffiliateIds[0] || a.referralCode === selectedAffiliateIds[0])?.name || selectedAffiliateIds[0])
                  : `${selectedAffiliateIds.length} Partners Selected`}
              </span>
              <span className="text-[10px] text-slate-500 shrink-0 ml-1">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isAffiliateDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] z-50 p-2.5 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-700">Select Partners</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={selectAllAffiliates}
                      className="text-[9px] font-black text-blue-700 hover:underline px-1 cursor-pointer"
                    >
                      All
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={resetToAllAffiliates}
                      className="text-[9px] font-black text-rose-700 hover:underline px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search inside partner list */}
                <input
                  type="text"
                  value={affiliateSearchText}
                  onChange={(e) => setAffiliateSearchText(e.target.value)}
                  placeholder="Search partner..."
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:border-slate-900 focus:outline-none font-mono"
                />

                {/* Partner Checkbox List */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1 font-mono">
                  <label
                    onClick={resetToAllAffiliates}
                    className={`flex items-center justify-between p-1.5 rounded cursor-pointer border text-xs transition ${
                      isAllAffiliatesSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black' : 'border-transparent hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAllAffiliatesSelected}
                        onChange={resetToAllAffiliates}
                        className="rounded border-slate-400 cursor-pointer"
                      />
                      <span>🌐 All Partners (Default)</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{allAffiliates.length}</span>
                  </label>

                  {filteredAffiliatesInDropdown.map((aff) => {
                    const isChecked = selectedAffiliateIds.includes(aff._id) || selectedAffiliateIds.includes(aff.referralCode)
                    return (
                      <div
                        key={aff._id}
                        className={`flex items-center justify-between p-1.5 rounded border text-xs transition ${
                          isChecked ? 'bg-amber-50 border-amber-400 text-slate-900 font-black' : 'border-transparent hover:bg-slate-50 text-slate-700 font-bold'
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAffiliateSelection(aff._id)}
                            className="rounded border-slate-400 cursor-pointer shrink-0"
                          />
                          <span className="truncate">{aff.name}</span>
                        </label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            selectSingleAffiliate(aff._id)
                          }}
                          className="text-[9px] px-1 py-0.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-300 rounded font-black uppercase shrink-0 ml-1 cursor-pointer"
                          title="Select only this partner"
                        >
                          Only
                        </button>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">
                    {isAllAffiliatesSelected ? 'Showing All' : `${selectedAffiliateIds.length} selected`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAffiliateDropdownOpen(false)}
                    className="px-2 py-0.5 bg-slate-900 text-white rounded font-black text-[10px] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. City / Territory Filter */}
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

          {/* 3. Product Demonstrated Filter */}
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

          {/* 4. Lead Status Filter */}
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
              <option value="In Discussion">💬 In Discussion</option>
              <option value="Deal Confirmed">⏳ Reported (Confirmed)</option>
              <option value="Deal Won">🎉 Deal Won</option>
              <option value="Lost">❌ Cancelled / Lost</option>
            </select>
          </div>

          {/* 5. Search Client / Lead */}
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
              Search Client / Partner
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search school, phone..."
                className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md pl-6 pr-6 py-1.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: LEADS ANALYTICS (EXACTLY MATCHING AFFILIATE PORTAL LEADS INTELLIGENCE) */}
      {/* ========================================================================= */}
      {activeView === 'leads' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Lead KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500">Total Leads</span>
                <span className="text-xs">🏢</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-slate-900">{leadStats.total}</div>
              <span className="text-[10px] text-slate-500 font-bold">Schools Pitched</span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-700">In Discussion</span>
                <span className="text-xs">💬</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-blue-700">{leadStats.inDiscussion}</div>
              <span className="text-[10px] text-blue-600 font-bold">Active Pipeline</span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-700">Reported Deals</span>
                <span className="text-xs">⏳</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-amber-600">{leadStats.reported}</div>
              <span className="text-[10px] text-amber-600 font-bold">Ready for Review</span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-700">Deals Won</span>
                <span className="text-xs">🎉</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-700">{leadStats.won}</div>
              <span className="text-[10px] text-emerald-600 font-bold">Closed Purchases</span>
            </div>

            <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-900">Win Rate</span>
                <span className="text-xs">📈</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-900">{leadStats.conversionRate}%</div>
              <span className="text-[10px] text-emerald-700 font-bold">{leadStats.won} of {leadStats.total} Converted</span>
            </div>
          </div>

          {/* Lead Pipeline Funnel Visualizer */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">📊</span>
                <h3 className="font-black text-xs uppercase text-slate-900">
                  Lead Pipeline Stage Funnel
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                {isAllAffiliatesSelected ? 'All Partners Aggregated' : `${selectedAffiliateIds.length} Selected Partners`}
              </span>
            </div>

            {leadStats.total === 0 ? (
              <p className="text-xs text-slate-400 italic py-2 text-center">No leads logged for the current filter.</p>
            ) : (
              <div className="space-y-2">
                <div className="w-full h-5 rounded-md border-2 border-slate-900 overflow-hidden flex bg-slate-100 shadow-[1px_1px_0px_0px_#000]">
                  {leadStats.won > 0 && (
                    <div
                      style={{ width: `${(leadStats.won / leadStats.total) * 100}%` }}
                      className="bg-[#86efac] h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                      title={`Won: ${leadStats.won}`}
                    >
                      🎉 {leadStats.won}
                    </div>
                  )}
                  {leadStats.reported > 0 && (
                    <div
                      style={{ width: `${(leadStats.reported / leadStats.total) * 100}%` }}
                      className="bg-[#fde047] h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                      title={`Reported: ${leadStats.reported}`}
                    >
                      ⏳ {leadStats.reported}
                    </div>
                  )}
                  {leadStats.inDiscussion > 0 && (
                    <div
                      style={{ width: `${(leadStats.inDiscussion / leadStats.total) * 100}%` }}
                      className="bg-[#93c5fd] h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                      title={`Discussion: ${leadStats.inDiscussion}`}
                    >
                      💬 {leadStats.inDiscussion}
                    </div>
                  )}
                  {leadStats.lost > 0 && (
                    <div
                      style={{ width: `${(leadStats.lost / leadStats.total) * 100}%` }}
                      className="bg-[#fca5a5] h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                      title={`Cancelled: ${leadStats.lost}`}
                    >
                      ❌ {leadStats.lost}
                    </div>
                  )}
                </div>

                {/* Funnel Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#86efac] border border-slate-900" />
                    <span className="font-bold text-slate-800">Won: {leadStats.won}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#fde047] border border-slate-900" />
                    <span className="font-bold text-slate-800">Reported: {leadStats.reported}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#93c5fd] border border-slate-900" />
                    <span className="font-bold text-slate-800">Discussion: {leadStats.inDiscussion}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#fca5a5] border border-slate-900" />
                    <span className="font-bold text-slate-800">Cancelled: {leadStats.lost}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3 Visual Cards: Circular Donut Chart + Products Pitched + Cities Reached */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            
            {/* 1. Circular Pipeline Status Donut / Pie Graph */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <span>🥧</span>
                  <span>Pipeline Distribution</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500 font-mono">
                  {leadStats.conversionRate}% Won Rate
                </span>
              </div>

              {leadStats.total === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No leads logged yet.</p>
              ) : (
                <div className="flex items-center justify-around gap-2 py-2 my-auto">
                  {/* Donut Circle */}
                  <div
                    className="relative w-28 h-28 sm:w-30 sm:h-30 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                    style={{ background: statusPieData.gradient }}
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 bg-white rounded-full border-2 border-slate-900 flex flex-col items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                      <span className="text-base sm:text-lg font-black text-slate-900 font-mono leading-none">
                        {leadStats.total}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-slate-500 tracking-tight mt-0.5">
                        Leads
                      </span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-1.5 text-[11px] font-mono">
                    {statusPieData.slices.map((s) => (
                      <div key={s.label} className="flex items-center justify-between gap-2.5 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded border border-slate-900 ${s.dot}`} />
                          <span className="text-slate-800 text-[10px]">{s.label}:</span>
                        </div>
                        <span className="text-slate-900 font-black text-[10px]">
                          {s.count} <span className="text-slate-500 font-normal">({s.pct}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9.5px] font-bold text-slate-500 font-mono">
                <span>Active: {leadStats.inDiscussion + leadStats.reported}</span>
                <span className="text-emerald-700 font-black">Won: {leadStats.won}</span>
              </div>
            </div>

            {/* 2. Products Pitched Breakdown */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <span>📦</span>
                  <span>Products Pitched</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  {leadStats.productRanking.length} Titles
                </span>
              </div>

              {leadStats.productRanking.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No pitch data logged yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {leadStats.productRanking.map((prod) => {
                    const percent = leadStats.total > 0 ? Math.round((prod.count / leadStats.total) * 100) : 0
                    return (
                      <div key={prod.name} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="truncate text-slate-800">{prod.name}</span>
                          <span className="font-mono text-slate-900 shrink-0 ml-2 text-[10px]">
                            {prod.count} leads ({percent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded bg-slate-100 border border-slate-300 overflow-hidden">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-blue-600 rounded"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 3. Geographic Footprint (Cities Covered) */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Cities Reached</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  {leadStats.uniqueCitiesCount} Cities
                </span>
              </div>

              {leadStats.cityRanking.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No city locations logged yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {leadStats.cityRanking.map((c) => (
                    <div
                      key={c.city}
                      className="flex items-center justify-between py-1 px-2 rounded-md bg-[#f8fafc] border border-slate-200 text-[11px] font-bold"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs">📍</span>
                        <span className="text-slate-900 truncate">{c.city}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 text-[10px]">
                        <span className="text-slate-600">{c.total} leads</span>
                        {c.won > 0 && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-black">
                            ✓ {c.won} Won
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* 4. Complete Leads Exploration Table */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <h3 className="font-black text-xs sm:text-sm uppercase text-slate-900 font-mono">
                  All Client Leads Portfolio ({filteredLeads.length})
                </h3>
              </div>

              {/* Status Chips */}
              <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                {['All', 'In Discussion', 'Deal Confirmed', 'Deal Won', 'Lost'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatusFilter(st)}
                    className={`px-2 py-0.5 rounded border font-black transition cursor-pointer ${
                      selectedStatusFilter === st
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {st === 'Deal Confirmed' ? 'Reported' : st === 'In Discussion' ? 'Discussion' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar & Secondary Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client, partner, city..."
                  className="w-full pl-7 pr-6 py-1.5 bg-slate-50 border-2 border-slate-900 rounded-md text-[11px] font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-900"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* City Dropdown */}
              <select
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-slate-50 border-2 border-slate-900 rounded-md px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Cities ({availableCities.length})</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Product Dropdown */}
              <select
                value={selectedProductFilter}
                onChange={(e) => setSelectedProductFilter(e.target.value)}
                className="bg-slate-50 border-2 border-slate-900 rounded-md px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Products ({availableProductsList.length})</option>
                {availableProductsList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Leads Table */}
            {filteredLeads.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                No leads found matching the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-slate-900 rounded-lg max-h-80 overflow-y-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-100 border-b-2 border-slate-900 text-[10px] font-black uppercase text-slate-700">
                      <th className="py-2 px-3">Institution / Client</th>
                      <th className="py-2 px-3">Partner Dossier</th>
                      <th className="py-2 px-3">Location</th>
                      <th className="py-2 px-3">Products Pitched</th>
                      <th className="py-2 px-3 text-center">Stage</th>
                      <th className="py-2 px-3 text-right">Deal / Comm</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredLeads.map((lead) => {
                      const prods = (lead.products && lead.products.length > 0
                        ? lead.products
                        : lead.product ? lead.product.split(', ') : []
                      ).filter(Boolean)

                      return (
                        <tr key={lead._id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">
                            <div>{lead.organizationName}</div>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {lead.contactPerson} • {lead.phone}
                            </div>
                          </td>

                          <td className="py-2 px-3 font-bold text-slate-800">
                            <div>{lead.affiliate?.name || 'Direct'}</div>
                            <span className="text-[9px] px-1 bg-slate-100 border border-slate-300 rounded font-mono">
                              {lead.affiliate?.referralCode || '—'}
                            </span>
                          </td>

                          <td className="py-2 px-3 text-slate-600 font-medium">
                            📍 {lead.city || 'N/A'}
                          </td>

                          <td className="py-2 px-3 max-w-[200px]">
                            <div className="flex flex-wrap gap-1">
                              {prods.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[9px] font-bold whitespace-nowrap"
                                >
                                  {p.split(' - ')[0]}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-2 px-3 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase border border-slate-900 ${
                              lead.status === 'Deal Won'
                                ? 'bg-[#86efac] text-slate-950'
                                : lead.status === 'Deal Confirmed'
                                ? 'bg-amber-200 text-amber-950'
                                : lead.status === 'Lost'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}>
                              {lead.status === 'Deal Confirmed' ? '⏳ Reported' : lead.status}
                            </span>
                          </td>

                          <td className="py-2 px-3 text-right font-black whitespace-nowrap">
                            {lead.dealValue ? (
                              <div>
                                <span className="text-slate-900">₹{lead.dealValue.toLocaleString('en-IN')}</span>
                                {lead.commissionAmount && (
                                  <div className="text-[9.5px] text-emerald-700">
                                    Comm: ₹{lead.commissionAmount.toLocaleString('en-IN')}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="py-2 px-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                setReviewModalLead(lead)
                                setReviewModalMode('approve')
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] hover:translate-y-[1px] transition cursor-pointer ${
                                lead.status === 'Deal Won'
                                  ? 'bg-white text-slate-800 hover:bg-slate-100'
                                  : 'bg-[#86efac] text-slate-950 hover:bg-[#6ee7b7]'
                              }`}
                            >
                              {lead.status === 'Deal Won' ? '✏️ Edit Deal' : '💰 Set Plan & Comm'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SALES & REVENUE ANALYTICS (EXACTLY MATCHING AFFILIATE PORTAL SALES) */}
      {/* ========================================================================= */}
      {activeView === 'sales' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Sales KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500">Deals Won</span>
                <span className="text-xs">🎉</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-slate-900">{salesStats.wonCount}</div>
              <span className="text-[10px] text-slate-500 font-bold">Closed Deals</span>
            </div>

            <div className="bg-[#fef9c3] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-900">Total Revenue</span>
                <span className="text-xs">💼</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-amber-900">
                ₹{salesStats.totalWonRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Gross Sales Closed</span>
            </div>

            <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-900">Commissions</span>
                <span className="text-xs">💰</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-800">
                ₹{salesStats.totalEarnedCommission.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">Total Partner Payouts</span>
            </div>

            <div className="bg-[#eff6ff] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-blue-900">Net Retained</span>
                <span className="text-xs">📈</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-blue-800">
                ₹{salesStats.netRetainedRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-blue-700 font-bold">Revenue after Comm</span>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500">Paid to Bank</span>
                <span className="text-xs">💳</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-slate-900">
                ₹{salesStats.totalPaidCommission.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-500 font-bold">Disbursed Payouts</span>
            </div>

            <div className="bg-amber-50 border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-900">Wallet Pending</span>
                <span className="text-xs">⏳</span>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-1 text-amber-700">
                ₹{(salesStats.availableBalance + salesStats.pendingPayout).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-700 font-bold">Undrawn in Wallets</span>
            </div>
          </div>

          {/* Performance Insights Bar */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#000]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-200">
              <div className="space-y-0.5">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Average Deal Value</span>
                <div className="text-lg font-black text-slate-900 font-mono">
                  ₹{salesStats.avgDealSize.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  Average revenue generated per closed client project.
                </p>
              </div>

              <div className="space-y-0.5 sm:pl-3 pt-2 sm:pt-0">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Average Commission / Deal</span>
                <div className="text-lg font-black text-emerald-700 font-mono">
                  ₹{salesStats.avgCommissionPerDeal.toLocaleString('en-IN')}
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  Average payout allocated to partner per win.
                </p>
              </div>

              <div className="space-y-0.5 sm:pl-3 pt-2 sm:pt-0">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Active Partners in Scope</span>
                <div className="text-lg font-black text-blue-700 font-mono">
                  {activeAffiliatesList.length} Partners
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  {isAllAffiliatesSelected ? 'Evaluating entire partner network' : 'Evaluating filtered partner cohort'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Sales & Revenue Trends Bar Chart */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">📈</span>
                <h3 className="font-black text-xs uppercase text-slate-900">
                  Monthly Revenue & Deals Closed (Last 6 Months)
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Gross Closed Deals
              </span>
            </div>

            <div className="pt-2 pb-1">
              <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-32 border-b-2 border-slate-900 px-2">
                {salesStats.monthlyTrends.map((m) => {
                  const heightPercent = salesStats.maxMonthlyRevenue > 0
                    ? Math.max(8, Math.round((m.revenue / salesStats.maxMonthlyRevenue) * 100))
                    : 8

                  return (
                    <div key={m.monthKey} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[9px] font-mono font-black text-slate-700 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        ₹{(m.revenue / 1000).toFixed(0)}k
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[48px] bg-[#86efac] hover:bg-[#4ade80] border-2 border-slate-900 rounded-t-md transition-all shadow-[1px_1px_0px_0px_#000] flex items-center justify-center text-[10px] font-black"
                        title={`${m.label}: ₹${m.revenue.toLocaleString('en-IN')} (${m.wonDeals} deals)`}
                      >
                        {m.wonDeals > 0 && <span>{m.wonDeals}</span>}
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-600 mt-1">
                        {m.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 2-Column: Product-Wise Sales Table + City Sales Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            
            {/* 1. Product-Wise Sales Table */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <span>📦</span>
                  <span>Product Sales & Revenue</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  {salesStats.productSalesList.length} Titles Closed
                </span>
              </div>

              {salesStats.productSalesList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center">
                  No closed sales recorded yet. Once deals are approved, metrics will appear here.
                </p>
              ) : (
                <div className="overflow-x-auto border border-slate-300 rounded-md">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-[#f1f5f9] border-b border-slate-900 uppercase font-black text-slate-700 text-[10px]">
                      <tr>
                        <th className="py-1.5 px-2.5">Software Product</th>
                        <th className="py-1.5 px-2.5 text-center">Deals</th>
                        <th className="py-1.5 px-2.5 text-right">Revenue (₹)</th>
                        <th className="py-1.5 px-2.5 text-right">Commission (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesStats.productSalesList.map((item) => (
                        <tr key={item.name} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2.5 font-black text-slate-900 flex items-center gap-1.5">
                            <span>{PRODUCT_ICONS[item.name] || '📦'}</span>
                            <span className="truncate">{item.name}</span>
                          </td>
                          <td className="py-1.5 px-2.5 text-center font-bold text-emerald-800">
                            <span className="px-1.5 py-0.2 bg-emerald-100 rounded-full text-[9.5px] font-black">
                              {item.count}
                            </span>
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-black text-slate-900">
                            ₹{item.revenue.toLocaleString('en-IN')}
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-black text-emerald-700">
                            ₹{item.commission.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. City-Wise Sales Table */}
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Territory Sales Revenue</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  {salesStats.citySalesList.length} Cities Closed
                </span>
              </div>

              {salesStats.citySalesList.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center">
                  No territory sales logged yet.
                </p>
              ) : (
                <div className="overflow-x-auto border border-slate-300 rounded-md">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-[#f1f5f9] border-b border-slate-900 uppercase font-black text-slate-700 text-[10px]">
                      <tr>
                        <th className="py-1.5 px-2.5">Territory / City</th>
                        <th className="py-1.5 px-2.5 text-center">Deals</th>
                        <th className="py-1.5 px-2.5 text-right">Revenue (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesStats.citySalesList.map((c) => (
                        <tr key={c.city} className="hover:bg-slate-50">
                          <td className="py-1.5 px-2.5 font-black text-slate-900 flex items-center gap-1.5">
                            <span>📍</span>
                            <span>{c.city}</span>
                          </td>
                          <td className="py-1.5 px-2.5 text-center font-bold text-emerald-800">
                            <span className="px-1.5 py-0.2 bg-emerald-100 rounded-full text-[9.5px] font-black">
                              {c.count}
                            </span>
                          </td>
                          <td className="py-1.5 px-2.5 text-right font-mono font-black text-slate-900">
                            ₹{c.revenue.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* Closed Deals Ledger (Verified Sales Records) */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                <span>🎉</span>
                <span>Verified Sales & Won Deals Ledger ({salesStats.wonLeads.length})</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">
                Super Admin Confirmed
              </span>
            </div>

            {salesStats.wonLeads.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No closed deals found matching the current filter.
              </p>
            ) : (
              <div className="overflow-x-auto border-2 border-slate-900 rounded-lg max-h-72 overflow-y-auto">
                <table className="w-full text-left text-[11px] font-mono border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-100 border-b-2 border-slate-900 uppercase font-black text-slate-700 text-[10px]">
                      <th className="py-2 px-3">School / Institution</th>
                      <th className="py-2 px-3">Partner Dossier</th>
                      <th className="py-2 px-3">Product Sold</th>
                      <th className="py-2 px-3 text-right">Deal Value</th>
                      <th className="py-2 px-3 text-right">Commission</th>
                      <th className="py-2 px-3 text-right">Date</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {salesStats.wonLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-black text-slate-900">
                          <div>{lead.organizationName}</div>
                          <div className="text-[9.5px] text-slate-500 font-medium">
                            {lead.contactPerson} • {lead.city || 'City N/A'}
                          </div>
                        </td>

                        <td className="py-2 px-3 font-bold text-slate-800">
                          <div>{lead.affiliate?.name || 'Direct'}</div>
                          <span className="text-[9px] px-1 bg-slate-100 border border-slate-300 rounded font-mono">
                            {lead.affiliate?.referralCode || '—'}
                          </span>
                        </td>

                        <td className="py-2 px-3 font-bold text-slate-700">
                          {lead.product}
                        </td>

                        <td className="py-2 px-3 text-right font-mono font-black text-slate-900">
                          ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="py-2 px-3 text-right font-mono font-black text-emerald-700">
                          ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="py-2 px-3 text-right text-[10px] text-slate-500 font-medium">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : '—'}
                        </td>

                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => {
                              setReviewModalLead(lead)
                              setReviewModalMode('approve')
                            }}
                            className="px-2 py-0.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-900 rounded text-[9.5px] font-black uppercase transition cursor-pointer"
                          >
                            Edit Deal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: TERRITORIES & CITIES (DEEP GEOGRAPHIC BREAKDOWN) */}
      {/* ========================================================================= */}
      {activeView === 'locations' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                📍 Territorial Intelligence & City Footprint
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                Geographical density of client leads across different cities and regions.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-100 border border-slate-900 text-emerald-950 rounded font-black">
              {leadStats.uniqueCitiesCount} Cities Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {leadStats.cityRanking.map((cityData) => (
              <div
                key={cityData.city}
                className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{cityData.city}</span>
                      </h3>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 bg-slate-100 border border-slate-900 rounded">
                      {cityData.total} leads
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-emerald-50 border border-emerald-300 rounded p-1.5">
                      <span className="text-[9px] font-black uppercase text-emerald-800 block">Won Deals</span>
                      <span className="text-base font-black text-emerald-900">{cityData.won}</span>
                    </div>
                    <div className="bg-sky-50 border border-sky-300 rounded p-1.5">
                      <span className="text-[9px] font-black uppercase text-sky-800 block">Win Rate</span>
                      <span className="text-base font-black text-sky-900">
                        {cityData.total > 0 ? Math.round((cityData.won / cityData.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCityFilter(cityData.city)
                    setActiveView('leads')
                  }}
                  className="mt-2 w-full py-1 bg-white hover:bg-slate-900 hover:text-white border border-slate-900 rounded text-[10px] font-black uppercase transition cursor-pointer"
                >
                  Filter Leads in {cityData.city} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: PARTNER DIRECTORY DOSSIER */}
      {/* ========================================================================= */}
      {activeView === 'partners' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
            <div>
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                🤝 Partner Dossier & Performance Matrix
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                Individual affiliate metrics, territory coverage, leads volume, and deal outcomes.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-yellow-100 border border-slate-900 text-yellow-950 rounded font-black">
              {allAffiliates.length} Registered Partners
            </span>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
                    <th className="p-3">Partner Dossier</th>
                    <th className="p-3 text-center">Leads Volume</th>
                    <th className="p-3 text-center">Deals Won</th>
                    <th className="p-3 text-right">Commissions Earned</th>
                    <th className="p-3 text-right">Paid Out</th>
                    <th className="p-3 text-right">Available Wallet</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-200 font-medium text-slate-800">
                  {allAffiliates.map((aff) => {
                    const isSelected = selectedAffiliateIds.includes(aff._id)
                    const affLeads = allLeads.filter(
                      (l) => String(l.affiliate?._id) === String(aff._id) || String(l.affiliate?.referralCode) === String(aff.referralCode)
                    )
                    const affWonLeads = affLeads.filter((l) => l.status === 'Deal Won' || l.status === 'Deal Confirmed')
                    const winRate = affLeads.length > 0 ? Math.round((affWonLeads.length / affLeads.length) * 100) : 0

                    return (
                      <tr
                        key={aff._id}
                        className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50' : ''}`}
                      >
                        <td className="p-3">
                          <div className="font-black text-slate-900 text-sm">{aff.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 bg-slate-100 border border-slate-900 rounded text-[10px] font-black text-slate-800">
                              🏷️ {aff.referralCode}
                            </span>
                            <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
                              {aff.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {aff.email} • {aff.phone || 'No phone'}
                          </div>
                        </td>

                        <td className="p-3 text-center font-mono">
                          <span className="text-base font-black text-slate-900">{affLeads.length}</span>
                        </td>

                        <td className="p-3 text-center font-mono">
                          <span className="text-base font-black text-emerald-700">{affWonLeads.length}</span>
                          <span className="block text-[9.5px] text-slate-500">{winRate}% win rate</span>
                        </td>

                        <td className="p-3 text-right font-mono font-black text-slate-900">
                          ₹{(aff.stats?.totalEarned || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3 text-right font-mono font-black text-blue-700">
                          ₹{(aff.stats?.totalPaid || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3 text-right font-mono font-black text-emerald-700">
                          ₹{(aff.stats?.availableBalance || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => {
                              selectSingleAffiliate(aff._id)
                              setActiveView('leads')
                            }}
                            className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-slate-900 rounded shadow-[1px_1px_0px_0px_#000] bg-white hover:bg-slate-900 hover:text-white transition cursor-pointer"
                          >
                            View Analytics ➔
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
