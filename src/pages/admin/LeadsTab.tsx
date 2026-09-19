import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type ContactItem, API_BASE } from './types'

export default function LeadsTab() {
  const { token } = useAuth()
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [contactSearch, setContactSearch] = useState('')

  const fetchContacts = async () => {
    try {
      setIsLoadingContacts(true)
      const res = await axios.get(`${API_BASE}/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success && Array.isArray(res.data.contacts)) {
        setContacts(res.data.contacts)
      }
    } catch (err: any) {
      console.error('Failed to load contacts:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch contact inquiries')
    } finally {
      setIsLoadingContacts(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchContacts()
    }
  }, [token])

  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"?`)) return
    try {
      const res = await axios.delete(`${API_BASE}/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Enquiry deleted successfully')
        setContacts((prev) => prev.filter((c) => c._id !== id))
      }
    } catch (err: any) {
      console.error('Error deleting contact:', err)
      showErrorToast('Failed to delete enquiry')
    }
  }

  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '')
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber
    const msg = encodeURIComponent(
      `Hi ${name}, this is Web n Code Technologies regarding your submission on our website.`
    )
    return `https://wa.me/${fullNumber}?text=${msg}`
  }

  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-4 font-mono">
      {/* Top Banner Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <span className="px-2.5 py-0.5 bg-[#ff9e7d] border-2 border-slate-900 rounded text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
            INQUIRIES & LEADS
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 mt-1">
            Client Enquiries ({contacts.length})
          </h2>
          <p className="text-xs text-slate-600 font-bold">
            Real-time messages sent by prospective clients from the website contact page
          </p>
        </div>

        <button
          onClick={fetchContacts}
          disabled={isLoadingContacts}
          className="self-start sm:self-auto px-3.5 py-2 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <span>🔄</span>
          <span>{isLoadingContacts ? 'Refreshing...' : 'Refresh Leads'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
        <div className="relative flex-1">
          <input
            type="text"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            placeholder="Search leads by name, email, phone, requirements..."
            className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          {contactSearch && (
            <button
              onClick={() => setContactSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="text-[11px] font-bold text-slate-500 self-end sm:self-center">
          Showing {filteredContacts.length} of {contacts.length}
        </div>
      </div>

      {/* Leads List */}
      {isLoadingContacts ? (
        <div className="py-14 text-center text-slate-600 text-xs font-bold">
          Fetching latest inquiries...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="text-3xl mb-2">📬</div>
          <h3 className="text-sm font-black text-slate-900 uppercase">No Enquiries Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
            {contactSearch
              ? 'No enquiries match your search query.'
              : 'When visitors fill out the Contact form on your website, leads will appear here immediately!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredContacts.map((item) => (
            <div
              key={item._id}
              className="bg-white border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
            >
              {/* Header Row: Avatar, Name, Date, Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-900/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#ff9e7d] text-slate-900 font-black flex items-center justify-center text-xs shrink-0 border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {new Date(item.createdAt).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700 mt-0.5">
                      <span className="font-bold">📧 {item.email}</span>
                      {item.phone && (
                        <>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold">📱 {item.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Communication Actions */}
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center">
                  {item.phone && (
                    <a
                      href={getWhatsAppLink(item.phone, item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 text-[11px] font-black uppercase rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  )}

                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                    >
                      <span>📞 Call</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${item.email}?subject=Web%20n%20Code%20Technologies%20-%20Enquiry%20Response`}
                    className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                  >
                    <span>✉️ Email</span>
                  </a>

                  <button
                    onClick={() => handleDeleteContact(item._id, item.name)}
                    className="px-2 py-1 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                    title="Delete Lead"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Message Box */}
              <div className="mt-2.5 p-2.5 bg-[#fefce8] border border-slate-900/50 rounded-lg">
                <div className="text-[10px] uppercase font-black tracking-wider text-amber-800 mb-0.5">
                  Requirements / Message:
                </div>
                <p className="text-xs text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
