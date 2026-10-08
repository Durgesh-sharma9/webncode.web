import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../../pages/admin/types'

interface AnnouncementItem {
  _id: string
  title: string
  message: string
  type: 'general' | 'boost' | 'important' | 'offer'
  priority: 'normal' | 'high' | 'urgent'
  actionLink?: string
}

export default function AffiliateAnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('dismissed_aff_announcements') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/affiliate-announcements`)
        setAnnouncements(res.data.data || [])
      } catch (err) {
        console.error('Failed to load announcements for banner:', err)
      }
    }
    fetchAnnouncements()
  }, [])

  const activeAnnouncements = announcements.filter((a) => !dismissedIds.includes(a._id))
  if (activeAnnouncements.length === 0) return null

  const latest = activeAnnouncements[0]

  const dismiss = (id: string) => {
    const next = [...dismissedIds, id]
    setDismissedIds(next)
    sessionStorage.setItem('dismissed_aff_announcements', JSON.stringify(next))
  }

  const isBoost = latest.type === 'boost' || latest.type === 'offer'
  const isUrgent = latest.priority === 'urgent' || latest.type === 'important'

  return (
    <div
      className={`border-2 border-slate-900 rounded-xl p-3 sm:p-3.5 shadow-[3px_3px_0px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-mono ${
        isUrgent
          ? 'bg-rose-100 text-rose-950'
          : isBoost
          ? 'bg-[#fde047] text-slate-950'
          : 'bg-[#86efac]/50 text-slate-950'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className="p-1 bg-white border border-slate-900 rounded text-sm shadow-[1px_1px_0px_0px_#000] shrink-0 mt-0.5">
          {isBoost ? '⚡' : isUrgent ? '⚠️' : '📢'}
        </span>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-white border border-slate-900 rounded">
              Management Notice
            </span>
            <h4 className="text-xs sm:text-sm font-black tracking-tight text-slate-950">
              {latest.title}
            </h4>
          </div>
          <p className="text-[11px] font-medium text-slate-800 mt-1 leading-snug">
            {latest.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {latest.actionLink && (
          <a
            href={latest.actionLink}
            target={latest.actionLink.startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000] hover:translate-y-[1px] transition"
          >
            Claim / Details →
          </a>
        )}
        <button
          onClick={() => dismiss(latest._id)}
          title="Dismiss Notice"
          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-900 rounded text-[10px] font-bold transition cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
