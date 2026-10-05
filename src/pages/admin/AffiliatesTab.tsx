import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE, type AffiliateItem, type AffiliateLeadItem, type AffiliatePayoutItem } from './types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import AffiliateModal from './AffiliateModal'
import RecordPayoutModal from './RecordPayoutModal'
import ReviewLeadModal from './ReviewLeadModal'
import ConfirmPayoutModal from './ConfirmPayoutModal'

export default function AffiliatesTab() {
  const { token } = useAuth()
  const [activeSubTab, setActiveSubTab] = useState<'partners' | 'leads' | 'payouts'>('partners')

  // Affiliates state
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([])
  const [isLoadingAffiliates, setIsLoadingAffiliates] = useState(true)
  const [searchAffiliate, setSearchAffiliate] = useState('')

  // Leads state
  const [leads, setLeads] = useState<AffiliateLeadItem[]>([])
  const [isLoadingLeads, setIsLoadingLeads] = useState(false)
  const [leadStatusFilter, setLeadStatusFilter] = useState('All')

  // Payout requests state
  const [payoutRequests, setPayoutRequests] = useState<AffiliatePayoutItem[]>([])
  const [isLoadingPayoutRequests, setIsLoadingPayoutRequests] = useState(false)
  const [confirmPayoutModalData, setConfirmPayoutModalData] = useState<AffiliatePayoutItem | null>(null)
  const [confirmPayoutModalMode, setConfirmPayoutModalMode] = useState<'confirm' | 'reject' | null>(null)

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

  const fetchPayoutRequests = async () => {
    setIsLoadingPayoutRequests(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliates/payout-requests`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setPayoutRequests(res.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch payout requests:', err)
      showErrorToast('Failed to load payout requests')
    } finally {
      setIsLoadingPayoutRequests(false)
    }
  }

  useEffect(() => {
    fetchAffiliates()
    fetchPayoutRequests()
  }, [token])

  useEffect(() => {
    if (activeSubTab === 'leads') {
      fetchLeads()
    } else if (activeSubTab === 'payouts') {
      fetchPayoutRequests()
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setSelectedAffiliate(null)
              setIsAffiliateModalOpen(true)
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
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

      {/* Sub Tabs Selector (Smooth Horizontal Scroll on Mobile) */}
      <div className="flex overflow-x-auto no-scrollbar border-b-2 border-slate-900 gap-1.5 sm:gap-2 pb-[1px]">
        <button
          onClick={() => setActiveSubTab('partners')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeSubTab === 'partners'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🤝 Partners Directory ({affiliates.length})
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all cursor-pointer ${
            activeSubTab === 'leads'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          🎯 Referred Leads Pipeline ({leads.length})
        </button>

        <button
          onClick={() => setActiveSubTab('payouts')}
          className={`shrink-0 px-3.5 py-2 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-md transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'payouts'
              ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#fff]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>💸 Payout Requests ({payoutRequests.length})</span>
          {payoutRequests.filter((p) => p.status === 'Pending').length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded-full text-[10px]">
              {payoutRequests.filter((p) => p.status === 'Pending').length} Pending
            </span>
          )}
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
            <div>
              {/* Mobile Cards List (< md) */}
              <div className="block md:hidden space-y-3">
                {filteredAffiliates.map((aff) => {
                  const pending = aff.stats?.pendingPayout || 0
                  return (
                    <div
                      key={aff._id}
                      className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm leading-snug">{aff.name}</h3>
                          <div className="text-[11px] text-slate-500 font-bold mt-0.5">{aff.email}</div>
                          {aff.phone && (
                            <a
                              href={`tel:${aff.phone}`}
                              className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-bold mt-1"
                            >
                              📞 {aff.phone}
                            </a>
                          )}
                        </div>

                        {/* Reward Model Badge */}
                        <div className="text-right shrink-0">
                          {aff.payoutType === 'fixed' ? (
                            <span className="font-black text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded text-[10px] block">
                              ₹{(aff.fixedAmount ?? 0).toLocaleString('en-IN')} Flat
                            </span>
                          ) : (
                            <span className="font-black text-slate-900 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded text-[10px] block">
                              {aff.commissionRate}% Rate
                            </span>
                          )}
                          <span className="text-[9px] uppercase font-bold text-slate-500 mt-0.5 block">
                            📦 {aff.allowedProducts && aff.allowedProducts.length > 0 ? `${aff.allowedProducts.length} Prods` : 'All Prods'}
                          </span>
                        </div>
                      </div>

                      {/* Numbers Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-[#f8fafc] border border-slate-200 rounded-lg p-2 text-center font-mono">
                        <div>
                          <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Leads / Won</span>
                          <span className="text-xs font-black text-slate-900">
                            {aff.stats?.totalLeads || 0} / <span className="text-emerald-700">{aff.stats?.dealsWon || 0}</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Earned</span>
                          <span className="text-xs font-black text-slate-900">
                            ₹{(aff.stats?.totalEarned || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-sans font-black uppercase text-slate-400 block">Pending</span>
                          <span className={`text-xs font-black ${pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            ₹{pending.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        {pending > 0 && (
                          <button
                            onClick={() => {
                              setPayoutAffiliate(aff)
                              setIsPayoutModalOpen(true)
                            }}
                            className="px-3 py-1.5 bg-[#86efac] border border-slate-900 rounded font-black text-xs uppercase hover:bg-[#4ade80] shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAffiliate(aff)
                            setIsAffiliateModalOpen(true)
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-900 rounded font-bold text-xs uppercase hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAffiliate(aff)}
                          className="px-3 py-1.5 bg-rose-50 border border-rose-400 text-rose-700 rounded font-bold text-xs uppercase hover:bg-rose-100 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
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
                          <td className="p-3">
                            <div className="font-black text-slate-900">{aff.name}</div>
                            <div className="text-[11px] text-slate-500">{aff.email}</div>
                            {aff.phone && <div className="text-[10px] text-slate-400">{aff.phone}</div>}
                          </td>

                          <td className="p-3">
                            <span
                              title={aff.allowedProducts && aff.allowedProducts.length > 0 ? aff.allowedProducts.join(', ') : 'All Products Allowed'}
                              className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 border border-blue-400 rounded text-blue-800"
                            >
                              📦 {aff.allowedProducts && aff.allowedProducts.length > 0 ? `${aff.allowedProducts.length} Products` : 'All Products'}
                            </span>
                          </td>

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

                          <td className="p-3">
                            <div className="font-bold text-slate-900">
                              {aff.stats?.totalLeads || 0} leads
                            </div>
                            <div className="text-[10px] font-black text-emerald-700">
                              {aff.stats?.dealsWon || 0} closed deals
                            </div>
                          </td>

                          <td className="p-3 font-mono">
                            <div className="text-slate-900 font-bold">
                              ₹{(aff.stats?.totalEarned || 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-[10px] text-emerald-600 font-bold">
                              Paid: ₹{(aff.stats?.totalPaid || 0).toLocaleString('en-IN')}
                            </div>
                          </td>

                          <td className="p-3 font-mono">
                            <span className={`font-black ${pending > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                              ₹{pending.toLocaleString('en-IN')}
                            </span>
                          </td>

                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {pending > 0 && (
                              <button
                                onClick={() => {
                                  setPayoutAffiliate(aff)
                                  setIsPayoutModalOpen(true)
                                }}
                                className="px-2.5 py-1 bg-[#86efac] border border-slate-900 rounded font-black text-[10px] uppercase hover:bg-[#4ade80] shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                              >
                                Pay Now
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedAffiliate(aff)
                                setIsAffiliateModalOpen(true)
                              }}
                              className="px-2 py-1 bg-white border border-slate-900 rounded font-bold text-[10px] uppercase hover:bg-slate-100 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAffiliate(aff)}
                              className="px-2 py-1 bg-rose-50 border border-rose-400 text-rose-700 rounded font-bold text-[10px] uppercase hover:bg-rose-100 cursor-pointer"
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
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap items-center gap-1.5 py-1">
            {['All', 'New', 'Contacted', 'Demo Scheduled', 'In Negotiation', 'Deal Won', 'Lost'].map((st) => (
              <button
                key={st}
                onClick={() => setLeadStatusFilter(st)}
                className={`shrink-0 px-3 py-1 text-xs font-black uppercase tracking-wider border-2 border-slate-900 rounded-md transition-all cursor-pointer ${
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
            <div>
              {/* Mobile Cards View (< md) */}
              <div className="block md:hidden space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3 text-xs"
                  >
                    {/* Header: School & Pipeline Select */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm leading-snug">
                          {lead.organizationName}
                        </h3>
                        <div className="text-[11px] text-blue-700 font-bold mt-0.5">
                          Partner: {lead.affiliate?.name || 'Unknown'} ({lead.affiliate?.referralCode || '—'})
                        </div>
                      </div>

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
                        className={`shrink-0 font-black uppercase text-[10px] px-2 py-1 rounded border-2 border-slate-900 shadow-[1px_1px_0px_0px_#000] focus:outline-none ${
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
                        <option value="Deal Won">Deal Won</option>
                        <option value="Lost">Lost / Cancelled</option>
                      </select>
                    </div>

                    {/* Contact & Phone */}
                    <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[9px] uppercase font-black text-slate-400 block">Contact</span>
                        <span className="font-black text-slate-900 text-xs">{lead.contactPerson}</span>
                      </div>
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-black text-blue-700 bg-white border border-blue-400 px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_#2563eb]"
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
                      {lead.city && (
                        <div className="text-[10px] text-slate-500 font-bold">
                          📍 Location: {lead.city}
                        </div>
                      )}
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

                    {/* Key Values & Commission Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-[#f1f5f9] border border-slate-200 rounded-lg p-2 text-center font-mono">
                      <div>
                        <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Deal Value</span>
                        <span className="text-xs font-black text-slate-900">
                          ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Commission</span>
                        <span className="text-xs font-black text-slate-900">
                          ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-sans font-black uppercase text-slate-500 block">Payout</span>
                        <select
                          value={lead.commissionStatus || 'Pending'}
                          onChange={(e) => handleUpdateLead(lead._id, { commissionStatus: e.target.value as any })}
                          className={`font-black uppercase text-[9px] px-1 py-0.5 rounded border border-slate-900 ${
                            lead.commissionStatus === 'Paid'
                              ? 'bg-emerald-100 text-emerald-900'
                              : lead.commissionStatus === 'Approved'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-white text-slate-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      {lead.status === 'Deal Won' ? (
                        <button
                          onClick={() => {
                            setReviewModalLead(lead)
                            setReviewModalMode('approve')
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-900 rounded font-bold text-xs uppercase hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                        >
                          Edit Deal / Payout
                        </button>
                      ) : lead.status === 'Lost' ? (
                        <button
                          onClick={() => {
                            setReviewModalLead(lead)
                            setReviewModalMode('approve')
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-900 rounded font-bold text-xs uppercase hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                        >
                          Reopen & Approve
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => {
                              setReviewModalLead(lead)
                              setReviewModalMode('approve')
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 bg-[#86efac] border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-[#6ee7b7] cursor-pointer text-center"
                          >
                            ✓ Approve Deal
                          </button>
                          <button
                            onClick={() => {
                              setReviewModalLead(lead)
                              setReviewModalMode('reject')
                            }}
                            className="flex-1 sm:flex-initial px-3 py-1.5 bg-rose-100 border border-slate-900 rounded font-bold text-xs uppercase text-rose-900 hover:bg-rose-200 cursor-pointer text-center"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
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
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: PAYOUT REQUESTS */}
      {/* ======================================================== */}
      {activeSubTab === 'payouts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-800">Partner Withdrawal Requests</h2>
              <p className="text-xs text-slate-500 font-bold">
                Review withdrawal requests, copy beneficiary UPI/bank details, transfer funds and record UTR to confirm.
              </p>
            </div>
          </div>

          {isLoadingPayoutRequests ? (
            <div className="p-8 text-center text-xs font-bold uppercase text-slate-500">
              Loading payout requests...
            </div>
          ) : payoutRequests.length === 0 ? (
            <div className="bg-white border-2 border-slate-900 rounded-lg p-8 text-center">
              <p className="text-sm font-black uppercase text-slate-600">No payout requests found</p>
              <p className="text-xs text-slate-500 mt-1">
                When affiliates submit withdrawal requests from their portal, they will appear here for 24h verification.
              </p>
            </div>
          ) : (
            <div>
              {/* Mobile Card List (< md) */}
              <div className="block md:hidden space-y-3">
                {payoutRequests.map((pay) => (
                  <div
                    key={pay._id}
                    className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3 text-xs"
                  >
                    {/* Header: Partner & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm leading-snug">
                          {pay.affiliate?.name || 'Unknown Partner'}
                        </h3>
                        <div className="text-[11px] text-slate-500 font-bold mt-0.5">
                          {pay.affiliate?.phone || pay.affiliate?.email}
                        </div>
                      </div>

                      <div>
                        {pay.status === 'Paid' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-900 rounded font-black text-[10px]">
                            ✓ Paid Out
                          </span>
                        ) : pay.status === 'Rejected' ? (
                          <span className="px-2 py-0.5 bg-rose-100 border border-rose-600 text-rose-900 rounded font-black text-[10px]">
                            ✕ Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-600 text-amber-900 rounded font-black text-[10px]">
                            🕒 Under Review (24h)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount & Beneficiary Account */}
                    <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-black text-slate-400">Amount Requested:</span>
                        <span className="font-mono font-black text-emerald-700 text-base">
                          ₹{pay.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-1">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">
                          Destination ({pay.paymentMethod || 'UPI'}):
                        </span>
                        <div className="font-mono font-black text-slate-900 text-xs break-all mt-0.5">
                          {pay.payoutDetails || 'No details specified'}
                        </div>
                      </div>
                      {pay.notes && (
                        <div className="text-[10px] text-slate-500 italic">"{pay.notes}"</div>
                      )}
                    </div>

                    {/* UTR or Rejection Reason */}
                    {pay.transactionReference && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-bold uppercase text-[10px]">Bank UTR:</span>
                        <span className="font-mono font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {pay.transactionReference}
                        </span>
                      </div>
                    )}
                    {pay.status === 'Rejected' && pay.rejectionReason && (
                      <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 rounded p-1.5 font-bold">
                        Reason: {pay.rejectionReason}
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-[10px] text-slate-400 text-right">
                      Requested:{' '}
                      {new Date(pay.requestedAt || pay.createdAt || Date.now()).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Actions if Pending */}
                    {pay.status === 'Pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setConfirmPayoutModalData(pay)
                            setConfirmPayoutModalMode('confirm')
                          }}
                          className="flex-1 py-2 bg-[#86efac] border-2 border-slate-900 rounded font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-[#6ee7b7] cursor-pointer text-center"
                        >
                          ✓ Pay & Confirm
                        </button>
                        <button
                          onClick={() => {
                            setConfirmPayoutModalData(pay)
                            setConfirmPayoutModalMode('reject')
                          }}
                          className="flex-1 py-2 bg-rose-100 border border-slate-900 rounded font-bold text-xs uppercase text-rose-900 hover:bg-rose-200 cursor-pointer text-center"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden md:block overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[4px_4px_0px_0px_#000] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                    <tr>
                      <th className="p-3">Partner Details</th>
                      <th className="p-3">Amount Requested</th>
                      <th className="p-3">Beneficiary Account</th>
                      <th className="p-3">Requested At</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">UTR / Ref</th>
                      <th className="p-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 font-medium">
                    {payoutRequests.map((pay) => (
                      <tr key={pay._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-black text-slate-900">{pay.affiliate?.name || 'Unknown Partner'}</div>
                          <div className="text-[11px] text-slate-500">{pay.affiliate?.phone || pay.affiliate?.email}</div>
                        </td>

                        <td className="p-3 font-mono font-black text-emerald-700 text-sm">
                          ₹{pay.amount.toLocaleString('en-IN')}
                        </td>

                        <td className="p-3 font-mono">
                          <div className="font-bold text-slate-900 text-xs">
                            {pay.payoutDetails || 'No details specified'}
                          </div>
                          {pay.paymentMethod && (
                            <span className="text-[10px] text-slate-500 font-sans block">
                              Method: {pay.paymentMethod}
                            </span>
                          )}
                          {pay.notes && (
                            <div className="text-[10px] text-slate-500 italic mt-0.5">"{pay.notes}"</div>
                          )}
                        </td>

                        <td className="p-3 whitespace-nowrap text-slate-700">
                          {new Date(pay.requestedAt || pay.createdAt || Date.now()).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        <td className="p-3">
                          {pay.status === 'Paid' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-900 rounded font-black text-[10px]">
                              ✓ Paid Out
                            </span>
                          ) : pay.status === 'Rejected' ? (
                            <div>
                              <span className="px-2 py-0.5 bg-rose-100 border border-rose-600 text-rose-900 rounded font-black text-[10px]">
                                ✕ Rejected
                              </span>
                              {pay.rejectionReason && (
                                <div className="text-[10px] text-rose-700 font-bold mt-0.5">
                                  Reason: {pay.rejectionReason}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 border border-amber-600 text-amber-900 rounded font-black text-[10px]">
                              🕒 Under Review (24h)
                            </span>
                          )}
                        </td>

                        <td className="p-3 font-mono">
                          {pay.transactionReference ? (
                            <span className="font-bold text-blue-700">{pay.transactionReference}</span>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          {pay.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setConfirmPayoutModalData(pay)
                                  setConfirmPayoutModalMode('confirm')
                                }}
                                className="px-2.5 py-1 bg-[#86efac] border-2 border-slate-900 rounded font-black text-[10px] shadow-[2px_2px_0px_0px_#000] hover:bg-[#6ee7b7] cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                              >
                                <span>✓</span>
                                <span>Pay & Confirm</span>
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmPayoutModalData(pay)
                                  setConfirmPayoutModalMode('reject')
                                }}
                                className="px-2 py-1 bg-rose-100 border border-slate-900 rounded font-bold text-[10px] shadow-[1px_1px_0px_0px_#000] text-rose-900 hover:bg-rose-200 cursor-pointer flex items-center gap-0.5"
                              >
                                <span>✕</span>
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-bold">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          if (activeSubTab === 'payouts') fetchPayoutRequests()
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
          fetchPayoutRequests()
        }}
      />

      {/* Confirm / Reject Payout Modal */}
      <ConfirmPayoutModal
        isOpen={Boolean(confirmPayoutModalData && confirmPayoutModalMode)}
        onClose={() => {
          setConfirmPayoutModalData(null)
          setConfirmPayoutModalMode(null)
        }}
        payout={confirmPayoutModalData}
        mode={confirmPayoutModalMode}
        token={token}
        onSuccess={() => {
          fetchPayoutRequests()
          fetchAffiliates()
        }}
      />

    </div>
  )
}
