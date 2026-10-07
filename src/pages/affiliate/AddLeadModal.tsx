import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type ProductPlan, getProductPrice, calculateProductsPrice } from '../admin/types'
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

  const [dbPlans, setDbPlans] = useState<ProductPlan[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)

  // Fetch official plans created by SuperAdmin
  useEffect(() => {
    const fetchDbPlans = async () => {
      setIsLoadingPlans(true)
      try {
        const res = await axios.get(`${API_BASE}/api/affiliates/plans`, { timeout: 10000 })
        if (res.data?.success && Array.isArray(res.data.data)) {
          setDbPlans(res.data.data)
        }
      } catch (err) {
        console.warn('Could not load dynamic plans, fallback to default catalog')
      } finally {
        setIsLoadingPlans(false)
      }
    }
    fetchDbPlans()
  }, [])

  const defaultStarterList = (allowedProducts && allowedProducts.length > 0)
    ? allowedProducts
    : [
        'School ERP Pro - Standard Campus',
        'Web Builder Pro - Starter Institutional Website',
        'Timetable Pro - Single School Annual License'
      ]

  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [customProduct, setCustomProduct] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  // Distinct projects available
  const distinctProjects = Array.from(
    new Set(dbPlans.map((p) => p.projectName))
  )
  const [activeSelectedProject, setActiveSelectedProject] = useState<string>('')

  useEffect(() => {
    if (distinctProjects.length > 0 && !activeSelectedProject) {
      setActiveSelectedProject(distinctProjects[0])
    }
  }, [dbPlans])

  // Current plans for the selected product
  const currentProjectPlans = dbPlans.filter(
    (p) => p.projectName === activeSelectedProject
  )

  // Initialize selected product once plans load or fallback
  useEffect(() => {
    if (selectedProducts.length === 0) {
      if (dbPlans.length > 0) {
        const first = `${dbPlans[0].projectName} - ${dbPlans[0].planName}`
        setSelectedProducts([first])
      } else {
        setSelectedProducts([defaultStarterList[0]])
      }
    }
  }, [dbPlans])

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Official Admin catalog price computed automatically from SuperAdmin's plans
  const officialPackagePrice = calculateProductsPrice(selectedProducts, dbPlans)
  const projectedCommission =
    payoutType === 'fixed'
      ? fixedAmount || 0
      : Math.round((officialPackagePrice * commissionRate) / 100)

  const toggleProduct = (prodIdentifier: string) => {
    if (selectedProducts.includes(prodIdentifier)) {
      if (selectedProducts.length > 1) {
        setSelectedProducts(selectedProducts.filter((p) => p !== prodIdentifier))
      } else {
        showErrorToast('Please select at least one plan/product')
      }
    } else {
      setSelectedProducts([...selectedProducts, prodIdentifier])
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
          products: selectedProducts,
          dealValue: officialPackagePrice,
          estimatedValue: officialPackagePrice
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white border-2 border-slate-900 rounded-xl p-4 sm:p-8 shadow-[6px_6px_0px_0px_#0f172a]">
        
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

          {/* STEP 1: Choose Software Product */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              1. Choose Software Product *
            </label>
            <select
              value={activeSelectedProject}
              onChange={(e) => setActiveSelectedProject(e.target.value)}
              className="w-full border-2 border-slate-900 rounded-lg px-3 py-2 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
            >
              {distinctProjects.map((proj) => (
                <option key={proj} value={proj}>
                  📦 {proj}
                </option>
              ))}
            </select>
          </div>

          {/* STEP 2: Choose Plan for that Selected Product */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-black uppercase tracking-wider text-slate-700">
                2. Available Plans for {activeSelectedProject || 'Product'} *
              </label>
              <span className="text-[10px] font-bold text-blue-700">
                {selectedProducts.length} Selected
              </span>
            </div>

            <div className="space-y-2 p-2.5 bg-slate-50 border-2 border-slate-900 rounded-lg max-h-56 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isLoadingPlans ? (
                <div className="p-4 text-center text-[11px] font-bold text-slate-500">
                  Loading official pricing plans...
                </div>
              ) : currentProjectPlans.length > 0 ? (
                currentProjectPlans.map((plan) => {
                  const planIdentifier = `${plan.projectName} - ${plan.planName}`
                  const isSelected = selectedProducts.includes(planIdentifier) || selectedProducts.includes(plan.planName)
                  return (
                    <label
                      key={plan._id || plan.planName}
                      className={`flex items-center justify-between p-2 rounded-lg border-2 cursor-pointer select-none transition-all ${
                        isSelected
                          ? 'bg-[#86efac] border-slate-900 font-black text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]'
                          : 'bg-white border-slate-300 font-medium text-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProduct(planIdentifier)}
                          className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-black text-slate-900">{plan.planName}</div>
                          {plan.description && (
                            <div className="text-[10px] text-slate-500 line-clamp-1">{plan.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded ${
                          isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900 border border-slate-300'
                        }`}>
                          ₹{plan.price.toLocaleString('en-IN')}
                        </span>
                        <div className="text-[9px] text-slate-500 font-bold mt-0.5">{plan.billingCycle}</div>
                      </div>
                    </label>
                  )
                })
              ) : (
                <p className="text-xs text-slate-500 font-bold p-3 text-center">
                  No plans configured for {activeSelectedProject}.
                </p>
              )}
            </div>

            {/* Selected Plans Badges */}
            {selectedProducts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-bold text-slate-500">Selected Plans:</span>
                {selectedProducts.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-300 border border-slate-900 rounded text-[10px] font-black text-slate-900 shadow-[1px_1px_0px_0px_#000]"
                  >
                    <span>✓ {p} (₹{getProductPrice(p).toLocaleString('en-IN')})</span>
                    <button
                      type="button"
                      onClick={() => toggleProduct(p)}
                      className="text-slate-900 hover:text-red-700 font-black ml-0.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

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
          </div>

          {/* Locked Official Admin Pricing & Partner Commission Breakdown */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#0f172a] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🔒</span>
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Official Pricing & Your Commission
                </span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-slate-900 text-white rounded">
                Admin Fixed Rates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-slate-600 block">
                  Official Package Price
                </span>
                <p className="text-xl font-black text-slate-950 mt-0.5">
                  ₹{officialPackagePrice.toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                  {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} bundled
                </span>
              </div>

              <div className="bg-[#86efac] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-slate-800 block">
                  Your Commission ({payoutType === 'fixed' ? 'Fixed Reward' : `${commissionRate}%`})
                </span>
                <p className="text-xl font-black text-slate-950 mt-0.5">
                  ₹{projectedCommission.toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-800 font-black block mt-0.5">
                  {payoutType === 'fixed' ? 'Flat payout per closed deal' : 'Credited to wallet upon deal won'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 text-[10px] text-slate-700 font-bold bg-white/80 p-2 rounded border border-slate-300">
              <span className="text-xs">💡</span>
              <span>
                Standard rates are set by Admin. When Admin closes this client deal, your commission will be credited directly to your partner wallet.
              </span>
            </div>
          </div>

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
              {isSubmitting ? 'Submitting...' : 'Submit Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
