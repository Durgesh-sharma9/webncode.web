import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateCouponItem, type AffiliateItem, PROJECT_OPTIONS } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface DiscountCouponsTabProps {
  token: string | null
  affiliates: AffiliateItem[]
}

export default function DiscountCouponsTab({ token, affiliates }: DiscountCouponsTabProps) {
  const [coupons, setCoupons] = useState<AffiliateCouponItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<AffiliateCouponItem | null>(null)

  // Form State
  const [formCode, setFormCode] = useState('')
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'flat'>('percentage')
  const [formDiscountValue, setFormDiscountValue] = useState<number | ''>(10)
  const [formAffiliateId, setFormAffiliateId] = useState<string>('all')
  const [formScopeAllProducts, setFormScopeAllProducts] = useState(true)
  const [formSelectedProducts, setFormSelectedProducts] = useState<string[]>([])
  const [formMaxUses, setFormMaxUses] = useState<number | ''>(0)
  const [formExpiryDate, setFormExpiryDate] = useState<string>('')
  const [formDescription, setFormDescription] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  const fetchCoupons = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliates/coupons`, {
        headers: getHeaders(),
        timeout: 10000
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCoupons(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to load coupons:', err)
      showErrorToast('Failed to load discount coupons')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [token])

  const openCreateModal = () => {
    setEditingCoupon(null)
    setFormCode('')
    setFormDiscountType('percentage')
    setFormDiscountValue(10)
    setFormAffiliateId('all')
    setFormScopeAllProducts(true)
    setFormSelectedProducts([])
    setFormMaxUses(0)
    setFormExpiryDate('')
    setFormDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (coupon: AffiliateCouponItem) => {
    setEditingCoupon(coupon)
    setFormCode(coupon.code)
    setFormDiscountType(coupon.discountType)
    setFormDiscountValue(coupon.discountValue)
    setFormAffiliateId(coupon.affiliate ? coupon.affiliate._id : 'all')
    const hasSpecificProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0
    setFormScopeAllProducts(!hasSpecificProducts)
    setFormSelectedProducts(coupon.applicableProducts || [])
    setFormMaxUses(coupon.maxUses || 0)
    setFormExpiryDate(coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '')
    setFormDescription(coupon.description || '')
    setIsModalOpen(true)
  }

  const toggleProductSelection = (productName: string) => {
    if (formSelectedProducts.includes(productName)) {
      setFormSelectedProducts(formSelectedProducts.filter((p) => p !== productName))
    } else {
      setFormSelectedProducts([...formSelectedProducts, productName])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCode.trim()) {
      showErrorToast('Coupon code is required')
      return
    }
    if (!formDiscountValue || Number(formDiscountValue) <= 0) {
      showErrorToast('Valid discount value is required')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        code: formCode.trim().toUpperCase(),
        discountType: formDiscountType,
        discountValue: Number(formDiscountValue),
        affiliate: formAffiliateId === 'all' ? null : formAffiliateId,
        applicableProducts: formScopeAllProducts ? [] : formSelectedProducts,
        maxUses: Number(formMaxUses) || 0,
        expiryDate: formExpiryDate ? new Date(formExpiryDate).toISOString() : null,
        description: formDescription.trim()
      }

      if (editingCoupon) {
        const res = await axios.put(`${API_BASE}/api/affiliates/coupons/${editingCoupon._id}`, payload, {
          headers: getHeaders(),
          timeout: 10000
        })
        if (res.data?.success) {
          showSuccessToast(`Coupon "${res.data.data?.code || formCode}" updated!`)
          setIsModalOpen(false)
          fetchCoupons()
        }
      } else {
        const res = await axios.post(`${API_BASE}/api/affiliates/coupons`, payload, {
          headers: getHeaders(),
          timeout: 10000
        })
        if (res.data?.success) {
          showSuccessToast(`Coupon "${res.data.data?.code || formCode}" created!`)
          setIsModalOpen(false)
          fetchCoupons()
        }
      }
    } catch (err: any) {
      console.error('Coupon submit error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to save coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (coupon: AffiliateCouponItem) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/affiliates/coupons/${coupon._id}`,
        { isActive: !coupon.isActive },
        { headers: getHeaders(), timeout: 10000 }
      )
      if (res.data?.success) {
        showSuccessToast(`Coupon ${!coupon.isActive ? 'activated' : 'paused'}!`)
        fetchCoupons()
      }
    } catch (err: any) {
      showErrorToast('Failed to update status')
    }
  }

  const handleDelete = async (coupon: AffiliateCouponItem) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) return

    try {
      const res = await axios.delete(`${API_BASE}/api/affiliates/coupons/${coupon._id}`, {
        headers: getHeaders(),
        timeout: 10000
      })
      if (res.data?.success) {
        showSuccessToast(`Coupon "${coupon.code}" deleted!`)
        fetchCoupons()
      }
    } catch (err: any) {
      showErrorToast('Failed to delete coupon')
    }
  }

  // Filtered coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.affiliate && c.affiliate.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    if (statusFilter === 'Active') return c.isActive
    if (statusFilter === 'Inactive') return !c.isActive
    return true
  })

  // Metric counts
  const totalCouponsCount = coupons.length
  const activeCouponsCount = coupons.filter((c) => c.isActive).length
  const totalUsesCount = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0)

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border-2 border-slate-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏷️</span>
            <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide">
              Affiliate Discount Coupons
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Attach personalized or catalog-wide discount coupon codes to specific affiliate partners or software packages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>+</span>
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Coupons</span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{totalCouponsCount}</p>
        </div>
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-emerald-700">Active Codes</span>
          <p className="text-xl font-black text-emerald-700 mt-0.5">{activeCouponsCount}</p>
        </div>
        <div className="bg-[#eff6ff] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-blue-700">Total Redemptions</span>
          <p className="text-xl font-black text-blue-700 mt-0.5">{totalUsesCount}</p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code, partner name, or description..."
            className="w-full px-3.5 py-2 pl-9 bg-white border-2 border-slate-900 rounded-md text-xs font-bold focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-[2px_2px_0px_0px_#000]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(['All', 'Active', 'Inactive'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border-2 border-slate-900 rounded-md transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[1px_1px_0px_0px_#000]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table / Cards */}
      {isLoading ? (
        <div className="bg-white border-2 border-slate-900 rounded-lg p-10 text-center font-bold text-slate-500">
          Loading discount coupons...
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-lg p-10 text-center space-y-3">
          <span className="text-3xl">🏷️</span>
          <p className="text-sm font-black text-slate-800">No discount coupons found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create coupon codes to empower your affiliate partners to offer approved deals to schools and clients.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-slate-900 text-white font-black text-xs uppercase rounded-md shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 cursor-pointer"
          >
            + Create First Coupon
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-700 font-black uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Assigned Partner</th>
                  <th className="py-3 px-4">Applicable Products</th>
                  <th className="py-3 px-4">Uses</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date()
                  return (
                    <tr key={coupon._id} className="hover:bg-slate-50 transition-colors">
                      {/* Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-100 border border-amber-900 rounded font-mono font-black text-xs text-amber-950 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code)
                              showSuccessToast(`Copied ${coupon.code} to clipboard`)
                            }}
                            title="Copy Code"
                            className="text-slate-400 hover:text-slate-800 text-xs transition"
                          >
                            📋
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-slate-500 font-medium mt-1 max-w-[200px] truncate">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="py-3 px-4 font-black">
                        {coupon.discountType === 'percentage' ? (
                          <span className="text-emerald-700 font-extrabold text-sm">
                            {coupon.discountValue}% OFF
                          </span>
                        ) : (
                          <span className="text-blue-700 font-extrabold text-sm">
                            ₹{coupon.discountValue.toLocaleString('en-IN')} Flat OFF
                          </span>
                        )}
                      </td>

                      {/* Assigned Partner */}
                      <td className="py-3 px-4">
                        {coupon.affiliate ? (
                          <div>
                            <span className="font-bold text-slate-900">{coupon.affiliate.name}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">
                              {coupon.affiliate.referralCode || coupon.affiliate.email}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold rounded-full">
                            🌐 All Partners
                          </span>
                        )}
                      </td>

                      {/* Applicable Products */}
                      <td className="py-3 px-4">
                        {coupon.applicableProducts && coupon.applicableProducts.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {coupon.applicableProducts.map((p, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-900 text-[10px] font-semibold rounded"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-600">All Software Products</span>
                        )}
                      </td>

                      {/* Uses */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{coupon.usedCount || 0}</span>
                        <span className="text-slate-500 text-[11px]">
                          {coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ' (Unlimited)'}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4">
                        {coupon.expiryDate ? (
                          <div>
                            <span className={`font-bold ${isExpired ? 'text-rose-600 line-through' : 'text-slate-700'}`}>
                              {new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            {isExpired && (
                              <span className="block text-[10px] font-black uppercase text-rose-600">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500">No Expiry</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border cursor-pointer transition ${
                            coupon.isActive
                              ? 'bg-emerald-100 border-emerald-800 text-emerald-900 hover:bg-emerald-200'
                              : 'bg-slate-100 border-slate-400 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 bg-white border border-slate-900 rounded hover:bg-slate-100 text-slate-900 transition cursor-pointer"
                            title="Edit Coupon"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(coupon)}
                            className="p-1.5 bg-white border border-rose-300 rounded hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                            title="Delete Coupon"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-slate-900 rounded-xl p-5 sm:p-6 w-full max-w-xl shadow-[8px_8px_0px_0px_#000] my-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Set promo parameters and attach to an affiliate or software package
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-full font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-slate-800">
              {/* Code & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-black text-slate-700">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder="e.g. PARTNER10, SUMMER25"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-mono font-black text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-black text-slate-700">Discount Type *</label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as 'percentage' | 'flat')}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="percentage">Percentage Discount (% Off)</option>
                    <option value="flat">Flat Amount Discount (₹ Off)</option>
                  </select>
                </div>
              </div>

              {/* Discount Value & Max Uses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-black text-slate-700">
                    {formDiscountType === 'percentage' ? 'Discount Percentage (%) *' : 'Flat Discount Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formDiscountType === 'percentage' ? '100' : '500000'}
                    required
                    value={formDiscountValue}
                    onChange={(e) => setFormDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={formDiscountType === 'percentage' ? '15' : '5000'}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-black focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-black text-slate-700">Max Redemptions (0 = Unlimited)</label>
                  <input
                    type="number"
                    min="0"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Target Affiliate Partner */}
              <div>
                <label className="block mb-1 font-black text-slate-700">Assign to Specific Affiliate Partner</label>
                <select
                  value={formAffiliateId}
                  onChange={(e) => setFormAffiliateId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="all">🌐 Available to All Affiliate Partners</option>
                  {affiliates.map((aff) => (
                    <option key={aff._id} value={aff._id}>
                      🤝 {aff.name} ({aff.referralCode || aff.email})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 font-normal mt-1">
                  Select a specific partner if this coupon should only be valid for their registered leads.
                </p>
              </div>

              {/* Product Scope */}
              <div>
                <label className="block mb-1 font-black text-slate-700">Applicable Software Products</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="allProducts"
                    checked={formScopeAllProducts}
                    onChange={(e) => setFormScopeAllProducts(e.target.checked)}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                  <label htmlFor="allProducts" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Apply to all software products & packages
                  </label>
                </div>

                {!formScopeAllProducts && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 border-2 border-slate-900 rounded-md max-h-40 overflow-y-auto">
                    {PROJECT_OPTIONS.map((prod) => {
                      const isSelected = formSelectedProducts.includes(prod)
                      return (
                        <button
                          key={prod}
                          type="button"
                          onClick={() => toggleProductSelection(prod)}
                          className={`text-left px-2 py-1.5 rounded text-[11px] font-bold border transition ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {prod}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block mb-1 font-black text-slate-700">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 font-black text-slate-700">Description / Internal Notes</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Special promotional discount approved for Q4 School ERP deals"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-900 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border-2 border-slate-900 rounded-md font-bold text-xs uppercase hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
