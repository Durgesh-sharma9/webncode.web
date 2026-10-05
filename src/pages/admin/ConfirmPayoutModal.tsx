import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliatePayoutItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ConfirmPayoutModalProps {
  isOpen: boolean
  onClose: () => void
  payout: AffiliatePayoutItem | null
  mode: 'confirm' | 'reject' | null
  token: string | null
  onSuccess: () => void
}

export default function ConfirmPayoutModal({
  isOpen,
  onClose,
  payout,
  mode,
  token,
  onSuccess
}: ConfirmPayoutModalProps) {
  if (!isOpen || !payout || !mode) return null

  const isConfirm = mode === 'confirm'
  const aff = payout.affiliate

  const [transactionRef, setTransactionRef] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      if (isConfirm) {
        if (!transactionRef.trim()) {
          showErrorToast('Please provide Transaction Reference / UTR Number')
          setIsSubmitting(false)
          return
        }

        await axios.put(
          `${API_BASE}/api/affiliates/payout-requests/${payout._id}/confirm`,
          {
            transactionReference: transactionRef.trim(),
            paymentMethod,
            notes: adminNotes.trim()
          },
          config
        )

        showSuccessToast(`Payout of ₹${payout.amount.toLocaleString('en-IN')} confirmed successfully!`)
      } else {
        if (!rejectionReason.trim()) {
          showErrorToast('Please provide a reason for rejecting this payout request')
          setIsSubmitting(false)
          return
        }

        await axios.put(
          `${API_BASE}/api/affiliates/payout-requests/${payout._id}/reject`,
          {
            rejectionReason: rejectionReason.trim()
          },
          config
        )

        showSuccessToast('Payout request rejected. Amount released back to partner balance.')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Confirm/Reject payout error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to process payout request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-900 rounded ${
                isConfirm ? 'bg-[#86efac] text-emerald-950' : 'bg-rose-200 text-rose-950'
              }`}
            >
              {isConfirm ? 'CONFIRM & DISBURSE PAYOUT' : 'REJECT PAYOUT REQUEST'}
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {isConfirm ? 'Verify & Record Payment' : 'Reject Withdrawal Request'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Partner & Amount Summary Card */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3 text-xs space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Partner Name:</span>
            <span className="font-black text-slate-900">{aff?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Contact:</span>
            <span className="font-bold text-slate-800">{aff?.phone || aff?.email}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-300 pt-1.5">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Payout Amount:</span>
            <span className="font-black text-lg text-emerald-700">₹{payout.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-slate-300 pt-1.5">
            <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">
              Beneficiary Payment Destination:
            </span>
            <div className="p-2 bg-white border border-slate-400 rounded font-black text-blue-900 text-xs break-all">
              {payout.payoutDetails || 'Details not specified'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isConfirm ? (
            <>
              {/* Payment Method */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Payment Mode Used *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                  <option value="IMPS">IMPS (Immediate Bank Transfer)</option>
                  <option value="NEFT">NEFT / RTGS</option>
                  <option value="Bank Transfer">Direct Bank Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* UTR / Transaction ID */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Transaction Reference / UTR Number *
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-mono font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. 429182938192 (from UPI or Bank app)"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter the 12-digit UTR or transaction ID after sending money from your bank/UPI app.
                </p>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. Paid via company GPay account"
                />
              </div>
            </>
          ) : (
            <>
              {/* Rejection Reason */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  placeholder="e.g. UPI ID is invalid / Bank account number mismatch. Please update details in Settings."
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  This reason will be visible to the partner and the requested amount will be released back to their available balance.
                </p>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t-2 border-slate-900 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors text-center cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-5 py-2.5 border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer text-center ${
                isConfirm ? 'bg-[#86efac] text-slate-900' : 'bg-rose-300 text-rose-950'
              }`}
            >
              {isSubmitting
                ? 'Processing...'
                : isConfirm
                ? '✓ Confirm & Mark Paid'
                : '✕ Confirm Rejection'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
