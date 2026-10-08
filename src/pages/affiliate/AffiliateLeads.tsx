import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'
import AddLeadModal from './AddLeadModal'
import ManageLeadModal from './ManageLeadModal'
import ReportPurchaseModal from './ReportPurchaseModal'

export default function AffiliateLeads() {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeadForManage, setSelectedLeadForManage] = useState<AffiliateLeadItem | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [selectedLeadForPurchase, setSelectedLeadForPurchase] = useState<AffiliateLeadItem | null>(null)
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)

  const payoutType = (user?.affiliate?.payoutType || 'percentage') as 'percentage' | 'fixed'
  const commissionRate = user?.affiliate?.commissionRate ?? 10
  const fixedAmount = user?.affiliate?.fixedAmount ?? 0
  const allowedProducts = user?.affiliate?.allowedProducts || []

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliate-portal/leads`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setLeads(res.data.data)
      }
    } catch (err: any) {
      console.error('Fetch affiliate leads error:', err)
      showErrorToast('Failed to load leads list')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [token])

  const isDiscussionStatus = (status: string) =>
    ['New', 'In Discussion', 'Contacted', 'Demo Scheduled', 'In Negotiation'].includes(status)

  const getCleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '')

  const formatProductName = (rawProd: string) => {
    if (!rawProd) return ''
    // Strip old plan names appended like "School ERP Pro - Standard Campus"
    const cleaned = rawProd.split(' - ')[0].trim()
    return cleaned || rawProd.trim()
  }

  const getWhatsappUrl = (lead: AffiliateLeadItem) => {
    const raw = getCleanPhone(lead.phone)
    const phone = raw.length > 10 ? raw.slice(-10) : raw
    const text = encodeURIComponent(
      `Hello ${lead.contactPerson || 'Sir/Madam'}, this is regarding ${lead.organizationName || 'your school'} software inquiry (Web n Code).`
    )
    return `https://wa.me/91${phone}?text=${text}`
  }

  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null)

  const toggleExpand = (leadId: string) => {
    setExpandedLeadId((prev) => (prev === leadId ? null : leadId))
  }

  const getLeadProducts = (lead: AffiliateLeadItem) => {
    const list = (lead.products && lead.products.length > 0
      ? lead.products
      : (lead.product ? lead.product.split(', ') : []))
      .filter(Boolean)
      .map(formatProductName)
      .filter((v, i, a) => a.indexOf(v) === i)
    return list.length > 0 ? list : ['General Inquiry']
  }

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.city && l.city.toLowerCase().includes(search.toLowerCase()))

    let matchesStatus = true
    if (statusFilter === 'In Discussion') {
      matchesStatus = isDiscussionStatus(l.status)
    } else if (statusFilter === 'Deal Confirmed') {
      matchesStatus = l.status === 'Deal Confirmed'
    } else if (statusFilter === 'Deal Won') {
      matchesStatus = l.status === 'Deal Won'
    } else if (statusFilter === 'Lost') {
      matchesStatus = l.status === 'Lost'
    } else if (statusFilter !== 'All') {
      matchesStatus = l.status === statusFilter
    }

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4 sm:space-y-6 font-mono text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b-2 border-slate-900 pb-3 sm:pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded inline-block">
            LEAD MANAGEMENT
          </span>
          <h1 className="text-xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            My Client Leads
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-600 font-bold leading-relaxed">
            Submit school leads, track pipeline status, and connect with 1-click calls or WhatsApp.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2.5 bg-[#86efac] hover:bg-[#6ee7b7] active:scale-[0.98] border-2 border-slate-900 rounded-lg font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <span className="text-sm font-black">+</span>
            <span>Submit Client Lead</span>
          </button>
        </div>
      </div>

      {/* Interactive Quick KPI Counters (Touch & Filter on Mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('All')}
          className={`p-2.5 sm:p-3 rounded-xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
              : 'bg-white text-slate-900 hover:bg-slate-50 shadow-[1px_1px_0px_0px_#000]'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-75">All Leads</div>
          <div className="text-base sm:text-xl font-black mt-0.5">{leads.length}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('In Discussion')}
          className={`p-2.5 sm:p-3 rounded-xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
            statusFilter === 'In Discussion'
              ? 'bg-blue-600 text-white shadow-[2px_2px_0px_0px_#000]'
              : 'bg-blue-50 text-blue-950 hover:bg-blue-100 shadow-[1px_1px_0px_0px_#000]'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-75">💬 In Discussion</div>
          <div className="text-base sm:text-xl font-black mt-0.5">{leads.filter((l) => isDiscussionStatus(l.status)).length}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Deal Confirmed')}
          className={`p-2.5 sm:p-3 rounded-xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
            statusFilter === 'Deal Confirmed'
              ? 'bg-amber-400 text-slate-950 shadow-[2px_2px_0px_0px_#000]'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 shadow-[1px_1px_0px_0px_#000]'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-75">⏳ Confirmed</div>
          <div className="text-base sm:text-xl font-black mt-0.5">{leads.filter((l) => l.status === 'Deal Confirmed').length}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Deal Won')}
          className={`p-2.5 sm:p-3 rounded-xl border-2 border-slate-900 text-left transition-all cursor-pointer ${
            statusFilter === 'Deal Won'
              ? 'bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
              : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100 shadow-[1px_1px_0px_0px_#000]'
          }`}
        >
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider opacity-75">🎉 Deals Won</div>
          <div className="text-base sm:text-xl font-black mt-0.5">{leads.filter((l) => l.status === 'Deal Won').length}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
        
        {/* Direct School Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search school name, contact, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-slate-900 rounded-lg pl-8 pr-7 py-2 text-xs font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-500 text-xs">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 font-black text-slate-400 hover:text-slate-900 text-xs cursor-pointer p-0.5"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Scrollable Tabs */}
        <div className="flex overflow-x-auto no-scrollbar items-center gap-1.5 text-xs py-0.5 -mx-1 px-1">
          {[
            { id: 'All', label: 'All Leads' },
            { id: 'In Discussion', label: '💬 In Discussion' },
            { id: 'Deal Confirmed', label: '⏳ Confirmed' },
            { id: 'Deal Won', label: '🎉 Deal Won' },
            { id: 'Lost', label: '❌ Cancelled' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`shrink-0 px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border-2 border-slate-900 rounded-lg transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Card List */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-bold uppercase text-slate-500">
          Loading leads pipeline...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center shadow-[3px_3px_0px_0px_#000]">
          <p className="text-sm font-black uppercase text-slate-600">No leads found</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {leads.length === 0
              ? 'You have not submitted any leads yet.'
              : 'No leads matched your search or filter criteria.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-lg font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            + Submit Client Lead
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile Card List (< md) — Beautiful, Touch-Optimized & Responsive */}
          <div className="block md:hidden space-y-3">
            {filtered.map((lead) => {
              const isExpanded = expandedLeadId === lead._id
              const allProds = getLeadProducts(lead)

              return (
                <div
                  key={lead._id}
                  className={`bg-white border-2 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] space-y-3 text-xs transition-all ${
                    isExpanded ? 'border-blue-700 ring-2 ring-blue-500' : 'border-slate-900'
                  }`}
                >
                  {/* Card Header: School Name & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-slate-900 text-sm leading-snug break-words">
                        {lead.organizationName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-950 font-black uppercase bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded">
                          📍 {lead.city || 'Location N/A'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          • {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] ${
                        lead.status === 'Deal Won'
                          ? 'bg-[#86efac] text-slate-950'
                          : lead.status === 'Deal Confirmed'
                          ? 'bg-amber-200 text-amber-950 border-amber-600'
                          : lead.status === 'Lost'
                          ? 'bg-rose-200 text-slate-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {lead.status === 'Deal Won'
                        ? '🎉 Won'
                        : lead.status === 'Deal Confirmed'
                        ? '⏳ Verifying'
                        : lead.status === 'Lost'
                        ? '❌ Cancelled'
                        : '💬 Discussion'}
                    </span>
                  </div>

                  {/* Contact Person & Thumb-Friendly Quick Connect */}
                  <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-black text-slate-400 block">Contact Person</span>
                        <span className="font-black text-slate-900 text-xs truncate block">{lead.contactPerson}</span>
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[10px] text-blue-700 hover:underline truncate block"
                          >
                            ✉️ {lead.email}
                          </a>
                        )}
                      </div>
                      <a
                        href={`tel:${lead.phone}`}
                        className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-300 px-2 py-1 rounded shadow-xs"
                      >
                        📞 {lead.phone}
                      </a>
                    </div>

                    {/* 1-Click Action Buttons for Mobile */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                      <a
                        href={getWhatsappUrl(lead)}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-1.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white border-2 border-slate-900 rounded-lg font-black text-[11px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center gap-1 transition-transform cursor-pointer"
                        title="WhatsApp chat"
                      >
                        <span className="text-xs">💬</span>
                        <span className="truncate">WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="py-2 px-1.5 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 border-2 border-slate-900 rounded-lg font-black text-[11px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center gap-1 transition-transform cursor-pointer"
                        title="Call directly"
                      >
                        <span className="text-xs">📞</span>
                        <span className="truncate">Call</span>
                      </a>
                      <button
                        onClick={() => {
                          setSelectedLeadForManage(lead)
                          setIsManageModalOpen(true)
                        }}
                        className="py-2 px-1.5 bg-amber-100 hover:bg-amber-200 active:scale-[0.98] text-amber-950 border-2 border-slate-900 rounded-lg font-black text-[11px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] flex items-center justify-center gap-1 transition-transform cursor-pointer"
                        title="Edit lead"
                      >
                        <span className="text-xs">✏️</span>
                        <span className="truncate">Edit</span>
                      </button>
                    </div>

                    {/* Prominent Conversion Notification Flow */}
                    {lead.status === 'Deal Won' ? (
                      <div className="p-2.5 bg-emerald-100 border-2 border-emerald-600 rounded-lg text-center font-black text-xs text-emerald-950 shadow-[1px_1px_0px_0px_#000]">
                        🎉 Deal Closed! ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')} Commission Credited
                      </div>
                    ) : lead.status === 'Deal Confirmed' ? (
                      <div className="p-2.5 bg-amber-100 border-2 border-amber-500 rounded-lg flex items-center justify-between gap-2 shadow-[1px_1px_0px_0px_#000]">
                        <div className="text-[11px] font-black text-amber-950 leading-tight">
                          ⏳ Purchase Reported! Super Admin verifying & crediting commission.
                        </div>
                        <button
                          onClick={() => {
                            setSelectedLeadForPurchase(lead)
                            setIsPurchaseModalOpen(true)
                          }}
                          className="shrink-0 px-2 py-1 bg-white border border-amber-600 rounded text-[10px] font-black uppercase text-amber-950 cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    ) : lead.status !== 'Lost' ? (
                      <button
                        onClick={() => {
                          setSelectedLeadForPurchase(lead)
                          setIsPurchaseModalOpen(true)
                        }}
                        className="w-full py-2.5 px-3 bg-[#86efac] hover:bg-[#6ee7b7] active:scale-[0.98] text-slate-950 border-2 border-slate-900 rounded-lg font-black text-xs uppercase shadow-[2.5px_2.5px_0px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-transform"
                      >
                        <span className="text-sm">🎉</span>
                        <span>School Bought Product! (Notify Admin)</span>
                      </button>
                    ) : null}
                  </div>

                  {/* Compact Product Tags & Accordion Toggle Bar */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <div className="flex items-center gap-1 flex-wrap min-w-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 whitespace-nowrap shadow-[0.5px_0.5px_0px_0px_#2563eb]">
                        <span className="text-[9px]">📦</span>
                        <span className="truncate max-w-[120px]">{allProds[0]}</span>
                      </span>
                      {allProds.length > 1 && (
                        <span className="text-[9px] font-black text-slate-600 bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded">
                          +{allProds.length - 1} more
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleExpand(lead._id)}
                      className={`px-2.5 py-1.5 text-[10px] font-black uppercase rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 cursor-pointer transition-all ${
                        isExpanded
                          ? 'bg-slate-900 text-white'
                          : 'bg-amber-50 text-amber-950 hover:bg-amber-100'
                      }`}
                    >
                      <span>{isExpanded ? '▲' : '▼'}</span>
                      <span>{isExpanded ? 'Hide' : 'Deep Info'}</span>
                    </button>
                  </div>

                  {/* Accordion Expanded Deep Info (Mobile View) */}
                  {isExpanded && (
                    <div className="pt-3 border-t-2 border-dashed border-slate-300 space-y-3 bg-[#f8fafc] -mx-3.5 -mb-3.5 p-3.5 rounded-b-xl animate-fadeIn">
                      
                      {/* 1. All Products Pitched */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                          📦 All Products Pitched ({allProds.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {allProds.map((prod, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 rounded-lg font-bold text-[11px] text-blue-950 shadow-[1px_1px_0px_0px_#2563eb]"
                            >
                              <span>📦</span>
                              <span>{prod}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 2. Visit Notes & Meeting Discussion */}
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1">
                          📝 Visit Notes & Meeting Discussion:
                        </span>
                        <div className="text-[11px] text-slate-800 bg-white border border-amber-300 rounded-lg p-2.5 leading-relaxed shadow-[1px_1px_0px_0px_#f59e0b]">
                          {lead.notes ? (
                            <span>"{lead.notes}"</span>
                          ) : (
                            <span className="text-slate-400 italic">No visit notes recorded</span>
                          )}
                        </div>
                      </div>

                      {/* 3. Feedback / Status Badges */}
                      {lead.adminNotes && (
                        <div className="text-[11px] text-blue-950 bg-blue-50 border border-blue-300 rounded-lg p-2 font-bold">
                          👑 Admin Review: "{lead.adminNotes}"
                        </div>
                      )}
                      {lead.confirmationNotes && lead.status === 'Deal Confirmed' && (
                        <div className="text-[11px] text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-lg p-2 font-bold">
                          ✅ Confirmation Note: "{lead.confirmationNotes}"
                        </div>
                      )}
                      {lead.rejectionReason && lead.status === 'Lost' && (
                        <div className="text-[11px] text-rose-950 bg-rose-50 border border-rose-300 rounded-lg p-2 font-bold">
                          ❌ Cancelled Reason: {lead.rejectionReason}
                        </div>
                      )}

                      {/* 4. Action Footer & Timestamp */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400">
                          Added: {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedLeadForManage(lead)
                            setIsManageModalOpen(true)
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1 text-slate-900"
                        >
                          <span>✏️</span>
                          <span>Edit Details</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )
            })}
          </div>

          {/* Desktop Table (>= md) with 1-Row-at-a-time Accordion Deep Info */}
          <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">School / Institution</th>
                  <th className="py-2.5 px-3">Contact Person</th>
                  <th className="py-2.5 px-3">Products Pitched</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Connect & Action</th>
                </tr>
              </thead>
              {filtered.map((lead) => {
                const isExpanded = expandedLeadId === lead._id
                const allProds = getLeadProducts(lead)

                return (
                  <tbody key={lead._id} className="divide-y-2 divide-slate-100 font-medium border-b border-slate-200">
                    {/* Main Row */}
                    <tr
                      onClick={() => toggleExpand(lead._id)}
                      className={`transition-colors cursor-pointer select-none ${
                        isExpanded ? 'bg-blue-50/70 hover:bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                      title="Click row to toggle deep info"
                    >
                      {/* School & Location & Date */}
                      <td className="py-2.5 px-3">
                        <div className="font-black text-slate-900 text-xs leading-snug flex items-center gap-1.5">
                          <span>{lead.organizationName}</span>
                          <span
                            className={`text-[9px] px-1 rounded transition-transform ${
                              isExpanded ? 'rotate-180 text-blue-700 font-black' : 'text-slate-400'
                            }`}
                          >
                            ▼
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-50 border border-amber-300 rounded text-[9px] font-black text-amber-950 uppercase">
                            <span>📍</span>
                            <span>{lead.city || 'Location N/A'}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            📅 {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Contact Person & Phone */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-black text-slate-900 text-xs">{lead.contactPerson}</div>
                        <div className="text-[11px] font-mono font-bold text-slate-600">{lead.phone}</div>
                      </td>

                      {/* Products Pitched (Compact Tag & Clickable) */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-950 rounded font-bold text-[10px] whitespace-nowrap shadow-[0.5px_0.5px_0px_0px_#2563eb]"
                            title={allProds[0]}
                          >
                            <span className="text-[9px]">📦</span>
                            <span className="truncate max-w-[130px]">{allProds[0]}</span>
                          </span>
                          {allProds.length > 1 && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded font-black text-[9px] whitespace-nowrap"
                              title={allProds.slice(1).join(', ')}
                            >
                              +{allProds.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] inline-block ${
                            lead.status === 'Deal Won'
                              ? 'bg-[#86efac] text-slate-950'
                              : lead.status === 'Deal Confirmed'
                              ? 'bg-amber-200 text-amber-950 border-amber-600'
                              : lead.status === 'Lost'
                              ? 'bg-rose-200 text-slate-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {lead.status === 'Deal Won'
                            ? '🎉 Won'
                            : lead.status === 'Deal Confirmed'
                            ? '⏳ Verifying'
                            : lead.status === 'Lost'
                            ? '❌ Cancelled'
                            : '💬 Discussion'}
                        </span>
                      </td>

                      {/* Quick Connect & Action (Right Aligned) */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {lead.status === 'Deal Won' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-950 rounded font-black text-[10px]">
                              🎉 Won (₹{(lead.commissionAmount || 0).toLocaleString('en-IN')})
                            </span>
                          ) : lead.status === 'Deal Confirmed' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedLeadForPurchase(lead)
                                setIsPurchaseModalOpen(true)
                              }}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-600 rounded font-black text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                              title="Purchase reported to Admin. Click to review or edit."
                            >
                              <span>⏳</span>
                              <span>Reported (Admin Review)</span>
                            </button>
                          ) : lead.status !== 'Lost' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedLeadForPurchase(lead)
                                setIsPurchaseModalOpen(true)
                              }}
                              className="px-2.5 py-1 bg-[#86efac] hover:bg-[#6ee7b7] text-slate-950 border-2 border-slate-900 rounded font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 hover:translate-y-[-1px] transition-all cursor-pointer"
                              title="School bought product - Notify Super Admin to credit commission"
                            >
                              <span>🎉</span>
                              <span>School Bought!</span>
                            </button>
                          ) : null}

                          <a
                            href={getWhatsappUrl(lead)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white border border-slate-900 rounded font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 hover:translate-y-[-1px] transition-all cursor-pointer"
                            title={`Direct WhatsApp to ${lead.contactPerson}`}
                          >
                            <span>💬</span>
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-900 rounded font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_#000] flex items-center gap-1 hover:translate-y-[-1px] transition-all cursor-pointer"
                            title={`Call ${lead.contactPerson} (${lead.phone})`}
                          >
                            <span>📞</span>
                            <span>Call</span>
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLeadForManage(lead)
                              setIsManageModalOpen(true)
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1 text-slate-900"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpand(lead._id)
                            }}
                            className={`px-2 py-1 border border-slate-900 rounded font-black text-[10px] uppercase shadow-[1px_1px_0px_0px_#000] flex items-center gap-0.5 transition-all cursor-pointer ${
                              isExpanded
                                ? 'bg-slate-900 text-white'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                            }`}
                            title={isExpanded ? 'Collapse info' : 'Expand deep info'}
                          >
                            <span>{isExpanded ? '▲' : '▼'}</span>
                            <span>{isExpanded ? 'Hide' : 'Info'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Accordion Deep Info Row (Only 1 open at a time) */}
                    {isExpanded && (
                      <tr className="bg-[#f8fafc] border-b-2 border-slate-900">
                        <td colSpan={5} className="p-3.5 sm:p-4">
                          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3.5">
                            
                            {/* Deep Info Top Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-black text-slate-900">
                                  🏫 {lead.organizationName}
                                </span>
                                {lead.city && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-amber-950 uppercase">
                                    📍 {lead.city}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-bold">
                                  Lead Logged: {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  Current Stage:
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                                    lead.status === 'Deal Won'
                                      ? 'bg-[#86efac] text-slate-950'
                                      : lead.status === 'Deal Confirmed'
                                      ? 'bg-amber-200 text-amber-950'
                                      : lead.status === 'Lost'
                                      ? 'bg-rose-200 text-slate-900'
                                      : 'bg-blue-100 text-blue-900'
                                  }`}
                                >
                                  {lead.status}
                                </span>
                              </div>
                            </div>

                            {/* 3-Column Deep Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                              
                              {/* 1. Products Pitched Full List */}
                              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-3 space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                  <span>📦</span>
                                  <span>Products Pitched ({allProds.length})</span>
                                </span>
                                <div className="space-y-1.5">
                                  {allProds.map((prod, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-1.5 p-1.5 bg-white border border-blue-200 rounded font-bold text-xs text-blue-950 shadow-[0.5px_0.5px_0px_0px_#2563eb]"
                                    >
                                      <span className="text-xs">📦</span>
                                      <span className="truncate">{prod}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 2. Contact Details & 1-Click Connect */}
                              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-3 space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                  <span>👤</span>
                                  <span>Contact Person & Direct Connect</span>
                                </span>
                                <div className="bg-white border border-slate-200 rounded p-2 space-y-1 text-xs">
                                  <div className="font-black text-slate-900">{lead.contactPerson}</div>
                                  <div className="font-mono text-slate-700 font-bold">📞 {lead.phone}</div>
                                  {lead.email ? (
                                    <a
                                      href={`mailto:${lead.email}`}
                                      className="text-[11px] text-blue-700 hover:underline block truncate"
                                    >
                                      ✉️ {lead.email}
                                    </a>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">No email provided</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 pt-1">
                                  <a
                                    href={getWhatsappUrl(lead)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-1 px-2 bg-[#25D366] hover:bg-[#20ba59] text-white border border-slate-900 rounded font-black text-[10px] uppercase text-center shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                                  >
                                    💬 WhatsApp Chat
                                  </a>
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-900 rounded font-black text-[10px] uppercase text-center shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                                  >
                                    📞 Call Direct
                                  </a>
                                </div>
                              </div>

                              {/* 3. Visit Notes, Admin Feedback & Timeline */}
                              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-3 space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                  <span>📝</span>
                                  <span>Visit Notes & Discussion Log</span>
                                </span>
                                <div className="bg-white border border-amber-300 rounded p-2 text-xs text-slate-800 leading-relaxed shadow-[1px_1px_0px_0px_#f59e0b] min-h-[60px]">
                                  {lead.notes ? (
                                    <span>"{lead.notes}"</span>
                                  ) : (
                                    <span className="text-slate-400 italic">No visit notes entered.</span>
                                  )}
                                </div>

                                {lead.adminNotes && (
                                  <div className="bg-blue-50 border border-blue-300 rounded p-1.5 text-[11px] text-blue-950 font-bold">
                                    👑 Admin Note: "{lead.adminNotes}"
                                  </div>
                                )}
                                {lead.confirmationNotes && lead.status === 'Deal Confirmed' && (
                                  <div className="bg-emerald-50 border border-emerald-300 rounded p-1.5 text-[11px] text-emerald-950 font-bold">
                                    ✅ Confirmation: "{lead.confirmationNotes}"
                                  </div>
                                )}
                                {lead.rejectionReason && lead.status === 'Lost' && (
                                  <div className="bg-rose-50 border border-rose-300 rounded p-1.5 text-[11px] text-rose-950 font-bold">
                                    ❌ Lost Reason: {lead.rejectionReason}
                                  </div>
                                )}
                              </div>

                            </div>

                            {/* Bottom Action Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <span className="text-[10px] text-slate-400 italic">
                                Tip: Click anywhere on this row or click "Hide" to close.
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedLeadForManage(lead)
                                    setIsManageModalOpen(true)
                                  }}
                                  className="px-3 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1 text-slate-900"
                                >
                                  <span>✏️</span>
                                  <span>Edit Lead Details</span>
                                </button>
                                <button
                                  onClick={() => toggleExpand(lead._id)}
                                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>▲</span>
                                  <span>Close Details</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )
              })}
            </table>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        payoutType={payoutType}
        commissionRate={commissionRate}
        fixedAmount={fixedAmount}
        allowedProducts={allowedProducts}
        onLeadAdded={fetchLeads}
      />



      {/* Manage Lead Modal */}
      {/* Edit Lead Modal */}
      <ManageLeadModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false)
          setSelectedLeadForManage(null)
        }}
        lead={selectedLeadForManage}
        token={token}
        allowedProducts={allowedProducts}
        onLeadUpdated={fetchLeads}
      />

      {/* Report School Purchase Modal */}
      <ReportPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false)
          setSelectedLeadForPurchase(null)
        }}
        lead={selectedLeadForPurchase}
        token={token}
        allowedProducts={allowedProducts}
        onSuccess={fetchLeads}
      />

    </div>
  )
}
