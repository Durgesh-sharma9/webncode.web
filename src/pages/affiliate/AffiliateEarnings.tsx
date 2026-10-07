import { useState, useEffect } from 'react'
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
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

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
      showErrorToast('Failed to load earnings and payout history')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // Calculations
  const wonLeads = leads.filter((l) => l.status === 'Deal Won')
  const totalEarned = wonLeads.reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0)
  const totalPaid = payouts.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const pendingRequests = payouts.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const availableBalance = Math.max(0, totalEarned - totalPaid - pendingRequests)

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-black uppercase text-slate-500 font-mono">
        Loading settlements and payout history...
      </div>
    )
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Header with Request Payout Action */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
            SETTLEMENTS & COMMISSIONS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            Earnings & Payouts
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Transparent record of all earned commissions from closed deals and bank/UPI disbursements.
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

      {/* 24-48 Hours Assurance Banner */}
      <div className="bg-[#fef08a] border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕒</span>
          <div>
            <span className="font-black text-slate-900 uppercase tracking-tight block">
              24 to 48 Hours Settlement Guarantee
            </span>
            <span className="text-slate-800 text-[11px] font-bold">
              When you submit a withdrawal request, our finance team verifies the closed deals and transfers funds to your account within <strong>24 to 48 hours</strong>.
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        
        {/* Available to Withdraw */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-800">Available for Withdrawal Request</span>
            <span className="text-xs">🟢</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700 font-mono">
            ₹{availableBalance.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">
            Wallet balance (Ready for Withdrawal Request)
          </span>
        </div>

        {/* In Verification (Pending) */}
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

        {/* Total Earned */}
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

      {/* Easy Accounting Breakdown Formula */}
      <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-black text-xs sm:text-sm uppercase text-slate-900 tracking-wider">
              Transparent Accounting Formula
            </span>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
            Auto-calculated
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Total Earned</span>
            <span className="text-lg font-black text-slate-900 block font-mono mt-0.5">₹{totalEarned.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-slate-500 font-bold">Commission from {wonLeads.length} closed deals</span>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-black uppercase text-blue-700 block">Paid to Bank / UPI</span>
            <span className="text-lg font-black text-blue-700 block font-mono mt-0.5">₹{totalPaid.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-slate-500 font-bold">Transferred to registered account</span>
          </div>

          <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-black uppercase text-amber-700 block">In Process (24-48h)</span>
            <span className="text-lg font-black text-amber-700 block font-mono mt-0.5">₹{pendingRequests.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-slate-500 font-bold">Under finance verification</span>
          </div>

          <div className="bg-[#86efac] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-black uppercase text-slate-950 block">Available in Wallet</span>
            <span className="text-lg font-black text-slate-950 block font-mono mt-0.5">₹{availableBalance.toLocaleString('en-IN')}</span>
            <span className="text-[9px] text-slate-800 font-black">Ready for withdrawal request</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-700 font-bold bg-white border border-slate-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            💡 <strong>Formula:</strong> Total Earned = Paid to Bank + In Process + Available Balance. You can submit a withdrawal request anytime from your available wallet balance.
          </span>
          {availableBalance > 0 && (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-black uppercase cursor-pointer shrink-0 transition-colors"
            >
              Withdrawal Request ₹{availableBalance.toLocaleString('en-IN')} ➔
            </button>
          )}
        </div>
      </div>

      {/* Payout Requests & History */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
          Payout Requests & Disbursement History
        </h2>

        {payouts.length === 0 ? (
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
            <p className="font-black uppercase text-slate-600">No payout requests submitted yet</p>
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

      {/* Won Deals Breakdown */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
          Deals Won & Commission Breakdown
        </h2>

        {wonLeads.length === 0 ? (
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
            <p className="font-black uppercase text-slate-600">No closed deals yet</p>
            <p className="text-slate-500 mt-1">When leads are marked as 'Deal Won' by the admin, your commission appears here.</p>
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

                  <div className="grid grid-cols-2 gap-2 bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 font-mono text-center">
                    <div>
                      <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Deal Closed</span>
                      <span className="text-xs font-black text-slate-900">
                        ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Commission</span>
                      <span className="text-xs font-black text-emerald-700">
                        ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                      </span>
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
                    <th className="p-3">Client Organization</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Deal Value</th>
                    <th className="p-3">Your Commission</th>
                    <th className="p-3">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-medium">
                  {wonLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-black text-slate-900">{lead.organizationName}</td>
                      <td className="p-3 font-bold text-slate-700">{lead.product}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">
                        ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
