import { useState, useEffect, useMemo, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE, type AffiliateLeadItem, type ProductPlan, AVAILABLE_PRODUCTS, PRODUCT_CATALOG } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ReviewLeadModalProps {
  isOpen: boolean
  onClose: () => void
  lead: AffiliateLeadItem | null
  mode: 'approve' | 'reject' | null
  token: string | null
  onSuccess: () => void
}

interface NormalizedPlanItem {
  key: string
  projectName: string
  planName: string
  price: number
  billingCycle: string
  description?: string
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

  // Available plans loaded from database
  const [dbPlans, setDbPlans] = useState<ProductPlan[]>([])
  
  // Multi-selection states
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPlanKeys, setSelectedPlanKeys] = useState<string[]>([])

  // Financial fields (editable)
  const [dealValue, setDealValue] = useState<string>('0')
  const [commissionAmount, setCommissionAmount] = useState<string>('0')
  const [isDealValueManuallyEdited, setIsDealValueManuallyEdited] = useState<boolean>(false)
  const [isCommissionManuallyEdited, setIsCommissionManuallyEdited] = useState<boolean>(false)

  // Notes and cancellation reason
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

  // Combine product list from database and predefined catalog
  const allProducts = useMemo(() => {
    const set = new Set<string>(AVAILABLE_PRODUCTS)
    dbPlans.forEach((p) => {
      if (p.projectName) set.add(p.projectName)
    })
    return Array.from(set)
  }, [dbPlans])

  // Normalized map of all available plans grouped by product
  const plansByProduct = useMemo(() => {
    const map = new Map<string, NormalizedPlanItem[]>()

    allProducts.forEach((prodName) => {
      // Find matching plans from database
      const matchingDbPlans = dbPlans.filter(
        (p) => p.projectName && p.projectName.toLowerCase() === prodName.toLowerCase()
      )

      if (matchingDbPlans.length > 0) {
        map.set(
          prodName,
          matchingDbPlans.map((p) => ({
            key: `${prodName}:::${p.planName}`,
            projectName: prodName,
            planName: p.planName,
            price: Number(p.price) || 0,
            billingCycle: p.billingCycle || 'Yearly',
            description: p.description || ''
          }))
        )
      } else {
        // Fallback to static catalog
        const catalogItem = PRODUCT_CATALOG.find(
          (c) => c.name.toLowerCase() === prodName.toLowerCase()
        )
        const fallbackPrice = catalogItem ? catalogItem.price : 25000
        const fallbackBilling = catalogItem ? catalogItem.billing : '/ Year'
        const fallbackDesc = catalogItem ? catalogItem.description : 'Standard software license'

        map.set(prodName, [
          {
            key: `${prodName}:::Standard License`,
            projectName: prodName,
            planName: 'Standard Annual License',
            price: fallbackPrice,
            billingCycle: fallbackBilling,
            description: fallbackDesc
          }
        ])
      }
    })

    return map
  }, [allProducts, dbPlans])

  // Flat list of all normalized plans for quick lookup
  const allNormalizedPlans = useMemo(() => {
    const list: NormalizedPlanItem[] = []
    plansByProduct.forEach((plans) => {
      list.push(...plans)
    })
    return list
  }, [plansByProduct])

  // Initialize selection when modal opens or lead changes
  useEffect(() => {
    if (!lead || !isOpen) return

    // 1. Identify initial products
    const initialProds: string[] = []
    if (Array.isArray(lead.products) && lead.products.length > 0) {
      lead.products.forEach((p) => {
        const found = allProducts.find((ap) => ap.toLowerCase() === p.trim().toLowerCase())
        if (found && !initialProds.includes(found)) initialProds.push(found)
      })
    }

    if (initialProds.length === 0 && lead.product) {
      // Split lead.product by comma if multiple products were reported
      const parts = lead.product.split(',').map((s) => s.trim())
      parts.forEach((part) => {
        const found = allProducts.find((ap) => 
          part.toLowerCase().includes(ap.toLowerCase()) || ap.toLowerCase().includes(part.toLowerCase())
        )
        if (found && !initialProds.includes(found)) initialProds.push(found)
      })
    }

    // Fallback if none matched
    const finalProds = initialProds.length > 0 ? initialProds : ['School ERP Pro']
    setSelectedProducts(finalProds)

    // 2. Identify initial plans
    const initialPlanKeys: string[] = []
    finalProds.forEach((prod) => {
      const plans = plansByProduct.get(prod) || []
      // Check if lead.product mentions a specific plan name
      const specificMatch = plans.find((pl) => 
        lead.product && lead.product.toLowerCase().includes(pl.planName.toLowerCase())
      )
      if (specificMatch) {
        initialPlanKeys.push(specificMatch.key)
      } else if (plans.length > 0) {
        initialPlanKeys.push(plans[0].key)
      }
    })
    setSelectedPlanKeys(initialPlanKeys)

    // 3. Initialize amounts
    if (lead.dealValue && lead.dealValue > 0) {
      setDealValue(String(lead.dealValue))
      setIsDealValueManuallyEdited(true)
    } else {
      const initialCatalogSum = initialPlanKeys.reduce((sum, key) => {
        const item = allNormalizedPlans.find((p) => p.key === key)
        return sum + (item ? item.price : 0)
      }, 0)
      setDealValue(String(initialCatalogSum))
      setIsDealValueManuallyEdited(false)
    }

    if (lead.commissionAmount && lead.commissionAmount > 0) {
      setCommissionAmount(String(lead.commissionAmount))
      setIsCommissionManuallyEdited(true)
    } else {
      const baseVal = lead.dealValue && lead.dealValue > 0 
        ? lead.dealValue 
        : initialPlanKeys.reduce((sum, key) => {
            const item = allNormalizedPlans.find((p) => p.key === key)
            return sum + (item ? item.price : 0)
          }, 0)
      const autoComm = isFixed ? fixedReward : Math.round((baseVal * defaultRate) / 100)
      setCommissionAmount(String(autoComm))
      setIsCommissionManuallyEdited(false)
    }

    setAdminNotes(lead.adminNotes || '')
    setRejectionReason(lead.rejectionReason || '')
  }, [lead, isOpen, allProducts, plansByProduct, allNormalizedPlans, isFixed, fixedReward, defaultRate])

  // Calculate sum of currently selected plans
  const catalogTotal = useMemo(() => {
    return selectedPlanKeys.reduce((sum, key) => {
      const plan = allNormalizedPlans.find((p) => p.key === key)
      return sum + (plan ? plan.price : 0)
    }, 0)
  }, [selectedPlanKeys, allNormalizedPlans])

  // Auto-calculated commission based on current deal value
  const autoCalculatedCommission = useMemo(() => {
    const numDeal = Number(dealValue) || 0
    if (isFixed) return fixedReward
    return Math.round((numDeal * defaultRate) / 100)
  }, [dealValue, isFixed, fixedReward, defaultRate])

  // Handle toggling a product checkbox
  const handleToggleProduct = (prodName: string) => {
    const isSelected = selectedProducts.includes(prodName)
    let newProducts: string[]
    let newPlanKeys: string[]

    if (isSelected) {
      // Remove product and all its plans
      newProducts = selectedProducts.filter((p) => p !== prodName)
      newPlanKeys = selectedPlanKeys.filter((key) => !key.startsWith(`${prodName}:::`))
    } else {
      // Add product and auto-select its first available plan
      newProducts = [...selectedProducts, prodName]
      const availablePlans = plansByProduct.get(prodName) || []
      newPlanKeys = [...selectedPlanKeys]
      if (availablePlans.length > 0 && !newPlanKeys.some((k) => k.startsWith(`${prodName}:::`))) {
        newPlanKeys.push(availablePlans[0].key)
      }
    }

    setSelectedProducts(newProducts)
    setSelectedPlanKeys(newPlanKeys)

    // Recalculate catalog sum and update deal value if not locked
    const newSum = newPlanKeys.reduce((sum, key) => {
      const plan = allNormalizedPlans.find((p) => p.key === key)
      return sum + (plan ? plan.price : 0)
    }, 0)

    if (!isDealValueManuallyEdited) {
      setDealValue(String(newSum))
      if (!isCommissionManuallyEdited) {
        const comm = isFixed ? fixedReward : Math.round((newSum * defaultRate) / 100)
        setCommissionAmount(String(comm))
      }
    }
  }

  // Handle toggling a plan checkbox
  const handleTogglePlan = (planKey: string, prodName: string) => {
    const isChecked = selectedPlanKeys.includes(planKey)
    let newPlanKeys: string[]

    if (isChecked) {
      newPlanKeys = selectedPlanKeys.filter((k) => k !== planKey)
    } else {
      newPlanKeys = [...selectedPlanKeys, planKey]
      // Ensure parent product is marked selected
      if (!selectedProducts.includes(prodName)) {
        setSelectedProducts([...selectedProducts, prodName])
      }
    }

    setSelectedPlanKeys(newPlanKeys)

    // Recalculate catalog sum
    const newSum = newPlanKeys.reduce((sum, key) => {
      const plan = allNormalizedPlans.find((p) => p.key === key)
      return sum + (plan ? plan.price : 0)
    }, 0)

    if (!isDealValueManuallyEdited) {
      setDealValue(String(newSum))
      if (!isCommissionManuallyEdited) {
        const comm = isFixed ? fixedReward : Math.round((newSum * defaultRate) / 100)
        setCommissionAmount(String(comm))
      }
    }
  }

  // Handle manual deal value change
  const handleDealValueChange = (valStr: string) => {
    setDealValue(valStr)
    setIsDealValueManuallyEdited(true)
    const num = Number(valStr) || 0

    if (!isCommissionManuallyEdited) {
      const comm = isFixed ? fixedReward : Math.round((num * defaultRate) / 100)
      setCommissionAmount(String(comm))
    }
  }

  // Handle manual commission change
  const handleCommissionChange = (valStr: string) => {
    setCommissionAmount(valStr)
    setIsCommissionManuallyEdited(true)
  }

  // Reset helpers
  const handleResetDealValue = () => {
    setDealValue(String(catalogTotal))
    setIsDealValueManuallyEdited(false)
    if (!isCommissionManuallyEdited) {
      const comm = isFixed ? fixedReward : Math.round((catalogTotal * defaultRate) / 100)
      setCommissionAmount(String(comm))
    }
  }

  const handleResetCommission = () => {
    setCommissionAmount(String(autoCalculatedCommission))
    setIsCommissionManuallyEdited(false)
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
        if (selectedProducts.length === 0) {
          showErrorToast('Please select at least one software product')
          setIsSubmitting(false)
          return
        }

        const val = Number(dealValue) || 0
        const comm = Number(commissionAmount) || 0

        // Compose detailed product & plan summary string
        const selectedPlanObjects = allNormalizedPlans.filter((p) => selectedPlanKeys.includes(p.key))
        const planLabels = selectedPlanObjects.map((p) => `${p.projectName} (${p.planName})`)
        const productSummary = planLabels.length > 0 ? planLabels.join(', ') : selectedProducts.join(', ')

        await axios.put(
          `${API_BASE}/api/affiliates/leads/${lead._id}`,
          {
            status: 'Deal Won',
            products: selectedProducts,
            product: productSummary,
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
          showErrorToast('Please provide a reason for marking this deal as lost')
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
      showErrorToast(err.response?.data?.message || 'Failed to update deal status')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[6px_6px_0px_0px_#0f172a] max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border border-slate-900 rounded ${
                isApprove ? 'bg-[#86efac] text-emerald-950' : 'bg-rose-200 text-rose-950'
              }`}
            >
              {isApprove ? 'DEAL APPROVAL & COMMISSION SETTLEMENT' : 'MARK AS LOST / CANCELLED'}
            </span>
            <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {isApprove ? 'Finalize Deal & Credit Commission' : 'Mark Deal as Lost'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-2 border-slate-900 rounded-md font-black text-slate-900 hover:bg-[#ff9e7d] transition-colors cursor-pointer text-lg"
            title="Close"
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
            <span>✓ Finalize Deal (Won)</span>
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
            <span>✕ Mark as Lost / Cancelled</span>
          </button>
        </div>

        {/* Client & Partner Summary Information Card */}
        <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3 text-xs space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Client / Institution:</span>
            <span className="font-black text-slate-900 text-sm">{lead.organizationName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Contact Person:</span>
            <span className="font-bold text-slate-800">{lead.contactPerson} {lead.phone ? `(${lead.phone})` : ''}</span>
          </div>
          {lead.city && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Location:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
                {lead.city}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 mt-1">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Affiliate Partner:</span>
            <span className="font-black text-slate-900">
              {aff?.name || 'Partner'} [{aff?.referralCode || 'CODE'}]
              <span className="ml-1 text-[10px] text-blue-700">
                ({isFixed ? `Flat ₹${fixedReward.toLocaleString('en-IN')}` : `${defaultRate}% Standard Commission`})
              </span>
            </span>
          </div>
          {lead.status === 'Deal Confirmed' && (
            <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-2.5 text-amber-950 font-medium mt-2 shadow-xs">
              <span className="block text-[10px] uppercase font-black text-amber-900 tracking-wider">🔔 Partner Reported Purchase Request:</span>
              <span className="block text-xs mt-0.5">Reported Software: <strong className="underline">{lead.products?.join(', ') || lead.product || 'Software'}</strong></span>
              {lead.confirmationNotes && (
                <span className="block text-[11px] italic mt-0.5 text-amber-900">Order Note: "{lead.confirmationNotes}"</span>
              )}
            </div>
          )}
          {lead.notes && (
            <div className="border-t border-slate-200 pt-1.5 text-[11px] text-slate-600 italic">
              Partner Lead Note: "{lead.notes}"
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isApprove ? (
            <>
              {/* STEP 1: Select Software Products Sold */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-blue-100 border border-slate-900 rounded text-[10px]">STEP 1</span>
                    <span>Select Software Products Sold *</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">
                    {selectedProducts.length} product(s) selected
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mb-2.5">
                  Select one or more software products purchased by the client.
                </p>

                {/* Product Checkboxes / Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allProducts.map((prod) => {
                    const isSelected = selectedProducts.includes(prod)
                    const plansCount = (plansByProduct.get(prod) || []).length

                    return (
                      <div
                        key={prod}
                        onClick={() => handleToggleProduct(prod)}
                        className={`flex items-center justify-between p-2.5 rounded-lg border-2 cursor-pointer transition-all select-none ${
                          isSelected
                            ? 'bg-emerald-50 border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-white border-slate-200 hover:border-slate-400 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 rounded border-slate-900 text-emerald-600 focus:ring-0 cursor-pointer pointer-events-none"
                          />
                          <span className={`text-xs ${isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                            {prod}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-300 px-1.5 py-0.5 rounded">
                          {plansCount} plan{plansCount > 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* STEP 2: Select License Plans for Chosen Products */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-indigo-100 border border-slate-900 rounded text-[10px]">STEP 2</span>
                    <span>Select License Plans & Tiers *</span>
                  </label>
                  <span className="text-[10px] font-bold text-indigo-700">
                    {selectedPlanKeys.length} plan(s) ticked
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mb-2.5">
                  Choose the specific plans purchased for each product above. You can tick multiple plans across products.
                </p>

                {selectedProducts.length === 0 ? (
                  <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg text-center text-slate-500 text-xs font-bold">
                    Please select at least one product in Step 1 to view its plans.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProducts.map((prod) => {
                      const plans = plansByProduct.get(prod) || []

                      return (
                        <div key={prod} className="bg-slate-50 border-2 border-slate-900 rounded-lg p-2.5">
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                            <span className="font-black text-xs text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                              <span>📦</span>
                              <span>{prod}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {plans.filter((p) => selectedPlanKeys.includes(p.key)).length} of {plans.length} selected
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {plans.map((plan) => {
                              const isChecked = selectedPlanKeys.includes(plan.key)

                              return (
                                <div
                                  key={plan.key}
                                  onClick={() => handleTogglePlan(plan.key, prod)}
                                  className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all select-none ${
                                    isChecked
                                      ? 'bg-white border-slate-900 shadow-[1px_1px_0px_0px_#000]'
                                      : 'bg-white/60 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}} // handled by parent div
                                      className="w-4 h-4 rounded border-slate-900 text-emerald-600 focus:ring-0 cursor-pointer pointer-events-none"
                                    />
                                    <div>
                                      <span className={`text-xs block ${isChecked ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                        {plan.planName}
                                      </span>
                                      {plan.description && (
                                        <span className="text-[10px] text-slate-500 block">
                                          {plan.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className="font-black text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                      ₹{plan.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-[9px] text-slate-500 block mt-0.5">
                                      {plan.billingCycle}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* STEP 3: Billing & Deal Calculation Breakdown */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-emerald-100 border border-slate-900 rounded text-[10px]">STEP 3</span>
                    <span>Deal Value & Billing Breakdown (₹) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-600">
                    Catalog Total: ₹{catalogTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Selected Plans Itemized Calculation */}
                {selectedPlanKeys.length > 0 && (
                  <div className="bg-slate-50 border border-slate-300 rounded-md p-2.5 mb-2.5 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-600 block mb-1">
                      Itemized License Summary:
                    </span>
                    {selectedPlanKeys.map((key) => {
                      const item = allNormalizedPlans.find((p) => p.key === key)
                      if (!item) return null
                      return (
                        <div key={key} className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-slate-700">
                            • {item.projectName} ({item.planName})
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )
                    })}
                    <div className="border-t border-slate-300 pt-1.5 mt-1 flex items-center justify-between font-black text-xs text-slate-900">
                      <span>Total Catalog Price:</span>
                      <span className="text-emerald-700">₹{catalogTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                {/* Final Deal Amount Input (Editable) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-slate-800">
                      Final Agreed Deal Amount (₹):
                    </span>
                    {isDealValueManuallyEdited && (
                      <button
                        type="button"
                        onClick={handleResetDealValue}
                        className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        ↺ Reset to Catalog Total (₹{catalogTotal.toLocaleString('en-IN')})
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
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
                    Enter the final amount agreed or received from the client. You can modify this amount if discounts or custom pricing were applied.
                  </span>
                </div>
              </div>

              {/* STEP 4: Affiliate Commission Calculation & Manual Adjustment */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 shadow-[2px_2px_0px_0px_#000]">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-purple-100 border border-slate-900 rounded text-[10px]">STEP 4</span>
                    <span>Affiliate Commission Credit (₹) *</span>
                  </label>
                  <span className="text-[10px] text-purple-700 font-black">
                    {isFixed ? `Flat Reward: ₹${fixedReward.toLocaleString('en-IN')}` : `Auto: ${defaultRate}% of deal`}
                  </span>
                </div>

                {/* Commission Amount Input (Editable) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-purple-950">
                      Commission Amount to Credit (₹):
                    </span>
                    {isCommissionManuallyEdited && (
                      <button
                        type="button"
                        onClick={handleResetCommission}
                        className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        ↺ Reset to Auto Formula (₹{autoCalculatedCommission.toLocaleString('en-IN')})
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-purple-700">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={commissionAmount}
                      onChange={(e) => handleCommissionChange(e.target.value)}
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-base text-purple-950 focus:outline-none bg-purple-50"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-600 font-bold mt-1">
                    This commission will be credited directly to the partner's wallet upon approval. You can manually adjust or override this value.
                  </span>
                </div>
              </div>

              {/* STEP 5: Closing Note for Partner */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.2 bg-amber-100 border border-slate-900 rounded text-[10px]">STEP 5</span>
                  <span>Closing Note for Partner (Optional - Visible in Partner Portal)</span>
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-medium text-slate-900 focus:outline-none bg-slate-50 mt-1"
                  placeholder="e.g. 1-Year ERP license closed with upfront payment. Full commission credited."
                />
              </div>

              {/* Submit Confirmation Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || selectedProducts.length === 0}
                  className="w-full py-3.5 px-4 bg-[#86efac] border-2 border-slate-900 rounded-lg font-black text-sm uppercase tracking-wider text-slate-950 shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>✓</span>
                  <span>
                    {isSubmitting 
                      ? 'Saving Deal...' 
                      : `Confirm Deal & Credit ₹${Number(commissionAmount || 0).toLocaleString('en-IN')} Commission`
                    }
                  </span>
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
                  placeholder="e.g. Client opted for competitor, budget postponed, contact unreachable, etc."
                />
                
                {/* Quick Presets */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {[
                    'Client opted for competitor',
                    'Already using another software',
                    'Budget constraints / Postponed',
                    'Unresponsive after demo',
                    'Duplicate or test entry'
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
                  className="w-full py-3.5 px-4 bg-rose-500 border-2 border-slate-900 rounded-lg font-black text-sm uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
