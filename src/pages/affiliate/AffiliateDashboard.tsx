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
  const [isPayoutBannerDismissed, setIsPayoutBannerDismissed] = useState(false)

  const latestPayoutId = data?.latestPaidPayout?.id
  const isBannerDismissed = isPayoutBannerDismissed || Boolean(latestPayoutId && sessionStorage.getItem(`dismissed_payout_bar_${latestPayoutId}`))

  const handleDismissPayoutBanner = () => {
    setIsPayoutBannerDismissed(true)
    if (latestPayoutId) {
      sessionStorage.setItem(`dismissed_payout_bar_${latestPayoutId}`, 'true')
    }
  }

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
      
      {/* Top Welcome & Lead Action Bar (Compact) */}
      <div className="bg-white border-2 border-slate-900 rounded-xl py-3.5 px-4 sm:px-5 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
              PARTNER DASHBOARD
            </span>
            <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">•</span>
            <p className="text-[11px] text-slate-600 font-bold">
              {payoutType === 'fixed' ? (
                <>Reward: <span className="text-emerald-700 font-black">₹{(fixedAmount || 0).toLocaleString('en-IN')} Flat</span> / deal</>
              ) : (
                <>Commission: <span className="text-emerald-700 font-black">{commissionRate}%</span> per closed deal</>
              )}
            </p>
          </div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight mt-1 text-slate-900">
            Welcome, {data?.profile?.name || user?.name}!
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <span className="text-base leading-none font-black">+</span>
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
                Withdrawal Request In Verification (24-48 Hours Policy)
              </span>
              <span className="px-2 py-0.5 bg-amber-200 border border-slate-900 rounded text-[10px] font-black text-slate-900 uppercase">
                Under Process
              </span>
            </div>
            <p className="text-slate-800 font-bold mt-1 leading-relaxed">
              Your withdrawal request for ₹{pendingSettlement.toLocaleString('en-IN')} is being processed by our finance team. Funds will be transferred to your account within <strong>24 to 48 hours</strong>.
            </p>
          </div>
        </div>
      ) : (data?.latestPaidPayout && !isBannerDismissed) ? (
        /* Payout Complete Celebratory Bar */
        <div className="bg-[#86efac] border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-950">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">🎉</span>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black uppercase text-slate-950 tracking-wider text-sm">
                  Congratulations! Payout Credited
                </span>
                <span className="px-2 py-0.5 bg-slate-900 border border-slate-900 rounded text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                  ✓ PAID ₹{data.latestPaidPayout.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-slate-900 font-bold mt-0.5">
                Your payout of ₹{data.latestPaidPayout.amount.toLocaleString('en-IN')} has been successfully transferred to your registered account!
                {data.latestPaidPayout.transactionReference ? ` (UTR / Ref: ${data.latestPaidPayout.transactionReference})` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setShowCongrats(true)}
              className="px-4 py-2 bg-slate-900 text-white border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 transition-colors cursor-pointer"
            >
              View Reward Details ➔
            </button>
            <button
              onClick={handleDismissPayoutBanner}
              title="Dismiss announcement"
              className="p-2 bg-slate-900 text-white border-2 border-slate-900 rounded-md font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      {/* KPI Cards (Clean Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 text-xs">
        
        {/* Available Balance (Wallet) */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-800">Available Balance</span>
              <span className="text-xs">🟢</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700 font-mono">
              ₹{availableBalance.toLocaleString('en-IN')}
            </p>
          </div>
          {availableBalance > 0 ? (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="mt-2 text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-black py-1.5 px-2 rounded cursor-pointer uppercase tracking-wider text-center transition-colors shadow-[1px_1px_0px_0px_#000]"
            >
              Withdrawal Request ➔
            </button>
          ) : (
            <span className="text-[10px] text-emerald-700 font-bold mt-1">Ready for Withdrawal Request</span>
          )}
        </div>

        {/* Pending Settlement (Under Process) */}
        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-800">In Process (24-48h)</span>
            <span className="text-xs">⏳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-amber-700 font-mono">
            ₹{pendingSettlement.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">
            {pendingSettlement > 0 ? 'Bank transfer pending' : 'No pending requests'}
          </span>
        </div>

        {/* Total Paid Out */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-blue-700">Paid to Bank / UPI</span>
            <span className="text-xs">💳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-blue-700 font-mono">
            ₹{(stats.totalPaid ?? 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Transferred to account</span>
        </div>

        {/* Total Earned Commissions */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-600">Total Commissions</span>
            <span className="text-xs">💰</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 font-mono">
            ₹{(stats.totalEarned ?? 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Across {stats.dealsWon ?? 0} won deals</span>
        </div>

        {/* Pipeline & Deals */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000] col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-600">Pipeline Leads</span>
            <span className="text-xs">👥</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900">{stats.totalLeads ?? 0}</p>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">
            {stats.dealsWon ?? 0} Won • {(stats.totalLeads ?? 0) - (stats.dealsWon ?? 0)} In Progress
          </span>
        </div>

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
          <div>
            {/* Mobile Card View (< md) */}
            <div className="block md:hidden space-y-3">
              {data.recentLeads.map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm leading-snug">
                        {lead.organizationName}
                      </h3>
                      <div className="text-[11px] text-slate-600 font-bold mt-0.5">
                        {lead.contactPerson}{' '}
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-bold hover:underline"
                        >
                          📞 {lead.phone}
                        </a>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                        lead.status === 'Deal Won'
                          ? 'bg-[#86efac] text-slate-900'
                          : lead.status === 'Lost'
                          ? 'bg-rose-200 text-slate-900'
                          : lead.status === 'Demo Scheduled'
                          ? 'bg-[#93c5fd] text-slate-900'
                          : 'bg-amber-100 text-slate-900'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Product:</span>
                    <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {lead.product}
                    </span>
                  </div>

                  {lead.status === 'Lost' && lead.rejectionReason && (
                    <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded px-2 py-1 font-bold">
                      Reason: {lead.rejectionReason}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 bg-[#f8fafc] border border-slate-200 rounded-lg p-2 text-center">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Est. Value</span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Commission</span>
                      <span className="text-xs font-black text-emerald-700">
                        ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block">Payout</span>
                      {lead.status !== 'Deal Won' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-300">
                          In Pipeline
                        </span>
                      ) : lead.commissionStatus === 'Paid' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-400">
                          ✓ Paid to Bank
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          🟢 In Wallet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                  <tr>
                    <th className="p-3">School / Client</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Est. Value</th>
                    <th className="p-3">Commission</th>
                    <th className="p-3">Payout Status</th>
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
                        {lead.status !== 'Deal Won' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-300">
                            <span>⏳</span>
                            <span>In Pipeline</span>
                          </span>
                        ) : lead.commissionStatus === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-400">
                            <span>✓</span>
                            <span>Paid to Bank</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                            <span>🟢</span>
                            <span>In Wallet (Ready)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
