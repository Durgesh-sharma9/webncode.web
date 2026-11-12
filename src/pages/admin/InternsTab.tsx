import { useState, useEffect } from 'react'
import axios from 'axios'
import { type InternItem, API_BASE } from './types'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import InternModal from './InternModal'
import InternDocumentStudioModal from './InternDocumentStudioModal'

export default function InternsTab() {
  const { token } = useAuth()
  const [interns, setInterns] = useState<InternItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'draft'>('all')

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedInternForEdit, setSelectedInternForEdit] = useState<InternItem | null>(null)

  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false)
  const [selectedInternForStudio, setSelectedInternForStudio] = useState<InternItem | null>(null)
  const [studioInitialTab, setStudioInitialTab] = useState<'offer' | 'certificate'>('offer')

  const fetchInterns = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`${API_BASE}/api/interns`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setInterns(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to fetch interns:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch interns')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInterns()
  }, [token])

  // Open Document Studio for an intern
  const handleOpenStudio = (intern: InternItem, tab: 'offer' | 'certificate' = 'offer') => {
    setSelectedInternForStudio(intern)
    setStudioInitialTab(tab)
    setIsStudioModalOpen(true)
  }

  // Quick toggle approval status
  const handleToggleStatus = async (intern: InternItem) => {
    const nextStatus = intern.certificateStatus === 'approved' ? 'draft' : 'approved'
    try {
      const res = await axios.patch(
        `${API_BASE}/api/interns/${intern._id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        setInterns((prev) => prev.map((item) => (item._id === intern._id ? res.data.data : item)))
        if (nextStatus === 'approved') {
          showSuccessToast(`Certificate approved for ${intern.name}! It is now publicly verified.`)
        } else {
          showSuccessToast(`Certificate set to Draft for ${intern.name}`)
        }
      }
    } catch (err: any) {
      console.error('Error toggling status:', err)
      showErrorToast('Failed to update status')
    }
  }

  // Delete intern
  const handleDeleteIntern = async (intern: InternItem) => {
    if (!window.confirm(`Are you sure you want to delete profile for "${intern.name}"?`)) return
    try {
      const res = await axios.delete(`${API_BASE}/api/interns/${intern._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Intern profile removed')
        setInterns((prev) => prev.filter((i) => i._id !== intern._id))
      }
    } catch (err: any) {
      console.error('Delete error:', err)
      showErrorToast('Failed to delete intern')
    }
  }

  // Filtered interns
  const filteredInterns = interns.filter((intern) => {
    const matchesSearch =
      intern.name.toLowerCase().includes(search.toLowerCase()) ||
      intern.email.toLowerCase().includes(search.toLowerCase()) ||
      intern.domain.toLowerCase().includes(search.toLowerCase()) ||
      (intern.college && intern.college.toLowerCase().includes(search.toLowerCase())) ||
      (intern.offerLetterRef && intern.offerLetterRef.toLowerCase().includes(search.toLowerCase())) ||
      (intern.certificateRef && intern.certificateRef.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && intern.certificateStatus === 'approved') ||
      (statusFilter === 'draft' && intern.certificateStatus !== 'approved')

    return matchesSearch && matchesStatus
  })

  // Metrics
  const totalCount = interns.length
  const approvedCount = interns.filter((i) => i.certificateStatus === 'approved').length
  const draftCount = interns.filter((i) => i.certificateStatus !== 'approved').length
  const offersSentCount = interns.filter((i) => i.offerLetterSentAt).length

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Add Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">
              Interns & Certificate Generation
            </h1>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-1">
            Manage intern profiles, issue formal Offer Letters, and generate QR-verifiable Certificates.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedInternForEdit(null)
            setIsFormModalOpen(true)
          }}
          className="px-5 py-2.5 bg-[#86efac] hover:bg-[#4ade80] border-2 border-slate-900 rounded-lg text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0px_0px_#000] cursor-pointer flex items-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>✨</span>
          <span>+ Add Intern Profile</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[11px] font-black uppercase text-slate-500">Total Interns</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>

        <div className="bg-[#f0fdf4] p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[11px] font-black uppercase text-emerald-700">Approved Certificates</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{approvedCount}</p>
        </div>

        <div className="bg-[#fffbeb] p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[11px] font-black uppercase text-amber-700">Pending Drafts</span>
          <p className="text-2xl font-black text-amber-800 mt-1">{draftCount}</p>
        </div>

        <div className="bg-[#f0f9ff] p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000]">
          <span className="text-[11px] font-black uppercase text-sky-700">Offers Emailed</span>
          <p className="text-2xl font-black text-sky-800 mt-1">{offersSentCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by intern name, email, college, ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs font-black uppercase text-slate-600">Filter:</span>
          {(['all', 'approved', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 text-xs font-black uppercase rounded-lg border-2 border-slate-900 cursor-pointer transition-all ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Interns Table */}
      <div className="bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-black uppercase text-slate-600">Loading Intern Records...</p>
          </div>
        ) : filteredInterns.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-2">🎓</span>
            <p className="text-sm font-black uppercase text-slate-800">No intern records found</p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Add your first intern profile to begin generating offer letters and verifiable certificates.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  <th className="py-3 px-4">Intern & Academic Info</th>
                  <th className="py-3 px-4">Domain / Mode</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Offer Letter</th>
                  <th className="py-3 px-4">Certificate Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-200 text-xs">
                {filteredInterns.map((intern) => (
                  <tr key={intern._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900 text-sm">{intern.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{intern.email}</p>
                      <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                        {intern.college} • {intern.course}
                      </p>
                    </td>

                    {/* Domain */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded font-black text-[11px] uppercase bg-sky-100 text-sky-800 border border-sky-300">
                        {intern.domain}
                      </span>
                      <p className="text-[11px] text-slate-500 capitalize mt-1">
                        {intern.mode} • {intern.stipend}
                      </p>
                    </td>

                    {/* Timeline */}
                    <td className="py-3.5 px-4 font-mono text-[11.5px] text-slate-700">
                      <p className="font-bold">{intern.duration}</p>
                      <p className="text-[10.5px] text-slate-500">
                        {intern.startDate} → {intern.endDate}
                      </p>
                    </td>

                    {/* Offer Letter */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenStudio(intern, 'offer')}
                        className="font-mono text-[11px] font-bold text-sky-700 hover:text-sky-900 underline block cursor-pointer"
                      >
                        {intern.offerLetterRef || 'View Offer'}
                      </button>
                      {intern.offerLetterSentAt ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-0.5">
                          <span>✓</span> <span>Emailed</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Not emailed yet</span>
                      )}
                    </td>

                    {/* Certificate Status */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(intern)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border cursor-pointer transition-colors ${
                            intern.certificateStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                          }`}
                          title="Click to toggle approval status"
                        >
                          {intern.certificateStatus === 'approved' ? '✓ Approved (Public)' : 'Draft (Private)'}
                        </button>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 mt-1">
                        Ref: {intern.certificateRef}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenStudio(intern, 'offer')}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-black uppercase cursor-pointer flex items-center gap-1 shadow-sm"
                          title="Open Document Studio (Offer Letter & Certificate)"
                        >
                          <span>📄</span>
                          <span>Studio</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedInternForEdit(intern)
                            setIsFormModalOpen(true)
                          }}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                          title="Edit intern details"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDeleteIntern(intern)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          title="Delete intern"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Intern Add/Edit Modal */}
      <InternModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        intern={selectedInternForEdit}
        onSuccess={(saved) => {
          setInterns((prev) => {
            const exists = prev.some((i) => i._id === saved._id)
            if (exists) {
              return prev.map((i) => (i._id === saved._id ? saved : i))
            }
            return [saved, ...prev]
          })
        }}
      />

      {/* Document Studio Modal (Two Tabs: Offer Letter & Certificate) */}
      {selectedInternForStudio && (
        <InternDocumentStudioModal
          isOpen={isStudioModalOpen}
          onClose={() => setIsStudioModalOpen(false)}
          intern={selectedInternForStudio}
          initialTab={studioInitialTab}
          onUpdateIntern={(updated) => {
            setSelectedInternForStudio(updated)
            setInterns((prev) => prev.map((i) => (i._id === updated._id ? updated : i)))
          }}
        />
      )}
    </div>
  )
}
