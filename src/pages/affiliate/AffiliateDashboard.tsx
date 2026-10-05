import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'
import AddLeadModal from './AddLeadModal'

interface DashboardData {
  profile: {
    id: string
    name: string
    email: string
    phone?: string
    referralCode: string
    payoutType?: 'percentage' | 'fixed'
    commissionRate: number
    fixedAmount?: number
    allowedProducts?: string[]
    status: string
    bankDetails?: any
  }
  stats: {
    clicks: number
    totalLeads: number
    dealsWon: number
    totalEarned: number
    totalPaid: number
    pendingPayout: number
  }
  recentLeads: AffiliateLeadItem[]
}

export default function AffiliateDashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const fetchDashboard = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliate-portal/dashboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success) {
        setData(res.data.data)
      }
    } catch (err: any) {
      console.error('Fetch affiliate dashboard error:', err)
      showErrorToast('Failed to load partner dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [token])

  const payoutType = (data?.profile?.payoutType || user?.affiliate?.payoutType || 'percentage') as 'percentage' | 'fixed'
  const commissionRate = data?.profile?.commissionRate ?? user?.affiliate?.commissionRate ?? 10
  const fixedAmount = data?.profile?.fixedAmount ?? user?.affiliate?.fixedAmount ?? 0
  const allowedProducts = data?.profile?.allowedProducts || user?.affiliate?.allowedProducts || []

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-black uppercase text-slate-500 font-mono">
        Loading partner metrics...
      </div>
    )
  }

  const stats = data?.stats || {
    clicks: 0,
    totalLeads: 0,
    dealsWon: 0,
    totalEarned: 0,
    totalPaid: 0,
    pendingPayout: 0
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Top Welcome & Lead Action Bar */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
            PARTNER DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1 text-slate-900">
            Welcome, {data?.profile?.name || user?.name}!
          </h1>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            {payoutType === 'fixed' ? (
              <>Your reward model is <span className="text-emerald-700 font-black">₹{fixedAmount.toLocaleString('en-IN')} Flat</span> per closed project.</>
            ) : (
              <>Your personal commission rate is <span className="text-emerald-700 font-black">{commissionRate}%</span> per closed deal.</>
            )}
          </p>
        </div>

        <button
          onClick={() => setIsLeadModalOpen(true)}
          className="px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span className="text-base leading-none">+</span>
          <span>Submit Client Lead</span>
        </button>
      </div>

      {/* Authorized Products Banner */}
      <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-500">Your Product Access:</span>
          <span className="px-2 py-0.5 bg-blue-50 border border-blue-600 text-blue-800 rounded font-black text-[11px]">
            {allowedProducts.length > 0 ? `${allowedProducts.length} Products Assigned` : 'All Products Allowed'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(allowedProducts.length > 0 ? allowedProducts : ['School ERP Pro', 'Timetable Pro', 'Attendance System', 'Result System', 'Web Builder Pro']).map((p) => (
            <span key={p} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-700">
              ✓ {p}
            </span>
          ))}
        </div>
      </div>

      {/* KPI Cards (4 Clean Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        
        {/* Total Leads */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Leads Submitted</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">{stats.totalLeads}</p>
          <span className="text-[10px] text-slate-400 font-bold">In client pipeline</span>
        </div>

        {/* Closed Deals */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Deals Won</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700">{stats.dealsWon}</p>
          <span className="text-[10px] text-slate-400 font-bold">Converted clients</span>
        </div>

        {/* Total Earned */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Earned</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">₹{stats.totalEarned.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-bold">Paid: ₹{stats.totalPaid.toLocaleString('en-IN')}</span>
        </div>

        {/* Pending Payout */}
        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Pending Settlement</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-rose-600">₹{stats.pendingPayout.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500 font-bold">Disbursed to your UPI/Bank</span>
        </div>

      </div>

      {/* Quick Promotion Kit Banner */}
      <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black uppercase text-slate-900">Need Marketing Kit & Product Brochures?</h3>
          <p className="text-xs text-slate-600">
            Get product demo decks, School ERP feature lists, and QR codes to show school administrators.
          </p>
        </div>
        <Link
          to="/affiliate/links"
          className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors text-center shadow-[1px_1px_0px_0px_#000]"
        >
          View Marketing Kit ➔
        </Link>
      </div>

      {/* Recent Leads Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
            Recent Client Leads
          </h2>
          <Link
            to="/affiliate/leads"
            className="text-xs font-black uppercase text-blue-700 hover:underline"
          >
            View All ({stats.totalLeads}) ➔
          </Link>
        </div>

        {(!data?.recentLeads || data.recentLeads.length === 0) ? (
          <div className="bg-white border-2 border-slate-900 rounded-lg p-8 text-center">
            <p className="text-sm font-black uppercase text-slate-600">No leads submitted yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Submit client leads directly using the button below to track your deal commissions.
            </p>
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]"
            >
              + Submit Your First Lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                <tr>
                  <th className="p-3">School / Client</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Est. Value</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium">
                {data.recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-black text-slate-900">{lead.organizationName}</div>
                      <div className="text-[11px] text-slate-500">{lead.contactPerson} ({lead.phone})</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{lead.product}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                        lead.status === 'Deal Won'
                          ? 'bg-[#86efac] text-slate-900'
                          : lead.status === 'Lost'
                          ? 'bg-rose-200 text-slate-900'
                          : lead.status === 'Demo Scheduled'
                          ? 'bg-[#93c5fd] text-slate-900'
                          : 'bg-amber-100 text-slate-900'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900">
                      ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-700">
                      ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        lead.commissionStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                          : lead.commissionStatus === 'Approved'
                          ? 'bg-blue-100 text-blue-800 border border-blue-400'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.commissionStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        token={token}
        payoutType={payoutType}
        commissionRate={commissionRate}
        fixedAmount={fixedAmount}
        allowedProducts={allowedProducts}
        onLeadAdded={fetchDashboard}
      />

    </div>
  )
}
