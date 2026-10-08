import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem, AVAILABLE_PRODUCTS } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ReportPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  token: string | null
  allowedProducts?: string[]
  onSuccess: () => void
}

export default function ReportPurchaseModal({
  isOpen,
  onClose,
  lead,
  token,
  allowedProducts,
  onSuccess
}: ReportPurchaseModalProps) {
  if (!isOpen || !lead) return null

  const availableList =
    allowedProducts && allowedProducts.length > 0
      ? allowedProducts
      : AVAILABLE_PRODUCTS

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [confirmationNotes, setConfirmationNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize selected products from lead
  useEffect(() => {
    if (lead) {
      if (lead.products && Array.isArray(lead.products) && lead.products.length > 0) {
        setSelectedProducts(lead.products)
      } else if (lead.product) {
        setSelectedProducts(lead.product.split(',').map((p) => p.trim()).filter(Boolean))
      } else {
        setSelectedProducts([availableList[0] || 'School ERP Pro'])
      }
      setConfirmationNotes(lead.confirmationNotes || lead.notes || '')
    }
  }, [lead])

  const toggleProduct = (prodName: string) => {
    if (selectedProducts.includes(prodName)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prodName))
      } else {
        showErrorToast('Please select at least 1 product that the school purchased')
      }
    } else {
      setSelectedProducts([...selectedProducts, prodName])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (selectedProducts.length === 0) {
      showErrorToast('Please select at least 1 product that the school purchased')
      return
    }

    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      const payload = {
        status: 'Deal Confirmed',
        products: selectedProducts,
        product: selectedProducts.join(', '),
        confirmationNotes: confirmationNotes.trim()
      }

      await axios.put(`${API_BASE}/api/affiliate-portal/leads/${lead._id}`, payload, config)
      showSuccessToast('🎉 Purchase reported to Super Admin! Super Admin will review and credit your commission.')
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Report purchase error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to submit purchase notification')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-300 border border-slate-900 rounded inline-flex items-center gap-1">
                <span>🔔</span>
                <span>NOTIFY ADMIN: PURCHASE COMPLETED</span>
              </span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              School Bought Product! 🎉
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Report which software product(s) this school took. Super Admin will finalize deal value & credit your commission.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* School Summary Box */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3.5 mb-4 shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">School / Client</span>
              <h3 className="font-black text-sm text-slate-900 leading-snug">
                🏫 {lead.organizationName}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                <span className="font-bold text-slate-700">👤 {lead.contactPerson}</span>
                <span className="text-slate-500 font-mono">📞 {lead.phone}</span>
                {lead.city && <span className="text-slate-500">📍 {lead.city}</span>}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          
          {/* Step 1: Which products were purchased? */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
                <span>1.</span>
                <span>Iss School Ne Kaunse Product(s) Liye?</span>
              </label>
              <span className="text-[10px] text-blue-700 font-black">
                {selectedProducts.length} Selected
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              School ne jo jo software liye hain unko select karein (multiple select kar sakte hain):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableList.map((prod) => {
                const isSelected = selectedProducts.includes(prod)
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`p-2.5 rounded-lg border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-black truncate">{prod}</span>
                    <span className="text-xs shrink-0 font-mono ml-1">{isSelected ? '✓' : '+'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Optional Notes / Order Remarks */}
          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1">
              <span>2.</span>
              <span>Details / Order Note (Optional):</span>
            </label>
            <textarea
              rows={2}
              value={confirmationNotes}
              onChange={(e) => setConfirmationNotes(e.target.value)}
              placeholder="e.g. Principal finalized for 1 year, agreement signed or advance cheque paid..."
              className="w-full border-2 border-slate-900 rounded-lg p-2.5 text-xs font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-[11px] text-amber-950 font-medium leading-relaxed">
            💡 <strong>Next Step:</strong> Submit karne ke baad Super Admin ko notification jayega. Super Admin final received amount verify karke aapke wallet me commission credit kar dega!
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 border-2 border-slate-900 rounded-lg font-black text-xs uppercase hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 rounded-lg font-black text-xs uppercase shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>🚀</span>
              <span>{isSubmitting ? 'Notifying...' : 'Notify Admin & Submit Purchase'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
