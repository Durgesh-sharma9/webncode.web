import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface RequestWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  bankDetails?: {
    upiId?: string
    accountHolder?: string
    accountNumber?: string
    ifscCode?: string
    bankName?: string
  }
  token: string | null
  onRequestSubmitted: () => void
}

export default function RequestWithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
  bankDetails,
  token,
  onRequestSubmitted
}: RequestWithdrawalModalProps) {
  if (!isOpen) return null

  const hasUpi = Boolean(bankDetails?.upiId && bankDetails.upiId.trim())
  const hasBank = Boolean(bankDetails?.accountNumber && bankDetails.accountNumber.trim())
  const isConfigured = hasUpi || hasBank

  const [amount, setAmount] = useState<string>(availableBalance > 0 ? String(availableBalance) : '500')
  const [notes, setNotes] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const numAmount = Number(amount)

    if (!numAmount || numAmount <= 0) {
      showErrorToast('Please enter a valid amount')
      return
    }

    if (numAmount < 500) {
      showErrorToast('Minimum withdrawal amount is ₹500')
      return
    }

    if (numAmount > availableBalance) {
      showErrorToast(`Amount cannot exceed available balance of ₹${availableBalance.toLocaleString('en-IN')}`)
      return
    }

    setIsSubmitting(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.post(
        `${API_BASE}/api/affiliate-portal/request-payout`,
        {
          amount: numAmount,
          paymentMethod: hasUpi ? 'UPI' : 'Bank Transfer',
          notes
        },
        config
      )

      setSubmittedSuccess(true)
      showSuccessToast('Withdrawal request submitted! Verification within 24 hours.')
      onRequestSubmitted()
    } catch (err: any) {
      console.error('Request payout error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to submit withdrawal request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-md bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
              WITHDRAW COMMISSIONS
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              Request Payout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>

        {submittedSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black text-emerald-800">
              ✓
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-slate-900">Request Submitted Successfully!</h3>
              <div className="mt-3 p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-xs text-emerald-950 font-bold leading-relaxed text-left">
                🕒 <span className="underline">24 Hours Guarantee:</span> Hum aapki closed deals aur bank details verify karke <span className="text-emerald-800 font-black">24 hours ke andar</span> aapke account me amount transfer kar denge.
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-900 text-white rounded-md font-black uppercase text-xs shadow-[2px_2px_0px_0px_#ff9e7d] hover:bg-slate-800 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Balance Overview */}
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-500 block">Available to Withdraw</span>
                <span className="text-xl font-black text-emerald-700">₹{availableBalance.toLocaleString('en-IN')}</span>
              </div>
              {availableBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(availableBalance))}
                  className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-700 text-emerald-900 rounded font-black text-[10px] uppercase cursor-pointer"
                >
                  Withdraw All
                </button>
              )}
            </div>

            {/* Destination Account */}
            <div className="border-2 border-slate-900 rounded-lg p-3 bg-white">
              <span className="text-[10px] uppercase font-black text-slate-500 block mb-1">
                Disbursement Account:
              </span>
              {hasUpi ? (
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-blue-100 border border-blue-600 text-blue-800 font-black rounded text-[10px]">UPI</span>
                  <span className="font-black text-slate-900 text-xs">{bankDetails?.upiId}</span>
                </div>
              ) : hasBank ? (
                <div>
                  <div className="font-black text-slate-900">{bankDetails?.bankName || 'Bank Account'}</div>
                  <div className="text-[11px] text-slate-600">A/C: {bankDetails?.accountNumber} | IFSC: {bankDetails?.ifscCode}</div>
                </div>
              ) : (
                <div className="text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded p-2 text-[11px]">
                  ⚠️ No UPI or Bank account found.{' '}
                  <Link to="/affiliate/settings" onClick={onClose} className="underline font-black text-blue-700">
                    Add Details in Settings
                  </Link>
                </div>
              )}
            </div>

            {/* Amount input */}
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Amount to Withdraw (₹) *
              </label>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">₹</span>
                <input
                  type="number"
                  min="500"
                  max={availableBalance}
                  step="100"
                  required
                  disabled={!isConfigured || availableBalance < 500}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none disabled:bg-slate-100"
                  placeholder="e.g. 5000"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Minimum withdrawal amount is ₹500.</p>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Note for Finance Team (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Please transfer via PhonePe UPI"
              />
            </div>

            {/* 24-Hour Assurance Alert Box */}
            <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded-lg text-amber-950 text-xs font-bold leading-relaxed">
              🕒 <span className="font-black uppercase">24 Hours Transfer Policy:</span> Admin aapki request verify karke 24 ghante ke andar aapke UPI / Bank me paise transfer kar dega.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-slate-900 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isConfigured || availableBalance < 500}
                className="px-5 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  )
}
