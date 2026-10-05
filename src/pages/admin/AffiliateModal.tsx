import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, AVAILABLE_PRODUCTS, type AffiliateItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface AffiliateModalProps {
  isOpen: boolean
  onClose: () => void
  affiliate: AffiliateItem | null
  token: string | null
  onSaved: () => void
}

export default function AffiliateModal({ isOpen, onClose, affiliate, token, onSaved }: AffiliateModalProps) {
  const isEditing = Boolean(affiliate)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    referralCode: '',
    payoutType: 'percentage' as 'percentage' | 'fixed',
    commissionRate: 10,
    fixedAmount: 5000,
    allowedProducts: [...AVAILABLE_PRODUCTS] as string[],
    status: 'active' as 'active' | 'inactive' | 'suspended',
    notes: '',
    sendEmail: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (affiliate) {
      setFormData({
        name: affiliate.name || '',
        email: affiliate.email || '',
        phone: affiliate.phone || '',
        password: '',
        referralCode: affiliate.referralCode || '',
        payoutType: affiliate.payoutType || 'percentage',
        commissionRate: affiliate.commissionRate ?? 10,
        fixedAmount: affiliate.fixedAmount ?? 5000,
        allowedProducts: Array.isArray(affiliate.allowedProducts) && affiliate.allowedProducts.length > 0
          ? affiliate.allowedProducts
          : [...AVAILABLE_PRODUCTS],
        status: affiliate.status || 'active',
        notes: affiliate.notes || '',
        sendEmail: false
      })
    } else {
      // Default auto-generated referral code suggestion
      const randomSuffix = Math.floor(100 + Math.random() * 900)
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: 'Pass@' + Math.floor(1000 + Math.random() * 9000),
        referralCode: `WNC-REF${randomSuffix}`,
        payoutType: 'percentage',
        commissionRate: 10,
        fixedAmount: 5000,
        allowedProducts: [...AVAILABLE_PRODUCTS],
        status: 'active',
        notes: '',
        sendEmail: true
      })
    }
  }, [affiliate, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      if (isEditing && affiliate) {
        await axios.put(`${API_BASE}/api/affiliates/${affiliate._id}`, formData, config)
        showSuccessToast('Affiliate partner updated successfully')
      } else {
        await axios.post(`${API_BASE}/api/affiliates`, formData, config)
        showSuccessToast('New affiliate partner onboarded successfully!')
      }

      onSaved()
      onClose()
    } catch (err: any) {
      console.error('Affiliate save error:', err)
      const msg = err.response?.data?.message || 'Failed to save affiliate partner'
      showErrorToast(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#dbeafe] border border-slate-900 rounded">
              {isEditing ? 'UPDATE PARTNER' : 'ONBOARD AFFILIATE'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {isEditing ? `Edit: ${affiliate?.name}` : 'Add New Affiliate Partner'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value
                  setFormData((prev) => {
                    const clean = val.trim().replace(/\s+/g, '').toUpperCase().slice(0, 8)
                    return {
                      ...prev,
                      name: val,
                      referralCode: !isEditing && clean ? `WNC-${clean}` : prev.referralCode
                    }
                  })
                }}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                disabled={isEditing}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none disabled:bg-slate-100"
                placeholder="partner@gmail.com"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                {isEditing ? 'New Password (Leave blank to keep current)' : 'Login Password *'}
              </label>
              <input
                type="text"
                required={!isEditing}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder={isEditing ? '••••••••' : 'Min 6 characters'}
              />
            </div>
          </div>

          {/* Payout Model Choice */}
          <div className="p-3 bg-[#fefce8] border-2 border-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="font-black uppercase tracking-wider text-slate-800 text-[11px]">
                Earnings Model (How Partner Gets Rewarded)
              </label>
              <span className="text-[10px] font-bold text-slate-500">
                {formData.payoutType === 'percentage' ? '% of Deal Value' : 'Flat ₹ per Closed Deal'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, payoutType: 'percentage' })}
                className={`py-2 px-3 text-xs font-black uppercase rounded border-2 border-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.payoutType === 'percentage'
                    ? 'bg-[#ffde59] shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white opacity-60 hover:opacity-100'
                }`}
              >
                <input
                  type="radio"
                  name="payoutType"
                  checked={formData.payoutType === 'percentage'}
                  onChange={() => setFormData({ ...formData, payoutType: 'percentage' })}
                  className="accent-slate-900 cursor-pointer"
                />
                <span>% Commission</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, payoutType: 'fixed' })}
                className={`py-2 px-3 text-xs font-black uppercase rounded border-2 border-slate-900 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.payoutType === 'fixed'
                    ? 'bg-[#86efac] shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white opacity-60 hover:opacity-100'
                }`}
              >
                <input
                  type="radio"
                  name="payoutType"
                  checked={formData.payoutType === 'fixed'}
                  onChange={() => setFormData({ ...formData, payoutType: 'fixed' })}
                  className="accent-slate-900 cursor-pointer"
                />
                <span>₹ Fixed / Project</span>
              </button>
            </div>
          </div>

          {/* Commission / Reward Rate Input */}
          <div>
            {formData.payoutType === 'percentage' ? (
              <>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Commission Rate (%) *
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="10"
                  />
                  <span className="font-black text-base">%</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Default 10% of deal value</p>
              </>
            ) : (
              <>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Fixed Reward per Project (₹) *
                </label>
                <div className="flex items-center gap-2 max-w-xs">
                  <span className="font-black text-base text-slate-900">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formData.fixedAmount}
                    onChange={(e) => setFormData({ ...formData, fixedAmount: Number(e.target.value) })}
                    className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="5000"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Flat reward credited on every closed deal</p>
              </>
            )}
          </div>

          {/* Allowed Products Selection */}
          <div className="p-3 bg-[#f8fafc] border-2 border-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="font-black uppercase tracking-wider text-slate-800 text-[11px]">
                Authorized Products to Sell ({formData.allowedProducts.length}/{AVAILABLE_PRODUCTS.length})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, allowedProducts: [...AVAILABLE_PRODUCTS] })}
                  className="text-[10px] font-bold text-blue-700 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, allowedProducts: [] })}
                  className="text-[10px] font-bold text-slate-500 hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {AVAILABLE_PRODUCTS.map((prod) => {
                const isChecked = formData.allowedProducts.includes(prod)
                return (
                  <label
                    key={prod}
                    className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            allowedProducts: [...formData.allowedProducts, prod]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            allowedProducts: formData.allowedProducts.filter((p) => p !== prod)
                          })
                        }
                      }}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-[11px] leading-tight">{prod}</span>
                  </label>
                )
              })}
            </div>
            {formData.allowedProducts.length === 0 && (
              <p className="text-[10px] text-amber-600 font-bold mt-1.5">
                ⚠️ Warning: No products selected. Partner will not see any products to sell.
              </p>
            )}
          </div>

          {/* Status (If editing) */}
          {isEditing && (
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              >
                <option value="active">Active (Access Allowed)</option>
                <option value="inactive">Inactive (Paused)</option>
                <option value="suspended">Suspended (Blocked)</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              Internal Admin Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. Lead partner for Jaipur schools network"
            />
          </div>

          {/* Send email toggle on creation */}
          {!isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                className="w-4 h-4 border-2 border-slate-900 rounded accent-slate-900 cursor-pointer"
              />
              <label htmlFor="sendEmail" className="font-bold text-slate-800 cursor-pointer">
                Send onboarding email with partner portal login credentials
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t-2 border-slate-900 mt-6">
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Partner' : 'Create & Onboard'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
