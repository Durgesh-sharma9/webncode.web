import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'

interface PayoutRecord {
  _id: string
  amount: number
  paymentMethod: string
  transactionReference?: string
  status: 'Pending' | 'Paid' | 'Rejected'
  paidAt?: string
  createdAt: string
}

export default function AffiliatePortalAnalytics() {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [payouts, setPayouts] = useState<PayoutRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Active Analytics Tab: 'leads' vs 'sales'
  const [analyticsView, setAnalyticsView] = useState<'leads' | 'sales'>('leads')

  // Date Range Filter: 'all', 'month', 'quarter'
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'quarter'>('all')

  // Search & filter for leads list in analytics
  const [tableSearch, setTableSearch] = useState('')
  const [tableStatus, setTableStatus] = useState<'all' | 'discussion' | 'reported' | 'won' | 'lost'>('all')

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined
      const [leadsRes, payoutsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/affiliate-portal/leads`, { headers }),
        axios.get(`${API_BASE}/api/affiliate-portal/payouts`, { headers }).catch(() => ({ data: { data: [] } }))
      ])

      if (leadsRes.data?.success && Array.isArray(leadsRes.data.data)) {
        setLeads(leadsRes.data.data)
      }
      if (payoutsRes.data?.data && Array.isArray(payoutsRes.data.data)) {
        setPayouts(payoutsRes.data.data)
      }
    } catch (err) {
      console.error('Fetch affiliate analytics error:', err)
      showErrorToast('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // Filter leads based on selected timeframe
  const filteredLeads = useMemo(() => {
    if (timeframe === 'all') return leads

    const now = new Date().getTime()
    const days = timeframe === 'month' ? 30 : 90
    const cutoff = now - days * 24 * 60 * 60 * 1000

    return leads.filter((l) => new Date(l.createdAt).getTime() >= cutoff)
  }, [leads, timeframe])

  // ==========================================
  // 1. LEAD ANALYTICS COMPUTATIONS
  // ==========================================
  const leadStats = useMemo(() => {
    const total = filteredLeads.length
    const won = filteredLeads.filter((l) => l.status === 'Deal Won').length
    const reported = filteredLeads.filter((l) => l.status === 'Deal Confirmed').length
    const lost = filteredLeads.filter((l) => l.status === 'Lost').length
    const inDiscussion = total - won - reported - lost

    const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0

    // Pitched products count
    const productCounts: Record<string, number> = {}
    filteredLeads.forEach((l) => {
      const prods = (l.products && l.products.length > 0
        ? l.products
        : l.product ? l.product.split(', ') : []
      ).filter(Boolean)

      if (prods.length === 0) {
        productCounts['General Pitch'] = (productCounts['General Pitch'] || 0) + 1
      } else {
        prods.forEach((p) => {
          const clean = p.split(' - ')[0].trim()
          productCounts[clean] = (productCounts[clean] || 0) + 1
        })
      }
    })

    const productRanking = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Cities count
    const cityCounts: Record<string, { total: number; won: number }> = {}
    filteredLeads.forEach((l) => {
      const city = (l.city || '').trim() || 'Unknown Location'
      if (!cityCounts[city]) {
        cityCounts[city] = { total: 0, won: 0 }
      }
      cityCounts[city].total += 1
      if (l.status === 'Deal Won') {
        cityCounts[city].won += 1
      }
    })

    const cityRanking = Object.entries(cityCounts)
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.total - a.total)

    return {
      total,
      won,
      reported,
      lost,
      inDiscussion,
      conversionRate,
      productRanking,
      cityRanking,
      uniqueCitiesCount: Object.keys(cityCounts).length
    }
  }, [filteredLeads])

  // Pipeline status distribution for circular pie/donut graph
  const statusPieData = useMemo(() => {
    const total = leadStats.total || 0
    if (total === 0) {
      return {
        hasData: false,
        gradient: 'conic-gradient(#e2e8f0 0deg 360deg)',
        slices: []
      }
    }

    const wonPct = Math.round((leadStats.won / total) * 100)
    const repPct = Math.round((leadStats.reported / total) * 100)
    const discPct = Math.round((leadStats.inDiscussion / total) * 100)
    const lostPct = Math.max(0, 100 - wonPct - repPct - discPct)

    const degWon = (leadStats.won / total) * 360
    const degRep = degWon + (leadStats.reported / total) * 360
    const degDisc = degRep + (leadStats.inDiscussion / total) * 360

    const gradient = `conic-gradient(#86efac 0deg ${degWon}deg, #fde047 ${degWon}deg ${degRep}deg, #7dd3fc ${degRep}deg ${degDisc}deg, #fca5a5 ${degDisc}deg 360deg)`

    return {
      hasData: true,
      gradient,
      slices: [
        { label: 'Won', count: leadStats.won, pct: wonPct, dot: 'bg-[#86efac]' },
        { label: 'Reported', count: leadStats.reported, pct: repPct, dot: 'bg-amber-300' },
        { label: 'Discussion', count: leadStats.inDiscussion, pct: discPct, dot: 'bg-sky-300' },
        { label: 'Cancelled', count: leadStats.lost, pct: lostPct, dot: 'bg-rose-200' },
      ]
    }
  }, [leadStats])


  // Filtered leads displayed in the analytics leads list
  const displayedLeads = useMemo(() => {
    return filteredLeads.filter((l) => {
      // Status filter
      if (tableStatus === 'won' && l.status !== 'Deal Won') return false
      if (tableStatus === 'reported' && l.status !== 'Deal Confirmed') return false
      if (tableStatus === 'lost' && l.status !== 'Lost') return false
      if (
        tableStatus === 'discussion' &&
        (l.status === 'Deal Won' || l.status === 'Deal Confirmed' || l.status === 'Lost')
      )
        return false

      // Search filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase()
        const org = (l.organizationName || '').toLowerCase()
        const person = (l.contactPerson || '').toLowerCase()
        const city = (l.city || '').toLowerCase()
        const phone = (l.phone || '').toLowerCase()
        const prods = (l.products || []).join(' ').toLowerCase()
        const singleProd = (l.product || '').toLowerCase()
        if (
          !org.includes(q) &&
          !person.includes(q) &&
          !city.includes(q) &&
          !phone.includes(q) &&
          !prods.includes(q) &&
          !singleProd.includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [filteredLeads, tableStatus, tableSearch])

  // ==========================================
  // 2. SALES ANALYTICS COMPUTATIONS
  // ==========================================
  const salesStats = useMemo(() => {
    const wonLeads = filteredLeads.filter((l) => l.status === 'Deal Won')
    const totalWonRevenue = wonLeads.reduce((acc, l) => acc + (l.dealValue || 0), 0)
    const totalEarnedCommission = wonLeads.reduce((acc, l) => acc + (l.commissionAmount || 0), 0)

    const paidCommission = payouts
      .filter((p) => p.status === 'Paid')
      .reduce((acc, p) => acc + (p.amount || 0), 0)

    const pendingPayout = Math.max(0, totalEarnedCommission - paidCommission)
    const avgDealSize = wonLeads.length > 0 ? Math.round(totalWonRevenue / wonLeads.length) : 0
    const avgCommissionPerDeal = wonLeads.length > 0 ? Math.round(totalEarnedCommission / wonLeads.length) : 0

    // Product-wise sales revenue & commission
    const productSalesMap: Record<string, { count: number; revenue: number; commission: number }> = {}
    wonLeads.forEach((l) => {
      const prod = l.product ? l.product.split(' - ')[0].trim() : 'Software Solution'
      if (!productSalesMap[prod]) {
        productSalesMap[prod] = { count: 0, revenue: 0, commission: 0 }
      }
      productSalesMap[prod].count += 1
      productSalesMap[prod].revenue += l.dealValue || 0
      productSalesMap[prod].commission += l.commissionAmount || 0
    })

    const productSalesList = Object.entries(productSalesMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      wonLeads,
      wonCount: wonLeads.length,
      totalWonRevenue,
      totalEarnedCommission,
      paidCommission,
      pendingPayout,
      avgDealSize,
      avgCommissionPerDeal,
      productSalesList
    }
  }, [filteredLeads, payouts])


  const aff = user?.affiliate
  const isFixed = aff?.payoutType === 'fixed'

  return (
    <div className="space-y-3.5 font-mono text-slate-900">
      {/* Top Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
              PERFORMANCE INTELLIGENCE
            </span>
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">Partner Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-0.5">
            Partner Analytics
          </h1>
        </div>

        {/* Timeframe Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center border-2 border-slate-900 rounded-lg overflow-hidden bg-white shadow-[2px_2px_0px_0px_#000]">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'quarter', label: '90D' },
              { id: 'month', label: '30D' }
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`px-2.5 py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                  timeframe === tf.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-1.5 bg-white border-2 border-slate-900 rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition cursor-pointer"
          >
            🔄
          </button>
        </div>
      </div>

      {/* 2-TYPE ANALYTICS MASTER TOGGLE - Sleek & Compact */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000]">
        <button
          onClick={() => setAnalyticsView('leads')}
          className={`py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            analyticsView === 'leads'
              ? 'bg-[#93c5fd] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <span className="text-sm">🎯</span>
          <span>Lead Analytics ({leadStats.total})</span>
        </button>

        <button
          onClick={() => setAnalyticsView('sales')}
          className={`py-2 px-3 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            analyticsView === 'sales'
              ? 'bg-[#86efac] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <span className="text-sm">💰</span>
          <span>Sell Analytics ({salesStats.wonCount})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs font-bold uppercase text-slate-500 bg-white border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000]">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading performance data...
        </div>
      ) : (
        <>
          {/* ========================================================== */}
          {/* VIEW 1: LEAD ANALYTICS (LEADS KI ANALYTICS) */}
          {/* ========================================================== */}
          {analyticsView === 'leads' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Lead KPIs Grid - Compact single-row layout */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">Total Leads</span>
                    <span className="text-xs">🏢</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900">{leadStats.total}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Schools Pitched</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-700">Discussion</span>
                    <span className="text-xs">💬</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-blue-700">{leadStats.inDiscussion}</div>
                  <span className="text-[10px] text-blue-600 font-bold">Active Pipeline</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-700">Reported Deals</span>
                    <span className="text-xs">⏳</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-amber-600">{leadStats.reported}</div>
                  <span className="text-[10px] text-amber-600 font-bold">In Review</span>
                </div>

                <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-800">Conversion</span>
                    <span className="text-xs">📈</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-emerald-800">{leadStats.conversionRate}%</div>
                  <span className="text-[10px] text-emerald-700 font-bold">{leadStats.won} of {leadStats.total} Won</span>
                </div>
              </div>

              {/* Lead Pipeline Funnel Visualizer - Compact */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <h3 className="font-black text-xs uppercase text-slate-900">
                      Lead Pipeline Stage Funnel
                    </h3>
                  </div>
                  <Link
                    to="/affiliate/leads"
                    className="text-[9.5px] font-black uppercase px-2 py-0.5 bg-amber-100 hover:bg-amber-200 border border-slate-900 rounded shadow-xs"
                  >
                    Open Leads →
                  </Link>
                </div>

                {/* Progress Bar Funnel */}
                {leadStats.total === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">No leads logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full h-4 sm:h-5 rounded-md border-2 border-slate-900 overflow-hidden flex bg-slate-100 shadow-[1px_1px_0px_0px_#000]">
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
                          className="bg-amber-300 h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                          title={`Reported: ${leadStats.reported}`}
                        >
                          ⏳ {leadStats.reported}
                        </div>
                      )}
                      {leadStats.inDiscussion > 0 && (
                        <div
                          style={{ width: `${(leadStats.inDiscussion / leadStats.total) * 100}%` }}
                          className="bg-sky-300 h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                          title={`Discussion: ${leadStats.inDiscussion}`}
                        >
                          💬 {leadStats.inDiscussion}
                        </div>
                      )}
                      {leadStats.lost > 0 && (
                        <div
                          style={{ width: `${(leadStats.lost / leadStats.total) * 100}%` }}
                          className="bg-rose-200 h-full transition-all flex items-center justify-center text-[9px] font-black text-slate-950"
                          title={`Cancelled: ${leadStats.lost}`}
                        >
                          ❌ {leadStats.lost}
                        </div>
                      )}
                    </div>

                    {/* Compact Funnel Legend */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-[#86efac] border border-slate-900" />
                        <span className="font-bold text-slate-800">Won: {leadStats.won}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-amber-300 border border-slate-900" />
                        <span className="font-bold text-slate-800">Reported: {leadStats.reported}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-sky-300 border border-slate-900" />
                        <span className="font-bold text-slate-800">Discussion: {leadStats.inDiscussion}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-rose-200 border border-slate-900" />
                        <span className="font-bold text-slate-800">Cancelled: {leadStats.lost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Intelligence: Pipeline Pie Graph + Products Pitched + Cities Reached */}
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
                    <div className="flex items-center justify-around gap-2 py-1 my-auto">
                      {/* Donut Circle */}
                      <div
                        className="relative w-28 h-28 sm:w-30 sm:h-30 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] shrink-0 flex items-center justify-center transition-transform hover:scale-105"
                        style={{ background: statusPieData.gradient }}
                      >
                        {/* Donut Hole */}
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

                {/* 2. Software Pitched Breakdown */}
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

                {/* 2. Geographic Footprint (Cities Covered) */}
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

              {/* 3. Comprehensive All Leads List - Compact Portfolio Table */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-900 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <h3 className="font-black text-xs sm:text-sm uppercase text-slate-900 font-mono">
                      All Client Leads Portfolio ({displayedLeads.length})
                    </h3>
                  </div>

                  <Link
                    to="/affiliate/leads"
                    className="self-start sm:self-auto px-2.5 py-1 bg-[#ff9e7d] text-slate-900 border-2 border-slate-900 rounded-md text-[10px] font-black uppercase font-mono shadow-[1px_1px_0px_0px_#000] hover:bg-[#ff8f6b] transition flex items-center gap-1"
                  >
                    <span>Manage Leads</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Filter & Search Bar - Compact */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
                  {/* Status Filter Chips */}
                  <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
                    {[
                      { id: 'all', label: 'All', count: filteredLeads.length },
                      { id: 'discussion', label: 'Discussion', count: leadStats.inDiscussion },
                      { id: 'reported', label: 'Reported', count: leadStats.reported },
                      { id: 'won', label: 'Won', count: leadStats.won },
                      { id: 'lost', label: 'Cancelled', count: leadStats.lost },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setTableStatus(tab.id as any)}
                        className={`px-2 py-0.5 rounded border font-black transition cursor-pointer flex items-center gap-1 ${
                          tableStatus === tab.id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[9px] px-1 rounded-full ${
                            tableStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search school, city, product..."
                      className="w-full pl-7 pr-6 py-1 bg-slate-50 border-2 border-slate-900 rounded-md text-[11px] font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">🔍</span>
                    {tableSearch && (
                      <button
                        onClick={() => setTableSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-900"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Table View */}
                {displayedLeads.length === 0 ? (
                  <div className="p-6 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    No leads found matching your search.
                  </div>
                ) : (
                  <div className="overflow-x-auto border-2 border-slate-900 rounded-lg max-h-72 overflow-y-auto">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-slate-100 border-b-2 border-slate-900 text-[10px] font-black uppercase text-slate-700">
                          <th className="py-1.5 px-2.5">Institution / Client</th>
                          <th className="py-1.5 px-2.5">Location</th>
                          <th className="py-1.5 px-2.5">Products Pitched</th>
                          <th className="py-1.5 px-2.5">Stage</th>
                          <th className="py-1.5 px-2.5 text-right">Commission</th>
                          <th className="py-1.5 px-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {displayedLeads.map((lead) => {
                          const prods = (lead.products && lead.products.length > 0
                            ? lead.products
                            : lead.product ? lead.product.split(', ') : []
                          ).filter(Boolean)

                          return (
                            <tr key={lead._id} className="hover:bg-amber-50/40 transition">
                              <td className="py-1.5 px-2.5">
                                <div className="font-black text-slate-900 truncate max-w-[190px] sm:max-w-[240px]">
                                  {lead.organizationName}
                                </div>
                                <div className="text-[9.5px] text-slate-500 font-bold truncate max-w-[190px]">
                                  {lead.contactPerson || 'Contact N/A'} {lead.phone ? `• ${lead.phone}` : ''}
                                </div>
                              </td>
                              <td className="py-1.5 px-2.5 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700">
                                  <span>📍</span>
                                  <span>{lead.city || 'Unspecified'}</span>
                                </span>
                              </td>
                              <td className="py-1.5 px-2.5">
                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                  {prods.length > 0 ? (
                                    prods.map((p, idx) => (
                                      <span
                                        key={idx}
                                        className="px-1.5 py-0.2 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[9px] font-bold whitespace-nowrap"
                                      >
                                        {p.split(' - ')[0]}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-slate-400 italic text-[9.5px]">General Pitch</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-1.5 px-2.5 whitespace-nowrap">
                                {lead.status === 'Deal Won' ? (
                                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[9.5px] font-black uppercase">
                                    ✓ Won
                                  </span>
                                ) : lead.status === 'Deal Confirmed' ? (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[9.5px] font-black uppercase">
                                    ⏳ Reported
                                  </span>
                                ) : lead.status === 'Lost' ? (
                                  <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded text-[9.5px] font-black uppercase">
                                    ❌ Cancelled
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-sky-100 text-sky-800 border border-sky-300 rounded text-[9.5px] font-black uppercase">
                                    💬 Discussion
                                  </span>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 text-right font-black whitespace-nowrap">
                                {lead.commissionAmount ? (
                                  <span className="text-emerald-700 font-bold">₹{lead.commissionAmount.toLocaleString('en-IN')}</span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 text-right whitespace-nowrap">
                                <Link
                                  to="/affiliate/leads"
                                  className="px-2 py-0.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-900 rounded text-[9.5px] font-black uppercase transition inline-block"
                                >
                                  View
                                </Link>
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

          {/* ========================================================== */}
          {/* VIEW 2: SELL ANALYTICS (SELL KI ANALYTICS) */}
          {/* ========================================================== */}
          {analyticsView === 'sales' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Sales KPIs Grid - Compact */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">Deals Won</span>
                    <span className="text-xs">🎉</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900">{salesStats.wonCount}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Closed Schools</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500">Revenue</span>
                    <span className="text-xs">💼</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-slate-900">
                    ₹{salesStats.totalWonRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">Total Deal Value</span>
                </div>

                <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-900">Commission</span>
                    <span className="text-xs">💰</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-emerald-800">
                    ₹{salesStats.totalEarnedCommission.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {isFixed ? `Flat ₹${aff?.fixedAmount || 0}` : `${aff?.commissionRate || 10}% rate`}
                  </span>
                </div>

                <div className="bg-amber-50 border-2 border-slate-900 rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-900">Wallet</span>
                    <span className="text-xs">🏦</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-amber-700">
                    ₹{salesStats.pendingPayout.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">
                    Paid: ₹{salesStats.paidCommission.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>


              {/* Performance Insights Bar - Compact */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Total Converted Deals</span>
                    <div className="text-lg font-black text-slate-900 font-mono">
                      {salesStats.wonCount} {salesStats.wonCount === 1 ? 'Client' : 'Clients'}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Successful client closures verified & approved.
                    </p>
                  </div>
                  <div className="space-y-0.5 sm:pl-3 pt-2 sm:pt-0">
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Average Commission / Deal</span>
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      ₹{salesStats.avgCommissionPerDeal.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold">
                      Average commission credited per closed deal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product-Wise Sales Performance Table - Compact */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                    <span>📦</span>
                    <span>Product-Wise Commission Performance</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500">
                    {salesStats.productSalesList.length} Titles
                  </span>
                </div>

                {salesStats.productSalesList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    No closed sales recorded yet. Once Super Admin approves deals, metrics will show here.
                  </p>
                ) : (
                  <div className="overflow-x-auto border border-slate-300 rounded-md">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-[#f1f5f9] border-b border-slate-900 uppercase font-black text-slate-700 text-[10px]">
                        <tr>
                          <th className="py-1.5 px-2.5">Software Product</th>
                          <th className="py-1.5 px-2.5 text-center">Deals Won</th>
                          <th className="py-1.5 px-2.5 text-right">Commission Earned (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesStats.productSalesList.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-black text-slate-900 flex items-center gap-1.5">
                              <span>📦</span>
                              <span>{item.name}</span>
                            </td>
                            <td className="py-1.5 px-2.5 text-center font-bold text-emerald-800">
                              <span className="px-1.5 py-0.2 bg-emerald-100 rounded-full text-[9.5px] font-black">
                                {item.count} deals
                              </span>
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

              {/* Won Deals Ledger (Closed Sales Records) - Compact */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_0px_#000] space-y-2.5">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h3 className="font-black text-xs uppercase text-slate-900 flex items-center gap-1.5">
                    <span>🎉</span>
                    <span>Closed Deals Commission Ledger ({salesStats.wonLeads.length})</span>
                  </h3>
                  <Link
                    to="/affiliate/earnings"
                    className="text-[9.5px] font-black uppercase px-2 py-0.5 bg-[#86efac] hover:bg-[#6ee7b7] border border-slate-900 rounded shadow-xs"
                  >
                    Withdrawals →
                  </Link>
                </div>

                {salesStats.wonLeads.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-3 text-center">
                    No closed deals yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto border border-slate-300 rounded-md">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-[#f1f5f9] border-b border-slate-900 uppercase font-black text-slate-700 text-[10px]">
                        <tr>
                          <th className="py-1.5 px-2.5">School / Institution</th>
                          <th className="py-1.5 px-2.5">Product Sold</th>
                          <th className="py-1.5 px-2.5 text-right">Commission Credited</th>
                          <th className="py-1.5 px-2.5 text-center">Status</th>
                          <th className="py-1.5 px-2.5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {salesStats.wonLeads.map((lead) => (
                          <tr key={lead._id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-black text-slate-900">
                              <div>{lead.organizationName}</div>
                              <div className="text-[9.5px] text-slate-500 font-medium">
                                {lead.contactPerson} ({lead.city || 'City N/A'})
                              </div>
                            </td>
                            <td className="py-1.5 px-2.5 font-bold text-slate-700">
                              {lead.product}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono font-black text-emerald-700">
                              ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-1.5 px-2.5 text-center">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border border-slate-900 ${
                                  lead.commissionStatus === 'Paid'
                                    ? 'bg-emerald-200 text-emerald-950'
                                    : 'bg-blue-100 text-blue-950'
                                }`}
                              >
                                {lead.commissionStatus === 'Paid' ? 'Paid' : 'Approved'}
                              </span>
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono text-[9.5px] text-slate-500">
                              {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })}
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
        </>
      )}
    </div>
  )
}
