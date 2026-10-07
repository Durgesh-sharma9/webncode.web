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
  if (!isOpen || !lead) return null

  const aff = lead.affiliate
  const isFixed = aff?.payoutType === 'fixed'
  const defaultRate = aff?.commissionRate || 10
  const fixedReward = aff?.fixedAmount || 0

  const [currentMode, setCurrentMode] = useState<'approve' | 'reject'>('approve')
  const standardValue = lead.dealValue || 50000
  const [dealValue, setDealValue] = useState<string>(lead.dealValue ? String(lead.dealValue) : '50000')
  const [commissionAmount, setCommissionAmount] = useState<string>(
    lead.commissionAmount ? String(lead.commissionAmount) : ''
  )
  const [adminNotes, setAdminNotes] = useState<string>(lead.adminNotes || '')
  const [rejectionReason, setRejectionReason] = useState<string>(lead.rejectionReason || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync mode whenever modal opens or mode prop changes
  useEffect(() => {
    if (mode) setCurrentMode(mode)
  }, [mode, isOpen])

  // Sync lead details when lead prop changes
  useEffect(() => {
    if (lead) {
      if (lead.dealValue) setDealValue(String(lead.dealValue))
      if (lead.commissionAmount) setCommissionAmount(String(lead.commissionAmount))
      setAdminNotes(lead.adminNotes || '')
      if (lead.rejectionReason) setRejectionReason(lead.rejectionReason)
    }
  }, [lead])

  const isApprove = currentMode === 'approve'

  // Auto-calculate suggested commission whenever dealValue changes (if approve mode and user hasn't explicitly set it)
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
            adminNotes: adminNotes.trim(),
            notes: lead.notes || ''
          },
          config
        )

        showSuccessToast(
          `Deal approved! ₹${comm.toLocaleString('en-IN')} commission credited to ${aff?.name || 'partner'}.`
        )
      } else {
        // Reject / Cancel
        if (!rejectionReason.trim()) {
          showErrorToast('Please provide a reason for rejecting this lead')
          setIsSubmitting(false)
          return
        }

        await axios.put(
          `${API_BASE}/api/affiliates/leads/${lead._id}`,
          {
            status: 'Lost',
            rejectionReason: rejectionReason.trim(),
            commissionAmount: 0,
            commissionStatus: 'Pending',
            adminNotes: adminNotes.trim(),
            notes: lead.notes || ''
          },
          config
        )

        showSuccessToast('Lead has been rejected/cancelled and reason recorded.')
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

  const presetReasons = [
    'School principal declined demo',
    'Already using another software / ERP',
    'Budget constraints / Not interested',
    'Invalid contact number / No response',
    'Duplicate lead submission'
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
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
              {isApprove ? 'Close Deal & Award Payout' : 'Reject Client Lead'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Tab Switcher (Approve vs Reject) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 border-2 border-slate-900 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setCurrentMode('approve')}
            className={`py-2 px-3 rounded-md font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isApprove
                ? 'bg-[#86efac] text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✓</span>
            <span>Approve Deal</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentMode('reject')}
            className={`py-2 px-3 rounded-md font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isApprove
                ? 'bg-rose-200 text-rose-950 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <span>✕</span>
            <span>Reject Deal</span>
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
              {aff?.name || 'Partner'} ({isFixed ? `₹${fixedReward.toLocaleString('en-IN')} Flat Reward` : `${defaultRate}% Commission`})
            </span>
          </div>
          {lead.notes && (
            <div className="border-t border-slate-300 pt-1.5 mt-1">
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Partner Discussion Note:</span>
              <p className="text-slate-800 font-bold italic mt-0.5 bg-yellow-50 p-2 rounded border border-yellow-300 text-[11px]">
                "{lead.notes}"
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isApprove ? (
            <>
              {/* Deal Value */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-black uppercase tracking-wider text-slate-700">
                    Final Deal Value (Amount Received from School ₹) *
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">
                    Standard Price: <strong className="text-slate-900">₹{standardValue.toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="e.g. 50000"
                  />
                </div>

                {/* Discount Tag & Quick Reset */}
                {Number(dealValue || 0) < standardValue && Number(dealValue || 0) > 0 && (
                  <div className="mt-1.5 p-2 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>🏷️</span>
                      <span>
                        Discounted Deal: <strong>-₹{(standardValue - Number(dealValue)).toLocaleString('en-IN')}</strong> ({Math.round(((standardValue - Number(dealValue)) / standardValue) * 100)}% off)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDealValue(String(standardValue))}
                      className="underline font-black text-blue-700 hover:text-blue-900 cursor-pointer text-[10px]"
                    >
                      Reset to Standard
                    </button>
                  </div>
                )}

                {Number(dealValue || 0) > standardValue && (
                  <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-900 font-bold text-[11px] flex items-center gap-1.5">
                    <span>📈</span>
                    <span>
                      Upsold / Higher Package: <strong>+₹{(Number(dealValue) - standardValue).toLocaleString('en-IN')}</strong> extra revenue
                    </span>
                  </div>
                )}

                <p className="text-[10px] text-slate-500 mt-1">
                  Default shows standard price. If client negotiated a discount, enter the actual collected amount here. Partner commission automatically recalculates.
                </p>
              </div>

              {/* Commission to Award */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-black uppercase tracking-wider text-slate-700">
                    Commission / Reward to Credit to Partner (₹) *
                  </label>
                  <span className="text-[10px] text-blue-700 font-bold">
                    {isFixed ? 'Based on Flat Reward' : `Calculated at ${defaultRate}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-emerald-700">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-emerald-800 bg-emerald-50 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="e.g. 750"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  This amount will be added to the partner's balance and show up in their pending earnings.
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Super Admin Note / Discount Reason (Saved & Visible to Partner)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. Special 16% discount approved for annual prepayment. Deal finalized at ₹42,000."
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  This note will be visible to the affiliate partner in their portal so they understand the final agreed deal amount.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Cancellation Reason */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Rejection / Cancellation *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="Specify why this lead cannot be closed..."
                />
                
                {/* Preset Chips */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Quick presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetReasons.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRejectionReason(preset)}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-2">
                  This reason will be visible to the partner in their portal so they know why the lead was not closed.
                </p>
              </div>

              {/* Optional Admin Notes */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Internal Admin Notes (Optional)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="Optional internal remarks..."
                />
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t-2 border-slate-900 mt-5">
            <div>
              {isApprove ? (
                <button
                  type="button"
                  onClick={() => setCurrentMode('reject')}
                  className="w-full sm:w-auto px-3 py-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-rose-100 transition-colors cursor-pointer text-center"
                >
                  ✕ Reject Deal Instead
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentMode('approve')}
                  className="w-full sm:w-auto px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-emerald-100 transition-colors cursor-pointer text-center"
                >
                  ✓ Approve Instead
                </button>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer text-center"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto px-5 py-2.5 border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer text-center ${
                  isApprove ? 'bg-[#86efac] text-slate-900' : 'bg-rose-300 text-rose-950'
                }`}
              >
                {isSubmitting
                  ? 'Processing...'
                  : isApprove
                  ? `✓ Approve Deal & Credit ₹${commissionAmount || 0}`
                  : '✕ Confirm Rejection'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  )
}
