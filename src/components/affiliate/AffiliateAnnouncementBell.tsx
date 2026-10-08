import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { API_BASE } from '../../pages/admin/types'

interface AnnouncementItem {
  _id: string
  title: string
  message: string
  type: 'general' | 'boost' | 'important' | 'offer'
  priority: 'normal' | 'high' | 'urgent'
  actionLink?: string
  author?: string
  createdAt: string
}

export default function AffiliateAnnouncementBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('affiliate_read_announcements') || '[]')
    } catch {
      return []
    }
  })

  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchAnnouncements = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/affiliate-announcements`)
      setAnnouncements(res.data.data || [])
    } catch (err) {
      console.error('Failed to load announcements:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
    const timer = setInterval(fetchAnnouncements, 60000)
    return () => clearInterval(timer)
  }, [])

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

  const unreadCount = announcements.filter((a) => !readIds.includes(a._id)).length

  const markAllRead = () => {
    const allIds = announcements.map((a) => a._id)
    setReadIds(allIds)
    localStorage.setItem('affiliate_read_announcements', JSON.stringify(allIds))
  }

  const markOneRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id]
      setReadIds(updated)
      localStorage.setItem('affiliate_read_announcements', JSON.stringify(updated))
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'boost':
        return { label: '⚡ Boost', color: 'bg-emerald-200 text-emerald-950 border-emerald-600' }
      case 'offer':
        return { label: '🎉 Offer', color: 'bg-yellow-200 text-yellow-950 border-yellow-600' }
      case 'important':
        return { label: '⚠️ Urgent', color: 'bg-rose-200 text-rose-950 border-rose-600' }
      default:
        return { label: '📌 Notice', color: 'bg-blue-100 text-blue-950 border-blue-600' }
    }
  }

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchAnnouncements()
        }}
        title="Partner Notifications & Announcements"
        className="relative p-2 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg text-sm font-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] transition cursor-pointer flex items-center justify-center shrink-0"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff9e7d] text-[10px] font-black border-2 border-slate-900 flex items-center justify-center text-slate-950 shadow-[1px_1px_0px_0px_#000] animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border-2 border-slate-900 rounded-xl shadow-[6px_6px_0px_0px_#000] z-50 overflow-hidden text-slate-900 animate-fadeIn">
          {/* Header */}
          <div className="p-3 bg-slate-100 border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔔</span>
              <div>
                <h3 className="font-black text-xs uppercase tracking-tight text-slate-900">
                  Notifications & Notices
                </h3>
                <span className="text-[9.5px] font-bold text-slate-500">
                  {unreadCount} Unread • {announcements.length} Total
                </span>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-2 py-0.5 bg-white border border-slate-900 rounded text-[9.5px] font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                Mark Read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
            {isLoading && announcements.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-bold">
                Checking for announcements...
              </div>
            ) : announcements.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-bold">
                No active announcements right now.
              </div>
            ) : (
              announcements.map((a) => {
                const isRead = readIds.includes(a._id)
                const badge = getTypeBadge(a.type)

                return (
                  <div
                    key={a._id}
                    onClick={() => markOneRead(a._id)}
                    className={`p-3 hover:bg-amber-50/60 transition flex flex-col gap-1.5 ${
                      !isRead ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[9.5px] text-slate-400 font-medium">
                        {new Date(a.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug">
                      {a.title}
                    </h4>

                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                      {a.message}
                    </p>

                    {a.actionLink && (
                      <a
                        href={a.actionLink}
                        target={a.actionLink.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 hover:underline mt-0.5"
                      >
                        <span>Learn More / Claim</span>
                        <span>→</span>
                      </a>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
