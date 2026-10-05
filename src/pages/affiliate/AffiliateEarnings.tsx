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
          className="px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>💸</span>
          <span>Request Payout</span>
        </button>
      </div>

      {/* 24-Hour Assurance Banner */}
      <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🕒</span>
          <div>
            <span className="font-black text-slate-900 uppercase tracking-tight block">24-Hour Settlement Policy</span>
            <span className="text-slate-600 text-[11px] font-bold">
              Jab aap payout request karte hain, Admin aapki closed deals verify karke 24 ghante ke andar aapke UPI / Bank me paise transfer kar deta hai.
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        
        {/* Available to Withdraw */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Available to Withdraw</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-700 font-mono">
            ₹{availableBalance.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Ready for instant request
          </span>
        </div>

        {/* In Verification (Pending) */}
        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Under 24h Review</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 font-mono">
            ₹{pendingRequests.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">
            Requested & in processing
          </span>
        </div>

        {/* Total Earned */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Commissions</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 font-mono">
            ₹{totalEarned.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Across {wonLeads.length} closed deals ({payoutType === 'fixed' ? `₹${fixedAmount.toLocaleString('en-IN')} Flat` : `${commissionRate}%`})
          </span>
        </div>

        {/* Total Paid Out */}
        <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Transferred</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-blue-700 font-mono">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Disbursed to your UPI/Bank
          </span>
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
              Click "Request Payout" above to withdraw your commission earnings anytime.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
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
          <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
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
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        lead.commissionStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : 'bg-amber-100 text-amber-800 border-amber-400'
                      }`}>
                        {lead.commissionStatus || 'Approved'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
