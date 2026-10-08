import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { usePortalTheme } from '../../contexts/PortalThemeContext'
import LogsHistoryTab from './LogsHistoryTab'
import { showSuccessToast } from '../../components/ui/Toast'

export default function AdminSettingsTab() {
  const { user } = useAuth()
  const { theme, setTheme } = usePortalTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialTab = searchParams.get('tab') || 'logs'
  const [activeTab, setActiveTab] = useState<'logs' | 'general' | 'profile'>(
    initialTab === 'general' ? 'general' : initialTab === 'profile' ? 'profile' : 'logs'
  )

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && (tabParam === 'logs' || tabParam === 'general' || tabParam === 'profile')) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const handleTabChange = (tab: 'logs' | 'general' | 'profile') => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  return (
    <div className="space-y-5 font-mono text-slate-900 animate-fadeIn">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fde047] border border-slate-900 rounded shadow-[1px_1px_0px_0px_#000]">
              MISSION CONTROL SETTINGS
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded">
              Super Admin Access
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>⚙️ Super Admin Settings & Controls</span>
          </h1>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            System audit logs, platform configurations, and administrative profile controls.
          </p>
        </div>
      </div>

      {/* 2. Top Settings Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b-2 border-slate-900 gap-1.5 sm:gap-2 pb-[1px]">
        <button
          onClick={() => handleTabChange('logs')}
          className={`shrink-0 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-[#86efac] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>📜</span>
          <span>Activity & Log History</span>
        </button>

        <button
          onClick={() => handleTabChange('general')}
          className={`shrink-0 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-[#fde047] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>🛠️</span>
          <span>Platform Config</span>
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`shrink-0 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-2 border-b-0 border-slate-900 rounded-t-lg transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#7dd3fc] text-slate-950 shadow-[2px_2px_0px_0px_#000]'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>🛡️</span>
          <span>Admin Profile & Security</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: ACTIVITY & LOG HISTORY */}
      {activeTab === 'logs' && (
        <div className="animate-fadeIn">
          <LogsHistoryTab />
        </div>
      )}

      {/* TAB 2: PLATFORM CONFIGURATION */}
      {activeTab === 'general' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
            <div className="border-b-2 border-slate-900 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm uppercase text-slate-900 flex items-center gap-1.5">
                  <span>🏢</span>
                  <span>Core Platform Preferences</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-bold">
                  System defaults for partners, deals, and automated notifications.
                </p>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 border border-slate-900 rounded text-emerald-950">
                System Healthy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Platform Name</span>
                <p className="font-black text-slate-900 text-sm">Web n Code Technologies</p>
                <span className="text-[10px] text-slate-400">Enterprise Web, App & School Systems</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Default Partner Commission</span>
                <p className="font-black text-emerald-700 text-sm">10% per Closed Project</p>
                <span className="text-[10px] text-slate-400">Configurable per affiliate profile</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Payout Settlement SLA</span>
                <p className="font-black text-amber-700 text-sm">24 to 48 Hours</p>
                <span className="text-[10px] text-slate-400">Standard bank/UPI clearance cycle</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Operational Currency</span>
                <p className="font-black text-slate-900 text-sm">Indian Rupee (INR - ₹)</p>
                <span className="text-[10px] text-slate-400">Domestic Indian payment rails</span>
              </div>
            </div>

            {/* Portal Theme Preferences */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-500 block mb-2">
                Admin Portal Visual Theme:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'light', label: '☀️ Neo-Brutalist Light', bg: 'bg-white text-slate-900' },
                  { id: 'dark', label: '🌙 Midnight Dark', bg: 'bg-slate-900 text-white' },
                  { id: 'emerald', label: '🟢 Emerald Neo', bg: 'bg-emerald-950 text-emerald-100' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id as any)
                      showSuccessToast(`Portal theme switched to ${th.label}`)
                    }}
                    className={`px-3 py-1.5 rounded-lg border-2 border-slate-900 text-xs font-black shadow-[2px_2px_0px_0px_#000] cursor-pointer transition flex items-center gap-1.5 ${
                      theme === th.id ? 'ring-2 ring-blue-500 scale-105 ' + th.bg : 'bg-slate-100 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{th.label}</span>
                    {theme === th.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white border-2 border-slate-900 rounded-xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] space-y-4 max-w-2xl">
            <div className="border-b-2 border-slate-900 pb-2">
              <h3 className="font-black text-sm uppercase text-slate-900 flex items-center gap-1.5">
                <span>🛡️</span>
                <span>Super Administrator Credentials</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-bold">
                Account identity and active authentication state.
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Administrator Name</span>
                <p className="font-black text-slate-900 text-base">{user?.name || 'Super Admin'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Login Email</span>
                <p className="font-black text-slate-900 text-base">{user?.email || 'admin@webncode.in'}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Assigned Privilege Role</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded font-black text-xs uppercase text-slate-950">
                    SUPERADMIN
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">Unrestricted Access</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border-2 border-slate-900 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Session Security</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-700">JWT Token Authenticated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
