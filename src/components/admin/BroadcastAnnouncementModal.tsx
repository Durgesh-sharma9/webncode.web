import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { API_BASE } from '../../pages/admin/types'
import { showSuccessToast, showErrorToast } from '../ui/Toast'

interface BroadcastAnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  token: string | null
  onAnnouncementCreated?: () => void
}

export default function BroadcastAnnouncementModal({
  isOpen,
  onClose,
  token,
  onAnnouncementCreated
}: BroadcastAnnouncementModalProps) {
  if (!isOpen) return null

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'general' | 'boost' | 'important' | 'offer'>('boost')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('high')
  const [actionLink, setActionLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      showErrorToast('Title and message are required')
      return
    }

    setIsSubmitting(true)
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      }

      await axios.post(
        `${API_BASE}/api/affiliate-announcements`,
        {
          title: title.trim(),
          message: message.trim(),
          type,
          priority,
          actionLink: actionLink.trim()
        },
        config
      )

      showSuccessToast('📢 Announcement broadcasted to all affiliate partners successfully!')
      setTitle('')
      setMessage('')
      setActionLink('')
      if (onAnnouncementCreated) onAnnouncementCreated()
      onClose()
    } catch (err: any) {
      console.error('Broadcast announcement error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to broadcast announcement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#fde047] border-2 border-slate-900 rounded-lg text-base shadow-[2px_2px_0px_0px_#000]">
              📢
            </span>
            <div>
              <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">
                Broadcast to Affiliates
              </h2>
              <p className="text-[11px] text-slate-500 font-bold">
                Publish a live announcement to all active partners.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-full font-black text-xs shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold text-slate-800">
          
          {/* Announcement Type Selector */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
              Announcement Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'boost', label: '⚡ Boost', desc: 'Bonus' },
                { id: 'offer', label: '🎉 Offer', desc: 'Campaign' },
                { id: 'important', label: '⚠️ Urgent', desc: 'Critical' },
                { id: 'general', label: '📌 Notice', desc: 'General' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`py-1.5 px-2 rounded-lg border-2 text-[10.5px] font-black uppercase transition-all cursor-pointer flex flex-col items-center ${
                    type === t.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className="text-[8.5px] opacity-75">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-1">
              Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festival Incentive: +5% Extra Commission on School ERP Pro!"
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 text-xs font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-1">
              Announcement Details *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain the update, commission booster, or new product brochure released for affiliates..."
              className="w-full border-2 border-slate-900 rounded-md px-3 py-2 text-xs font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
            />
          </div>

          {/* Optional Action Link & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-1">
                Call to Action Link (Optional)
              </label>
              <input
                type="text"
                value={actionLink}
                onChange={(e) => setActionLink(e.target.value)}
                placeholder="e.g. /affiliate/leads or https://..."
                className="w-full border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-slate-900 shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-1">
                Priority Badge
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full border-2 border-slate-900 rounded-md px-2.5 py-1.5 text-[11px] font-black text-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] focus:outline-none"
              >
                <option value="normal">Normal Priority</option>
                <option value="high">High Visibility</option>
                <option value="urgent">Urgent / Attention</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-slate-900 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-white border-2 border-slate-900 rounded-md font-bold uppercase text-[11px] hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 rounded-md font-black uppercase text-[11px] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? 'Publishing...' : '📢 Broadcast Announcement'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
