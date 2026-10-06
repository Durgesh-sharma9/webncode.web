import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateLeadItem } from '../admin/types'
import { showErrorToast } from '../../components/ui/Toast'
import AddLeadModal from './AddLeadModal'
import ManageLeadModal from './ManageLeadModal'

export default function AffiliateLeads() {
  const { token, user } = useAuth()
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLeadForManage, setSelectedLeadForManage] = useState<AffiliateLeadItem | null>(null)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

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

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      l.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.city && l.city.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
        >
          <span>+</span>
          <span>Submit Client Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search by school, contact, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border-2 border-slate-900 rounded-md px-3 py-2 text-xs font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
        />

        {/* Status filters */}
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-1.5 text-xs py-1">
          {['All', 'New', 'Contacted', 'Demo Scheduled', 'In Negotiation', 'Deal Won', 'Lost'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`shrink-0 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border-2 border-slate-900 rounded transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {st}
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
                        ? 'bg-[#86efac] text-slate-900'
                        : lead.status === 'Lost'
                        ? 'bg-rose-200 text-slate-900'
                        : lead.status === 'Demo Scheduled'
                        ? 'bg-[#93c5fd] text-slate-900'
                        : 'bg-amber-100 text-slate-900'
                    }`}
                  >
                    {lead.status === 'Lost' ? 'Cancelled' : lead.status}
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
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Product:</span>
                    <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                      {lead.product}
                    </span>
                  </div>
                  {lead.notes && (
                    <div className="text-[10px] text-slate-600 bg-amber-50/70 border border-amber-200 rounded p-1.5 italic">
                      "{lead.notes}"
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
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-black uppercase ${
                        lead.commissionStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                          : lead.commissionStatus === 'Approved'
                          ? 'bg-blue-100 text-blue-800 border border-blue-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {lead.commissionStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Date & Manage Action */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    Submitted: {new Date(lead.createdAt).toLocaleDateString('en-IN', {
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
                    className="px-3 py-1.5 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer flex items-center gap-1 text-slate-950"
                  >
                    <span>⚙️</span>
                    <span>Manage Lead</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                <tr>
                  <th className="p-3">School / Organization</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Pipeline Status</th>
                  <th className="p-3">Deal Value</th>
                  <th className="p-3">Commission ({commissionRate}%)</th>
                  <th className="p-3">Payout Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100 font-medium">
                {filtered.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Org */}
                    <td className="p-3">
                      <div className="font-black text-slate-900">{lead.organizationName}</div>
                      {lead.city && <div className="text-[10px] text-slate-400">City: {lead.city}</div>}
                      {lead.notes && (
                        <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-[200px] truncate">
                          "{lead.notes}"
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{lead.contactPerson}</div>
                      <div className="text-[11px] text-slate-500">{lead.phone}</div>
                      {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                    </td>

                    {/* Product */}
                    <td className="p-3 font-bold text-slate-800">
                      {lead.product}
                    </td>

                    {/* Status Badge */}
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 shadow-[1px_1px_0px_0px_#000] inline-block ${
                        lead.status === 'Deal Won'
                          ? 'bg-[#86efac] text-slate-900'
                          : lead.status === 'Lost'
                          ? 'bg-rose-200 text-slate-900'
                          : lead.status === 'Demo Scheduled'
                          ? 'bg-[#93c5fd] text-slate-900'
                          : 'bg-amber-100 text-slate-900'
                      }`}>
                        {lead.status === 'Lost' ? 'Cancelled / Lost' : lead.status}
                      </span>
                      {lead.rejectionReason && lead.status === 'Lost' && (
                        <div className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5 mt-1 font-bold">
                          Reason: {lead.rejectionReason}
                        </div>
                      )}
                    </td>

                    {/* Deal Value */}
                    <td className="p-3 font-mono font-bold text-slate-900">
                      ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Commission */}
                    <td className="p-3 font-mono font-black text-emerald-700">
                      ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Commission / Payout Status */}
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        lead.commissionStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                          : lead.commissionStatus === 'Approved'
                          ? 'bg-blue-100 text-blue-800 border-blue-400'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {lead.commissionStatus || 'Pending'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3 text-[10px] text-slate-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Action */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedLeadForManage(lead)
                          setIsManageModalOpen(true)
                        }}
                        className="px-3 py-1.5 bg-[#86efac] hover:bg-[#6ee7b7] border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[0.5px_0.5px_0px_0px_#000] transition-all cursor-pointer inline-flex items-center gap-1 text-slate-950"
                      >
                        <span>⚙️</span>
                        <span>Manage</span>
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

      {/* Manage Lead Modal */}
      <ManageLeadModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false)
          setSelectedLeadForManage(null)
        }}
        lead={selectedLeadForManage}
        token={token}
        payoutType={payoutType}
        commissionRate={commissionRate}
        fixedAmount={fixedAmount}
        allowedProducts={allowedProducts}
        onLeadUpdated={fetchLeads}
        onLeadDeleted={fetchLeads}
      />

    </div>
  )
}
