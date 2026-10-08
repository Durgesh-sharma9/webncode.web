import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { API_BASE } from '../../pages/admin/types'
import BroadcastAnnouncementModal from './BroadcastAnnouncementModal'

interface NotificationItem {
  id: string
  type: 'deal_bought' | 'new_lead' | 'payout_request' | 'career_application' | 'partner_registration'
  category: 'Leads & Deals' | 'Careers'
  title: string
  description: string
  meta?: string
  link: string
  priority: 'normal' | 'urgent'
  badge: string
  badgeColor: string
  timestamp: string
  rawId: string
}

interface NotificationResponse {
  totalCount: number
  urgentCount: number
  boughtCount: number
  newLeadsCount: number
  notifications: NotificationItem[]
}

export default function AdminNotificationBell() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<NotificationResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'careers'>('all')
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_read_notif_ids') || '[]')
    } catch {
      return []
    }
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const res = await axios.get<NotificationResponse>(`${API_BASE}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Periodic refresh every 45 seconds for real-time mission control
    const timer = setInterval(fetchNotifications, 45000)
    return () => clearInterval(timer)
  }, [token])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const notifications = data?.notifications || []
  const unreadNotifications = notifications.filter((n) => !readIds.includes(n.id))
  const unreadCount = unreadNotifications.length
  const hasUrgent = unreadNotifications.some((n) => n.priority === 'urgent')

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id)
    setReadIds(allIds)
    localStorage.setItem('admin_read_notif_ids', JSON.stringify(allIds))
  }

  const markItemRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id]
      setReadIds(updated)
      localStorage.setItem('admin_read_notif_ids', JSON.stringify(updated))
    }
  }

  const handleNotificationClick = (item: NotificationItem) => {
    markItemRead(item.id)
    setIsOpen(false)
    navigate(item.link)
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'deals') return n.category === 'Leads & Deals'
    if (activeTab === 'careers') return n.category === 'Careers'
    return true
  })

  const formatTime = (ts: string) => {
    try {
      const diffMs = Date.now() - new Date(ts).getTime()
      const diffMins = Math.floor(diffMs / (60 * 1000))
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours}h ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    } catch {
      return 'Recent'
    }
  }

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      {/* Navbar Notification Bell Trigger */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        title="Mission Control Notifications & Alerts"
        className="relative p-2 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg text-sm font-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[1px_1px_0px_0px_#000] animate-bounce ${
              hasUrgent ? 'bg-[#ff9e7d]' : 'bg-[#86efac]'
            }`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-slate-900 rounded-xl shadow-[6px_6px_0px_0px_#000] z-50 overflow-hidden text-slate-900 animate-fadeIn">
          
          {/* Header */}
          <div className="p-3 bg-slate-100 border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔔</span>
              <div>
                <h3 className="font-black text-xs uppercase tracking-tight text-slate-900">
                  Mission Alerts
                </h3>
                <span className="text-[9.5px] font-bold text-slate-500">
                  {unreadCount} Unread • {notifications.length} Total
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="px-2 py-0.5 bg-white border border-slate-900 rounded text-[9.5px] font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={fetchNotifications}
                title="Refresh Notifications"
                className="p-1 bg-white border border-slate-900 rounded text-[10px] hover:bg-slate-200 transition cursor-pointer"
              >
                🔄
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 divide-x border-b border-slate-200 bg-slate-50 text-[10px] font-bold py-1 px-2">
            <div className="flex items-center justify-center gap-1 text-emerald-800">
              <span>🎉</span>
              <span>{data?.boughtCount ?? 0} Purchases Reported</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-blue-800">
              <span>🎯</span>
              <span>{data?.newLeadsCount ?? 0} Client Leads</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b-2 border-slate-900 bg-white text-[10px] font-black uppercase">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'deals', label: 'Leads & Deals', count: notifications.filter((n) => n.category === 'Leads & Deals').length },
              { id: 'careers', label: 'Careers', count: notifications.filter((n) => n.category === 'Careers').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-1.5 text-center transition cursor-pointer border-r border-slate-200 last:border-r-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
            {isLoading && notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-bold">
                Checking for updates...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-bold">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isRead = readIds.includes(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-2.5 sm:p-3 hover:bg-amber-50/70 transition-all cursor-pointer flex items-start gap-2.5 ${
                      !isRead ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Status Dot */}
                    <div className="mt-1 shrink-0">
                      {!isRead ? (
                        <span className="w-2 h-2 rounded-full bg-blue-600 block shadow-xs" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300 block" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded border border-slate-900 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-slate-900 truncate mt-1">
                        {item.title}
                      </h4>
                      <p className="text-[10.5px] text-slate-600 font-medium line-clamp-2 leading-snug mt-0.5">
                        {item.description}
                      </p>

                      {item.meta && (
                        <div className="text-[9.5px] font-bold text-slate-700 mt-1">
                          {item.meta}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Bottom Broadcast Bar */}
          <div className="p-2.5 bg-slate-100 border-t-2 border-slate-900 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setIsOpen(false)
                setIsBroadcastOpen(true)
              }}
              className="w-full py-1.5 px-3 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 rounded-lg text-[10.5px] font-black uppercase tracking-wider text-slate-950 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📢</span>
              <span>Broadcast Announcement to Affiliates</span>
            </button>
          </div>

        </div>
      )}

      {/* Broadcast Announcement Modal */}
      <BroadcastAnnouncementModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        token={token}
      />
    </div>
  )
}
