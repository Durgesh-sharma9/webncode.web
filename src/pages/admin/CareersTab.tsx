import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { type ApplicationItem, API_BASE } from './types'

export default function CareersTab() {
  const { token } = useAuth()
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)
  const [careerSearch, setCareerSearch] = useState('')
  const [careerFilterPosition, setCareerFilterPosition] = useState('All')

  const fetchApplications = async () => {
    try {
      setIsLoadingApplications(true)
      const res = await axios.get(`${API_BASE}/api/careers/all`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success && Array.isArray(res.data.data)) {
        setApplications(res.data.data)
      }
    } catch (err: any) {
      console.error('Failed to load applications:', err)
      showErrorToast(err.response?.data?.message || 'Failed to fetch job applications')
    } finally {
      setIsLoadingApplications(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchApplications()
    }
  }, [token])

  const handleDeleteApplication = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete application from "${name}"?`)) return
    try {
      const res = await axios.delete(`${API_BASE}/api/careers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data?.success) {
        showSuccessToast('Application deleted successfully')
        setApplications((prev) => prev.filter((a) => a._id !== id))
      }
    } catch (err: any) {
      console.error('Error deleting application:', err)
      showErrorToast('Failed to delete application')
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: ApplicationItem['status']) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/careers/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data?.success) {
        showSuccessToast(`Status updated to ${newStatus}`)
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
        )
      }
    } catch (err) {
      console.error('Failed to update application status:', err)
      showErrorToast('Failed to update status')
    }
  }

  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, '')
    const fullNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber
    const msg = encodeURIComponent(
      `Hi ${name}, this is Web n Code Technologies regarding your job application.`
    )
    return `https://wa.me/${fullNumber}?text=${msg}`
  }

  const filteredApplications = applications.filter((a) => {
    const matchesPos =
      careerFilterPosition === 'All' ||
      a.position.toLowerCase().includes(careerFilterPosition.toLowerCase())
    const q = careerSearch.toLowerCase()
    const matchesSearch =
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.mobile.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q) ||
      (a.city && a.city.toLowerCase().includes(q)) ||
      (a.currentCompany && a.currentCompany.toLowerCase().includes(q))
    return matchesPos && matchesSearch
  })

  return (
    <div className="space-y-4 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-slate-900">
        <div>
          <span className="px-2.5 py-0.5 bg-[#c084fc] border-2 border-slate-900 rounded text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
            JOB APPLICATIONS & TALENT
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 mt-1">
            Candidate Profiles ({applications.length})
          </h2>
          <p className="text-xs text-slate-600 font-bold">
            Applications, candidate experiences, portfolio links & PDF resumes submitted via /careers
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={isLoadingApplications}
          className="self-start sm:self-auto px-3.5 py-2 bg-[#c084fc] hover:bg-[#a855f7] border-2 border-slate-900 text-slate-900 text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#000] cursor-pointer"
        >
          <span>🔄</span>
          <span>{isLoadingApplications ? 'Refreshing...' : 'Refresh Applicants'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white border-2 border-slate-900 p-3 rounded-xl shadow-[3px_3px_0px_0px_#0f172a]">
        <div className="relative flex-1">
          <input
            type="text"
            value={careerSearch}
            onChange={(e) => setCareerSearch(e.target.value)}
            placeholder="Search candidate name, email, mobile, position, company..."
            className="w-full pl-8 pr-7 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] outline-none"
          />
          <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🔍</span>
          {careerSearch && (
            <button
              onClick={() => setCareerSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={careerFilterPosition}
            onChange={(e) => setCareerFilterPosition(e.target.value)}
            className="px-2.5 py-2 bg-[#fafafa] border-2 border-slate-900 rounded-lg text-xs font-bold text-slate-900 focus:bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] cursor-pointer outline-none"
          >
            <option value="All">All Roles / Positions</option>
            <option value="Frontend">Frontend Roles</option>
            <option value="Backend">Backend Roles</option>
            <option value="Full">Full Stack</option>
            <option value="Design">UI/UX Design</option>
            <option value="QA">Quality Assurance</option>
            <option value="Open">Open Applications</option>
          </select>

          <span className="text-[11px] font-bold text-slate-500">
            Showing {filteredApplications.length} of {applications.length}
          </span>
        </div>
      </div>

      {/* Applications List */}
      {isLoadingApplications ? (
        <div className="py-14 text-center text-slate-600 text-xs font-bold">
          Loading applicant records...
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white border-2 border-slate-900 rounded-xl p-8 text-center shadow-[3px_3px_0px_0px_#0f172a]">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="text-sm font-black text-slate-900 uppercase">No Applications Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto font-bold">
            {careerSearch || careerFilterPosition !== 'All'
              ? 'No candidates match your filters.'
              : 'Applications submitted through /careers will show up here along with their experience, builder answers, and resume PDFs!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white border-2 border-slate-900 rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all"
            >
              {/* Header Row: Name, Position, Experience, Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-900/20">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#c084fc] text-slate-900 font-black text-[10px] uppercase rounded border border-slate-900 shadow-[1px_1px_0px_0px_#000]">
                      {app.position}
                    </span>
                    <h3 className="text-base font-black text-slate-900 uppercase">
                      {app.fullName}
                    </h3>
                    <span className="px-1.5 py-0.5 bg-[#fafafa] border border-slate-900/40 text-slate-700 text-[10px] font-bold rounded">
                      Exp: {app.experience}
                    </span>
                    {app.noticePeriod && (
                      <span className="px-1.5 py-0.5 bg-[#fafafa] border border-slate-900/40 text-slate-700 text-[10px] font-bold rounded">
                        Notice: {app.noticePeriod}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-bold mt-1">
                    {app.city && <span>📍 {app.city}{app.state ? `, ${app.state}` : ''}</span>}
                    {app.gender && (
                      <>
                        <span>•</span>
                        <span>Gender: {app.gender}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Direct Actions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {app.mobile && (
                    <a
                      href={getWhatsAppLink(app.mobile, app.fullName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#86efac] hover:bg-[#4ade80] text-slate-900 text-[11px] font-black uppercase rounded-lg border-2 border-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  )}

                  {app.mobile && (
                    <a
                      href={`tel:${app.mobile}`}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                      <span>📞 Call</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${app.email}?subject=Web%20n%20Code%20Application%20Update%20-%20${encodeURIComponent(app.position)}`}
                    className="px-2.5 py-1 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 text-[11px] font-bold rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]"
                  >
                    <span>✉️ Email</span>
                  </a>

                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#ff9e7d] hover:bg-[#ff8a65] border-2 border-slate-900 text-slate-900 text-[11px] font-black uppercase rounded-lg shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1 transition-all"
                    >
                      <span>📥 PDF Resume ↗</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteApplication(app._id, app.fullName)}
                    className="px-2 py-1 bg-rose-100 border-2 border-rose-600 hover:bg-rose-200 text-rose-900 text-[11px] font-bold rounded-lg cursor-pointer"
                    title="Delete Application"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Contact & Candidate Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-2.5 text-[11px]">
                <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                  <span className="text-slate-500 uppercase block font-black text-[9px]">Email</span>
                  <a href={`mailto:${app.email}`} className="text-slate-900 font-bold truncate block hover:underline">
                    {app.email}
                  </a>
                </div>

                <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                  <span className="text-slate-500 uppercase block font-black text-[9px]">Mobile</span>
                  <a href={`tel:${app.mobile}`} className="text-slate-900 font-bold block hover:underline">
                    {app.mobile}
                  </a>
                </div>

                <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                  <span className="text-slate-500 uppercase block font-black text-[9px]">Current Org</span>
                  <span className="text-slate-900 font-bold truncate block">
                    {app.currentCompany || 'N/A'} {app.currentRole ? `(${app.currentRole})` : ''}
                  </span>
                </div>

                <div className="p-2 bg-[#fafafa] rounded-lg border border-slate-900/30">
                  <span className="text-slate-500 uppercase block font-black text-[9px]">Academics</span>
                  <span className="text-slate-900 font-bold truncate block">
                    {app.college ? `${app.college} (${app.graduationYear || ''})` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Social & Portfolio Links */}
              {(app.linkedin || app.github || app.portfolio || app.portfolioUrl) && (
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {app.linkedin && (
                    <a
                      href={app.linkedin.startsWith('http') ? app.linkedin : `https://${app.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-white hover:bg-[#7dd3fc] border border-slate-900 text-slate-900 text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                    >
                      <span>🔗 LinkedIn ↗</span>
                    </a>
                  )}
                  {app.github && (
                    <a
                      href={app.github.startsWith('http') ? app.github : `https://${app.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-900 text-slate-900 text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                    >
                      <span>🐙 GitHub ↗</span>
                    </a>
                  )}
                  {(app.portfolio || app.portfolioUrl) && (
                    <a
                      href={(app.portfolio || app.portfolioUrl || '').startsWith('http') ? (app.portfolio || app.portfolioUrl) : `https://${app.portfolio || app.portfolioUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 bg-white hover:bg-[#c084fc] border border-slate-900 text-slate-900 text-[10px] font-bold rounded shadow-[1px_1px_0px_0px_#000] flex items-center gap-1"
                    >
                      <span>🎨 Portfolio ↗</span>
                    </a>
                  )}
                </div>
              )}

              {/* Builder Question Responses Preview */}
              {(app.builtProduct || app.reason) && (
                <div className="p-2.5 bg-[#f8fafc] border border-slate-900/40 rounded-lg text-xs space-y-1 mt-2">
                  {app.builtProduct && (
                    <div>
                      <span className="text-slate-500 font-black uppercase text-[10px]">What they've built: </span>
                      <span className="text-slate-900 font-medium">{app.builtProduct}</span>
                    </div>
                  )}
                  {app.reason && (
                    <div>
                      <span className="text-slate-500 font-black uppercase text-[10px]">Why Web n Code: </span>
                      <span className="text-slate-900 font-medium">{app.reason}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Status Update Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-900/15 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-600">Review Status:</span>
                  <select
                    value={app.status || 'pending'}
                    onChange={(e) => handleUpdateStatus(app._id, e.target.value as ApplicationItem['status'])}
                    className="px-2 py-0.5 border border-slate-900 rounded text-[11px] font-bold bg-white text-slate-900 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                  >
                    <option value="pending">⏳ Pending Review</option>
                    <option value="reviewed">👀 Under Review</option>
                    <option value="shortlisted">⭐ Shortlisted</option>
                    <option value="hired">🎉 Hired</option>
                    <option value="rejected">✕ Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
