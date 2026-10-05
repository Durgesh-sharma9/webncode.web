import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateItem, type AffiliateLeadItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import AffiliateModal from './AffiliateModal'
import RecordPayoutModal from './RecordPayoutModal'
import ReviewLeadModal from './ReviewLeadModal'

export default function AffiliatesTab() {
  const { token } = useAuth()
  const [activeSubTab, setActiveSubTab] = useState<'partners' | 'leads'>('partners')

  // Affiliates state
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([])
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(true)
  const [searchAffiliate, setSearchAffiliate] = useState('')

  // Leads state
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [leadStatusFilter, setLeadStatusFilter] = useState('All')

  // Modals state
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateItem | null>(null)
  
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false)
  const [payoutAffiliate, setPayoutAffiliate] = useState<AffiliateItem | null>(null)

  const [reviewModalLead, setReviewModalLead] = useState<AffiliateLeadItem | null>(null)
  const [reviewModalMode, setReviewModalMode] = useState<'approve' | 'reject' | null>(null)

  // Fetch affiliates
  const fetchAffiliates = async () => {
    setIsLoadingAffiliates(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliates`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setAffiliates(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch affiliates:', err)
      showErrorToast('Failed to load affiliates list')
    } finally {
      setIsLoadingAffiliates(false)
    }
  }

  // Fetch leads
  const fetchLeads = async () => {
    setIsLoadingLeads(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliates/leads`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setLeads(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch affiliate leads:', err)
      showErrorToast('Failed to load affiliate leads')
    } finally {
      setIsLoadingLeads(false)
    }
  }

  useEffect(() => {
    fetchAffiliates()
  }, [token])

  useEffect(() => {
    if (activeSubTab === 'leads') {
      fetchLeads()
    }
  }, [activeSubTab, token])

  // Delete affiliate
  const handleDeleteAffiliate = async (aff: AffiliateItem) => {
    if (!window.confirm(`Are you sure you want to remove affiliate partner "${aff.name}"? This will also remove their login access.`)) {
      return
    }

    try {
      await axios.delete(`${API_BASE}/api/affiliates/${aff._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      showSuccessToast('Affiliate partner removed successfully')
      fetchAffiliates()
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to delete affiliate')
    }
  }

  // Update lead status by admin
  const handleUpdateLead = async (leadId: string, updates: Partial<AffiliateLeadItem>) => {
    try {
      await axios.put(`${API_BASE}/api/affiliates/leads/${leadId}`, updates, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      showSuccessToast('Lead updated successfully')
      fetchLeads()
      fetchAffiliates()
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to update lead')
    }
  }

  // Calculate totals
  const totalPartners = affiliates.length
  const totalEarnedAll = affiliates.reduce((acc, a) => acc + (a.stats?.totalEarned || 0), 0)
  const totalPaidAll = affiliates.reduce((acc, a) => acc + (a.stats?.totalPaid || 0), 0)
  const totalPendingAll = affiliates.reduce((acc, a) => acc + (a.stats?.pendingPayout || 0), 0)

  // Filter affiliates
  const filteredAffiliates = affiliates.filter((a) => {
    const q = searchAffiliate.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.referralCode.toLowerCase().includes(q) ||
      (a.phone && a.phone.includes(q))
    )
  })

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    if (leadStatusFilter === 'All') return true
    return l.status === leadStatusFilter
  })

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
            PARTNER ECOSYSTEM
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            Affiliates & Partners
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Manage channel partners, assigned products, submitted client leads, and payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedAffiliate(null)
              setIsAffiliateModalOpen(true)
            }}
            className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Affiliate Partner</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Clean Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
        <div className="bg-white border-2 border-slate-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Active Partners</span>
          <p className="text-xl sm:text-2xl font-black mt-1 text-slate-900">{totalPartners}</p>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Commissions Earned</span>
          <p className="text-xl sm:text-2xl font-black mt-1 text-slate-900">₹{totalEarnedAll.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white border-2 border-slate-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Commissions Paid</span>
          <p className="text-xl sm:text-2xl font-black mt-1 text-emerald-600">₹{totalPaidAll.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[10px] font-black uppercase text-slate-500">Pending Settlements</span>
          <p className="text-xl sm:text-2xl font-black mt-1 text-rose-600">₹{totalPendingAll.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex border-b-2 border-slate-900 gap-2">
        <button
          onClick={() => setActiveSubTab('partners')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all ${
            activeSubTab === 'partners'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🤝 Partners Directory ({affiliates.length})
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all ${
            activeSubTab === 'leads'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🎯 Referred Leads Pipeline ({leads.length})
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUBTAB 1: PARTNERS DIRECTORY */}
      {/* ======================================================== */}
      {activeSubTab === 'partners' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search partners by name, email..."
              value={searchAffiliate}
              onChange={(e) => setSearchAffiliate(e.target.value)}
              className="w-full sm:w-80 border-2 border-slate-900 rounded-md px-3 py-2 text-xs font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          {/* Affiliates Table / List */}
          {isLoadingAffiliates ? (
            <div className="p-8 text-center text-xs font-bold uppercase text-slate-500">
              Loading affiliate partners...
            </div>
          ) : filteredAffiliates.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-lg p-8 text-center">
              <p className="text-sm font-black uppercase text-slate-600">No affiliate partners found</p>
              <p className="text-xs text-slate-500 mt-1">Click "+ Add Affiliate Partner" above to onboard your first partner.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                  <tr>
                    <th className="p-3">Partner Details</th>
                    <th className="p-3">Permitted Products</th>
                    <th className="p-3">Reward Model</th>
                    <th className="p-3">Leads / Won</th>
                    <th className="p-3">Earned / Paid</th>
                    <th className="p-3">Pending</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-medium">
                  {filteredAffiliates.map((aff) => {
                    const pending = aff.stats?.pendingPayout || 0
                    return (
                      <tr key={aff._id} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Name & Contact */}
                        <td className="p-3">
                          <div className="font-black text-slate-900">{aff.name}</div>
                          <div className="text-[11px] text-slate-500">{aff.email}</div>
                          {aff.phone && <div className="text-[10px] text-slate-400">{aff.phone}</div>}
                        </td>

                        {/* Permitted Products */}
                        <td className="p-3">
                          <span
                            title={aff.allowedProducts && aff.allowedProducts.length > 0 ? aff.allowedProducts.join(', ') : 'All Products Allowed'}
                            className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 border border-blue-400 rounded text-blue-800"
                          >
                            📦 {aff.allowedProducts && aff.allowedProducts.length > 0 ? `${aff.allowedProducts.length} Products` : 'All Products'}
                          </span>
                        </td>

                        {/* Earnings Model */}
                        <td className="p-3">
                          {aff.payoutType === 'fixed' ? (
                            <div>
                              <span className="font-black text-emerald-800 bg-emerald-100 border border-emerald-400 px-1.5 py-0.5 rounded text-[11px]">
                                ₹{(aff.fixedAmount ?? 0).toLocaleString('en-IN')}
                              </span>
                              <div className="text-[10px] uppercase font-black text-emerald-600 mt-0.5">Fixed / Deal</div>
                            </div>
                          ) : (
                            <div>
                              <span className="font-black text-slate-900 bg-amber-100 border border-amber-400 px-1.5 py-0.5 rounded text-[11px]">
                                {aff.commissionRate}%
                              </span>
                              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">of Deal Value</div>
                            </div>
                          )}
                        </td>

                        {/* Leads / Closed */}
                        <td className="p-3">
                          <div className="font-bold text-slate-900">
                            {aff.stats?.totalLeads || 0} leads
                          </div>
                          <div className="text-[10px] font-black text-emerald-700">
                            {aff.stats?.dealsWon || 0} closed deals
                          </div>
                        </td>

                        {/* Earned vs Paid */}
                        <td className="p-3 font-mono">
                          <div className="text-slate-900 font-bold">
                            ₹{(aff.stats?.totalEarned || 0).toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold">
                            Paid: ₹{(aff.stats?.totalPaid || 0).toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Pending Payout */}
                        <td className="p-3 font-mono">
                          <span className={`font-black ${pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            ₹{pending.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          {pending > 0 && (
                            <button
                              onClick={() => {
                                setPayoutAffiliate(aff)
                                setIsPayoutModalOpen(true)
                              }}
                              className="px-2.5 py-1 bg-[#86efac] border border-slate-900 rounded font-black text-[10px] uppercase hover:bg-[#4ade80] shadow-[1px_1px_0px_0px_#000]"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedAffiliate(aff)
                              setIsAffiliateModalOpen(true)
                            }}
                            className="px-2 py-1 bg-white border border-slate-900 rounded font-bold text-[10px] uppercase hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAffiliate(aff)}
                            className="px-2 py-1 bg-rose-50 border border-rose-400 text-rose-700 rounded font-bold text-[10px] uppercase hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: REFERRED LEADS PIPELINE */}
      {/* ======================================================== */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          
          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'New', 'Contacted', 'Demo Scheduled', 'In Negotiation', 'Deal Won', 'Lost'].map((st) => (
              <button
                key={st}
                onClick={() => setLeadStatusFilter(st)}
                className={`px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-slate-900 rounded-md transition-all ${
                  leadStatusFilter === st
                    ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {isLoadingLeads ? (
            <div className="p-8 text-center text-xs font-bold uppercase text-slate-500">
              Loading referred leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-lg p-8 text-center">
              <p className="text-sm font-black uppercase text-slate-600">No referred leads found</p>
              <p className="text-xs text-slate-500 mt-1">Leads submitted directly by affiliate partners will show up here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                  <tr>
                    <th className="p-3">School / Client</th>
                    <th className="p-3">Partner Attributed</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Pipeline Status</th>
                    <th className="p-3">Deal Value</th>
                    <th className="p-3">Commission</th>
                    <th className="p-3">Comm. Status</th>
                    <th className="p-3 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-medium">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Organization & Contact */}
                      <td className="p-3">
                        <div className="font-black text-slate-900">{lead.organizationName}</div>
                        <div className="text-[11px] text-slate-600">Contact: {lead.contactPerson} ({lead.phone})</div>
                        {lead.city && <div className="text-[10px] text-slate-400">City: {lead.city}</div>}
                        {lead.notes && <div className="text-[10px] text-slate-500 italic mt-0.5">"{lead.notes}"</div>}
                        {lead.rejectionReason && lead.status === 'Lost' && (
                          <div className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded px-1.5 py-0.5 mt-1">
                            Reason: {lead.rejectionReason}
                          </div>
                        )}
                      </td>

                      {/* Affiliate Partner */}
                      <td className="p-3">
                        <div className="font-bold text-slate-900">
                          {lead.affiliate?.name || 'Unknown Affiliate'}
                        </div>
                        <span className="font-mono text-[10px] text-blue-600">
                          {lead.affiliate?.email || lead.affiliate?.referralCode}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="p-3 font-bold text-slate-800">
                        {lead.product}
                      </td>

                      {/* Pipeline Status Select */}
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as any
                            if (newStatus === 'Deal Won') {
                              setReviewModalLead(lead)
                              setReviewModalMode('approve')
                            } else if (newStatus === 'Lost') {
                              setReviewModalLead(lead)
                              setReviewModalMode('reject')
                            } else {
                              handleUpdateLead(lead._id, { status: newStatus })
                            }
                          }}
                          className={`font-black uppercase text-[10px] px-2 py-1 rounded border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] focus:outline-none ${
                            lead.status === 'Deal Won'
                              ? 'bg-[#86efac] text-slate-900'
                              : lead.status === 'Lost'
                              ? 'bg-rose-200 text-slate-900'
                              : lead.status === 'Demo Scheduled'
                              ? 'bg-[#93c5fd] text-slate-900'
                              : 'bg-amber-100 text-slate-900'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Demo Scheduled">Demo Scheduled</option>
                          <option value="In Negotiation">In Negotiation</option>
                          <option value="Deal Won">Deal Won (Closed)</option>
                          <option value="Lost">Lost / Cancelled</option>
                        </select>
                      </td>

                      {/* Deal Value */}
                      <td className="p-3 font-mono font-bold text-slate-900">
                        ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Commission Amount */}
                      <td className="p-3 font-mono font-black text-slate-900">
                        ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Commission Status */}
                      <td className="p-3">
                        <select
                          value={lead.commissionStatus || 'Pending'}
                          onChange={(e) => handleUpdateLead(lead._id, { commissionStatus: e.target.value as any })}
                          className={`font-black uppercase text-[9px] px-1.5 py-0.5 rounded border border-slate-900 ${
                            lead.commissionStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-900'
                              : lead.commissionStatus === 'Approved'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </td>

                      {/* Quick Actions */}
                      <td className="p-3 text-right">
                        {lead.status === 'Deal Won' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-900 rounded font-black text-[10px]">
                              ✓ Won
                            </span>
                            <button
                              onClick={() => {
                                setReviewModalLead(lead)
                                setReviewModalMode('approve')
                              }}
                              className="px-2 py-0.5 bg-white border border-slate-900 rounded font-bold text-[10px] hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                              title="Edit deal amount or commission"
                            >
                              Edit
                            </button>
                          </div>
                        ) : lead.status === 'Lost' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="px-2 py-0.5 bg-rose-100 border border-rose-500 text-rose-900 rounded font-black text-[10px]">
                              ✕ Cancelled
                            </span>
                            <button
                              onClick={() => {
                                setReviewModalLead(lead)
                                setReviewModalMode('approve')
                              }}
                              className="px-2 py-0.5 bg-white border border-slate-900 rounded font-bold text-[10px] hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                              title="Re-open and approve deal"
                            >
                              Reopen
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setReviewModalLead(lead)
                                setReviewModalMode('approve')
                              }}
                              className="px-2.5 py-1 bg-[#86efac] border-2 border-slate-900 rounded font-black text-[10px] shadow-[2px_2px_0px_0px_#000] hover:bg-[#6ee7b7] cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                            >
                              <span>✓</span>
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                setReviewModalLead(lead)
                                setReviewModalMode('reject')
                              }}
                              className="px-2 py-1 bg-rose-100 border border-slate-900 rounded font-bold text-[10px] shadow-[1px_1px_0px_0px_#000] text-rose-900 hover:bg-rose-200 cursor-pointer flex items-center gap-0.5"
                            >
                              <span>✕</span>
                              <span>Cancel</span>
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* Onboard / Edit Affiliate Modal */}
      <AffiliateModal
        isOpen={isAffiliateModalOpen}
        onClose={() => setIsAffiliateModalOpen(false)}
        affiliate={selectedAffiliate}
        token={token}
        onSaved={fetchAffiliates}
      />

      {/* Record Payout Modal */}
      <RecordPayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        affiliate={payoutAffiliate}
        token={token}
        onPaid={() => {
          fetchAffiliates()
          if (activeSubTab === 'leads') fetchLeads()
        }}
      />

      {/* Review / Approve / Cancel Lead Modal */}
      <ReviewLeadModal
        isOpen={Boolean(reviewModalLead && reviewModalMode)}
        onClose={() => {
          setReviewModalLead(null)
          setReviewModalMode(null)
        }}
        lead={reviewModalLead}
        mode={reviewModalMode}
        token={token}
        onSuccess={() => {
          fetchLeads()
          fetchAffiliates()
        }}
      />

    </div>
  )
}
