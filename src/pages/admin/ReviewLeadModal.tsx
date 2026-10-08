import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem, type ProductPlan, AVAILABLE_PRODUCTS, getProductPrice } from './types'
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

  // Available software plans
  const [dbPlans, setDbPlans] = useState<ProductPlan[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>(lead.product || 'School ERP Pro')

  // The 2 core inputs
  const [dealValue, setDealValue] = useState<string>(
    lead.dealValue && lead.dealValue > 0 ? String(lead.dealValue) : '50000'
  )
  const [commissionAmount, setCommissionAmount] = useState<string>(
    lead.commissionAmount && lead.commissionAmount > 0 ? String(lead.commissionAmount) : '5000'
  )
  const [adminNotes, setAdminNotes] = useState<string>(lead.adminNotes || '')
  const [rejectionReason, setRejectionReason] = useState<string>(lead.rejectionReason || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  // Load product plans from database
  useEffect(() => {
    if (!isOpen) return

    const loadPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/affiliates/plans`, {
          headers: getHeaders(),
          timeout: 10000
        })
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setDbPlans(res.data.data)
        }
      } catch (err) {
        // Fallback to static catalog if API is unreachable
      }
    }
    loadPlans()
  }, [isOpen])

  // Sync mode whenever opened
  useEffect(() => {
    if (mode) setCurrentMode(mode)
  }, [mode, isOpen])

  // Initialize values from lead
  useEffect(() => {
    if (lead) {
      const initialProd = lead.product || (lead.products && lead.products[0]) || 'School ERP Pro'
      setSelectedProduct(initialProd)

      if (lead.dealValue && lead.dealValue > 0) {
        setDealValue(String(lead.dealValue))
      } else {
        // Auto fill default price for this product
        const defaultPrice = getProductPrice(initialProd, dbPlans)
        setDealValue(String(defaultPrice))
      }

      if (lead.commissionAmount && lead.commissionAmount > 0) {
        setCommissionAmount(String(lead.commissionAmount))
      } else {
        const numVal = lead.dealValue && lead.dealValue > 0 ? lead.dealValue : getProductPrice(initialProd, dbPlans)
        const autoComm = isFixed ? fixedReward : Math.round((numVal * defaultRate) / 100)
        setCommissionAmount(String(autoComm))
      }

      setAdminNotes(lead.adminNotes || '')
      setRejectionReason(lead.rejectionReason || '')
    }
  }, [lead, dbPlans, isFixed, fixedReward, defaultRate])

  // When Super Admin changes the chosen product, auto-suggest the catalog price & commission
  const handleProductChange = (newProd: string) => {
    setSelectedProduct(newProd)
    const price = getProductPrice(newProd, dbPlans)
    setDealValue(String(price))
    const autoComm = isFixed ? fixedReward : Math.round((price * defaultRate) / 100)
    setCommissionAmount(String(autoComm))
  }

  // When Super Admin changes deal value, auto-suggest commission (can still be edited manually)
  const handleDealValueChange = (valStr: string) => {
    setDealValue(valStr)
    const num = Number(valStr) || 0
    if (isFixed) {
      setCommissionAmount(String(fixedReward))
    } else {
      const autoComm = Math.round((num * defaultRate) / 100)
      setCommissionAmount(String(autoComm))
    }
  }

  const isApprove = currentMode === 'approve'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = {
        headers: getHeaders()
      }

      if (isApprove) {
        const val = Number(dealValue) || 0
        const comm = Number(commissionAmount) || 0

        await axios.put(
          `${API_BASE}/api/affiliates/leads/${lead._id}`,
          {
            status: 'Deal Won',
            product: selectedProduct,
            dealValue: val,
            commissionAmount: comm,
            commissionStatus: 'Approved',
            adminNotes: adminNotes.trim(),
            notes: lead.notes || ''
          },
          config
        )

        showSuccessToast(
          `Deal finalized! ₹${comm.toLocaleString('en-IN')} commission credited to ${aff?.name || 'affiliate partner'}.`
        )
      } else {
        // Cancel / Lost
        if (!rejectionReason.trim()) {
          showErrorToast('Please provide a reason for cancelling this deal')
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

        showSuccessToast('Lead has been marked as Lost/Cancelled.')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Update lead action error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update deal')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pre-compiled list of product options combining database plans and available products
  const productOptions = dbPlans.length > 0
    ? dbPlans.map((p) => `${p.projectName} - ${p.planName}`)
    : AVAILABLE_PRODUCTS

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-900 rounded ${
                isApprove ? 'bg-[#86efac] text-emerald-950' : 'bg-rose-200 text-rose-950'
              }`}
            >
              {isApprove ? '💰 DEAL FINALIZE & SETTLE' : '❌ CANCEL / LOST LEAD'}
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {isApprove ? 'Close Deal & Credit Commission' : 'Mark Deal as Lost / Cancelled'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer text-lg"
          >
            ×
          </button>
        </div>

        {/* Mode Switcher: Won Deal vs Lost Deal */}
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
            <span>✓ Deal Won / Finalize</span>
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
            <span>✕ Deal Cancelled / Lost</span>
          </button>
        </div>

        {/* Lead Client Summary Box */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3 text-xs space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">🏫 School / Client:</span>
            <span className="font-black text-slate-900 text-sm">{lead.organizationName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">👤 Contact Person:</span>
            <span className="font-bold text-slate-800">{lead.contactPerson} {lead.phone ? `(${lead.phone})` : ''}</span>
          </div>
          {lead.city && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">📍 Location / City:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
                {lead.city}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 mt-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">🤝 Affiliate Partner:</span>
            <span className="font-black text-slate-900">
              {aff?.name || 'Partner'} [{aff?.referralCode || 'CODE'}]
              <span className="ml-1 text-[10px] text-blue-700">
                ({isFixed ? `Flat ₹${fixedReward.toLocaleString('en-IN')}` : `${defaultRate}% Standard Comm`})
              </span>
            </span>
          </div>
          {lead.status === 'Deal Confirmed' && (
            <div className="bg-amber-100 border-2 border-amber-500 rounded-lg p-2.5 text-amber-950 font-bold mt-2 shadow-xs">
              <span className="block text-[10px] uppercase font-black text-amber-900">🔔 Partner Reported Purchase:</span>
              <span className="block text-xs mt-0.5">Reported Product(s): <strong className="underline">{lead.product || 'Software'}</strong></span>
              {lead.confirmationNotes && (
                <span className="block text-[11px] italic mt-0.5 text-amber-900">Order Note: "{lead.confirmationNotes}"</span>
              )}
            </div>
          )}
          {lead.notes && (
            <div className="border-t border-slate-200 pt-1.5 text-[11px] text-slate-600 italic">
              Partner Visit Note: "{lead.notes}"
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isApprove ? (
            <>
              {/* STEP 1: Kon sa Plan becha? */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <label className="block font-black uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 bg-blue-100 border border-slate-900 rounded text-[10px]">STEP 1</span>
                  <span>📦 Kaun sa Plan Becha? (Select Sold Product) *</span>
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 focus:outline-none bg-white cursor-pointer mt-1"
                >
                  {productOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="block text-[10px] text-slate-500 font-bold mt-1">
                  💡 Select karte hi standard catalog price neeche auto-fill ho jayega.
                </span>
              </div>

              {/* STEP 2: Kitne paise mile? */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <label className="block font-black uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 bg-emerald-100 border border-slate-900 rounded text-[10px]">STEP 2</span>
                  <span>💵 School se Kitne Paise Mile? (Final Deal Amount ₹) *</span>
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-black text-lg text-slate-900">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={dealValue}
                    onChange={(e) => handleDealValueChange(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-base text-slate-900 focus:outline-none bg-[#f0fdf4]"
                    placeholder="e.g. 50000"
                  />
                </div>
                <span className="block text-[10px] text-slate-500 font-bold mt-1">
                  School se final jitne paise me deal hui hai wo amount yahan likhein (discount ke baad wala amount).
                </span>
              </div>

              {/* STEP 3: Kitni commission mile? */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-purple-100 border border-slate-900 rounded text-[10px]">STEP 3</span>
                    <span>🎁 Affiliate ko Kitni Commission Deni Hai? (₹) *</span>
                  </label>
                  <span className="text-[10px] text-purple-700 font-black">
                    {isFixed ? `Flat Reward: ₹${fixedReward}` : `Auto: ${defaultRate}% of deal`}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-black text-lg text-purple-700">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={commissionAmount}
                    onChange={(e) => setCommissionAmount(e.target.value)}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-base text-purple-950 focus:outline-none bg-purple-50"
                    placeholder="e.g. 5000"
                  />
                </div>
                <span className="block text-[10px] text-slate-600 font-bold mt-1">
                  💡 Yeh commission partner ke dashboard me credit ho jayegi. Aap ise manually bhi kam ya zyada kar sakte hain.
                </span>
              </div>

              {/* STEP 4: Note for Partner (Optional) */}
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  📝 Note for Partner (Optional - Visible in Partner Dashboard)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 focus:outline-none bg-slate-50"
                  placeholder="e.g. 1-Year ERP license closed with upfront payment. Full commission credited."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#86efac] border-2 border-slate-900 rounded-lg font-black text-sm uppercase tracking-wider text-slate-950 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>✓</span>
                  <span>{isSubmitting ? 'Saving Deal...' : 'Confirm Deal & Credit Commission'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Lost / Cancelled Reason */}
              <div className="bg-rose-50 border-2 border-slate-900 rounded-lg p-3">
                <label className="block font-black uppercase tracking-wider text-rose-950 mb-1">
                  Why was this deal cancelled / lost? *
                </label>
                <input
                  type="text"
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 focus:outline-none bg-white mt-1"
                  placeholder="e.g. School principal declined demo, already using other software, etc."
                />
                
                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {[
                    'School principal declined demo',
                    'Already using another software',
                    'Budget issues / Not interested',
                    'Invalid contact number / No response'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className="text-[9px] font-bold bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded hover:border-slate-900 cursor-pointer"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-rose-500 border-2 border-slate-900 rounded-lg font-black text-sm uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>✕</span>
                  <span>{isSubmitting ? 'Cancelling Lead...' : 'Mark Deal as Lost'}</span>
                </button>
              </div>
            </>
          )}
        </form>

      </div>
    </div>
  )
}
