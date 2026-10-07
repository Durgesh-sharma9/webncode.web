import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem, PRODUCT_CATALOG } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ManageLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  token: string | null
  allowedProducts?: string[]
  onLeadUpdated: () => void
}

export default function ManageLeadModal({
  isOpen,
  onClose,
  lead,
  token,
  allowedProducts,
  onLeadUpdated
}: ManageLeadModalProps) {
  if (!isOpen || !lead) return null

  const availableList =
    allowedProducts && allowedProducts.length > 0
      ? allowedProducts
      : PRODUCT_CATALOG.map((p) => p.name)

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    status: 'In Discussion',
    notes: ''
  })

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form with current lead data on open
  useEffect(() => {
    if (lead) {
      setFormData({
        organizationName: lead.organizationName || '',
        contactPerson: lead.contactPerson || '',
        phone: lead.phone || '',
        email: lead.email || '',
        city: lead.city || '',
        status: lead.status || 'In Discussion',
        notes: lead.notes || ''
      })

      if (lead.products && Array.isArray(lead.products) && lead.products.length > 0) {
        setSelectedProducts(lead.products)
      } else if (lead.product) {
        setSelectedProducts(lead.product.split(',').map((p) => p.trim()).filter(Boolean))
      } else {
        setSelectedProducts([availableList[0] || 'School ERP Pro'])
      }
    }
  }, [lead])

  const toggleProduct = (prodName: string) => {
    if (selectedProducts.includes(prodName)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prodName))
      } else {
        showErrorToast('At least one software product must be selected')
      }
    } else {
      setSelectedProducts([...selectedProducts, prodName])
    }
  }

  // Handle Save Lead
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()

    if (!formData.organizationName.trim()) {
      showErrorToast('School/Organization name is required')
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

    setIsSubmitting(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      const payload = {
        organizationName: formData.organizationName.trim(),
        contactPerson: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        products: selectedProducts,
        product: selectedProducts.join(', '),
        status: formData.status,
        notes: formData.notes.trim()
      }

      await axios.put(`${API_BASE}/api/affiliate-portal/leads/${lead._id}`, payload, config)
      showSuccessToast('Lead details updated successfully!')
      onLeadUpdated()
      onClose()
    } catch (err: any) {
      console.error('Update lead error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  const cleanPhone = formData.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/91${cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone}?text=Hello%20${encodeURIComponent(formData.contactPerson)},%20this%20is%20regarding%20Web%20n%20Code%20Software%20Solutions.`

  const pipelineStages = [
    { id: 'In Discussion', label: '💬 In Discussion', desc: 'Active communication with client' },
    { id: 'Deal Confirmed', label: '🎉 Deal Confirmed', desc: 'Client agreed to purchase (Ready for Admin verification)' },
    { id: 'Lost', label: '❌ Cancelled', desc: 'Client declined or cancelled' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
                EDIT CLIENT LEAD
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                ID: {lead._id.slice(-6)}
              </span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1 truncate max-w-sm sm:max-w-md">
              {formData.organizationName || 'Edit Client Lead'}
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Update school details, contact person, pipeline stage, and products pitched.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Quick Contact & WhatsApp Bar */}
        <div className="p-3 bg-[#f8fafc] border-2 border-slate-900 rounded-lg flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-500">Contact:</span>
            <span className="font-black text-slate-900">{formData.contactPerson}</span>
            <span className="text-slate-600 font-bold">({formData.phone})</span>
          </div>

          <div className="flex items-center gap-2">
            {formData.phone && (
              <>
                <a
                  href={`tel:${formData.phone}`}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-900 rounded text-xs font-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 text-slate-900"
                >
                  <span>📞 Call</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-[#86efac] hover:bg-[#6ee7b7] border border-slate-900 rounded text-xs font-black shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 text-slate-950"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Pipeline Stage Selector */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-800 mb-1.5">
              Pipeline Stage *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {pipelineStages.map((stage) => {
                const isSelected = formData.status === stage.id
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: stage.id })}
                    className={`p-2 rounded-lg border-2 border-slate-900 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#86efac] translate-y-[-1px]'
                        : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black uppercase truncate block">{stage.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* School / Org & City */}
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
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. St. Xavier High School"
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
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Jaipur, Rajasthan"
              />
            </div>
          </div>

          {/* Contact Person, Phone, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Mr. Rajesh Sharma"
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
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono"
                placeholder="e.g. 9876543210"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="principal@school.edu"
              />
            </div>
          </div>

          {/* Software Products Pitched (No prices, pure selection) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-black uppercase tracking-wider text-slate-700">
                Software Products Pitched *
              </label>
              <span className="text-[10px] text-slate-500 font-bold">
                {selectedProducts.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border-2 border-slate-900 rounded-lg">
              {availableList.map((prod) => {
                const isSelected = selectedProducts.includes(prod)
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#86efac] font-black'
                        : 'bg-white text-slate-800 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{prod}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Discussion Notes / Follow-up history */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Discussion Notes & Follow-Up Log
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Called principal on Monday, liked timetable module. In-person demo scheduled for next Wednesday."
              className="w-full border-2 border-slate-900 rounded-md p-2.5 font-medium text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          {/* Super Admin Closing Note if present */}
          {lead.adminNotes && (
            <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-black text-blue-900 uppercase text-[10px]">
                <span>📢</span>
                <span>Note from Super Admin:</span>
              </div>
              <p className="text-slate-800 font-bold leading-relaxed text-[11px]">
                {lead.adminNotes}
              </p>
            </div>
          )}

          {/* Action Buttons (Save Changes & Cancel only, NO Delete) */}
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
              {isSubmitting ? 'Saving...' : '✓ Save Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
