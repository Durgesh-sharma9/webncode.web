import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, PROJECT_OPTIONS } from '../admin/types'
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
  allowedProducts,
  onLeadAdded
}: AddLeadModalProps) {
  if (!isOpen) return null

  const availableProductsList = (allowedProducts && allowedProducts.length > 0)
    ? allowedProducts
    : PROJECT_OPTIONS

  const [selectedProducts, setSelectedProducts] = useState<string[]>([availableProductsList[0] || 'School ERP Pro'])
  const [customProduct, setCustomProduct] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!formData.organizationName.trim()) {
      showErrorToast('School / Organization name is required')
      return
    }
    if (!formData.contactPerson.trim()) {
      showErrorToast('Contact person name is required')
      return
    }
    if (!formData.phone.trim()) {
      showErrorToast('Phone number is required')
      return
    }
    if (selectedProducts.length === 0) {
      showErrorToast('Please select at least one software product')
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
          organizationName: formData.organizationName.trim(),
          contactPerson: formData.contactPerson.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          product: productSummary,
          products: selectedProducts,
          dealValue: 0,
          notes: formData.notes.trim()
        },
        config
      )

      showSuccessToast('Client lead registered successfully! Our team will reach out for the demo.')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-yellow-300 border-2 border-slate-900 rounded-lg text-lg shadow-[2px_2px_0px_0px_#0f172a]">
              🎯
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight">
                Submit Client Lead
              </h2>
              <p className="text-xs text-slate-600 font-bold">
                Enter client details. Our team will schedule the software demo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-full font-black text-sm shadow-[2px_2px_0px_0px_#0f172a] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-800">
          
          {/* School / Organization Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                School / Client Name *
              </label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. St. Xavier High School"
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
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
                placeholder="e.g. Jaipur, Rajasthan"
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Principal Rajesh Sharma"
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. contact@stxaviers.edu.in"
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          {/* Software Products Interested In */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-black uppercase tracking-wider text-slate-700">
                Software Products of Interest *
              </label>
              <span className="text-[10px] text-slate-500 font-bold">
                {selectedProducts.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {availableProductsList.map((prod) => {
                const isSelected = selectedProducts.includes(prod)
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`px-3 py-1.5 rounded-md text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#86efac]'
                        : 'bg-white text-slate-800 hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {prod}
                  </button>
                )
              })}
            </div>

            {/* Custom Product Add Button */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="mt-2 text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <span>+</span>
                <span>Other / Custom Software Requirement</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-2">
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
                  placeholder="Enter software/service name..."
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

          {/* Meeting Notes */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Discussion Notes / Preferred Demo Time
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. School needs ERP + Attendance System. Principal requested live demo on Thursday at 11 AM."
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t-2 border-slate-900 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all text-center cursor-pointer"
            >
              {isSubmitting ? 'Registering Lead...' : 'Submit Client Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
