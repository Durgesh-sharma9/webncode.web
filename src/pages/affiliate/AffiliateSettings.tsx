import { useState, useEffect, type FormEvent } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE } from '../admin/types'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

export default function AffiliateSettings() {
  const { token, user } = useAuth()
  const [activeTab, setActiveTab] = useState<'payout' | 'profile' | 'notifications' | 'security'>('payout')

  // Bank & Payout state
  const [primaryMethod, setPrimaryMethod] = useState<'upi' | 'bank'>('upi')
  const [bankDetails, setBankDetails] = useState({
    upiId: '',
    accountHolder: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    accountType: 'savings' as 'savings' | 'current'
  })
  const [isSavingPayout, setIsSavingPayout] = useState(false)

  // Profile & Contact state
  const [phone, setPhone] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailOnDealWon: true,
    emailOnPayout: true,
    monthlySummary: true
  })
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Full affiliate profile details from server
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load current affiliate settings & profile
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
        const res = await axios.get(`${API_BASE}/api/affiliate-portal/dashboard`, config)
        if (res.data?.success && res.data.data?.profile) {
          const prof = res.data.data.profile
          setProfileData(prof)
          setPhone(prof.phone || '')

          if (prof.bankDetails) {
            const bd = prof.bankDetails
            setPrimaryMethod(bd.primaryMethod === 'bank' ? 'bank' : 'upi')
            setBankDetails({
              upiId: bd.upiId || '',
              accountHolder: bd.accountHolder || '',
              accountNumber: bd.accountNumber || '',
              confirmAccountNumber: bd.accountNumber || '',
              ifscCode: bd.ifscCode || '',
              bankName: bd.bankName || '',
              accountType: bd.accountType === 'current' ? 'current' : 'savings'
            })
          }

          if (prof.notifications) {
            setNotifications({
              emailOnDealWon: prof.notifications.emailOnDealWon ?? true,
              emailOnPayout: prof.notifications.emailOnPayout ?? true,
              monthlySummary: prof.notifications.monthlySummary ?? true
            })
          }
        }
      } catch (err) {
        console.warn('Could not load partner settings:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [token])

  // Save Payout Details (UPI & Bank)
  const handleSavePayout = async (e: FormEvent) => {
    e.preventDefault()

    if (primaryMethod === 'upi') {
      if (!bankDetails.upiId.trim()) {
        showErrorToast('Please enter a valid UPI ID (e.g. yourname@oksbi)')
        return
      }
    } else {
      if (!bankDetails.accountHolder.trim()) {
        showErrorToast('Account holder name is required')
        return
      }
      if (!bankDetails.accountNumber.trim()) {
        showErrorToast('Account number is required')
        return
      }
      if (bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
        showErrorToast('Account numbers do not match')
        return
      }
      if (!bankDetails.ifscCode.trim()) {
        showErrorToast('IFSC Code is required')
        return
      }
    }

    setIsSavingPayout(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      const payload = {
        primaryMethod,
        upiId: bankDetails.upiId.trim(),
        accountHolder: bankDetails.accountHolder.trim(),
        accountNumber: bankDetails.accountNumber.trim(),
        ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
        bankName: bankDetails.bankName.trim(),
        accountType: bankDetails.accountType
      }

      const res = await axios.put(`${API_BASE}/api/affiliate-portal/payout-settings`, payload, config)
      if (res.data?.success) {
        showSuccessToast('Payout banking details saved! Future withdrawals will use this account automatically.')
        setProfileData((prev: any) => ({
          ...prev,
          bankDetails: res.data.data?.bankDetails || payload
        }))
      }
    } catch (err: any) {
      console.error('Update payout settings error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update payout settings')
    } finally {
      setIsSavingPayout(false)
    }
  }

  // Save Profile Phone Number
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }
      const res = await axios.put(`${API_BASE}/api/affiliate-portal/payout-settings`, { phone }, config)
      if (res.data?.success) {
        showSuccessToast('Contact phone updated successfully!')
        setProfileData((prev: any) => ({
          ...prev,
          phone
        }))
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to update phone')
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Save Notification Preferences
  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }
      const res = await axios.put(`${API_BASE}/api/affiliate-portal/payout-settings`, { notifications }, config)
      if (res.data?.success) {
        showSuccessToast('Notification preferences updated!')
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to save notifications')
    } finally {
      setIsSavingNotifications(false)
    }
  }

  // Change Password
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    if (!passwordData.currentPassword) {
      showErrorToast('Please enter your current password')
      return
    }
    if (passwordData.newPassword.length < 6) {
      showErrorToast('New password must be at least 6 characters')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast('New passwords do not match')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }
      const res = await axios.put(
        `${API_BASE}/api/auth/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        config
      )
      if (res.data?.success) {
        showSuccessToast('Portal password updated successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const referralCode = profileData?.referralCode || user?.affiliate?.referralCode || 'PARTNER'
  const referralLink = `${window.location.origin}/?ref=${referralCode}`
  const payoutType = profileData?.payoutType || user?.affiliate?.payoutType || 'percentage'
  const commissionRate = profileData?.commissionRate ?? user?.affiliate?.commissionRate ?? 10
  const fixedAmount = profileData?.fixedAmount ?? user?.affiliate?.fixedAmount ?? 0

  const hasConfiguredAccount = Boolean(
    (bankDetails.upiId && bankDetails.upiId.trim()) ||
    (bankDetails.accountNumber && bankDetails.accountNumber.trim())
  )

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showSuccessToast(`${label} copied to clipboard!`)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center font-mono">
        <div className="inline-flex items-center gap-2 p-3 bg-white border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#000]">
          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black uppercase text-slate-800">Loading Partner Settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-mono text-slate-900 max-w-5xl">
      
      {/* Top Banner Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded">
            PARTNER SETTINGS & CONTROLS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
            Account & Payout Settings
          </h1>
          <p className="text-xs text-slate-600 font-bold">
            Configure your permanent bank details, contact profile, and security preferences.
          </p>
        </div>

        {/* Quick Referral Tag */}
        <div className="flex items-center gap-2">
          <div className="p-2.5 bg-white border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000] flex items-center gap-2">
            <div>
              <span className="text-[9px] uppercase font-black text-slate-400 block leading-none">Your Partner Code</span>
              <span className="text-sm font-black text-slate-900 leading-none">{referralCode}</span>
            </div>
            <button
              onClick={() => copyToClipboard(referralCode, 'Partner code')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-900 rounded text-xs cursor-pointer font-bold"
              title="Copy Partner Code"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b-2 border-slate-900">
        <button
          onClick={() => setActiveTab('payout')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-2 border-b-0 border-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'payout'
              ? 'bg-[#86efac] text-slate-900 shadow-[2px_-2px_0px_0px_#000] translate-y-[2px]'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🏦</span>
          <span>Bank & UPI Details</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-2 border-b-0 border-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[#86efac] text-slate-900 shadow-[2px_-2px_0px_0px_#000] translate-y-[2px]'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>👤</span>
          <span>Partner Profile & ID</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-2 border-b-0 border-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-[#86efac] text-slate-900 shadow-[2px_-2px_0px_0px_#000] translate-y-[2px]'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🔔</span>
          <span>Alerts & Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg border-2 border-b-0 border-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#86efac] text-slate-900 shadow-[2px_-2px_0px_0px_#000] translate-y-[2px]'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🔒</span>
          <span>Security & Password</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BANK & UPI DETAILS (Permanent 1-time setup) */}
      {/* ============================================================== */}
      {activeTab === 'payout' && (
        <div className="space-y-5">
          {/* Status banner showing saved state */}
          {hasConfiguredAccount ? (
            <div className="p-4 bg-[#86efac] border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">✅</span>
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black uppercase tracking-wider text-sm">
                      Auto-Payout Destination Active
                    </span>
                    <span className="px-2 py-0.5 bg-slate-900 text-emerald-300 font-black text-[10px] rounded uppercase">
                      Ready for 1-Click Withdrawals
                    </span>
                  </div>
                  <p className="font-bold mt-1 leading-relaxed">
                    Aapki bank/UPI details saved hain. Ab jab bhi aap withdrawal request karenge, aapko bar-bar account number ya UPI daalne ki zaroorat nahi padegi!
                  </p>
                </div>
              </div>

              {/* Mini Preview Chip */}
              <div className="bg-white border-2 border-slate-900 rounded-lg p-2.5 text-slate-900 text-xs font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                <span className="text-[9px] uppercase font-bold text-slate-500 block">Default Destination:</span>
                {primaryMethod === 'upi' && bankDetails.upiId ? (
                  <div className="flex items-center gap-1.5 text-blue-700">
                    <span>⚡ UPI:</span>
                    <span>{bankDetails.upiId}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-800">
                    <span>🏦 {bankDetails.bankName || 'Bank'}:</span>
                    <span>••••{bankDetails.accountNumber.slice(-4)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#fef08a] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000] text-slate-900 flex items-start gap-3 text-xs">
              <span className="text-2xl leading-none">⚠️</span>
              <div>
                <span className="font-black uppercase tracking-wider block text-sm">
                  Koi Payout Account Saved Nahi Hai
                </span>
                <p className="font-bold mt-0.5">
                  Apna UPI ID ya Bank details niche ek baar fill karke save kar lijiye. Iske baad aap 1-click me turant withdraw kar sakenge!
                </p>
              </div>
            </div>
          )}

          {/* Bank Configuration Form */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#000] space-y-6">
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-slate-900 pb-1 border-b-2 border-slate-900 inline-block">
                Payout Destination Details
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-1">
                Choose whether you prefer instant UPI transfer or direct NEFT/RTGS bank deposit.
              </p>
            </div>

            {/* Payout Method Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setPrimaryMethod('upi')}
                className={`flex-1 p-3 rounded-lg border-2 border-slate-900 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  primaryMethod === 'upi'
                    ? 'bg-[#86efac] text-slate-950 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <div className="text-left">
                    <div>UPI Address (VPA)</div>
                    <span className="text-[10px] font-bold lowercase text-slate-600 block">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
                {primaryMethod === 'upi' && <span className="text-xs font-black">✓ Selected</span>}
              </button>

              <button
                type="button"
                onClick={() => setPrimaryMethod('bank')}
                className={`flex-1 p-3 rounded-lg border-2 border-slate-900 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  primaryMethod === 'bank'
                    ? 'bg-[#86efac] text-slate-950 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏦</span>
                  <div className="text-left">
                    <div>Bank Account Transfer</div>
                    <span className="text-[10px] font-bold lowercase text-slate-600 block">Direct NEFT / IMPS / RTGS</span>
                  </div>
                </div>
                {primaryMethod === 'bank' && <span className="text-xs font-black">✓ Selected</span>}
              </button>
            </div>

            <form onSubmit={handleSavePayout} className="space-y-4 text-xs">
              {/* UPI Section */}
              <div className={`p-4 rounded-xl border-2 border-slate-900 space-y-3 ${primaryMethod === 'upi' ? 'bg-[#f0fdf4]' : 'bg-slate-50 opacity-80'}`}>
                <div className="flex items-center justify-between">
                  <label className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span>⚡ UPI ID (Virtual Payment Address)</span>
                    {primaryMethod === 'upi' && <span className="text-emerald-700 font-bold">* Required</span>}
                  </label>
                  <span className="text-[10px] font-bold text-slate-500">Fastest Transfer</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={bankDetails.upiId}
                    onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                    className="w-full border-2 border-slate-900 rounded-md px-3.5 py-2.5 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    placeholder="e.g. mobile@paytm or name@okhdfcbank"
                  />
                </div>

                {/* Quick UPI Providers suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-1">
                  <span className="font-bold text-slate-500">Common handles:</span>
                  {['@okaxis', '@okhdfcbank', '@oksbi', '@paytm', '@ybl'].map((suf) => (
                    <button
                      key={suf}
                      type="button"
                      onClick={() => {
                        const base = bankDetails.upiId.split('@')[0]
                        if (base) setBankDetails({ ...bankDetails, upiId: `${base}${suf}` })
                      }}
                      className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-900 rounded font-bold cursor-pointer"
                    >
                      {suf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Bank Account Section */}
              <div className={`p-4 rounded-xl border-2 border-slate-900 space-y-4 ${primaryMethod === 'bank' ? 'bg-[#f0fdf4]' : 'bg-slate-50 opacity-80'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span>🏦 Bank Account Details</span>
                    {primaryMethod === 'bank' && <span className="text-emerald-700 font-bold">* Required</span>}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">NEFT / IMPS</span>
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
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                      placeholder="As per bank passbook / statement"
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
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                      placeholder="e.g. HDFC Bank, SBI, ICICI, Kotak"
                    />
                  </div>
                </div>

                {/* Account Number & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono"
                      placeholder="e.g. 50100456789012"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.confirmAccountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })}
                      className={`w-full border-2 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono ${
                        bankDetails.confirmAccountNumber && bankDetails.confirmAccountNumber !== bankDetails.accountNumber
                          ? 'border-rose-500 bg-rose-50'
                          : 'border-slate-900'
                      }`}
                      placeholder="Re-enter account number"
                    />
                  </div>
                </div>

                {/* IFSC & Account Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none font-mono uppercase"
                      placeholder="e.g. HDFC0001234"
                    />
                  </div>

                  <div>
                    <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                      Account Type
                    </label>
                    <select
                      value={bankDetails.accountType}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value as any })}
                      className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                    >
                      <option value="savings">Savings Account</option>
                      <option value="current">Current Account</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-bold">
                  🔒 Data is stored safely and used strictly for transferring your commissions.
                </span>

                <button
                  type="submit"
                  disabled={isSavingPayout}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] disabled:opacity-50 transition-all text-center cursor-pointer"
                >
                  {isSavingPayout ? 'Saving Details...' : '💾 Save Payout Account Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines Box */}
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_#000] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-black text-slate-900 uppercase block">🕒 24-48 Hours Policy</span>
              <p className="text-[11px] text-slate-600 font-bold">
                Payout requests are verified by our finance team and disbursed within 24 to 48 hours directly to your account.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-black text-slate-900 uppercase block">💰 ₹100 Min Withdrawal</span>
              <p className="text-[11px] text-slate-600 font-bold">
                You can withdraw any amount as soon as your available balance reaches ₹100 or above.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-black text-slate-900 uppercase block">🛡️ Zero Transfer Fee</span>
              <p className="text-[11px] text-slate-600 font-bold">
                Web n Code covers 100% of all banking and gateway disbursement fees. You receive your exact earned commission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PARTNER PROFILE & ID */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#000] space-y-6">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900 pb-1 border-b-2 border-slate-900 inline-block">
              Affiliate Identity & Contract Details
            </h2>

            {/* Profile Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Partner Full Name</span>
                <p className="font-black text-slate-900 text-sm mt-0.5">{profileData?.name || user?.name}</p>
              </div>

              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Registered Email</span>
                <p className="font-bold text-slate-800 text-xs mt-0.5 truncate">{profileData?.email || user?.email}</p>
              </div>

              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Reward Commission</span>
                <p className="font-black text-emerald-700 text-sm mt-0.5">
                  {payoutType === 'fixed' ? `₹${fixedAmount.toLocaleString('en-IN')} Flat / Deal` : `${commissionRate}% / Deal`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Partner Status</span>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-800 rounded font-black text-[10px]">
                  Active Verified
                </span>
              </div>
            </div>

            {/* Referral Links & Assets */}
            <div className="p-4 bg-[#f8fafc] border-2 border-slate-900 rounded-xl space-y-3">
              <span className="font-black uppercase tracking-wider text-xs text-slate-900 block">
                🔗 Your Personalized Referral Assets
              </span>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 border-2 border-slate-900 rounded-md px-3 py-2 font-mono text-xs bg-white text-slate-900 select-all"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(referralLink, 'Referral link')}
                  className="px-4 py-2 bg-slate-900 text-white border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800 transition-colors cursor-pointer text-center"
                >
                  Copy Link 📋
                </button>
              </div>
            </div>

            {/* Contact Phone Update Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t-2 border-slate-200">
              <span className="font-black uppercase tracking-wider text-xs text-slate-900 block">
                📱 Partner Phone / WhatsApp Number
              </span>

              <div className="max-w-md space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-slate-100 border-2 border-slate-900 rounded-md font-bold text-xs text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="flex-1 border-2 border-slate-900 rounded-md px-3 py-2 font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-4 py-2 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    {isSavingProfile ? 'Saving...' : 'Update Phone'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">
                  Our admin team contacts you on this number for lead updates and payout confirmations.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ALERTS & NOTIFICATIONS */}
      {/* ============================================================== */}
      {activeTab === 'notifications' && (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#000] space-y-6">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900 pb-1 border-b-2 border-slate-900 inline-block">
              Notification Preferences
            </h2>
            <p className="text-xs text-slate-600 font-bold mt-1">
              Control what alerts you receive at <span className="text-blue-700">{user?.email}</span>.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Deal Won Alert */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-lg flex items-center justify-between gap-4">
              <div>
                <span className="font-black text-slate-900 block uppercase">🎯 Deal Won & Commission Notification</span>
                <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                  Get notified instantly when one of your client leads signs up and commission is added to your balance.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notifications.emailOnDealWon}
                  onChange={(e) => setNotifications({ ...notifications, emailOnDealWon: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none border-2 border-slate-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-slate-900 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            {/* Payout Disbursed Alert */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-lg flex items-center justify-between gap-4">
              <div>
                <span className="font-black text-slate-900 block uppercase">💰 Payout Disbursed (With Bank UTR)</span>
                <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                  Receive transfer receipt email with bank transaction reference number once finance transfers money.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notifications.emailOnPayout}
                  onChange={(e) => setNotifications({ ...notifications, emailOnPayout: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none border-2 border-slate-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-slate-900 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            {/* Monthly Earnings Statement */}
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-lg flex items-center justify-between gap-4">
              <div>
                <span className="font-black text-slate-900 block uppercase">📊 Monthly Performance Summary</span>
                <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                  Receive a consolidated monthly report of all submitted leads, conversion ratios, and total earnings.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={notifications.monthlySummary}
                  onChange={(e) => setNotifications({ ...notifications, monthlySummary: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none border-2 border-slate-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-slate-900 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={isSavingNotifications}
                className="px-6 py-2.5 bg-[#86efac] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
              >
                {isSavingNotifications ? 'Saving...' : 'Save Notification Preferences'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SECURITY & PASSWORD */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_#000] space-y-6 max-w-2xl">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900 pb-1 border-b-2 border-slate-900 inline-block">
              Change Account Password
            </h2>
            <p className="text-xs text-slate-600 font-bold mt-1">
              Ensure your account is protected with a strong, secure password.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                New Password (Minimum 6 Characters) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full border-2 border-slate-900 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
                placeholder="Enter new strong password"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={`w-full border-2 rounded-md px-3 py-2 font-bold text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none ${
                  passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-slate-900'
                }`}
                placeholder="Re-enter new password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] hover:bg-slate-800 transition-all cursor-pointer"
              >
                {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
