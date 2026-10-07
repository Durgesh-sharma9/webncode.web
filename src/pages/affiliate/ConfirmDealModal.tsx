import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import {
  API_BASE,
  type AffiliateLeadItem,
  type ProductPlan,
  type AffiliateCouponItem,
  PRODUCT_CATALOG
} from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface SoldItem {
  productName: string
  selectedPlanId: string
  planName: string
  price: number
}

interface ConfirmDealModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  allLeads?: AffiliateLeadItem[]
  token: string | null
  payoutType?: 'percentage' | 'fixed'
  commissionRate?: number
  fixedAmount?: number
  onSuccess: () => void
}

export default function ConfirmDealModal({
  isOpen,
  onClose,
  lead,
  allLeads = [],
  token,
  payoutType = 'percentage',
  commissionRate = 10,
  fixedAmount = 0,
  onSuccess
}: ConfirmDealModalProps) {
  if (!isOpen) return null

  // Active selected lead (defaults to passed lead, can be switched via school search)
  const [activeLead, setActiveLead] = useState<AffiliateLeadItem | null>(lead)

  // School Search / Switcher state
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('')
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false)

  // Plans & Coupons from DB
  const [dbPlans, setDbPlans] = useState<ProductPlan[]>([])
  const [partnerCoupons, setPartnerCoupons] = useState<AffiliateCouponItem[]>([])

  // Multi-product selection state
  const [soldProducts, setSoldProducts] = useState<SoldItem[]>([])

  // Coupon state
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>('')

  // Notes & submitting state
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  // Sync activeLead when prop changes
  useEffect(() => {
    if (lead) {
      setActiveLead(lead)
      setSchoolSearchQuery(lead.organizationName)
    } else if (allLeads.length > 0 && !activeLead) {
      setActiveLead(allLeads[0])
      setSchoolSearchQuery(allLeads[0].organizationName)
    }
  }, [lead, allLeads])

  // Fetch plans and affiliate's active coupons independently
  useEffect(() => {
    if (!isOpen) return

    const loadData = async () => {
      // 1. Fetch DB plans (public endpoint)
      try {
        const plansRes = await axios.get(`${API_BASE}/api/affiliates/plans`, { timeout: 10000 })
        if (plansRes.data?.success && Array.isArray(plansRes.data.data)) {
          setDbPlans(plansRes.data.data)
        }
      } catch (err) {
        console.warn('Failed to load plans:', err)
      }

      // 2. Fetch coupons (affiliate / admin endpoint)
      try {
        const couponsRes = await axios.get(`${API_BASE}/api/affiliate-portal/coupons`, {
          headers: getHeaders(),
          timeout: 10000
        })
        if (couponsRes.data?.success && Array.isArray(couponsRes.data.data)) {
          setPartnerCoupons(couponsRes.data.data)
        }
      } catch (err) {
        // quiet fallback if coupons route is unauthorized or unavailable
      }
    }

    loadData()
  }, [isOpen])

  // Get distinct list of available products from DB plans (or fallback to catalog)
  const availableProducts: string[] = (() => {
    if (dbPlans.length > 0) {
      const names = Array.from(new Set(dbPlans.map((p) => p.projectName.trim()))).filter(Boolean)
      if (names.length > 0) return names
    }
    return PRODUCT_CATALOG.map((p) => p.name)
  })()

  // Helper: get plans for a specific product name (clean normalization)
  const getPlansForProduct = (productName: string): ProductPlan[] => {
    const clean = (productName || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    return dbPlans.filter((p) => {
      const pClean = p.projectName.toLowerCase().replace(/[^a-z0-9]/g, '')
      return clean === pClean || clean.includes(pClean) || pClean.includes(clean)
    })
  }

  // List of pitched products for current lead
  const pitchedProductsList: string[] = activeLead
    ? (activeLead.products && activeLead.products.length > 0
        ? activeLead.products
        : (activeLead.product ? activeLead.product.split(', ') : [])
      )
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  // Initialize sold products whenever activeLead or dbPlans change
  useEffect(() => {
    if (!activeLead) return

    const initialItems: SoldItem[] = []

    if (dbPlans.length > 0) {
      // For each pitched product, find matching product in availableProducts
      pitchedProductsList.forEach((pitched) => {
        const pNorm = pitched.toLowerCase().replace(/[^a-z0-9]/g, '')
        const matchedProject = availableProducts.find((avail) => {
          const aNorm = avail.toLowerCase().replace(/[^a-z0-9]/g, '')
          return pNorm.includes(aNorm) || aNorm.includes(pNorm)
        })

        if (matchedProject && !initialItems.some((i) => i.productName.toLowerCase() === matchedProject.toLowerCase())) {
          const plans = getPlansForProduct(matchedProject)
          if (plans.length > 0) {
            // Check if pitched string specifically mentions a plan name (e.g. "yearly custom domain")
            const pLow = pitched.toLowerCase()
            const specificPlan =
              plans.find((p) => pLow.includes(p.planName.toLowerCase())) || plans[0]

            initialItems.push({
              productName: matchedProject,
              selectedPlanId: specificPlan._id || '',
              planName: specificPlan.planName,
              price: specificPlan.price
            })
          }
        }
      })

      // If no pitched products matched, default to first available product
      if (initialItems.length === 0 && availableProducts.length > 0) {
        const firstProd = availableProducts[0]
        const plans = getPlansForProduct(firstProd)
        if (plans.length > 0) {
          initialItems.push({
            productName: firstProd,
            selectedPlanId: plans[0]._id || '',
            planName: plans[0].planName,
            price: plans[0].price
          })
        }
      }
    } else {
      // Fallback from catalog
      const firstCat = PRODUCT_CATALOG[0]
      initialItems.push({
        productName: firstCat.name,
        selectedPlanId: firstCat.name,
        planName: 'Standard Plan',
        price: firstCat.price
      })
    }

    setSoldProducts(initialItems)
    setSelectedCouponCode(activeLead.appliedCoupon || '')
  }, [activeLead, dbPlans])

  // Handler: toggle a product in the sale
  const handleToggleProduct = (productName: string) => {
    const isAlreadySelected = soldProducts.some(
      (item) => item.productName.toLowerCase() === productName.toLowerCase()
    )

    if (isAlreadySelected) {
      setSoldProducts((prev) =>
        prev.filter((item) => item.productName.toLowerCase() !== productName.toLowerCase())
      )
    } else {
      const plans = getPlansForProduct(productName)
      if (plans.length > 0) {
        setSoldProducts((prev) => [
          ...prev,
          {
            productName,
            selectedPlanId: plans[0]._id || '',
            planName: plans[0].planName,
            price: plans[0].price
          }
        ])
      } else {
        const cat = PRODUCT_CATALOG.find(
          (c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, '') === productName.toLowerCase().replace(/[^a-z0-9]/g, '')
        )
        setSoldProducts((prev) => [
          ...prev,
          {
            productName,
            selectedPlanId: productName,
            planName: 'Standard Plan',
            price: cat ? cat.price : (productName.toLowerCase().includes('web') ? 5999 : 25000)
          }
        ])
      }
    }
  }

  // Handler: Change plan for a specific product
  const handlePlanChange = (productName: string, planId: string) => {
    const plan = dbPlans.find((p) => p._id === planId)
    if (!plan) return

    setSoldProducts((prev) =>
      prev.map((item) =>
        item.productName.toLowerCase() === productName.toLowerCase()
          ? {
              ...item,
              selectedPlanId: plan._id || planId,
              planName: plan.planName,
              price: plan.price
            }
          : item
      )
    )
  }

  // Calculations: Catalog base total
  const catalogBasePrice = soldProducts.reduce((sum, item) => sum + item.price, 0)

  // Calculations: Coupon discount
  let appliedDiscountAmount = 0
  if (selectedCouponCode) {
    const coupon = partnerCoupons.find(
      (c) => c.code.toUpperCase() === selectedCouponCode.toUpperCase()
    )
    if (coupon) {
      const applicableItems = soldProducts.filter((item) => {
        if (!coupon.applicableProducts || coupon.applicableProducts.length === 0) return true
        return coupon.applicableProducts.some((app) => {
          const aLow = app.toLowerCase().trim()
          const pLow = item.productName.toLowerCase().trim()
          const plLow = item.planName.toLowerCase().trim()
          return pLow.includes(aLow) || aLow.includes(pLow) || plLow.includes(aLow)
        })
      })

      if (applicableItems.length > 0) {
        const applicableBase = applicableItems.reduce((sum, item) => sum + item.price, 0)
        appliedDiscountAmount =
          coupon.discountType === 'percentage'
            ? Math.round((applicableBase * coupon.discountValue) / 100)
            : Math.min(applicableBase, coupon.discountValue)
      }
    }
  }

  const finalDealValue = Math.max(0, catalogBasePrice - appliedDiscountAmount)

  const calculatedCommission =
    payoutType === 'fixed'
      ? fixedAmount
      : Math.round((finalDealValue * commissionRate) / 100)

  // Handler: Toggling promo coupon
  const handleToggleCoupon = (coupon: AffiliateCouponItem) => {
    if (selectedCouponCode.toUpperCase() === coupon.code.toUpperCase()) {
      setSelectedCouponCode('')
      return
    }

    // Verify if applicable to at least one sold product
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const matchesAny = soldProducts.some((item) =>
        coupon.applicableProducts?.some((app) => {
          const aLow = app.toLowerCase().trim()
          const pLow = item.productName.toLowerCase().trim()
          return pLow.includes(aLow) || aLow.includes(pLow)
        })
      )

      if (!matchesAny) {
        showErrorToast(
          `Coupon ${coupon.code} is valid only for: ${coupon.applicableProducts.join(', ')}`
        )
        return
      }
    }

    setSelectedCouponCode(coupon.code)
  }

  // Handler: Selecting a school from the quick search dropdown
  const handleSelectSchool = (chosenLead: AffiliateLeadItem) => {
    setActiveLead(chosenLead)
    setSchoolSearchQuery(chosenLead.organizationName)
    setIsSchoolDropdownOpen(false)
  }

  // Filter schools for search dropdown
  const filteredSchools = allLeads.filter((l) => {
    if (!schoolSearchQuery) return true
    const q = schoolSearchQuery.toLowerCase()
    return (
      l.organizationName.toLowerCase().includes(q) ||
      l.contactPerson.toLowerCase().includes(q) ||
      (l.city && l.city.toLowerCase().includes(q))
    )
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!activeLead) {
      showErrorToast('Please select a school to confirm')
      return
    }

    if (soldProducts.length === 0) {
      showErrorToast('Please select at least one software product and plan')
      return
    }

    setIsSubmitting(true)
    try {
      const soldProductNames = soldProducts.map((p) => p.productName)
      const formattedProductSummary = soldProducts
        .map((p) => `${p.productName} (${p.planName})`)
        .join(' + ')

      await axios.put(
        `${API_BASE}/api/affiliate-portal/leads/${activeLead._id}`,
        {
          status: 'Deal Confirmed',
          products: soldProductNames,
          product: formattedProductSummary,
          dealValue: finalDealValue,
          commissionAmount: calculatedCommission,
          appliedCoupon: selectedCouponCode.trim() || undefined,
          discountAmount: appliedDiscountAmount > 0 ? appliedDiscountAmount : undefined,
          confirmationNotes:
            notes.trim() || 'School has confirmed purchase. Ready for admin verification and onboarding.'
        },
        { headers: getHeaders() }
      )

      showSuccessToast(
        `🎉 Deal confirmation sent for ${activeLead.organizationName}! Expected commission: ₹${calculatedCommission.toLocaleString('en-IN')}. Admin will verify shortly.`
      )
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
      <div className="relative w-full max-w-xl bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
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
              Select product(s) sold, pick specific plans, apply coupon, and report closed order to Admin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer shrink-0"
          >
            ×
          </button>
        </div>

        {/* 1. School Search & Direct Selector */}
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1">
            Search or Switch School / Client Directly 🔍
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search school by name, contact person, or city..."
              value={schoolSearchQuery}
              onFocus={() => setIsSchoolDropdownOpen(true)}
              onChange={(e) => {
                setSchoolSearchQuery(e.target.value)
                setIsSchoolDropdownOpen(true)
              }}
              className="w-full border-2 border-slate-900 rounded-md pl-3 pr-8 py-2 font-bold text-xs text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
            {schoolSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSchoolSearchQuery('')
                  setIsSchoolDropdownOpen(true)
                }}
                className="absolute right-2.5 top-2 text-xs font-black text-slate-400 hover:text-slate-800"
              >
                ×
              </button>
            )}

            {/* Dropdown list of matching schools */}
            {isSchoolDropdownOpen && allLeads.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border-2 border-slate-900 rounded-md shadow-[4px_4px_0px_0px_#000] z-30 max-h-48 overflow-y-auto">
                {filteredSchools.length === 0 ? (
                  <div className="p-3 text-xs text-slate-500 font-bold text-center">
                    No matching school found
                  </div>
                ) : (
                  filteredSchools.map((l) => (
                    <button
                      key={l._id}
                      type="button"
                      onClick={() => handleSelectSchool(l)}
                      className={`w-full text-left p-2.5 border-b border-slate-200 hover:bg-emerald-50 transition-colors flex items-center justify-between text-xs cursor-pointer ${
                        activeLead?._id === l._id ? 'bg-emerald-100 font-black' : ''
                      }`}
                    >
                      <div>
                        <div className="font-black text-slate-900">{l.organizationName}</div>
                        <div className="text-[10px] text-slate-600 font-medium">
                          {l.contactPerson} {l.city ? `• ${l.city}` : ''}
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-400 uppercase font-bold text-slate-700">
                        {l.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected School Context Card */}
        {activeLead && (
          <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-lg space-y-1 mb-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Client / School:</span>
              <span className="text-sm font-black text-slate-950">{activeLead.organizationName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Contact Person:</span>
              <span className="font-bold text-slate-900">
                {activeLead.contactPerson} ({activeLead.phone})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Products Pitched:</span>
              <span className="font-bold text-blue-700">{activeLead.product || 'Software Suite'}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* STEP 1: Select Sold Products (One or Multiple) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-black uppercase tracking-wider text-slate-900 text-xs">
                1. Which Product(s) Were Sold? (Select 1 or More) *
              </label>
              <span className="text-[10px] font-bold text-emerald-700">
                {soldProducts.length} Product{soldProducts.length !== 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-100 border-2 border-slate-900 rounded-md">
              {availableProducts.map((prodName) => {
                const isSelected = soldProducts.some(
                  (item) => item.productName.toLowerCase() === prodName.toLowerCase()
                )
                const wasPitched = pitchedProductsList.some((pitched) => {
                  const pClean = pitched.toLowerCase().trim()
                  const aClean = prodName.toLowerCase().trim()
                  return pClean.includes(aClean) || aClean.includes(pClean)
                })

                return (
                  <button
                    key={prodName}
                    type="button"
                    onClick={() => handleToggleProduct(prodName)}
                    className={`px-2.5 py-1.5 rounded text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-300 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_#000] font-black'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{prodName}</span>
                    {wasPitched && (
                      <span className="text-[9px] px-1 py-0.2 bg-blue-100 text-blue-800 rounded font-bold uppercase tracking-wider">
                        Pitched
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* STEP 2: Choose Specific Plan for Each Sold Product */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-900 text-xs mb-1.5">
              2. Select Confirmed Plan for Each Sold Product *
            </label>

            {soldProducts.length === 0 ? (
              <div className="p-3 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg text-center text-xs text-amber-800 font-bold">
                👆 Please select at least one product above in Step 1 to choose its plan.
              </div>
            ) : (
              <div className="space-y-2.5">
                {soldProducts.map((item) => {
                  const plans = getPlansForProduct(item.productName)
                  return (
                    <div
                      key={item.productName}
                      className="p-3 bg-white border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                          <span>📦</span>
                          <span>{item.productName}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleProduct(item.productName)}
                            className="text-xs font-black text-rose-500 hover:text-rose-700 px-1 cursor-pointer"
                            title="Remove product"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {plans.length > 0 ? (
                        <select
                          value={item.selectedPlanId}
                          onChange={(e) => handlePlanChange(item.productName, e.target.value)}
                          className="w-full border-2 border-slate-900 rounded-md px-2.5 py-1.5 font-bold text-xs text-slate-900 bg-slate-50 focus:outline-none cursor-pointer"
                        >
                          {plans.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.planName} — ₹{p.price.toLocaleString('en-IN')}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                          {item.planName} — ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2 font-bold px-1">
                  <span>Combined Catalog Total:</span>
                  <strong className="text-slate-950 font-black text-xs font-mono">
                    ₹{catalogBasePrice.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Promo Discount Coupons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-black uppercase tracking-wider text-slate-800">
                Partner Promo Coupon (Optional Discount)
              </label>
              {selectedCouponCode && (
                <button
                  type="button"
                  onClick={() => setSelectedCouponCode('')}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                >
                  Remove Coupon
                </button>
              )}
            </div>

            {partnerCoupons.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border-2 border-slate-900 rounded-md">
                {partnerCoupons.map((c) => {
                  const isSelected = selectedCouponCode.toUpperCase() === c.code.toUpperCase()
                  return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => handleToggleCoupon(c)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-white text-slate-800 border-slate-300 hover:border-slate-900'
                      }`}
                    >
                      <span>🏷️ {c.code}</span>
                      <span className="text-[10px] px-1 py-0.2 bg-slate-900/10 rounded">
                        {c.discountType === 'percentage' ? `-${c.discountValue}%` : `-₹${c.discountValue}`}
                      </span>
                      {isSelected && <span>✓</span>}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="p-2 border border-dashed border-slate-300 rounded text-[11px] text-slate-500 bg-slate-50">
                No promo coupons currently assigned to your account.
              </div>
            )}

            {selectedCouponCode && appliedDiscountAmount > 0 && (
              <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-400 rounded text-emerald-950 font-bold text-[11px] flex items-center justify-between">
                <span>
                  🏷️ Coupon <strong>{selectedCouponCode}</strong> applied: <strong>-₹{appliedDiscountAmount.toLocaleString('en-IN')}</strong> discount.
                </span>
                <span className="text-[10px] text-emerald-800 font-bold">
                  Final: ₹{finalDealValue.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* STEP 4: Live Calculated Package Price & Commission Box */}
          {soldProducts.length > 0 ? (
            <div className="pt-2 border-t-2 border-slate-900 space-y-2">
              {/* Itemized breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[11px] space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Package Calculation Breakdown:
                </span>
                {soldProducts.map((p) => (
                  <div key={p.productName} className="flex items-center justify-between font-mono">
                    <span className="text-slate-800 font-bold">
                      • {p.productName} <span className="text-slate-500 font-normal">({p.planName})</span>
                    </span>
                    <span className="font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white border-2 border-slate-900 rounded-lg p-2.5 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-[9px] font-black uppercase text-slate-500 block">
                    Total Package Price ({soldProducts.length} Product{soldProducts.length > 1 ? 's' : ''})
                  </span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    ₹{finalDealValue.toLocaleString('en-IN')}
                  </span>
                  {appliedDiscountAmount > 0 ? (
                    <span className="text-[9px] text-amber-700 font-bold block">
                      (-₹{appliedDiscountAmount.toLocaleString('en-IN')} discount applied)
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-bold block">
                      Catalog Base: ₹{catalogBasePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="bg-[#86efac] border-2 border-slate-900 rounded-lg p-2.5 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-[9px] font-black uppercase text-slate-800 block">
                    Your Commission ({payoutType === 'fixed' ? 'Flat Reward' : `${commissionRate}%`})
                  </span>
                  <span className="text-base font-black text-slate-950 font-mono">
                    ₹{calculatedCommission.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-emerald-900 font-bold block">
                    Credited upon verification
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t-2 border-slate-900 p-3 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500 font-bold">
              Select product(s) and plan(s) above to view total package price and commission calculation.
            </div>
          )}

          {/* STEP 5: Discussion Summary & Action Taken */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-800 mb-1">
              Discussion Summary & What Was Agreed (Action Taken) *
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Conducted product demo with Principal & management. Agreed on School ERP + Web Builder. Payment agreed via Cheque / Bank Transfer. Client requested onboarding next Monday."
              className="w-full border-2 border-slate-900 rounded-md p-2.5 font-medium text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Provide demo summary and payment details so Admin can quickly verify and approve the order.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-400 rounded text-[11px] text-blue-900 flex items-start gap-2">
            <span className="text-base">💡</span>
            <span>
              Once submitted, Admin will verify the purchase and approve the deal. Your commission of <strong>₹{calculatedCommission.toLocaleString('en-IN')}</strong> will be credited directly to your wallet!
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
              disabled={isSubmitting || !activeLead || soldProducts.length === 0}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all text-center cursor-pointer"
            >
              {isSubmitting
                ? 'Submitting...'
                : soldProducts.length === 0
                ? 'Select Product & Plan to Continue'
                : `✓ Submit Deal Confirmation (₹${finalDealValue.toLocaleString('en-IN')})`}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

