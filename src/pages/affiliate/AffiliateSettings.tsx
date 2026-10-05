import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

export default function AffiliateSettings() {
  const { token, user } = useAuth()

  const [bankDetails, setBankDetails] = useState({
    upiId: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  // Load current bank details
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
        const res = await axios.get(`${API_BASE}/api/affiliate-portal/dashboard`, config)
        if (res.data?.success && res.data.data?.profile?.bankDetails) {
          const bd = res.data.data.profile.bankDetails
          setBankDetails({
            upiId: bd.upiId || '',
            accountHolder: bd.accountHolder || '',
            accountNumber: bd.accountNumber || '',
            ifscCode: bd.ifscCode || '',
            bankName: bd.bankName || ''
          })
        }
      } catch (err) {
        console.warn('Could not load bank details:', err)
      }
    }
    fetchSettings()
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.put(`${API_BASE}/api/affiliate-portal/payout-settings`, bankDetails, config)
      showSuccessToast('Payout banking details updated successfully!')
    } catch (err: any) {
      console.error('Update payout settings error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update settings')
    } finally {
      setIsSaving(false)
    }
  }

  const payoutType = user?.affiliate?.payoutType || 'percentage'
  const commissionRate = user?.affiliate?.commissionRate ?? 10
  const fixedAmount = user?.affiliate?.fixedAmount ?? 0

  return (
    <div className="space-y-6 font-mono text-slate-900 max-w-4xl">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#dbeafe] border border-slate-900 rounded">
          PAYOUT CONFIGURATION
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
          Bank & UPI Settings
        </h1>
        <p className="text-xs text-slate-600 font-bold">
          Provide your UPI address or bank account details to receive commission disbursements directly.
        </p>
      </div>

      {/* Account Info Box */}
      <div className="p-4 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 block">Partner Name</span>
          <p className="font-black text-slate-900 mt-0.5">{user?.name}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 block">Registered Email</span>
          <p className="font-bold text-slate-800 mt-0.5 truncate">{user?.email}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 block">Account Status</span>
          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-800 rounded font-black text-[10px]">
            Active Partner
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-black text-slate-400 block">Reward Tier</span>
          <p className="font-black text-emerald-700 mt-0.5">
            {payoutType === 'fixed' ? `₹${fixedAmount.toLocaleString('en-IN')} Flat / Deal` : `${commissionRate}% / Deal`}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_#000]">
        <h2 className="text-base font-black uppercase tracking-tight text-slate-900 mb-4 border-b-2 border-slate-900 pb-2 inline-block">
          Payout Account Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* UPI ID */}
          <div>
            <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
              UPI ID (Fastest Settlement — GPay / PhonePe / Paytm / BHIM)
            </label>
            <input
              type="text"
              value={bankDetails.upiId}
              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              placeholder="e.g. yourname@oksbi or 9876543210@paytm"
            />
            <p className="text-[10px] text-slate-500 mt-1">Recommended: Most commission payouts are transferred via instant UPI.</p>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] font-black uppercase text-slate-400 block mb-3">Or Direct Bank Transfer Details:</span>
          </div>

          {/* Account Holder & Bank Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankDetails.accountHolder}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="Name as per bank records"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="e.g. HDFC Bank, SBI, ICICI"
              />
            </div>
          </div>

          {/* Account Number & IFSC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono"
                placeholder="e.g. 5010023456789"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono uppercase"
                placeholder="e.g. HDFC0001234"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Payout Details'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}
