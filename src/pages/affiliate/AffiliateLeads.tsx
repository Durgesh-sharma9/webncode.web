import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'
import AddLeadModal from './AddLeadModal'
import ManageLeadModal from './ManageLeadModal'
import ConfirmDealModal from './ConfirmDealModal'

export default function AffiliateLeads() {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeadForManage, setSelectedLeadForManage] = useState<AffiliateLeadItem | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)
  const [confirmDealModalLead, setConfirmDealModalLead] = useState<AffiliateLeadItem | null>(null)

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
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
            LEAD MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            My Client Leads
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Track deal status from demo scheduling to closing and commission payouts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {leads.length > 0 && (
            <button
              onClick={() => {
                const defaultLead = leads.find((l) => isDiscussionStatus(l.status)) || leads[0]
                setConfirmDealModalLead(defaultLead)
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-100 border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
            >
              <span>✓</span>
              <span>Confirm School Order</span>
            </button>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <span>+</span>
            <span>Submit Client Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Direct School Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search school name, contact, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-slate-900 rounded-md pl-8 pr-7 py-2 text-xs font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
          />
          <span className="absolute left-2.5 top-2.5 text-slate-500 text-xs">🔍</span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 font-black text-slate-400 hover:text-slate-900 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Status filters */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-1.5 text-xs py-1">
          {[
            { id: 'All', label: 'All Leads' },
            { id: 'In Discussion', label: '💬 In Discussion (Active)' },
            { id: 'Deal Confirmed', label: '⏳ Confirmed (Waiting Admin)' },
            { id: 'Deal Won', label: '🎉 Deal Won' },
            { id: 'Lost', label: '❌ Cancelled' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`shrink-0 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border-2 border-slate-900 rounded transition-all cursor-pointer ${
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

      {/* Table */}
      {isLoading ? (
        <div className="p-8 text-center text-xs font-bold uppercase text-slate-500">
          Loading leads pipeline...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-lg p-8 text-center">
          <p className="text-sm font-black uppercase text-slate-600">No leads found</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            {leads.length === 0
              ? 'You have not submitted any leads yet.'
              : 'No leads matched your search/filter criteria.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000]"
          >
            + Submit Client Lead
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile Card List (< md) */}
          <div className="block md:hidden space-y-3">
            {filtered.map((lead) => (
              <div
                key={lead._id}
                className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-2.5 text-xs"
              >
                {/* Header: Organization & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm leading-snug">
                      {lead.organizationName}
                    </h3>
                    {lead.city && (
                      <span className="text-[10px] text-slate-500 font-bold block">
                        📍 {lead.city}
                      </span>
                    )}
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
                      ? '🎉 Won (In Wallet)'
                      : lead.status === 'Deal Confirmed'
                      ? '⏳ Confirmed (Verifying)'
                      : lead.status === 'Lost'
                      ? '❌ Cancelled'
                      : '💬 In Discussion'}
                  </span>
                </div>

                {/* Contact Person & Call link */}
                <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-400 block">Contact Person</span>
                    <span className="font-black text-slate-900 text-xs">{lead.contactPerson}</span>
                  </div>
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-700 bg-white border border-blue-400 px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_#2563eb] active:translate-y-0.5"
                  >
                    <span>📞</span>
                    <span>{lead.phone}</span>
                  </a>
                </div>

                {/* Product & Notes */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Products:</span>
                    {(lead.products && lead.products.length > 0 ? lead.products : (lead.product ? lead.product.split(', ') : []))
                      .filter(Boolean)
                      .map((prod, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        >
                          <span>📦</span>
                          <span>{prod.trim()}</span>
                        </span>
                      ))}
                  </div>
                  {lead.appliedCoupon && (
                    <div>
                      <span className="inline-block px-1.5 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded font-mono text-[9px] font-black">
                        🏷️ {lead.appliedCoupon} {lead.discountAmount ? `(-₹${lead.discountAmount.toLocaleString('en-IN')})` : ''}
                      </span>
                    </div>
                  )}
                  {lead.notes && (
                    <div className="text-[10px] text-slate-600 bg-amber-50/70 border border-amber-200 rounded p-1.5 italic">
                      "{lead.notes}"
                    </div>
                  )}
                  {lead.adminNotes && (
                    <div className="text-[10px] text-blue-900 bg-blue-50 border border-blue-300 rounded p-1.5 font-bold">
                      Admin Note: "{lead.adminNotes}"
                    </div>
                  )}
                  {lead.confirmationNotes && lead.status === 'Deal Confirmed' && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 rounded p-1.5 font-bold">
                      Confirmation Note: "{lead.confirmationNotes}"
                    </div>
                  )}
                  {lead.rejectionReason && lead.status === 'Lost' && (
                    <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded p-1.5 font-bold">
                      Reason: {lead.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#f1f5f9] border border-slate-200 rounded-lg p-2 text-center font-mono">
                  <div>
                    <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Deal Value</span>
                    <span className="text-xs font-black text-slate-900">
                      ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Commission</span>
                    <span className="text-xs font-black text-emerald-700">
                      ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                    <div>
                      <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Payout</span>
                      {lead.status !== 'Deal Won' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-black uppercase bg-slate-200 text-slate-600">
                          In Pipeline
                        </span>
                      ) : lead.commissionStatus === 'Paid' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-400">
                          ✓ Paid to Bank
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          🟢 In Wallet
                        </span>
                      )}
                    </div>
                </div>

                {/* Date & Manage Action */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {lead.status !== 'Deal Won' && lead.status !== 'Lost' && (
                      lead.status === 'Deal Confirmed' ? (
                        <span className="px-2 py-1 bg-amber-100 border border-amber-500 rounded text-[10px] font-black uppercase text-amber-900 inline-flex items-center gap-1">
                          <span>⏳</span>
                          <span>Admin Verifying</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDealModalLead(lead)}
                          className="px-2.5 py-1.5 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1 text-slate-950"
                        >
                          <span>🎉</span>
                          <span>Confirm Deal</span>
                        </button>
                      )
                    )}
                    <button
                      onClick={() => {
                        setSelectedLeadForManage(lead)
                        setIsManageModalOpen(true)
                      }}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer flex items-center gap-1 text-slate-900"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) — Perfectly sized without horizontal scroll */}
          <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">School / Client</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Products Pitched</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Deal & Commission</th>
                  <th className="py-2.5 px-3">Payout</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium">
                {filtered.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Org & Location & Date */}
                    <td className="py-2.5 px-3">
                      <div className="font-black text-slate-900 text-xs leading-snug">{lead.organizationName}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {lead.city ? `${lead.city} • ` : ''}
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      {lead.notes && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-[180px] truncate" title={lead.notes}>
                          "{lead.notes}"
                        </div>
                      )}
                    </td>

                    {/* Contact Person & Phone */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900 text-xs">{lead.contactPerson}</div>
                      <a href={`tel:${lead.phone}`} className="text-[10px] text-blue-700 font-bold hover:underline font-mono">
                        {lead.phone}
                      </a>
                    </td>

                    {/* Product Chips */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {(lead.products && lead.products.length > 0 ? lead.products : (lead.product ? lead.product.split(', ') : []))
                          .filter(Boolean)
                          .map((prod, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-900 rounded font-bold text-[10px]"
                            >
                              <span className="text-[9px]">📦</span>
                              <span>{prod.trim()}</span>
                            </span>
                          ))}
                      </div>
                      {lead.appliedCoupon && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded font-mono text-[9px] font-black">
                            <span>🏷️</span>
                            <span>{lead.appliedCoupon}</span>
                            {lead.discountAmount ? <span>(-₹{lead.discountAmount.toLocaleString('en-IN')})</span> : null}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] inline-block ${
                        lead.status === 'Deal Won'
                          ? 'bg-[#86efac] text-slate-950'
                          : lead.status === 'Deal Confirmed'
                          ? 'bg-amber-200 text-amber-950 border-amber-600'
                          : lead.status === 'Lost'
                          ? 'bg-rose-200 text-slate-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {lead.status === 'Deal Won'
                          ? '🎉 Won'
                          : lead.status === 'Deal Confirmed'
                          ? '⏳ Verifying'
                          : lead.status === 'Lost'
                          ? '❌ Cancelled'
                          : '💬 Discussion'}
                      </span>
                      {lead.confirmationNotes && lead.status === 'Deal Confirmed' && (
                        <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 rounded px-1.5 py-0.5 mt-1 font-bold max-w-[140px] truncate" title={lead.confirmationNotes}>
                          "{lead.confirmationNotes}"
                        </div>
                      )}
                      {lead.rejectionReason && lead.status === 'Lost' && (
                        <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5 mt-1 font-bold max-w-[140px] truncate" title={lead.rejectionReason}>
                          Reason: {lead.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Deal Value & Commission */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-900 text-xs">
                        ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                      </div>
                      <div className="font-black text-emerald-700 text-[10px]">
                        Comm: ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Commission / Payout Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {lead.status !== 'Deal Won' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-300">
                          In Pipeline
                        </span>
                      ) : lead.commissionStatus === 'Paid' ? (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-400">
                          ✓ Paid to Bank
                        </span>
                      ) : (
                        <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#86efac] text-slate-950 border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          🟢 In Wallet
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      {lead.status !== 'Deal Won' && lead.status !== 'Lost' && (
                        lead.status === 'Deal Confirmed' ? (
                          <span className="px-2 py-1 bg-amber-100 border border-amber-500 rounded text-[10px] font-black uppercase text-amber-900 inline-flex items-center gap-1">
                            <span>⏳</span>
                            <span>Pending Admin</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDealModalLead(lead)}
                            className="px-2 py-1 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 rounded font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] hover:translate-y-[-1px] transition-all cursor-pointer inline-flex items-center gap-1 text-slate-950"
                            title="School agreed to purchase! Submit confirmation to Admin"
                          >
                            <span>🎉</span>
                            <span>Confirm</span>
                          </button>
                        )
                      )}
                      <button
                        onClick={() => {
                          setSelectedLeadForManage(lead)
                          setIsManageModalOpen(true)
                        }}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer inline-flex items-center gap-1 text-slate-900"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
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

      {/* School Confirmed Modal */}
      <ConfirmDealModal
        isOpen={Boolean(confirmDealModalLead)}
        onClose={() => setConfirmDealModalLead(null)}
        lead={confirmDealModalLead}
        allLeads={leads}
        token={token}
        payoutType={payoutType}
        commissionRate={commissionRate}
        fixedAmount={fixedAmount}
        onSuccess={fetchLeads}
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

    </div>
  )
}
