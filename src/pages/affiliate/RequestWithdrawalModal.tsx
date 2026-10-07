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
    primaryMethod?: 'upi' | 'bank'
    upiId?: string
    accountHolder?: string
    accountNumber?: string
    ifscCode?: string
    bankName?: string
    accountType?: string
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

  // Default method selection based on saved settings
  const defaultMethod: 'UPI' | 'Bank Transfer' =
    bankDetails?.primaryMethod === 'bank' && hasBank
      ? 'Bank Transfer'
      : hasUpi
      ? 'UPI'
      : hasBank
      ? 'Bank Transfer'
      : 'UPI'

  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Bank Transfer'>(defaultMethod)
  const [amount, setAmount] = useState<string>(availableBalance > 0 ? String(availableBalance) : '100')
  const [inlineUpi, setInlineUpi] = useState<string>('')
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

    if (numAmount < 100) {
      showErrorToast('Minimum withdrawal amount is ₹100')
      return
    }

    if (numAmount > availableBalance) {
      showErrorToast(`Amount cannot exceed available balance of ₹${availableBalance.toLocaleString('en-IN')}`)
      return
    }

    if (!isConfigured && !inlineUpi.trim()) {
      showErrorToast('Please enter your UPI ID or Bank account to receive payout')
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
          paymentMethod: isConfigured ? selectedMethod : 'UPI',
          upiId: !isConfigured ? inlineUpi.trim() : undefined,
          notes
        },
        config
      )

      setSubmittedSuccess(true)
      showSuccessToast('Withdrawal request submitted! Verification within 24-48 hours.')
      onRequestSubmitted()
    } catch (err: any) {
      console.error('Request payout error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to submit withdrawal request')
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
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
              COMMISSION PAYOUT
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              Withdrawal Request
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {submittedSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-[#86efac] border-2 border-slate-900 rounded-full flex items-center justify-center mx-auto text-2xl font-black text-slate-900 shadow-[3px_3px_0px_0px_#000]">
              ✓
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-slate-900">Withdrawal Request Submitted!</h3>
              <div className="mt-3 p-4 bg-[#f0fdf4] border-2 border-slate-900 rounded-lg text-xs text-slate-900 font-bold leading-relaxed text-left shadow-[2px_2px_0px_0px_#000]">
                🕒 <span className="font-black underline text-emerald-800">24-48 Hours Verification Policy:</span>
                <p className="mt-1 text-slate-700">
                  Our finance team will verify your closed deals and disburse funds to your registered account within <span className="font-black text-emerald-800">24 to 48 hours</span>.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-md font-black uppercase text-xs shadow-[2px_2px_0px_0px_#ff9e7d] hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Balance Overview */}
            <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_#000]">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-500 block">Available for Withdrawal Request</span>
                <span className="text-2xl font-black text-emerald-700">₹{availableBalance.toLocaleString('en-IN')}</span>
              </div>
              {availableBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(String(availableBalance))}
                  className="px-3 py-1.5 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 text-slate-900 rounded-md font-black text-[10px] uppercase cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                >
                  Request Full Balance
                </button>
              )}
            </div>

            {/* Destination Account: Auto-routed from Settings */}
            <div className="border-2 border-slate-900 rounded-lg p-3 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black text-slate-500 block">
                  Disbursement Destination:
                </span>
                {isConfigured && (
                  <span className="px-1.5 py-0.5 bg-[#86efac] border border-slate-900 rounded text-[9px] font-black text-slate-950 uppercase">
                    ✓ Saved Account
                  </span>
                )}
              </div>

              {/* If both UPI & Bank are saved, let user toggle */}
              {hasUpi && hasBank ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`p-2 rounded border-2 border-slate-900 text-left transition-all cursor-pointer ${
                      selectedMethod === 'UPI'
                        ? 'bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-black text-[11px] flex items-center gap-1">
                      <span>⚡ UPI</span>
                      {selectedMethod === 'UPI' && <span>✓</span>}
                    </div>
                    <div className="text-[10px] truncate font-bold text-slate-800">{bankDetails?.upiId}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Bank Transfer')}
                    className={`p-2 rounded border-2 border-slate-900 text-left transition-all cursor-pointer ${
                      selectedMethod === 'Bank Transfer'
                        ? 'bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-black text-[11px] flex items-center gap-1">
                      <span>🏦 Bank</span>
                      {selectedMethod === 'Bank Transfer' && <span>✓</span>}
                    </div>
                    <div className="text-[10px] truncate font-bold text-slate-800">
                      ••••{bankDetails?.accountNumber?.slice(-4)}
                    </div>
                  </button>
                </div>
              ) : hasUpi ? (
                <div className="flex items-center gap-2 p-2 bg-[#f0fdf4] border border-slate-900 rounded">
                  <span className="px-1.5 py-0.5 bg-blue-100 border border-blue-600 text-blue-800 font-black rounded text-[10px]">UPI</span>
                  <span className="font-black text-slate-900 text-xs">{bankDetails?.upiId}</span>
                </div>
              ) : hasBank ? (
                <div className="p-2 bg-[#f0fdf4] border border-slate-900 rounded">
                  <div className="font-black text-slate-900">{bankDetails?.bankName || 'Bank Account'}</div>
                  <div className="text-[11px] text-slate-700 font-bold">
                    A/C: ••••{bankDetails?.accountNumber?.slice(-4)} | IFSC: {bankDetails?.ifscCode}
                  </div>
                  <div className="text-[10px] text-slate-500">Holder: {bankDetails?.accountHolder}</div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-amber-900 font-bold bg-amber-50 border border-amber-300 rounded p-2 text-[11px]">
                    No payout account saved yet. Enter UPI below, or{' '}
                    <Link to="/affiliate/settings" onClick={onClose} className="underline text-blue-700 font-black">
                      save once in Settings
                    </Link>{' '}
                    for auto-payouts.
                  </div>
                  <input
                    type="text"
                    required
                    value={inlineUpi}
                    onChange={(e) => setInlineUpi(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-1.5 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Amount input */}
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Withdrawal Request Amount (₹) *
              </label>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-slate-900">₹</span>
                <input
                  type="number"
                  min="100"
                  max={availableBalance}
                  step="any"
                  required
                  disabled={availableBalance < 100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none disabled:bg-slate-100"
                  placeholder="e.g. 750"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Minimum withdrawal request amount is ₹100.</p>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Note for Finance Team (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Urgent settlement for School ERP deal"
                className="w-full border-2 border-slate-900 rounded-md px-3 py-1.5 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || availableBalance < 100}
                className="w-full py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all text-center cursor-pointer"
              >
                {isSubmitting ? 'Submitting Request...' : `Submit Withdrawal Request (₹${Number(amount || 0).toLocaleString('en-IN')})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
