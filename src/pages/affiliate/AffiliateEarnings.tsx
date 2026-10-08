import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'

import RequestWithdrawalModal from './RequestWithdrawalModal'

interface PayoutTransaction {
  _id: string
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

export default function AffiliateEarnings() {
  const { token, user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  // Active History Tab: 'withdrawals' | 'commissions' | 'reports'
  const paramTab = searchParams.get('tab') as 'withdrawals' | 'commissions' | 'reports'
  const [activeHistoryTab, setActiveHistoryTab] = useState<'withdrawals' | 'commissions' | 'reports'>(
    paramTab && ['withdrawals', 'commissions', 'reports'].includes(paramTab) ? paramTab : 'withdrawals'
  )

  const payoutType = (user?.affiliate?.payoutType || 'percentage') as 'percentage' | 'fixed'
  const commissionRate = user?.affiliate?.commissionRate ?? 10
  const fixedAmount = user?.affiliate?.fixedAmount ?? 0

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      const [leadsRes, payoutsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/affiliate-portal/leads`, config),
        axios.get(`${API_BASE}/api/affiliate-portal/payouts`, config)
      ])

      if (leadsRes.data?.success && Array.isArray(leadsRes.data.data)) {
        setLeads(leadsRes.data.data)
      }

      if (payoutsRes.data?.success && Array.isArray(payoutsRes.data.data)) {
        setPayouts(payoutsRes.data.data)
      }
    } catch (err: any) {
      console.error('Fetch earnings error:', err)
      showErrorToast('Failed to load transaction history and earnings')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // Sync tab with search params if changed externally
  useEffect(() => {
    if (paramTab && ['withdrawals', 'commissions', 'reports'].includes(paramTab)) {
      setActiveHistoryTab(paramTab)
    }
  }, [paramTab])

  const handleTabChange = (tab: 'withdrawals' | 'commissions' | 'reports') => {
    setActiveHistoryTab(tab)
    setSearchParams({ tab })
  }

  // Calculations
  const wonLeads = leads.filter((l) => l.status === 'Deal Won')
  const reportedLeads = leads.filter(
    (l) => l.status === 'Deal Confirmed' || Boolean(l.confirmationNotes)
  )
  const pendingReportedCount = leads.filter((l) => l.status === 'Deal Confirmed').length

  const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0)
  const totalPaid = payouts.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const pendingRequests = payouts.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const availableBalance = Math.max(0, totalEarned - totalPaid - pendingRequests)

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-black uppercase text-slate-500 font-mono">
        <div className="inline-flex items-center gap-2 p-3 bg-white border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000]">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span>Loading complete financial & transaction history...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Header with Request Payout Action */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
            TRANSACTION & REPORT HISTORY CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            Earnings & Complete History
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Transparent records of all bank withdrawals, wallet commissions, and purchase reports.
          </p>
        </div>

        <button
          onClick={() => setIsWithdrawModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <span>💸</span>
          <span>Withdrawal Request</span>
        </button>
      </div>

      {/* 24-48 Hours Settlement Guarantee Banner */}
      <div className="bg-[#fef08a] border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕒</span>
          <div>
            <span className="font-black text-slate-900 uppercase tracking-tight block">
              24 to 48 Hours Settlement Guarantee
            </span>
            <span className="text-slate-800 text-[11px] font-bold">
              When you submit a withdrawal request, our finance team verifies closed deals and transfers funds to your account within <strong>24 to 48 hours</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        
        {/* Available to Withdraw */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-800">Available Wallet Balance</span>
            <span className="text-xs">🟢</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700 font-mono">
            ₹{availableBalance.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">
            Ready for 1-click withdrawal
          </span>
        </div>

        {/* In Process (Pending) */}
        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-800">In Process (24-48h)</span>
            <span className="text-xs">⏳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-amber-700 font-mono">
            ₹{pendingRequests.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">
            Requested & in bank transfer
          </span>
        </div>

        {/* Total Commissions Earned */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-600">Total Commissions</span>
            <span className="text-xs">💰</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 font-mono">
            ₹{totalEarned.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            From {wonLeads.length} closed deals ({payoutType === 'fixed' ? `₹${fixedAmount.toLocaleString('en-IN')} Flat` : `${commissionRate}%`})
          </span>
        </div>

        {/* Total Paid Out */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-blue-700">Paid to Bank / UPI</span>
            <span className="text-xs">💳</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-blue-700 font-mono">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Disbursed to your account
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COMPLETE HISTORY SECTION WITH 3 DEDICATED TABS */}
      {/* ============================================================== */}
      <div className="space-y-4 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-900 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
              Account Activity & History Ledger
            </h2>
            <p className="text-[11px] text-slate-500 font-bold">
              Switch between bank transactions, wallet commission credits, and reported purchases.
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Tab 1: Withdrawals */}
          <button
            type="button"
            onClick={() => handleTabChange('withdrawals')}
            className={`p-3 rounded-lg border-2 border-slate-900 text-left transition-all cursor-pointer ${
              activeHistoryTab === 'withdrawals'
                ? 'bg-[#86efac] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-slate-50 opacity-90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>💸</span>
                <span>Bank Withdrawals</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 bg-white border border-slate-900 rounded">
                {payouts.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 font-bold block mt-1">
              Disbursement receipts & UTR IDs
            </span>
          </button>

          {/* Tab 2: Commission Credits */}
          <button
            type="button"
            onClick={() => handleTabChange('commissions')}
            className={`p-3 rounded-lg border-2 border-slate-900 text-left transition-all cursor-pointer ${
              activeHistoryTab === 'commissions'
                ? 'bg-[#86efac] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-slate-50 opacity-90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>💰</span>
                <span>Commission Credits</span>
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.2 bg-white border border-slate-900 rounded">
                {wonLeads.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 font-bold block mt-1">
              Wallet earnings from closed deals
            </span>
          </button>

          {/* Tab 3: Purchase Reports */}
          <button
            type="button"
            onClick={() => handleTabChange('reports')}
            className={`p-3 rounded-lg border-2 border-slate-900 text-left transition-all cursor-pointer ${
              activeHistoryTab === 'reports'
                ? 'bg-[#fde047] shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                : 'bg-white hover:bg-slate-50 opacity-90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>📋</span>
                <span>Purchase Reports</span>
              </span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 border border-slate-900 rounded ${
                pendingReportedCount > 0 ? 'bg-amber-300 text-amber-950 font-black' : 'bg-white'
              }`}>
                {reportedLeads.length} {pendingReportedCount > 0 ? `(${pendingReportedCount} Pending)` : ''}
              </span>
            </div>
            <span className="text-[10px] text-slate-600 font-bold block mt-1">
              Reported school purchases & review status
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: BANK WITHDRAWALS TRANSACTIONS */}
        {/* ============================================================== */}
        {activeHistoryTab === 'withdrawals' && (
          <div className="space-y-3 pt-2">
            {payouts.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
                <p className="font-black uppercase text-slate-600">No withdrawal requests submitted yet</p>
                <p className="text-slate-500 mt-1">
                  Click "Withdrawal Request" above to withdraw your commission earnings anytime.
                </p>
              </div>
            ) : (
              <div>
                {/* Mobile Card List (< md) */}
                <div className="block md:hidden space-y-3">
                  {payouts.map((pay) => (
                    <div
                      key={pay._id}
                      className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">Amount</span>
                          <span className="text-xl font-mono font-black text-emerald-700">
                            ₹{pay.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {pay.status === 'Paid' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-900 rounded font-black text-[10px]">
                            ✓ Paid Out
                          </span>
                        ) : pay.status === 'Rejected' ? (
                          <span className="px-2 py-0.5 bg-rose-100 border border-rose-600 text-rose-900 rounded font-black text-[10px]">
                            ✕ Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-600 text-amber-900 rounded font-black text-[10px]">
                            🕒 Under 24h Review
                          </span>
                        )}
                      </div>

                      <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Method:</span>
                          <span className="text-[10px] font-black text-slate-800">{pay.paymentMethod || 'UPI'}</span>
                        </div>
                        {pay.payoutDetails && (
                          <div className="text-[10px] font-mono text-slate-700 break-all">
                            {pay.payoutDetails}
                          </div>
                        )}
                      </div>

                      {pay.transactionReference && (
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="text-slate-500 font-bold uppercase text-[10px]">Bank UTR:</span>
                          <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {pay.transactionReference}
                          </span>
                        </div>
                      )}

                      {pay.status === 'Rejected' && pay.rejectionReason && (
                        <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded p-1.5 font-bold">
                          Reason: {pay.rejectionReason}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 text-right">
                        Requested:{' '}
                        {new Date(pay.requestedAt || pay.createdAt || pay.paidAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (>= md) */}
                <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                      <tr>
                        <th className="p-3">Request Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Reference / UTR ID</th>
                        <th className="p-3">Remarks / Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100 font-medium">
                      {payouts.map((pay) => (
                        <tr key={pay._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 whitespace-nowrap font-bold text-slate-800">
                            {new Date(pay.requestedAt || pay.createdAt || pay.paidAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="p-3 font-mono font-black text-emerald-700 text-sm">
                            ₹{pay.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 font-bold text-slate-700">
                            <div>{pay.paymentMethod || 'UPI'}</div>
                            {pay.payoutDetails && (
                              <div className="text-[10px] text-slate-500 font-mono">{pay.payoutDetails}</div>
                            )}
                          </td>
                          <td className="p-3">
                            {pay.status === 'Paid' ? (
                              <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-900 rounded font-black text-[10px]">
                                ✓ Paid Out
                              </span>
                            ) : pay.status === 'Rejected' ? (
                              <span className="px-2 py-0.5 bg-rose-100 border border-rose-600 text-rose-900 rounded font-black text-[10px]">
                                ✕ Rejected
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 border border-amber-600 text-amber-900 rounded font-black text-[10px]">
                                🕒 Under 24h Review
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-slate-900">
                            {pay.transactionReference ? (
                              <span className="font-bold text-blue-700">{pay.transactionReference}</span>
                            ) : (
                              <span className="text-slate-400 italic">Processing...</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600">
                            {pay.status === 'Rejected' && pay.rejectionReason ? (
                              <span className="text-rose-700 font-bold">Reason: {pay.rejectionReason}</span>
                            ) : (
                              pay.notes || '—'
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
        )}

        {/* ============================================================== */}
        {/* TAB 2: COMMISSION CREDITS HISTORY */}
        {/* ============================================================== */}
        {activeHistoryTab === 'commissions' && (
          <div className="space-y-3 pt-2">
            {wonLeads.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
                <p className="font-black uppercase text-slate-600">No commission credits recorded yet</p>
                <p className="text-slate-500 mt-1">When leads are closed and verified, your credited commissions will be listed here.</p>
              </div>
            ) : (
              <div>
                {/* Mobile Card View (< md) */}
                <div className="block md:hidden space-y-3">
                  {wonLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-slate-900 text-sm leading-snug">
                          {lead.organizationName}
                        </h3>
                        {lead.commissionStatus === 'Paid' ? (
                          <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-400">
                            ✓ Paid to Bank
                          </span>
                        ) : (
                          <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                            🟢 In Wallet
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-slate-600">
                        Product: <span className="text-slate-900 font-black">{lead.product}</span>
                      </div>

                      <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 font-mono text-center">
                        <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Your Commission</span>
                        <span className="text-sm font-black text-emerald-700">
                          ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {lead.adminNotes && (
                        <div className="text-[10px] text-blue-900 bg-blue-50 border border-blue-200 rounded p-1.5 font-bold">
                          Closing Note: "{lead.adminNotes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop Table (>= md) */}
                <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                      <tr>
                        <th className="p-3">Client Organization</th>
                        <th className="p-3">Software Product</th>
                        <th className="p-3">Your Commission</th>
                        <th className="p-3">Settlement Status</th>
                        <th className="p-3">Closing Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100 font-medium">
                      {wonLeads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-black text-slate-900">{lead.organizationName}</td>
                          <td className="p-3 font-bold text-slate-700">{lead.product}</td>
                          <td className="p-3 font-mono font-black text-emerald-700">
                            ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            {lead.commissionStatus === 'Paid' ? (
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
                          <td className="p-3 text-slate-600 text-[11px]">
                            {lead.adminNotes ? (
                              <span className="font-bold text-blue-900 italic">"{lead.adminNotes}"</span>
                            ) : (
                              '—'
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
        )}

        {/* ============================================================== */}
        {/* TAB 3: PURCHASE REPORTS HISTORY */}
        {/* ============================================================== */}
        {activeHistoryTab === 'reports' && (
          <div className="space-y-3 pt-2">
            {reportedLeads.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
                <p className="font-black uppercase text-slate-600">No purchase reports submitted yet</p>
                <p className="text-slate-500 mt-1">
                  When a client buys a software license, click "School Bought!" on any lead to report the purchase to Super Admin.
                </p>
              </div>
            ) : (
              <div>
                {/* Mobile Card View (< md) */}
                <div className="block md:hidden space-y-3">
                  {reportedLeads.map((lead) => {
                    const isPending = lead.status === 'Deal Confirmed'
                    const isWon = lead.status === 'Deal Won'
                    const isLost = lead.status === 'Lost'

                    return (
                      <div
                        key={lead._id}
                        className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-black text-slate-900 text-sm leading-snug">
                              {lead.organizationName}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-bold block">
                              {lead.contactPerson} ({lead.city || 'City N/A'})
                            </span>
                          </div>

                          {isWon ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                              ✓ Approved & Credited
                            </span>
                          ) : isPending ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-950 border border-amber-600">
                              ⏳ Under Admin Review
                            </span>
                          ) : isLost ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-200 text-rose-950 border border-rose-600">
                              ✕ Declined / Lost
                            </span>
                          ) : null}
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 space-y-1">
                          <span className="text-[9.5px] uppercase font-black text-slate-400 block">Reported Software:</span>
                          <span className="text-xs font-black text-slate-900 block">{lead.product}</span>
                        </div>

                        {lead.confirmationNotes && (
                          <div className="bg-amber-50 border border-amber-300 rounded-lg p-2 text-[10.5px] text-amber-950 font-bold">
                            <span className="block text-[9px] uppercase text-amber-800 font-black">Your Order Note:</span>
                            "{lead.confirmationNotes}"
                          </div>
                        )}

                        {isWon && (
                          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-900 uppercase">Commission Credited:</span>
                            <span className="text-xs font-black text-emerald-800 font-mono">
                              ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}

                        {lead.adminNotes && (
                          <div className="text-[10px] text-blue-900 bg-blue-50 border border-blue-200 rounded p-1.5 font-bold">
                            Admin Feedback: "{lead.adminNotes}"
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Desktop Table (>= md) */}
                <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                      <tr>
                        <th className="p-3">School / Client</th>
                        <th className="p-3">Reported Product</th>
                        <th className="p-3">Partner Order Note</th>
                        <th className="p-3">Super Admin Review Status</th>
                        <th className="p-3 text-right">Commission Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100 font-medium">
                      {reportedLeads.map((lead) => {
                        const isPending = lead.status === 'Deal Confirmed'
                        const isWon = lead.status === 'Deal Won'
                        const isLost = lead.status === 'Lost'

                        return (
                          <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <div className="font-black text-slate-900">{lead.organizationName}</div>
                              <div className="text-[11px] text-slate-500">{lead.contactPerson} ({lead.city || 'N/A'})</div>
                            </td>
                            <td className="p-3 font-bold text-slate-700 max-w-xs">
                              {lead.product}
                            </td>
                            <td className="p-3 text-slate-700 text-[11px]">
                              {lead.confirmationNotes ? (
                                <span className="italic bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block">
                                  "{lead.confirmationNotes}"
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                            <td className="p-3">
                              {isWon ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                                  <span>✓</span>
                                  <span>Verified & Credited</span>
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase bg-amber-200 text-amber-950 border border-amber-600">
                                  <span>⏳</span>
                                  <span>Under Admin Review</span>
                                </span>
                              ) : isLost ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-900 border border-rose-400">
                                  <span>✕</span>
                                  <span>Declined</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-bold uppercase">{lead.status}</span>
                              )}
                            </td>
                            <td className="p-3 text-right font-mono font-black">
                              {isWon ? (
                                <span className="text-emerald-700 text-sm">
                                  ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                                </span>
                              ) : isPending ? (
                                <span className="text-amber-700 text-[11px] font-bold">Awaiting Admin</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Withdrawal Modal */}
      <RequestWithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        availableBalance={availableBalance}
        bankDetails={user?.affiliate?.bankDetails}
        token={token}
        onRequestSubmitted={() => {
          fetchData()
        }}
      />

    </div>
  )
}
