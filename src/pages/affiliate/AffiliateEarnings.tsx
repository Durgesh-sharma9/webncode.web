import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'

interface PayoutTransaction {
  _id: string
  amount: number
  paymentMethod: string
  transactionReference?: string
  notes?: string
  paidAt: string
}

export default function AffiliateEarnings() {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [payouts, setPayouts] = useState<PayoutTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  const totalPaid = payouts.reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const pendingPayout = Math.max(0, totalEarned - totalPaid)

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-black uppercase text-slate-500 font-mono">
        Loading settlements and payout history...
      </div>
    )
  }

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4">
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Commissions Earned</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-slate-900 font-mono">
            ₹{totalEarned.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Across {wonLeads.length} closed deals {payoutType === 'fixed' ? `(₹${fixedAmount.toLocaleString('en-IN')} Flat / deal)` : `(${commissionRate}%)`}
          </span>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-lg p-5 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Disbursed (Paid)</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600 font-mono">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-1 block">
            Transferred via UPI/Bank
          </span>
        </div>

        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-5 shadow-[4px_4px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Pending Settlement</span>
          <p className="text-2xl sm:text-3xl font-black mt-1 text-rose-600 font-mono">
            ₹{pendingPayout.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">
            Processed weekly/monthly
          </span>
        </div>
      </div>

      {/* Disbursed Payout Transactions */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
          Payout Disbursement History
        </h2>

        {payouts.length === 0 ? (
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs">
            <p className="font-black uppercase text-slate-600">No payout disbursements recorded yet</p>
            <p className="text-slate-500 mt-1">Once a deal closes and payment is transferred, the transaction details will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                <tr>
                  <th className="p-3">Payout Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference / UTR ID</th>
                  <th className="p-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium">
                {payouts.map((pay) => (
                  <tr key={pay._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 whitespace-nowrap font-bold text-slate-800">
                      {new Date(pay.paidAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-700 text-sm">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-slate-700">
                      {pay.paymentMethod}
                    </td>
                    <td className="p-3 font-mono text-slate-900">
                      {pay.transactionReference || 'N/A'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {pay.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
