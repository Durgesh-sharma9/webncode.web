import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'
import AddLeadModal from './AddLeadModal'
import RequestWithdrawalModal from './RequestWithdrawalModal'
import PayoutCongratsModal from './PayoutCongratsModal'

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
    clicks?: number
    totalLeads?: number
    dealsWon?: number
    totalEarned?: number
    totalPaid?: number
    pendingPayout?: number
    pendingWithdrawal?: number
    availableBalance?: number
  }
  latestPaidPayout?: {
    id: string
    amount: number
    paidAt?: string
    transactionReference?: string
    paymentMethod?: string
  } | null
  recentLeads: AffiliateLeadItem[]
}

export default function AffiliateDashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)

  const fetchDashboard = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliate-portal/dashboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success) {
        setData(res.data.data)
        const payout = res.data.data?.latestPaidPayout
        if (payout?.id) {
          const seenKey = `payout_congrats_seen_${payout.id}`
          if (!sessionStorage.getItem(seenKey)) {
            setShowCongrats(true)
          }
        }
      }
    } catch (err: any) {
      console.error('Fetch affiliate dashboard error:', err)
      showErrorToast('Failed to load partner dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismissCongrats = () => {
    if (data?.latestPaidPayout?.id) {
      sessionStorage.setItem(`payout_congrats_seen_${data.latestPaidPayout.id}`, 'true')
    }
    setShowCongrats(false)
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

  const stats = {
    clicks: 0,
    totalLeads: 0,
    dealsWon: 0,
    totalEarned: 0,
    totalPaid: 0,
    pendingPayout: 0,
    pendingWithdrawal: 0,
    availableBalance: 0,
    ...(data?.stats || {})
  }

  const availableBalance = stats.availableBalance ?? Math.max(0, (stats.totalEarned || 0) - (stats.totalPaid || 0) - (stats.pendingWithdrawal || 0))
  const pendingSettlement = stats.pendingWithdrawal ?? stats.pendingPayout ?? 0

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
              <>Your reward model is <span className="text-emerald-700 font-black">₹{(fixedAmount || 0).toLocaleString('en-IN')} Flat</span> per closed project.</>
            ) : (
              <>Your personal commission rate is <span className="text-emerald-700 font-black">{commissionRate}%</span> per closed deal.</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {availableBalance > 0 && (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-4 py-2.5 bg-[#fef08a] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>💸</span>
              <span>Withdraw ₹{availableBalance.toLocaleString('en-IN')}</span>
            </button>
          )}

          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-base leading-none">+</span>
            <span>Submit Client Lead</span>
          </button>
        </div>
      </div>

      {/* 24-48 Hours Verification Notice Banner - ONLY shown when withdrawal is pending */}
      {pendingSettlement > 0 ? (
        <div className="bg-[#fef08a] border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex items-start gap-3">
          <span className="text-2xl leading-none">🕒</span>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-black uppercase text-slate-900 tracking-wider text-sm">
                Withdrawal In Verification (24-48 Hours Policy)
              </span>
              <span className="px-2 py-0.5 bg-amber-200 border border-slate-900 rounded text-[10px] font-black text-slate-900 uppercase">
                Under Process
              </span>
            </div>
            <p className="text-slate-800 font-bold mt-1 leading-relaxed">
              Aapki ₹{pendingSettlement.toLocaleString('en-IN')} ki payout request admin team ke paas process ho rahi hai. <strong>24 se 48 ghante (24-48 Hours) ke andar</strong> aapke UPI ya Bank account me paise credit ho jayenge.
            </p>
          </div>
        </div>
      ) : data?.latestPaidPayout ? (
        /* Payout Complete Celebratory Bar */
        <div className="bg-[#86efac] border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">🎉</span>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black uppercase text-slate-900 tracking-wider text-sm">
                  Congratulations! Payout Credited
                </span>
                <span className="px-2 py-0.5 bg-white border border-slate-900 rounded text-[10px] font-black text-emerald-900 uppercase">
                  ✓ PAID ₹{data.latestPaidPayout.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-slate-900 font-bold mt-0.5">
                Aapka ₹{data.latestPaidPayout.amount.toLocaleString('en-IN')} ka payout safaltapoorvak aapke account me transfer kar diya gaya hai!
                {data.latestPaidPayout.transactionReference ? ` (UTR: ${data.latestPaidPayout.transactionReference})` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCongrats(true)}
            className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            View Reward Details ➔
          </button>
        </div>
      ) : null}

      {/* KPI Cards (Clean Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-xs">
        
        {/* Total Leads */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Leads Submitted</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">{stats.totalLeads ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-bold">In client pipeline</span>
        </div>

        {/* Closed Deals */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Deals Won</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700">{stats.dealsWon ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-bold">Converted clients</span>
        </div>

        {/* Available Balance */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500">Available Balance</span>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700">₹{availableBalance.toLocaleString('en-IN')}</p>
          </div>
          {availableBalance > 0 ? (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="mt-2 text-[10px] bg-emerald-100 hover:bg-emerald-200 border border-emerald-700 text-emerald-950 font-black py-1 px-2 rounded cursor-pointer uppercase tracking-wider text-center"
            >
              Withdraw ➔
            </button>
          ) : (
            <span className="text-[10px] text-emerald-700 font-bold mt-1">Ready to withdraw</span>
          )}
        </div>

        {/* Pending Settlement */}
        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Pending Settlement</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-amber-700">₹{pendingSettlement.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-500 font-bold">Under admin verification</span>
        </div>

        {/* Total Earned */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000] col-span-2 sm:col-span-2 md:col-span-1">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Earned</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">₹{(stats.totalEarned ?? 0).toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-slate-400 font-bold">Paid: ₹{(stats.totalPaid ?? 0).toLocaleString('en-IN')}</span>
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
                      {lead.status === 'Lost' && lead.rejectionReason && (
                        <div className="text-[10px] text-rose-700 font-bold mt-0.5">
                          Reason: {lead.rejectionReason}
                        </div>
                      )}
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

      {/* Request Withdrawal Modal */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={availableBalance}
        bankDetails={data?.profile?.bankDetails}
        token={token}
        onRequestSubmitted={fetchDashboard}
      />

      {/* Celebratory Payout Congrats Modal */}
      <PayoutCongratsModal
        isOpen={showCongrats}
        onClose={handleDismissCongrats}
        partnerName={data?.profile?.name || user?.name || 'Partner'}
        payout={data?.latestPaidPayout || null}
      />

    </div>
  )
}
