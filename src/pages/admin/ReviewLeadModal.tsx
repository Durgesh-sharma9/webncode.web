import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ReviewLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  mode: 'approve' | 'reject' | null
  token: string | null
  onSuccess: () => void
}

export default function ReviewLeadModal({
  isOpen,
  onClose,
  lead,
  mode,
  token,
  onSuccess
}: ReviewLeadModalProps) {
  if (!isOpen || !lead || !mode) return null

  const isApprove = mode === 'approve'
  const aff = lead.affiliate
  const isFixed = aff?.payoutType === 'fixed'
  const defaultRate = aff?.commissionRate || 10
  const fixedReward = aff?.fixedAmount || 0

  const [dealValue, setDealValue] = useState<string>(lead.dealValue ? String(lead.dealValue) : '50000')
  const [commissionAmount, setCommissionAmount] = useState<string>(
    lead.commissionAmount ? String(lead.commissionAmount) : ''
  )
  const [adminNotes, setAdminNotes] = useState<string>(lead.notes || '')
  const [rejectionReason, setRejectionReason] = useState<string>(lead.rejectionReason || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-calculate suggested commission whenever dealValue changes (if approve mode)
  useEffect(() => {
    if (isApprove) {
      if (isFixed) {
        setCommissionAmount(String(fixedReward))
      } else {
        const val = Number(dealValue) || 0
        const autoComm = Math.round((val * defaultRate) / 100)
        setCommissionAmount(String(autoComm))
      }
    }
  }, [dealValue, isApprove, isFixed, fixedReward, defaultRate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      if (isApprove) {
        const val = Number(dealValue) || 0
        const comm = Number(commissionAmount) || 0

        await axios.put(
          `${API_BASE}/api/affiliates/leads/${lead._id}`,
          {
            status: 'Deal Won',
            dealValue: val,
            commissionAmount: comm,
            commissionStatus: 'Approved',
            notes: adminNotes
          },
          config
        )

        showSuccessToast(
          `Deal approved! ₹${comm.toLocaleString('en-IN')} commission credited to ${aff?.name || 'partner'}.`
        )
      } else {
        // Reject / Cancel
        if (!rejectionReason.trim()) {
          showErrorToast('Please provide a reason for cancelling this lead')
          setIsSubmitting(false)
          return
        }

        await axios.put(
          `${API_BASE}/api/affiliates/leads/${lead._id}`,
          {
            status: 'Lost',
            rejectionReason: rejectionReason.trim(),
            commissionAmount: 0,
            commissionStatus: 'Pending'
          },
          config
        )

        showSuccessToast('Lead has been cancelled and reason recorded.')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Update lead action error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-900 rounded ${
                isApprove ? 'bg-[#86efac] text-emerald-950' : 'bg-rose-200 text-rose-950'
              }`}
            >
              {isApprove ? 'APPROVE & CREDIT COMMISSION' : 'CANCEL / REJECT LEAD'}
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {isApprove ? 'Close Deal & Award Payout' : 'Cancel Client Lead'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Lead Context Summary Box */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3 text-xs space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Client / School:</span>
            <span className="font-black text-slate-900">{lead.organizationName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Contact Person:</span>
            <span className="font-bold text-slate-800">{lead.contactPerson} ({lead.phone})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Product Pitched:</span>
            <span className="font-black text-blue-700">{lead.product}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-300 pt-1.5 mt-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Partner Attributed:</span>
            <span className="font-bold text-slate-900">
              {aff?.name} ({isFixed ? `₹${fixedReward.toLocaleString('en-IN')} Flat / Project` : `${defaultRate}% Commission`})
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isApprove ? (
            <>
              {/* Deal Value */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Final Deal Value (Amount Received from School ₹) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="e.g. 50000"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Total revenue collected from the client for this software purchase.
                </p>
              </div>

              {/* Commission to Award */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-black uppercase tracking-wider text-slate-700">
                    Commission / Reward to Credit to Partner (₹) *
                  </label>
                  <span className="text-[10px] text-blue-700 font-bold">
                    {isFixed ? 'Based on ₹ Flat Reward' : `Calculated at ${defaultRate}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-emerald-700">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    required
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-emerald-800 bg-emerald-50 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="e.g. 5000"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  This amount will be added to the partner's balance and show up in their pending earnings.
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Admin Closing Notes (Optional)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. 1 Year license signed with Principal"
                />
              </div>
            </>
          ) : (
            <>
              {/* Cancellation Reason */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Cancellation / Rejection *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. School principal declined demo / School already reached out directly / Invalid contact number"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This reason will be visible to the partner in their portal so they know why the lead was not closed.
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-900 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all ${
                isApprove ? 'bg-[#86efac] text-slate-900' : 'bg-rose-300 text-rose-950'
              }`}
            >
              {isSubmitting
                ? 'Processing...'
                : isApprove
                ? '✓ Approve Deal & Credit'
                : '✕ Confirm Cancellation'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
