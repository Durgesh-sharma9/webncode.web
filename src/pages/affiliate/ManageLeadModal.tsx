import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ManageLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  token: string | null
  payoutType?: 'percentage' | 'fixed'
  commissionRate: number
  fixedAmount?: number
  allowedProducts?: string[]
  onLeadUpdated: () => void
  onLeadDeleted?: () => void
}

export default function ManageLeadModal({
  isOpen,
  onClose,
  lead,
  token,
  payoutType = 'percentage',
  commissionRate,
  fixedAmount = 0,
  allowedProducts,
  onLeadUpdated,
  onLeadDeleted
}: ManageLeadModalProps) {
  if (!isOpen || !lead) return null

  const availableList =
    allowedProducts && allowedProducts.length > 0
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

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    dealValue: '',
    status: 'New',
    notes: ''
  })

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Populate form with current lead data on open
  useEffect(() => {
    if (lead) {
      setFormData({
        organizationName: lead.organizationName || '',
        contactPerson: lead.contactPerson || '',
        phone: lead.phone || '',
        email: lead.email || '',
        city: lead.city || '',
        dealValue: lead.dealValue ? String(lead.dealValue) : '',
        status: lead.status || 'New',
        notes: lead.notes || ''
      })

      if (lead.products && Array.isArray(lead.products) && lead.products.length > 0) {
        setSelectedProducts(lead.products)
      } else if (lead.product) {
        setSelectedProducts(lead.product.split(',').map((p) => p.trim()).filter(Boolean))
      } else {
        setSelectedProducts([availableList[0] || 'School ERP Pro'])
      }
      setShowDeleteConfirm(false)
    }
  }, [lead])

  const estVal = Number(formData.dealValue) || 0
  const projectedCommission =
    payoutType === 'fixed'
      ? fixedAmount || 0
      : estVal > 0
      ? Math.round((estVal * commissionRate) / 100)
      : 0

  const toggleProduct = (prod: string) => {
    if (selectedProducts.includes(prod)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prod))
      }
    } else {
      setSelectedProducts([...selectedProducts, prod])
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
        dealValue: estVal,
        status: formData.status,
        notes: formData.notes.trim()
      }

      await axios.put(`${API_BASE}/api/affiliate-portal/leads/${lead._id}`, payload, config)
      showSuccessToast('Lead updated successfully!')
      onLeadUpdated()
      onClose()
    } catch (err: any) {
      console.error('Update lead error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update lead')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete Lead
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.delete(`${API_BASE}/api/affiliate-portal/leads/${lead._id}`, config)
      showSuccessToast('Lead deleted successfully')
      if (onLeadDeleted) onLeadDeleted()
      else onLeadUpdated()
      onClose()
    } catch (err: any) {
      console.error('Delete lead error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to delete lead')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const cleanPhone = formData.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/91${cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone}?text=Hello%20${encodeURIComponent(formData.contactPerson)},%20this%20is%20regarding%20Web%20n%20Code%20Software%20Solutions.`

  const pipelineStages = [
    { id: 'New', label: 'New Lead', icon: '🌱', color: 'bg-slate-100 text-slate-800' },
    { id: 'Contacted', label: 'Contacted', icon: '📞', color: 'bg-amber-100 text-amber-900' },
    { id: 'Demo Scheduled', label: 'Demo Booked', icon: '📅', color: 'bg-blue-100 text-blue-900' },
    { id: 'In Negotiation', label: 'Negotiation', icon: '🤝', color: 'bg-purple-100 text-purple-900' },
    { id: 'Deal Won', label: 'Deal Won', icon: '🎉', color: 'bg-[#86efac] text-emerald-950 font-black' },
    { id: 'Lost', label: 'Cancelled/Lost', icon: '❌', color: 'bg-rose-100 text-rose-900' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
                LEAD MANAGER
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                ID: {lead._id.slice(-6)}
              </span>
            </div>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1 truncate max-w-sm sm:max-w-md">
              {formData.organizationName || 'Manage Client Lead'}
            </h2>
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
            <span className="text-[10px] font-black uppercase text-slate-500">Client Contact:</span>
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
              Current Deal Pipeline Stage *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pipelineStages.map((stage) => {
                const isSelected = formData.status === stage.id
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: stage.id })}
                    className={`p-2 rounded-lg border-2 border-slate-900 flex items-center gap-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#86efac] translate-y-[-1px]'
                        : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-sm leading-none">{stage.icon}</span>
                    <span className="text-[11px] font-black uppercase truncate">{stage.label}</span>
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

          {/* Products Pitched (Multi-select) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-black uppercase tracking-wider text-slate-700">
                Software Products Pitched
              </label>
              <span className="text-[10px] font-bold text-slate-500">
                {selectedProducts.length} Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border-2 border-slate-900 rounded-lg max-h-36 overflow-y-auto">
              {availableList.map((prod) => {
                const isSelected = selectedProducts.includes(prod)
                return (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => toggleProduct(prod)}
                    className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider border-2 border-slate-900 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#86efac] text-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {prod}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Deal Value & Projected Commission */}
          <div className="p-3 bg-[#f0fdf4] border-2 border-slate-900 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">
                Estimated Deal Value (₹)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900">₹</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.dealValue}
                  onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                  placeholder="e.g. 50000"
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-1.5 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-white border-2 border-slate-900 rounded-md p-2.5 shadow-[1.5px_1.5px_0px_0px_#000]">
              <span className="text-[9px] uppercase font-black text-slate-500 block">
                Your Commission ({payoutType === 'fixed' ? 'Flat' : `${commissionRate}%`})
              </span>
              <p className="text-base font-black text-emerald-700 mt-0.5">
                ₹{projectedCommission.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] text-slate-400 font-bold block">
                {payoutType === 'fixed' ? 'Flat reward per closed deal' : 'Calculated on closed deal value'}
              </span>
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

          {/* Commission status note if present */}
          {lead.commissionStatus && (
            <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px] flex items-center justify-between">
              <span className="font-bold text-slate-600">Admin Payout Status:</span>
              <span className={`px-2 py-0.5 rounded font-black uppercase text-[10px] ${
                lead.commissionStatus === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-500'
                  : 'bg-amber-100 text-amber-900 border border-amber-400'
              }`}>
                {lead.commissionStatus}
              </span>
            </div>
          )}

          {/* Delete Confirmation Box */}
          {showDeleteConfirm && (
            <div className="p-3 bg-rose-50 border-2 border-rose-600 rounded-lg space-y-2 text-rose-900">
              <div className="font-black text-xs uppercase flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Are you sure you want to delete this lead?</span>
              </div>
              <p className="text-[11px] font-bold">
                This will permanently remove "{formData.organizationName}" from your pipeline.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded font-black text-xs uppercase hover:bg-rose-700 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Lead'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-900 rounded font-black text-xs uppercase text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-3 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              {!showDeleteConfirm && lead.commissionStatus !== 'Paid' && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-rose-700 hover:text-rose-900 font-black text-xs uppercase hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>🗑️</span>
                  <span>Delete Lead</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-md font-black text-xs uppercase text-slate-800 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all cursor-pointer text-center"
              >
                {isSubmitting ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
