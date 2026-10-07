import { useState } from 'react'
import { type AffiliateItem, type AffiliateLeadItem } from './types'
import { showSuccessToast } from '../../components/ui/Toast'

interface ViewAffiliateModalProps {
  isOpen: boolean
  onClose: () => void
  affiliate: AffiliateItem | null
  leads: AffiliateLeadItem[]
  onEdit: (affiliate: AffiliateItem) => void
  onPay: (affiliate: AffiliateItem) => void
}

export default function ViewAffiliateModal({
  isOpen,
  onClose,
  affiliate,
  leads,
  onEdit,
  onPay
}: ViewAffiliateModalProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  if (!isOpen || !affiliate) return null

  const partnerLeads = leads.filter(
    (l) => l.affiliate?._id === affiliate._id || (typeof l.affiliate === 'string' && l.affiliate === affiliate._id)
  )

  const referralLink = `https://webncode.in/?ref=${affiliate.referralCode}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopiedLink(true)
    showSuccessToast('Referral link copied to clipboard!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(affiliate.referralCode)
    setCopiedCode(true)
    showSuccessToast('Referral code copied!')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const stats = affiliate.stats || {
    clicks: affiliate.clicksCount || 0,
    totalLeads: partnerLeads.length,
    dealsWon: partnerLeads.filter((l) => l.status === 'Deal Won').length,
    totalEarned: partnerLeads.filter((l) => l.status === 'Deal Won').reduce((acc, curr) => acc + (curr.commissionAmount || 0), 0),
    totalPaid: 0,
    pendingPayout: 0,
    availableBalance: 0
  }

  const pending = stats.pendingPayout || 0
  const available = stats.availableBalance ?? Math.max(0, (stats.totalEarned || 0) - (stats.totalPaid || 0) - pending)

  const bank = affiliate.bankDetails

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-mono text-slate-900">
      <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[6px_6px_0px_0px_#000] w-full max-w-3xl my-8 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-[#faf5ff] border-b-2 border-slate-900 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-200 border border-slate-900 rounded text-purple-900">
                PARTNER DOSSIER & PROFILE
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-900 ${
                  affiliate.status === 'active'
                    ? 'bg-[#86efac] text-slate-950'
                    : affiliate.status === 'suspended'
                    ? 'bg-rose-200 text-slate-950'
                    : 'bg-amber-100 text-slate-950'
                }`}
              >
                {affiliate.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1">
              {affiliate.name}
            </h2>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              Partner Member since {new Date(affiliate.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-slate-900 rounded-md font-black text-sm hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Quick Contact & Referral Link Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Contacts */}
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3.5 space-y-2 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Contact Information</span>
              <div className="text-xs font-bold space-y-1">
                <div className="flex items-center gap-2 text-slate-800">
                  <span>✉️</span>
                  <a href={`mailto:${affiliate.email}`} className="text-blue-700 hover:underline">
                    {affiliate.email}
                  </a>
                </div>
                {affiliate.phone ? (
                  <div className="flex items-center gap-2 pt-0.5">
                    <span>📞</span>
                    <span className="text-slate-900 font-black">{affiliate.phone}</span>
                    <a
                      href={`tel:${affiliate.phone}`}
                      className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-400 rounded text-[10px] font-black uppercase hover:bg-blue-200 ml-auto"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${affiliate.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 rounded text-[10px] font-black uppercase hover:bg-emerald-200"
                    >
                      WhatsApp
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-400 text-[11px]">No phone number added</span>
                )}
              </div>
            </div>

            {/* Referral Tracking Details */}
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-3.5 space-y-2 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Referral Code & Link</span>
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600">Code:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-amber-100 border border-amber-400 rounded font-black text-slate-950">
                      {affiliate.referralCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-[10px] bg-white border border-slate-900 px-1.5 py-0.5 rounded font-black uppercase cursor-pointer hover:bg-slate-100"
                    >
                      {copiedCode ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-600">Clicks Tracked:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded font-black text-xs font-mono">
                    {stats.clicks} Clicks
                  </span>
                </div>
                <div className="pt-1">
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-center py-1 bg-white hover:bg-slate-50 border border-slate-900 rounded text-[10px] font-black uppercase text-slate-900 shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                  >
                    {copiedLink ? '✓ Partner Link Copied!' : '🔗 Copy Partner Referral Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Accounting & Commission Cards */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              💰 Partner Financial Performance
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Total Earned</span>
                <p className="text-lg font-black mt-1 text-slate-900 font-mono">
                  ₹{(stats.totalEarned || 0).toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                  Across {stats.dealsWon || 0} won deals
                </span>
              </div>

              <div className="bg-white border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-blue-700 block">Paid Out</span>
                <p className="text-lg font-black mt-1 text-blue-700 font-mono">
                  ₹{(stats.totalPaid || 0).toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                  Disbursed by Admin
                </span>
              </div>

              <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-amber-700 block">In Process</span>
                <p className="text-lg font-black mt-1 text-amber-700 font-mono">
                  ₹{pending.toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                  Requested withdrawals
                </span>
              </div>

              <div className="bg-[#86efac] border-2 border-slate-900 rounded-lg p-3 shadow-[2px_2px_0px_0px_#000]">
                <span className="text-[10px] font-black uppercase text-slate-950 block">Available in Wallet</span>
                <p className="text-lg font-black mt-1 text-slate-950 font-mono">
                  ₹{available.toLocaleString('en-IN')}
                </p>
                <span className="text-[9px] text-slate-800 font-black block mt-0.5">
                  Ready to withdraw
                </span>
              </div>
            </div>
          </div>

          {/* Reward Plan & Permitted Products */}
          <div className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[2px_2px_0px_0px_#000] space-y-2 text-xs">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Commercial Terms</span>
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Commission Model</span>
                <span className="text-sm font-black text-slate-900">
                  {affiliate.payoutType === 'fixed'
                    ? `₹${(affiliate.fixedAmount || 0).toLocaleString('en-IN')} Flat per deal`
                    : `${affiliate.commissionRate}% of Closed Deal Value`}
                </span>
              </div>
              <div className="bg-slate-100 border border-slate-300 px-3 py-1.5 rounded flex-1 min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Assigned / Permitted Products</span>
                <span className="text-xs font-black text-slate-800">
                  {affiliate.allowedProducts && affiliate.allowedProducts.length > 0
                    ? affiliate.allowedProducts.join(', ')
                    : 'All Products (School ERP Pro, Library, Attendance, Custom Software, etc.)'}
                </span>
              </div>
            </div>
          </div>

          {/* Bank & UPI Account Details */}
          <div className="bg-[#fafafa] border-2 border-slate-900 rounded-xl p-4 shadow-[3px_3px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🏦</span>
                <span className="font-black text-xs uppercase text-slate-900 tracking-wider">
                  Registered Bank & UPI Account Details
                </span>
              </div>
              {bank?.primaryMethod && (
                <span className="px-2 py-0.5 bg-blue-100 border border-blue-400 text-blue-900 rounded text-[10px] font-black uppercase">
                  Primary: {bank.primaryMethod.toUpperCase()}
                </span>
              )}
            </div>

            {bank && (bank.upiId || bank.accountNumber) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                {/* UPI ID */}
                <div className="bg-white border border-slate-300 rounded-lg p-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">UPI ID / VPA</span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {bank.upiId || 'Not provided'}
                  </span>
                </div>

                {/* Account Holder */}
                <div className="bg-white border border-slate-300 rounded-lg p-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Account Holder Name</span>
                  <span className="text-sm font-black text-slate-900">
                    {bank.accountHolder || affiliate.name}
                  </span>
                </div>

                {/* Account Number */}
                <div className="bg-white border border-slate-300 rounded-lg p-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Bank Account Number</span>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    {bank.accountNumber || 'Not provided'}
                  </span>
                </div>

                {/* IFSC & Bank */}
                <div className="bg-white border border-slate-300 rounded-lg p-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Bank & IFSC</span>
                  <span className="text-sm font-black text-slate-900">
                    {bank.bankName || 'Bank'} {bank.ifscCode ? `(IFSC: ${bank.ifscCode})` : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-500 font-bold">
                No bank account or UPI details added by partner yet.
              </div>
            )}
          </div>

          {/* Leads Submitted by This Partner */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                📋 Leads Submitted by {affiliate.name} ({partnerLeads.length})
              </span>
            </div>

            {partnerLeads.length === 0 ? (
              <div className="bg-white border-2 border-slate-900 rounded-lg p-6 text-center text-xs text-slate-500">
                No leads submitted by this partner yet.
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f1f5f9] border-b-2 border-slate-900 uppercase font-black tracking-wider text-slate-700">
                    <tr>
                      <th className="p-2.5">Client / School</th>
                      <th className="p-2.5">Product</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Deal Value</th>
                      <th className="p-2.5">Commission</th>
                      <th className="p-2.5">Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 font-medium">
                    {partnerLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5">
                          <div className="font-black text-slate-900">{lead.organizationName}</div>
                          <div className="text-[10px] text-slate-500">{lead.contactPerson} ({lead.phone})</div>
                        </td>
                        <td className="p-2.5 font-bold text-slate-700">{lead.product}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border border-slate-900 ${
                              lead.status === 'Deal Won'
                                ? 'bg-[#86efac] text-slate-900'
                                : lead.status === 'Lost'
                                ? 'bg-rose-200 text-slate-900'
                                : 'bg-amber-100 text-slate-900'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-900">
                          ₹{(lead.dealValue || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-2.5 font-mono font-black text-emerald-700">
                          ₹{(lead.commissionAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="p-2.5">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Notes if any */}
          {affiliate.notes && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs">
              <span className="text-[10px] font-black uppercase text-amber-900 block">Admin Notes:</span>
              <p className="text-slate-800 font-bold mt-0.5">{affiliate.notes}</p>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#f8fafc] border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border-2 border-slate-900 rounded font-black text-xs uppercase hover:bg-slate-100 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose()
                onEdit(affiliate)
              }}
              className="px-4 py-2 bg-[#fef08a] border-2 border-slate-900 rounded font-black text-xs uppercase hover:bg-amber-300 shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              ✏️ Edit Partner
            </button>

            {(pending > 0 || available > 0) && (
              <button
                onClick={() => {
                  onClose()
                  onPay(affiliate)
                }}
                className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded font-black text-xs uppercase hover:bg-emerald-400 shadow-[2px_2px_0px_0px_#000] cursor-pointer flex items-center gap-1"
              >
                <span>💸</span>
                <span>Record Payout</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
