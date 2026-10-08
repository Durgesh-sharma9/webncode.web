import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE } from './types'
import { showErrorToast, showSuccessToast } from '../../components/ui/Toast'

interface LogActor {
  name: string
  role: string
  email?: string
  id?: string
}

interface ActivityLogItem {
  _id: string
  type: string
  category: 'leads' | 'financial' | 'partners' | 'broadcast' | 'careers' | 'system'
  title: string
  description: string
  actor: LogActor
  entityId?: string
  entityType?: string
  metadata?: Record<string, any>
  createdAt: string
}

interface LogCounts {
  total: number
  leads: number
  financial: number
  partners: number
  broadcast: number
  careers: number
  uniqueActors: number
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  DEAL_WON: {
    label: 'DEAL WON',
    icon: '🎉',
    bg: 'bg-emerald-100',
    text: 'text-emerald-950',
    border: 'border-emerald-600'
  },
  PURCHASE_REPORTED: {
    label: 'REPORTED',
    icon: '⏳',
    bg: 'bg-amber-100',
    text: 'text-amber-950',
    border: 'border-amber-600'
  },
  LEAD_SUBMITTED: {
    label: 'LEAD LOGGED',
    icon: '📬',
    bg: 'bg-blue-100',
    text: 'text-blue-950',
    border: 'border-blue-500'
  },
  LEAD_LOST: {
    label: 'CANCELLED',
    icon: '❌',
    bg: 'bg-rose-100',
    text: 'text-rose-950',
    border: 'border-rose-500'
  },
  WITHDRAWAL_REQUEST: {
    label: 'WITHDRAWAL REQ',
    icon: '🏦',
    bg: 'bg-orange-100',
    text: 'text-orange-950',
    border: 'border-orange-500'
  },
  PAYOUT_TRANSFERRED: {
    label: 'PAYOUT PAID',
    icon: '💸',
    bg: 'bg-emerald-200',
    text: 'text-emerald-950',
    border: 'border-emerald-700'
  },
  PARTNER_ONBOARDED: {
    label: 'NEW PARTNER',
    icon: '🤝',
    bg: 'bg-yellow-100',
    text: 'text-yellow-950',
    border: 'border-yellow-600'
  },
  BROADCAST_SENT: {
    label: 'BROADCAST',
    icon: '📢',
    bg: 'bg-purple-100',
    text: 'text-purple-950',
    border: 'border-purple-600'
  },
  JOB_APPLICATION: {
    label: 'APPLICANT',
    icon: '💼',
    bg: 'bg-indigo-100',
    text: 'text-indigo-950',
    border: 'border-indigo-500'
  },
  CONTACT_INQUIRY: {
    label: 'INQUIRY',
    icon: '📩',
    bg: 'bg-sky-100',
    text: 'text-sky-950',
    border: 'border-sky-500'
  },
  GLOBAL_SETTING: {
    label: 'SYSTEM SETTING',
    icon: '⚙️',
    bg: 'bg-slate-200',
    text: 'text-slate-900',
    border: 'border-slate-600'
  }
}

export default function LogsHistoryTab() {
  const { token } = useAuth()
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [counts, setCounts] = useState<LogCounts>({
    total: 0,
    leads: 0,
    financial: 0,
    partners: 0,
    broadcast: 0,
    careers: 0,
    uniqueActors: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')

  // Selected Log for details modal
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('wnc_token')
    return activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
  }

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/logs`, {
        headers: getAuthHeaders(),
        params: {
          category: categoryFilter,
          actorRole: roleFilter,
          timeRange: timeRangeFilter,
          search: searchQuery,
          limit: 300
        }
      })

      if (res.data?.success) {
        setLogs(res.data.data || [])
        if (res.data.counts) {
          setCounts(res.data.counts)
        }
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err)
      showErrorToast('Failed to load activity logs from server.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [categoryFilter, roleFilter, timeRangeFilter])

  // Debounced live search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs()
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Export logs to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      showErrorToast('No logs to export')
      return
    }

    const headers = [
      'Timestamp',
      'Event Type',
      'Category',
      'Title',
      'Description',
      'Actor Name',
      'Actor Role',
      'Entity ID'
    ]

    const rows = logs.map((l) => [
      `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      `"${l.type}"`,
      `"${l.category}"`,
      `"${(l.title || '').replace(/"/g, '""')}"`,
      `"${(l.description || '').replace(/"/g, '""')}"`,
      `"${(l.actor?.name || 'System').replace(/"/g, '""')}"`,
      `"${l.actor?.role || 'system'}"`,
      `"${l.entityId || ''}"`
    ])

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute(
      'download',
      `wnc_system_logs_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showSuccessToast('System activity logs exported successfully!')
  }

  // Format relative time helper
  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="space-y-4 sm:space-y-5 font-mono text-slate-900 animate-fadeIn">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded shadow-[1px_1px_0px_0px_#000]">
              AUDIT & LOG HISTORY
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Feed</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>📜 System Activity & Log History</span>
          </h1>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            Realtime audit log tracking all partner actions, client leads, deal closures, payouts, and broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border-2 border-slate-900 rounded-md overflow-hidden shadow-[2px_2px_0px_0px_#000] bg-white">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 text-xs font-black uppercase transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'timeline' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Timeline Feed View"
            >
              <span>⏱️</span>
              <span className="hidden sm:inline">Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-black uppercase transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Structured Table View"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-2 bg-white border-2 border-slate-900 rounded-md font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            title="Refresh Logs"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#7dd3fc] border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        {/* Total Events */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500">Total Events</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{counts.total}</span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">
              Across All Modules
            </span>
          </div>
        </div>

        {/* Lead & Deals Events */}
        <div className="bg-[#eff6ff] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-blue-700">Leads & Deals</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-blue-900">{counts.leads}</span>
            <span className="block text-[9px] font-bold text-blue-600 uppercase mt-0.5">
              Pitched & Won
            </span>
          </div>
        </div>

        {/* Financial & Payout Events */}
        <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-emerald-700">Payouts & Wallet</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-900">{counts.financial}</span>
            <span className="block text-[9px] font-bold text-emerald-600 uppercase mt-0.5">
              Redemptions
            </span>
          </div>
        </div>

        {/* Partners Events */}
        <div className="bg-[#fef9c3] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-amber-800">Partner Actions</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-900">{counts.partners}</span>
            <span className="block text-[9px] font-bold text-amber-700 uppercase mt-0.5">
              Onboardings
            </span>
          </div>
        </div>

        {/* Broadcasts & Alerts */}
        <div className="bg-[#faf5ff] border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-purple-700">Broadcasts</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-purple-900">{counts.broadcast}</span>
            <span className="block text-[9px] font-bold text-purple-600 uppercase mt-0.5">
              Alerts Dispatched
            </span>
          </div>
        </div>

        {/* Active Actors */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-3 shadow-[2px_2px_0px_0px_#000] flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500">Active Actors</span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{counts.uniqueActors}</span>
            <span className="block text-[9px] font-bold text-slate-500 uppercase mt-0.5">
              Distinct Entities
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls Toolbar */}
      <div className="bg-white border-2 border-slate-900 rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000] space-y-3">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500 mr-1">Category:</span>
            {[
              { id: 'all', label: 'All Events', count: counts.total },
              { id: 'leads', label: 'Leads & Deals', count: counts.leads },
              { id: 'financial', label: 'Financial / Payouts', count: counts.financial },
              { id: 'partners', label: 'Partners', count: counts.partners },
              { id: 'broadcast', label: 'Broadcasts', count: counts.broadcast },
              { id: 'careers', label: 'Careers & Inquiries', count: counts.careers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-black transition cursor-pointer flex items-center gap-1.5 border ${
                  categoryFilter === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[1px_1px_0px_0px_#000]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${
                    categoryFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {(categoryFilter !== 'all' || roleFilter !== 'all' || timeRangeFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('all')
                setRoleFilter('all')
                setTimeRangeFilter('all')
                setSearchQuery('')
              }}
              className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded hover:bg-rose-100 transition cursor-pointer"
            >
              Reset All Filters ✕
            </button>
          )}
        </div>

        {/* Secondary Filters: Role, Time, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title, actor, school, reference..."
              className="w-full bg-[#f8fafc] border-2 border-slate-900 rounded-md pl-7 pr-6 py-1.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Actor Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Actor Roles (Admin, Partners, Clients)</option>
            <option value="admin">Super Admin Only</option>
            <option value="affiliate">Affiliate Partners Only</option>
            <option value="client">Public Visitors & Clients</option>
            <option value="system">System Automated</option>
          </select>

          {/* Time Range Filter */}
          <select
            value={timeRangeFilter}
            onChange={(e) => setTimeRangeFilter(e.target.value)}
            className="bg-[#f8fafc] border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">Time Range: All Recorded Time</option>
            <option value="today">Today Only</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* 4. Activity Logs Presentation (Timeline Feed or Table View) */}
      {isLoading ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-12 text-center shadow-[4px_4px_0px_0px_#000]">
          <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-black uppercase text-slate-700">Loading system activity audit trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-12 text-center shadow-[4px_4px_0px_0px_#000] space-y-2">
          <span className="text-3xl block">📭</span>
          <h3 className="text-base font-black uppercase text-slate-900">No Logs Found</h3>
          <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
            No system events matched the active filters. Try resetting the search or category filters.
          </p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* ================= TIMELINE FEED VIEW ================= */
        <div className="space-y-2.5">
          {logs.map((log) => {
            const cfg = TYPE_CONFIG[log.type] || {
              label: log.type,
              icon: '📌',
              bg: 'bg-slate-100',
              text: 'text-slate-900',
              border: 'border-slate-400'
            }

            return (
              <div
                key={log._id}
                onClick={() => setSelectedLog(log)}
                className="bg-white hover:bg-slate-50 border-2 border-slate-900 rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] transition cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Icon Badge */}
                  <div
                    className={`w-9 h-9 shrink-0 rounded-lg border-2 border-slate-900 flex items-center justify-center text-base shadow-[1px_1px_0px_0px_#000] ${cfg.bg}`}
                  >
                    <span>{cfg.icon}</span>
                  </div>

                  {/* Log Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[9.5px] font-black uppercase px-2 py-0.2 rounded border ${cfg.border} ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {log.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 font-bold line-clamp-2">
                      {log.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold">
                      <span className="px-1.5 py-0.2 bg-slate-100 border border-slate-300 rounded text-slate-700">
                        👤 Actor: <strong className="text-slate-900">{log.actor?.name || 'System'}</strong> ({log.actor?.role || 'system'})
                      </span>

                      {log.metadata?.dealValue ? (
                        <span className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-black">
                          Deal: ₹{log.metadata.dealValue.toLocaleString('en-IN')}
                        </span>
                      ) : null}

                      {log.metadata?.commissionAmount ? (
                        <span className="px-1.5 py-0.2 bg-amber-50 border border-amber-300 rounded text-amber-900 font-black">
                          Comm: ₹{log.metadata.commissionAmount.toLocaleString('en-IN')}
                        </span>
                      ) : null}

                      {log.metadata?.amount ? (
                        <span className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 font-black">
                          Amount: ₹{log.metadata.amount.toLocaleString('en-IN')}
                        </span>
                      ) : null}

                      {log.metadata?.city ? (
                        <span className="px-1.5 py-0.2 bg-sky-50 border border-sky-300 rounded text-sky-800">
                          📍 {log.metadata.city}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp */}
                <div className="sm:text-right shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between">
                  <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {formatTimeAgo(log.createdAt)}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-bold mt-0.5">
                    {new Date(log.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ================= STRUCTURED TABLE VIEW ================= */
        <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider border-b-2 border-slate-900">
                  <th className="p-3">Type</th>
                  <th className="p-3">Event Title & Summary</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Timestamp</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => {
                  const cfg = TYPE_CONFIG[log.type] || {
                    label: log.type,
                    icon: '📌',
                    bg: 'bg-slate-100',
                    text: 'text-slate-900',
                    border: 'border-slate-400'
                  }

                  return (
                    <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-black uppercase border ${cfg.border} ${cfg.bg} ${cfg.text}`}
                        >
                          <span>{cfg.icon}</span>
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      <td className="p-3 max-w-md">
                        <div className="font-black text-slate-900 text-xs">{log.title}</div>
                        <div className="text-[10px] text-slate-500 font-bold line-clamp-1 mt-0.5">
                          {log.description}
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-xs">{log.actor?.name || 'System'}</div>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {log.actor?.role}
                        </span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded">
                          {log.category}
                        </span>
                      </td>

                      <td className="p-3 text-right whitespace-nowrap font-mono text-[10px] text-slate-600 font-bold">
                        <div>{new Date(log.createdAt).toLocaleDateString('en-IN')}</div>
                        <div className="text-[9px] text-slate-400">
                          {new Date(log.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-0.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-900 rounded text-[9.5px] font-black uppercase transition cursor-pointer"
                        >
                          Details
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

      {/* 5. Event Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs font-mono">
          <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 border border-slate-900 rounded">
                  {selectedLog.type} • {selectedLog.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {selectedLog.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-900 rounded flex items-center justify-center font-black text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Description:</span>
                <p className="text-slate-800 font-bold mt-0.5 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {selectedLog.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[9.5px] font-black uppercase text-slate-400 block">Actor:</span>
                  <span className="font-black text-slate-900 block">{selectedLog.actor?.name || 'System'}</span>
                  <span className="text-[9.5px] text-slate-500 font-mono">Role: {selectedLog.actor?.role}</span>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[9.5px] font-black uppercase text-slate-400 block">Timestamp:</span>
                  <span className="font-bold text-slate-800 block">
                    {new Date(selectedLog.createdAt).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-mono">
                    {formatTimeAgo(selectedLog.createdAt)}
                  </span>
                </div>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                    Event Metadata:
                  </span>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[10.5px] font-mono overflow-x-auto max-h-40">
                    <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded font-black text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
