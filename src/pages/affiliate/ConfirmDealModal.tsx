import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ConfirmDealModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  token: string | null
  onSuccess: () => void
}

export default function ConfirmDealModal({
  isOpen,
  onClose,
  lead,
  token,
  onSuccess
}: ConfirmDealModalProps) {
  if (!isOpen || !lead) return null

  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.put(
        `${API_BASE}/api/affiliate-portal/leads/${lead._id}`,
        {
          status: 'Deal Confirmed',
          confirmationNotes: notes.trim() || 'School has confirmed purchase. Ready for admin verification and onboarding.'
        },
        config
      )

      showSuccessToast(`🎉 Deal confirmation sent for ${lead.organizationName}! Admin will verify and credit your commission.`)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Submit deal confirmation error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to submit deal confirmation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a] max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
              SCHOOL CONFIRMATION
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
              Confirm School Order
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              School agreed to purchase software? Submit confirmation to Admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer shrink-0"
          >
            ×
          </button>
        </div>

        {/* Lead Summary Card */}
        <div className="p-4 bg-emerald-50 border-2 border-slate-900 rounded-lg space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-700">Client / School:</span>
            <span className="text-sm font-black text-slate-950">{lead.organizationName}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">Contact Person:</span>
            <span className="font-bold text-slate-900">{lead.contactPerson} ({lead.phone})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-bold">Products:</span>
            <span className="font-bold text-blue-700">{lead.product}</span>
          </div>

          <div className="pt-2 border-t border-emerald-300 grid grid-cols-2 gap-2 text-center">
            <div className="bg-white border border-slate-900 rounded p-2">
              <span className="text-[9px] font-black uppercase text-slate-500 block">Package Price</span>
              <span className="text-sm font-black text-slate-900">₹{(lead.dealValue || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-[#86efac] border border-slate-900 rounded p-2">
              <span className="text-[9px] font-black uppercase text-slate-800 block">Your Commission</span>
              <span className="text-sm font-black text-slate-950">₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">
              Discussion Summary / Confirmation Note (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Principal Dr. Rajesh approved ERP + Attendance. Agreed on payment via Cheque / Bank Transfer. Demo was conducted successfully."
              className="w-full border-2 border-slate-900 rounded-md p-2.5 font-medium text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              This note will be sent directly to Admin for verification.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-400 rounded text-[11px] text-blue-900 flex items-start gap-2">
            <span className="text-base">💡</span>
            <span>
              Once submitted, Admin will verify the purchase and approve the deal. The commission of <strong>₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}</strong> will be credited directly to your wallet!
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all text-center cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : '✓ Submit Deal Confirmation'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
