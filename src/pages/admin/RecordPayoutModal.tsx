import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface RecordPayoutModalProps {
  isOpen: boolean
  onClose: () => void
  affiliate: AffiliateItem | null
  token: string | null
  onPaid: () => void
}

export default function RecordPayoutModal({ isOpen, onClose, affiliate, token, onPaid }: RecordPayoutModalProps) {
  if (!isOpen || !affiliate) return null

  const pending = affiliate.stats?.pendingPayout || 0
  const [amount, setAmount] = useState<number>(pending > 0 ? pending : 1000)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer (IMPS/NEFT)' | 'Cash' | 'Cheque' | 'Other'>('UPI')
  const [transactionReference, setTransactionReference] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (amount <= 0) {
      showErrorToast('Please enter a valid payout amount')
      return
    }

    setIsSubmitting(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.post(
        `${API_BASE}/api/affiliates/${affiliate._id}/payout`,
        {
          amount,
          paymentMethod,
          transactionReference,
          notes
        },
        config
      )

      showSuccessToast(`Payout of ₹${amount.toLocaleString('en-IN')} recorded successfully!`)
      onPaid()
      onClose()
    } catch (err: any) {
      console.error('Payout record error:', err)
      const msg = err.response?.data?.message || 'Failed to record payout'
      showErrorToast(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fde047] border border-slate-900 rounded">
              COMMISSION SETTLEMENT
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
              Record Payout
            </h2>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              Affiliate: <span className="text-slate-900">{affiliate.name}</span> ({affiliate.referralCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Affiliate Banking Info Box */}
        <div className="p-3 bg-[#f8fafc] border-2 border-slate-900 rounded-lg text-xs mb-4">
          <p className="font-black uppercase tracking-wider text-slate-500 mb-1">Affiliate Payout Details:</p>
          <div className="space-y-0.5 text-slate-900">
            <p><strong>UPI ID:</strong> {affiliate.bankDetails?.upiId || 'Not provided'}</p>
            <p><strong>Bank:</strong> {affiliate.bankDetails?.bankName || 'Not provided'} | <strong>A/C:</strong> {affiliate.bankDetails?.accountNumber || 'N/A'}</p>
            <p><strong>IFSC:</strong> {affiliate.bankDetails?.ifscCode || 'N/A'} | <strong>Beneficiary:</strong> {affiliate.bankDetails?.accountHolder || 'N/A'}</p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between font-black">
            <span className="text-slate-600">Pending Balance:</span>
            <span className="text-emerald-700 font-mono">₹{pending.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Payout Amount (₹ INR) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 text-base shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS / NEFT / RTGS)</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              UTR / Transaction Reference ID
            </label>
            <input
              type="text"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. UPI/123456789012 or IMPS83921"
            />
          </div>

          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. Commission for School ERP Jaipur closing"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-900 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Recording...' : 'Confirm & Mark Paid'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
