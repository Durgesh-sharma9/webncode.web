import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE, type ProductPlan, PROJECT_OPTIONS } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface ProductPlansTabProps {
  token: string | null
}

export default function ProductPlansTab({ token }: ProductPlansTabProps) {
  const [plans, setPlans] = useState<ProductPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Navigation state: null = Products List view, string = Inside specific product plans view
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchProduct, setSearchProduct] = useState('')

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<ProductPlan | null>(null)

  // Form states
  const [formProject, setFormProject] = useState(PROJECT_OPTIONS[0])
  const [formCustomProject, setFormCustomProject] = useState('')
  const [formPlanName, setFormPlanName] = useState('')
  const [formPrice, setFormPrice] = useState<number | ''>(25000)
  const [formBilling, setFormBilling] = useState('Yearly')
  const [formDescription, setFormDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  const fetchPlans = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliates/plans`, {
        headers: getHeaders(),
        timeout: 10000
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPlans(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch product plans:', err)
      showErrorToast('Failed to load plans list')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [token])

  // Get distinct products from existing plans + defaults
  const allKnownProducts = Array.from(
    new Set([
      ...PROJECT_OPTIONS,
      ...plans.map((p) => p.projectName)
    ])
  )

  const openCreateModalForProject = (projectTarget?: string) => {
    setEditingPlan(null)
    const target = projectTarget || selectedProject || PROJECT_OPTIONS[0]
    if (PROJECT_OPTIONS.includes(target)) {
      setFormProject(target)
      setFormCustomProject('')
    } else {
      setFormProject('Custom')
      setFormCustomProject(target)
    }
    setFormPlanName('')
    setFormPrice(25000)
    setFormBilling('Yearly')
    setFormDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (plan: ProductPlan) => {
    setEditingPlan(plan)
    if (PROJECT_OPTIONS.includes(plan.projectName)) {
      setFormProject(plan.projectName)
      setFormCustomProject('')
    } else {
      setFormProject('Custom')
      setFormCustomProject(plan.projectName)
    }
    setFormPlanName(plan.planName)
    setFormPrice(plan.price)
    setFormBilling(plan.billingCycle || 'Yearly')
    setFormDescription(plan.description || '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetProject = formProject === 'Custom' ? formCustomProject.trim() : formProject.trim()
    if (!targetProject) {
      showErrorToast('Please enter or select a project name')
      return
    }
    if (!formPlanName.trim()) {
      showErrorToast('Please enter a plan name (e.g. Starter, Standard, Enterprise)')
      return
    }
    if (formPrice === '' || Number(formPrice) < 0) {
      showErrorToast('Please enter a valid price in ₹')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        projectName: targetProject,
        planName: formPlanName.trim(),
        price: Number(formPrice),
        billingCycle: formBilling,
        description: formDescription.trim()
      }

      if (editingPlan && editingPlan._id) {
        await axios.put(`${API_BASE}/api/affiliates/plans/${editingPlan._id}`, payload, {
          headers: getHeaders()
        })
        showSuccessToast(`Plan "${formPlanName}" updated successfully!`)
      } else {
        await axios.post(`${API_BASE}/api/affiliates/plans`, payload, {
          headers: getHeaders()
        })
        showSuccessToast(`New plan "${formPlanName}" created for ${targetProject}!`)
      }

      setIsModalOpen(false)
      fetchPlans()
      // If we created a plan for a project, stay on that project
      setSelectedProject(targetProject)
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to save plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (plan: ProductPlan) => {
    if (!window.confirm(`Are you sure you want to delete plan "${plan.planName}" of ${plan.projectName}?`)) {
      return
    }

    try {
      await axios.delete(`${API_BASE}/api/affiliates/plans/${plan._id}`, {
        headers: getHeaders()
      })
      showSuccessToast('Plan deleted successfully')
      fetchPlans()
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete plan')
    }
  }

  // Filtered products list for Level 1
  const filteredProducts = allKnownProducts.filter((p) =>
    p.toLowerCase().includes(searchProduct.toLowerCase().trim())
  )

  // Current plans for selected product in Level 2
  const currentProjectPlans = selectedProject
    ? plans.filter((p) => p.projectName === selectedProject)
    : []

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* LEVEL 1: PRODUCTS DIRECTORY (When selectedProject is null) */}
      {/* ======================================================== */}
      {!selectedProject ? (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-amber-50 border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-block bg-amber-300 border border-slate-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider mb-1.5">
                PRODUCTS DIRECTORY
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Software Products Catalog
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5 max-w-2xl">
                Har product par click karein uske andar bane huye plans (Starter, Standard, Enterprise, Monthly/Yearly) dekhne aur naye plan add karne ke liye.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPlans}
                title="Refresh All"
                className="p-2.5 bg-white border-2 border-slate-900 rounded-lg hover:bg-slate-100 transition shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                🔄
              </button>
              <button
                onClick={() => {
                  setEditingPlan(null)
                  setFormProject('Custom')
                  setFormCustomProject('')
                  setFormPlanName('')
                  setFormPrice(25000)
                  setFormBilling('Yearly')
                  setFormDescription('')
                  setIsModalOpen(true)
                }}
                className="px-3.5 py-2.5 bg-yellow-400 hover:bg-yellow-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>✨</span> + Add New Product
              </button>
              <button
                onClick={() => openCreateModalForProject()}
                className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-2"
              >
                <span>+</span> Add Plan
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                placeholder="Search software products (e.g. School ERP, Web Builder, Timetable)..."
                className="w-full px-3.5 py-2 pl-9 bg-white border-2 border-slate-900 rounded-lg text-xs font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
              {searchProduct && (
                <button
                  onClick={() => setSearchProduct('')}
                  className="absolute right-2.5 top-2 text-xs font-black text-slate-400 hover:text-slate-800"
                >
                  ✕
                </button>
              )}
            </div>
            <span className="text-xs font-black uppercase text-slate-500">
              {filteredProducts.length} Products Available
            </span>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="p-12 text-center text-xs font-bold uppercase text-slate-500">
              Loading products and plans...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((projName) => {
                const projPlans = plans.filter((p) => p.projectName === projName)
                const planCount = projPlans.length
                const minPrice = planCount > 0 ? Math.min(...projPlans.map((p) => p.price)) : 0
                const maxPrice = planCount > 0 ? Math.max(...projPlans.map((p) => p.price)) : 0

                return (
                  <div
                    key={projName}
                    onClick={() => setSelectedProject(projName)}
                    className="bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] transition duration-150 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-2xl">
                          {projName.toLowerCase().includes('school') ? '🏫' :
                           projName.toLowerCase().includes('web') ? '🌐' :
                           projName.toLowerCase().includes('time') ? '📅' :
                           projName.toLowerCase().includes('attend') ? '⏱️' :
                           projName.toLowerCase().includes('result') ? '📊' :
                           projName.toLowerCase().includes('sport') ? '🏆' :
                           projName.toLowerCase().includes('test') ? '📝' : '💻'}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            planCount > 0
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-800'
                              : 'bg-amber-100 text-amber-900 border-amber-800'
                          }`}
                        >
                          {planCount} {planCount === 1 ? 'Plan' : 'Plans'} Configured
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-700 transition">
                        {projName}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {planCount > 0
                          ? `Pricing tiers configured: ${projPlans.map((p) => p.planName.split(' ')[0]).join(', ')}`
                          : 'No pricing plans configured yet. Click to add the first plan.'}
                      </p>

                      {/* Pricing Range Tag */}
                      <div className="mt-4 p-2.5 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-bold text-[11px]">Pricing Range:</span>
                        <span className="font-black text-slate-900">
                          {planCount === 0
                            ? 'Not set'
                            : planCount === 1
                            ? `₹${minPrice.toLocaleString('en-IN')}`
                            : `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-blue-700 group-hover:translate-x-1 transition flex items-center gap-1">
                        View Plans & Details →
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openCreateModalForProject(projName)
                        }}
                        className="px-2.5 py-1 bg-yellow-300 hover:bg-yellow-400 border border-slate-900 rounded font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                        title={`Add new plan to ${projName}`}
                      >
                        + Add Plan
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* LEVEL 2: INSIDE SELECTED PRODUCT (Plans & Tiers View) */
        /* ======================================================== */
        <div className="space-y-6">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 rounded-lg text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>←</span>
                <span>All Products</span>
              </button>
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500">
                  PRODUCT PRICING TIERS
                </span>
                <h2 className="text-lg font-black text-slate-900 uppercase leading-none mt-0.5">
                  {selectedProject}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black bg-blue-100 text-blue-900 border border-blue-900 px-2.5 py-1 rounded-md">
                {currentProjectPlans.length} Plans Active
              </span>
              <button
                onClick={() => openCreateModalForProject(selectedProject)}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span> Add New Plan
              </button>
            </div>
          </div>

          {/* Current Project Plans List */}
          {currentProjectPlans.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-xl p-10 text-center shadow-[3px_3px_0px_0px_#000]">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-base font-black uppercase text-slate-700">
                No pricing plans created for {selectedProject}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Create starter, standard or enterprise plans with official prices for this software product.
              </p>
              <button
                onClick={() => openCreateModalForProject(selectedProject)}
                className="mt-4 px-4 py-2 bg-yellow-400 border-2 border-slate-900 text-xs font-black uppercase rounded-lg shadow-[2px_2px_0px_0px_#000] cursor-pointer"
              >
                + Create First Plan Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentProjectPlans.map((plan) => {
                return (
                  <div
                    key={plan._id}
                    className="bg-white border-2 border-slate-900 rounded-xl p-5 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between hover:-translate-y-0.5 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="inline-block bg-blue-100 border border-blue-900 text-blue-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                          {plan.projectName}
                        </span>
                        <span className="inline-block bg-emerald-100 border border-emerald-900 text-emerald-900 text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                          {plan.billingCycle}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 text-base leading-snug">
                        {plan.planName}
                      </h3>

                      {plan.description && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {plan.description}
                        </p>
                      )}

                      {/* Price Box */}
                      <div className="my-4 p-3 bg-slate-50 border-2 border-slate-900 rounded-lg">
                        <div className="text-[10px] font-bold text-slate-500 uppercase">
                          Official Deal Value
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black text-slate-900">
                            ₹{plan.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {plan.billingCycle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t-2 border-slate-100">
                      <button
                        onClick={() => openEditModal(plan)}
                        className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded shadow-[2px_2px_0px_0px_#000] cursor-pointer transition"
                      >
                        ✏️ Edit Plan
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="py-1.5 px-3 bg-red-100 hover:bg-red-200 border-2 border-slate-900 text-red-800 text-xs font-black uppercase rounded shadow-[2px_2px_0px_0px_#000] cursor-pointer transition"
                        title="Delete Plan"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-[8px_8px_0px_0px_#000] max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase bg-yellow-300 px-2 py-0.5 border border-slate-900 rounded">
                  {editingPlan ? 'UPDATE PRICING' : 'NEW PLAN'}
                </span>
                <h3 className="text-lg font-black text-slate-900 uppercase mt-1">
                  {editingPlan ? `Edit ${editingPlan.planName}` : 'Create New Product Plan'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 font-black flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Selection */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Software Project / Product *
                </label>
                <select
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {allKnownProducts.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="Custom">+ Other Custom Software Name</option>
                </select>

                {formProject === 'Custom' && (
                  <input
                    type="text"
                    value={formCustomProject}
                    onChange={(e) => setFormCustomProject(e.target.value)}
                    placeholder="Enter custom software name (e.g. Hostel Pro, Coaching ERP)"
                    className="w-full mt-2 px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                )}
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Plan / Package Name *
                </label>
                <input
                  type="text"
                  value={formPlanName}
                  onChange={(e) => setFormPlanName(e.target.value)}
                  placeholder="e.g. Starter (Up to 500 Students), Standard Campus, Enterprise"
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Price & Billing Cycle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formPrice}
                    onChange={(e) =>
                      setFormPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder="e.g. 5999"
                    className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    Billing Cycle *
                  </label>
                  <select
                    value={formBilling}
                    onChange={(e) => setFormBilling(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="Yearly">Yearly (Annual License)</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-time">One-time / Lifetime</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Starting">Starting Base</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  Plan Description & Features Included
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Includes student info, marksheet generator, RFID integration, and automated WhatsApp notices."
                  className="w-full px-3 py-2 border-2 border-slate-900 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t-2 border-slate-900 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-black uppercase rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 border-2 border-slate-900 bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-xs font-black uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_#000] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
