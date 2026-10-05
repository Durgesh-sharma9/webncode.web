import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface AddLeadModalProps {
  isOpen: boolean
  onClose: () => void
  token: string | null
  payoutType?: 'percentage' | 'fixed'
  commissionRate: number
  fixedAmount?: number
  allowedProducts?: string[]
  onLeadAdded: () => void
}

export default function AddLeadModal({
  isOpen,
  onClose,
  token,
  payoutType = 'percentage',
  commissionRate,
  fixedAmount = 0,
  allowedProducts,
  onLeadAdded
}: AddLeadModalProps) {
  if (!isOpen) return null

  const availableList = (allowedProducts && allowedProducts.length > 0)
    ? allowedProducts
    : [
        'School ERP Pro',
        'Timetable Pro',
        'Attendance Management System',
        'Result Management System',
        'Web Builder Pro',
        'Sports Academy Pro',
        'Daily Test Pro',
        'Custom Software / App'
      ]

  const [selectedProducts, setSelectedProducts] = useState<string[]>([availableList[0] || 'School ERP Pro'])
  const [customProduct, setCustomProduct] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    estimatedValue: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const estVal = Number(formData.estimatedValue) || 0
  const projectedCommission = estVal > 0 ? Math.round((estVal * commissionRate) / 100) : 0

  const toggleProduct = (prod: string) => {
    if (selectedProducts.includes(prod)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prod))
      } else {
        showErrorToast('Please select at least one product')
      }
    } else {
      setSelectedProducts([...selectedProducts, prod])
    }
  }

  const handleAddCustomProduct = () => {
    const val = customProduct.trim()
    if (!val) return
    if (!selectedProducts.includes(val)) {
      setSelectedProducts([...selectedProducts, val])
    }
    setCustomProduct('')
    setShowCustomInput(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (selectedProducts.length === 0) {
      showErrorToast('Please select at least one product or service')
      return
    }

    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      const productSummary = selectedProducts.join(', ')

      await axios.post(
        `${API_BASE}/api/affiliate-portal/leads`,
        {
          ...formData,
          product: productSummary,
          products: selectedProducts
        },
        config
      )

      showSuccessToast('Client lead submitted successfully! Our team will contact them.')
      onLeadAdded()
      onClose()
    } catch (err: any) {
      console.error('Submit lead error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to submit lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
              NEW CLIENT LEAD
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
              Submit Client Lead
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Submit details of a school or organization interested in Web n Code software.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* School/Org Name */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              School / College / Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. Modern Public Academy"
            />
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Contact Person (Principal/Director) *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Dr. Rajesh Verma"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Email & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="info@school.com"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Jaipur, Rajasthan"
              />
            </div>
          </div>

          {/* Multiple Products Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-black uppercase tracking-wider text-slate-700">
                Products Pitched / Sold (Select 1 or Multiple) *
              </label>
              <span className="text-[10px] text-blue-700 font-bold">
                {selectedProducts.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border-2 border-slate-900 rounded-lg max-h-52 overflow-y-auto">
              {availableList.map((prod) => {
                const isSelected = selectedProducts.includes(prod)
                return (
                  <label
                    key={prod}
                    className={`flex items-center gap-2.5 p-2 rounded-md border-2 cursor-pointer select-none transition-all ${
                      isSelected
                        ? 'bg-[#86efac] border-slate-900 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                        : 'bg-white border-slate-300 font-bold text-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProduct(prod)}
                      className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                    />
                    <span className="text-xs">{prod}</span>
                  </label>
                )
              })}

              {/* Any custom products added by affiliate */}
              {selectedProducts
                .filter((p) => !availableList.includes(p))
                .map((custom) => (
                  <label
                    key={custom}
                    className="flex items-center justify-between p-2 rounded-md border-2 bg-blue-100 border-slate-900 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">★ {custom}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleProduct(custom)}
                      className="text-rose-700 hover:text-rose-900 font-black text-xs px-1 cursor-pointer"
                      title="Remove"
                    >
                      ×
                    </button>
                  </label>
                ))}
            </div>

            {/* Custom product adder */}
            <div className="mt-2">
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="text-[11px] font-black text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Add Another / Custom Software Product</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomProduct()
                      }
                    }}
                    placeholder="Enter custom product/service name..."
                    className="flex-1 border-2 border-slate-900 rounded-md px-3 py-1.5 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomProduct}
                    className="px-3 py-1.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-[#6ee7b7] cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false)
                      setCustomProduct('')
                    }}
                    className="px-2 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Chips of chosen products */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedProducts.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded font-black text-[10px] text-slate-900 flex items-center gap-1"
                >
                  <span>✓ {p}</span>
                  {selectedProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => toggleProduct(p)}
                      className="hover:text-rose-700 cursor-pointer text-xs leading-none"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Estimated Value */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Estimated Total Deal Value (₹ Optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-900">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. 50000"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              If client wants multiple products bundled together, enter estimated total package cost.
            </p>
          </div>

          {/* Projected Commission / Reward Badge */}
          {payoutType === 'fixed' ? (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-md flex items-center justify-between text-xs font-black">
              <span className="text-emerald-900">Your Fixed Payout Reward on Deal Win:</span>
              <span className="text-emerald-700 text-sm">₹{(fixedAmount || 0).toLocaleString('en-IN')} Flat</span>
            </div>
          ) : (
            estVal > 0 && (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-md flex items-center justify-between text-xs font-black">
                <span className="text-emerald-900">Your Projected Commission ({commissionRate}%):</span>
                <span className="text-emerald-700 text-sm">₹{projectedCommission.toLocaleString('en-IN')}</span>
              </div>
            )
          )}

          {/* Meeting Notes */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Discussion Notes / Preferred Demo Time
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. School needs ERP + Attendance System. Principal requested demo on Thursday at 11 AM"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-900 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
