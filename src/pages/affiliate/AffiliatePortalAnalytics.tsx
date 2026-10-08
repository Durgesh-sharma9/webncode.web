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
        productCounts['General Inquiry'] = (productCounts['General Inquiry'] || 0) + 1
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
      .map(([city, data]) => ({ city, total: data.total, won: data.won }))
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
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded inline-block">
            PERFORMANCE INTELLIGENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            Partner Analytics
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Monitor client lead generation, pitch conversions, and closed deal commissions.
          </p>
        </div>

        {/* Timeframe Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center border-2 border-slate-900 rounded-lg overflow-hidden bg-white shadow-[2px_2px_0px_0px_#000]">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'quarter', label: '90 Days' },
              { id: 'month', label: '30 Days' }
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as any)}
                className={`px-3 py-1.5 text-[11px] font-black uppercase transition-all cursor-pointer ${
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
            title="Refresh Analytics"
            className="p-2 bg-white border-2 border-slate-900 rounded-lg font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition cursor-pointer"
          >
            🔄
          </button>
        </div>
      </div>

      {/* 2-TYPE ANALYTICS MASTER TOGGLE */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
        <button
          onClick={() => setAnalyticsView('leads')}
          className={`py-3 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            analyticsView === 'leads'
              ? 'bg-[#93c5fd] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <span className="text-base sm:text-lg">🎯</span>
          <span>Lead Analytics ({leadStats.total})</span>
        </button>

        <button
          onClick={() => setAnalyticsView('sales')}
          className={`py-3 px-4 rounded-lg font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
            analyticsView === 'sales'
              ? 'bg-[#86efac] text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <span className="text-base sm:text-lg">💰</span>
          <span>Sell Analytics ({salesStats.wonCount})</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-bold uppercase text-slate-500 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading performance analytics...
        </div>
      ) : (
        <>
          {/* ========================================================== */}
          {/* VIEW 1: LEAD ANALYTICS (LEADS KI ANALYTICS) */}
          {/* ========================================== */}
          {analyticsView === 'leads' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Lead KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-500">Total Leads Logged</span>
                  <div className="text-2xl font-black mt-1 text-slate-900">{leadStats.total}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Schools Pitched</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-500">💬 Active Pipeline</span>
                  <div className="text-2xl font-black mt-1 text-blue-700">{leadStats.inDiscussion}</div>
                  <span className="text-[10px] text-blue-600 font-bold">In Discussion</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-500">⏳ Reported Purchases</span>
                  <div className="text-2xl font-black mt-1 text-amber-600">{leadStats.reported}</div>
                  <span className="text-[10px] text-amber-600 font-bold">Super Admin Reviewing</span>
                </div>

                <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-700">Conversion Rate</span>
                  <div className="text-2xl font-black mt-1 text-emerald-800">{leadStats.conversionRate}%</div>
                  <span className="text-[10px] text-emerald-700 font-bold">{leadStats.won} of {leadStats.total} Won</span>
                </div>
              </div>

              {/* Lead Pipeline Funnel Visualizer */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
                  <div>
                    <h3 className="font-black text-sm uppercase text-slate-900">
                      📊 Lead Pipeline Stage Funnel
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Distribution of submitted leads across active, reported, won, and cancelled states.
                    </p>
                  </div>
                  <Link
                    to="/affiliate/leads"
                    className="text-[10px] font-black uppercase px-2.5 py-1 bg-amber-100 hover:bg-amber-200 border border-slate-900 rounded shadow-xs"
                  >
                    Open Leads Pipeline →
                  </Link>
                </div>

                {/* Progress Bar Funnel */}
                {leadStats.total === 0 ? (
                  <p className="text-xs text-slate-400 italic">No leads logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="w-full h-7 rounded-lg border-2 border-slate-900 overflow-hidden flex bg-slate-100 shadow-[1px_1px_0px_0px_#000]">
                      {leadStats.won > 0 && (
                        <div
                          style={{ width: `${(leadStats.won / leadStats.total) * 100}%` }}
                          className="bg-[#86efac] h-full transition-all flex items-center justify-center text-[10px] font-black text-slate-950"
                          title={`Won: ${leadStats.won}`}
                        >
                          🎉 {leadStats.won}
                        </div>
                      )}
                      {leadStats.reported > 0 && (
                        <div
                          style={{ width: `${(leadStats.reported / leadStats.total) * 100}%` }}
                          className="bg-amber-300 h-full transition-all flex items-center justify-center text-[10px] font-black text-slate-950"
                          title={`Reported: ${leadStats.reported}`}
                        >
                          ⏳ {leadStats.reported}
                        </div>
                      )}
                      {leadStats.inDiscussion > 0 && (
                        <div
                          style={{ width: `${(leadStats.inDiscussion / leadStats.total) * 100}%` }}
                          className="bg-blue-300 h-full transition-all flex items-center justify-center text-[10px] font-black text-slate-950"
                          title={`Discussion: ${leadStats.inDiscussion}`}
                        >
                          💬 {leadStats.inDiscussion}
                        </div>
                      )}
                      {leadStats.lost > 0 && (
                        <div
                          style={{ width: `${(leadStats.lost / leadStats.total) * 100}%` }}
                          className="bg-rose-200 h-full transition-all flex items-center justify-center text-[10px] font-black text-slate-950"
                          title={`Lost: ${leadStats.lost}`}
                        >
                          ❌ {leadStats.lost}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-[#86efac] border border-slate-900" />
                        <span className="font-bold text-slate-700">🎉 Won: {leadStats.won}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-300 border border-slate-900" />
                        <span className="font-bold text-slate-700">⏳ Reported: {leadStats.reported}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-blue-300 border border-slate-900" />
                        <span className="font-bold text-slate-700">💬 Discussion: {leadStats.inDiscussion}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-rose-200 border border-slate-900" />
                        <span className="font-bold text-slate-700">❌ Cancelled: {leadStats.lost}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2-Columns: Products Pitched + Geographic Footprint */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Software Pitched Breakdown */}
                <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                    <h3 className="font-black text-xs uppercase text-slate-900">
                      📦 Software Products Pitched
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500">
                      {leadStats.productRanking.length} Unique Titles
                    </span>
                  </div>

                  {leadStats.productRanking.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No pitch data logged yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {leadStats.productRanking.map((prod) => {
                        const percent = leadStats.total > 0 ? Math.round((prod.count / leadStats.total) * 100) : 0
                        return (
                          <div key={prod.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="truncate text-slate-800">{prod.name}</span>
                              <span className="font-mono text-slate-900 shrink-0 ml-2">
                                {prod.count} leads ({percent}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded bg-slate-100 border border-slate-400 overflow-hidden">
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
                <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                    <h3 className="font-black text-xs uppercase text-slate-900">
                      📍 Geographic Footprint (Cities)
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500">
                      {leadStats.uniqueCitiesCount} Cities Reached
                    </span>
                  </div>

                  {leadStats.cityRanking.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No city locations logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {leadStats.cityRanking.slice(0, 5).map((c) => (
                        <div
                          key={c.city}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#f8fafc] border border-slate-300 text-xs font-bold"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span>📍</span>
                            <span className="text-slate-900 truncate">{c.city}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-slate-600">{c.total} leads</span>
                            {c.won > 0 && (
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black">
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

            </div>
          )}

          {/* ========================================================== */}
          {/* VIEW 2: SELL ANALYTICS (SELL KI ANALYTICS) */}
          {/* ========================================================== */}
          {analyticsView === 'sales' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Sales KPIs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-500">Total Deals Won</span>
                  <div className="text-2xl font-black mt-1 text-slate-900">{salesStats.wonCount}</div>
                  <span className="text-[10px] text-slate-500 font-bold">Closed Schools</span>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-slate-500">Revenue Generated</span>
                  <div className="text-2xl font-black mt-1 text-slate-900">
                    ₹{salesStats.totalWonRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">Deal Value to Web n Code</span>
                </div>

                <div className="bg-[#86efac]/30 border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-emerald-900">Commission Earned</span>
                  <div className="text-2xl font-black mt-1 text-emerald-800">
                    ₹{salesStats.totalEarnedCommission.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {isFixed ? `Flat ₹${aff?.fixedAmount || 0} / deal` : `${aff?.commissionRate || 10}% rate`}
                  </span>
                </div>

                <div className="bg-amber-50 border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000]">
                  <span className="text-[10px] font-black uppercase text-amber-900">Pending in Wallet</span>
                  <div className="text-2xl font-black mt-1 text-amber-700">
                    ₹{salesStats.pendingPayout.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-700 font-bold">
                    Paid: ₹{salesStats.paidCommission.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Deal Size Insights Bar */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Average Deal Size</span>
                    <div className="text-xl font-black text-slate-900 font-mono">
                      ₹{salesStats.avgDealSize.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Average order value per converted school or client institution.
                    </p>
                  </div>
                  <div className="space-y-1 sm:pl-4 pt-3 sm:pt-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Average Commission / Deal</span>
                    <div className="text-xl font-black text-emerald-700 font-mono">
                      ₹{salesStats.avgCommissionPerDeal.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Average commission credited to you per confirmed deal won.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product-Wise Sales Performance Table */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
                  <div>
                    <h3 className="font-black text-xs sm:text-sm uppercase text-slate-900">
                      📦 Product-Wise Sales & Commission Breakdown
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Which products generated the most sales revenue and commissions for you.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">
                    {salesStats.productSalesList.length} Products Sold
                  </span>
                </div>

                {salesStats.productSalesList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    No closed sales recorded yet. Once Super Admin approves reported deals, sales metrics will display here!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black text-slate-700">
                        <tr>
                          <th className="p-2.5">Software Product</th>
                          <th className="p-2.5 text-center">Deals Won</th>
                          <th className="p-2.5 text-right">Total Deal Value (₹)</th>
                          <th className="p-2.5 text-right">Commission Earned (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {salesStats.productSalesList.map((item) => (
                          <tr key={item.name} className="hover:bg-slate-50">
                            <td className="p-2.5 font-black text-slate-900 flex items-center gap-1.5">
                              <span>📦</span>
                              <span>{item.name}</span>
                            </td>
                            <td className="p-2.5 text-center font-bold text-emerald-800">
                              <span className="px-2 py-0.5 bg-emerald-100 rounded-full text-[10px] font-black">
                                {item.count} deals
                              </span>
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              ₹{item.revenue.toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-right font-mono font-black text-emerald-700">
                              ₹{item.commission.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Won Deals Ledger (Closed Sales Records) */}
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
                  <div>
                    <h3 className="font-black text-xs sm:text-sm uppercase text-slate-900">
                      🎉 Closed Deals Sales Ledger ({salesStats.wonLeads.length})
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Every confirmed school order approved by Super Admin and credited to your wallet.
                    </p>
                  </div>
                  <Link
                    to="/affiliate/earnings"
                    className="text-[10px] font-black uppercase px-2.5 py-1 bg-[#86efac] hover:bg-[#6ee7b7] border border-slate-900 rounded shadow-xs"
                  >
                    Withdraw Earnings →
                  </Link>
                </div>

                {salesStats.wonLeads.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    No closed deals yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black text-slate-700">
                        <tr>
                          <th className="p-2.5">School / Institution</th>
                          <th className="p-2.5">Product Sold</th>
                          <th className="p-2.5 text-right">Deal Value</th>
                          <th className="p-2.5 text-right">Your Commission</th>
                          <th className="p-2.5 text-center">Payout Status</th>
                          <th className="p-2.5 text-right">Date Closed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {salesStats.wonLeads.map((lead) => (
                          <tr key={lead._id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-black text-slate-900">
                              <div>{lead.organizationName}</div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                Contact: {lead.contactPerson} ({lead.city || 'City N/A'})
                              </div>
                            </td>
                            <td className="p-2.5 font-bold text-slate-700">
                              {lead.product}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-right font-mono font-black text-emerald-700">
                              ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                                  lead.commissionStatus === 'Paid'
                                    ? 'bg-emerald-200 text-emerald-950'
                                    : 'bg-blue-100 text-blue-950'
                                }`}
                              >
                                {lead.commissionStatus === 'Paid' ? 'Paid' : 'Approved'}
                              </span>
                            </td>
                            <td className="p-2.5 text-right font-mono text-[10px] text-slate-500">
                              {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
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
