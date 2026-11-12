import { useState, useEffect } from 'react'
import axios from 'axios'
import { type InternItem, API_BASE } from './types'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'

interface InternModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (intern: InternItem) => void
  intern: InternItem | null
}

export default function InternModal({ isOpen, onClose, onSuccess, intern }: InternModalProps) {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current 2-digit year (e.g. '26' for 2026)
  const currentYear = new Date().getFullYear().toString().slice(-2)
  const defaultRefCode = `WNC/SI/FSD/${currentYear}/001`

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    domain: '',
    department: '',
    mode: 'offline',
    stipend: '',
    location: '',
    duration: '',
    startDate: '',
    endDate: '',
    offerLetterRef: defaultRefCode,
    offerLetterDate: '',
    acceptanceDueDate: '',
    certificateRef: defaultRefCode,
    certificateIssueDate: '',
    certificateStatus: 'draft',
    certificateEvaluation: '',
    notes: ''
  })

  // Synchronize Reference No across both fields
  const handleRefChange = (newRef: string) => {
    setFormData((prev) => ({
      ...prev,
      offerLetterRef: newRef,
      certificateRef: newRef
    }))
  }

  useEffect(() => {
    if (intern) {
      const unifiedRef = intern.certificateRef || intern.offerLetterRef || defaultRefCode
      setFormData({
        name: intern.name || '',
        email: intern.email || '',
        phone: intern.phone || '',
        college: intern.college || '',
        course: intern.course || '',
        domain: intern.domain || '',
        department: intern.department || '',
        mode: intern.mode || 'offline',
        stipend: intern.stipend || '',
        location: intern.location || '',
        duration: intern.duration || '',
        startDate: intern.startDate || '',
        endDate: intern.endDate || '',
        offerLetterRef: intern.offerLetterRef || unifiedRef,
        offerLetterDate: intern.offerLetterDate || '',
        acceptanceDueDate: intern.acceptanceDueDate || '',
        certificateRef: intern.certificateRef || unifiedRef,
        certificateIssueDate: intern.certificateIssueDate || '',
        certificateStatus: intern.certificateStatus || 'draft',
        certificateEvaluation: intern.certificateEvaluation || '',
        notes: intern.notes || ''
      })
    } else {
      // Set default immediately, then fetch next sequential reference from backend
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        course: '',
        domain: '',
        department: '',
        mode: 'offline',
        stipend: '',
        location: '',
        duration: '',
        startDate: '',
        endDate: '',
        offerLetterRef: defaultRefCode,
        offerLetterDate: '',
        acceptanceDueDate: '',
        certificateRef: defaultRefCode,
        certificateIssueDate: '',
        certificateStatus: 'draft',
        certificateEvaluation: '',
        notes: ''
      })

      // Fetch next sequential reference code starting from 001
      if (isOpen && token) {
        axios
          .get(`${API_BASE}/api/interns/next-ref`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((res) => {
            if (res.data?.success && res.data?.nextRef) {
              const nextCode = res.data.nextRef
              setFormData((prev) => ({
                ...prev,
                offerLetterRef: nextCode,
                certificateRef: nextCode
              }))
            }
          })
          .catch((err) => {
            console.warn('Could not fetch next ref, using default sequence:', err)
          })
      }
    }
  }, [intern, isOpen, token])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      showErrorToast('Please provide intern full name and email')
      return
    }

    try {
      setIsSubmitting(true)
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Ensure both reference numbers are strictly identical
      const payload = {
        ...formData,
        certificateRef: formData.certificateRef || formData.offerLetterRef,
        offerLetterRef: formData.offerLetterRef || formData.certificateRef
      }

      if (intern) {
        const res = await axios.put(`${API_BASE}/api/interns/${intern._id}`, payload, config)
        if (res.data?.success) {
          showSuccessToast('Intern details updated successfully')
          onSuccess(res.data.data)
          onClose()
        }
      } else {
        const res = await axios.post(`${API_BASE}/api/interns`, payload, config)
        if (res.data?.success) {
          showSuccessToast('New intern added successfully')
          onSuccess(res.data.data)
          onClose()
        }
      }
    } catch (err: any) {
      console.error('Error saving intern:', err)
      showErrorToast(err.response?.data?.message || 'Failed to save intern details')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white border-2 border-slate-900 rounded-xl shadow-[8px_8px_0px_0px_#000] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-900 bg-sky-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">
              {intern ? '✏️ Edit Intern Details' : '🎓 Add New Intern Profile'}
            </h3>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              Configure profile for automated Offer Letter & Verified Certificate generation
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border-2 border-slate-900 bg-white hover:bg-red-500 hover:text-white flex items-center justify-center font-black cursor-pointer transition-colors shadow-[2px_2px_0px_0px_#000]"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Candidate Basic Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-1 mb-3">
              1. Candidate Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Full Name (with Prefix) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Aryan Kumar Swain"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aryanswain@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 8947919195"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arya college, Jaipur"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Course & Semester Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4th Year 7th Sem (B. TECH CS-AI)"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Internship Domain & Logistics */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0284c7] border-b border-slate-200 pb-1 mb-3">
              2. Internship Role & Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Domain / Position *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Development"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Development"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Mode of Internship
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                >
                  <option value="offline">Offline (In-office)</option>
                  <option value="online">Online (Remote)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6th July 2026"
                  value={formData.startDate}
                  onChange={(e) => {
                    const start = e.target.value
                    const newDuration = start && formData.endDate ? `${start} to ${formData.endDate}` : formData.duration
                    setFormData({ ...formData, startDate: start, duration: newDuration })
                  }}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6th Feb 2027"
                  value={formData.endDate}
                  onChange={(e) => {
                    const end = e.target.value
                    const newDuration = formData.startDate && end ? `${formData.startDate} to ${end}` : formData.duration
                    setFormData({ ...formData, endDate: end, duration: newDuration })
                  }}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Stipend
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹15000/month or Unpaid"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Overall Duration Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6th July 2026 to 6th Feb 2027"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Office / Work Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur, Rajasthan, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Document Reference & Certificate Publishing */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
                3. Offer Letter & Certificate Settings
              </h4>
              <span className="text-[11px] font-bold text-slate-500">
                Prefix: <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">WNC/SI/FSD/{currentYear}/001</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Offer Letter Reference No.
                </label>
                <input
                  type="text"
                  placeholder={`e.g. WNC/SI/FSD/${currentYear}/001`}
                  value={formData.offerLetterRef}
                  onChange={(e) => handleRefChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg font-mono font-bold text-[#0052cc] focus:outline-none focus:bg-sky-50"
                />
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  Synchronized with Certificate Reference
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Offer Acceptance Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3rd July 2026"
                  value={formData.acceptanceDueDate}
                  onChange={(e) => setFormData({ ...formData, acceptanceDueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Certificate Reference No. (Used in QR Code)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. WNC/SI/FSD/${currentYear}/001`}
                  value={formData.certificateRef}
                  onChange={(e) => handleRefChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg font-mono text-[#0052cc] font-bold focus:outline-none focus:bg-sky-50"
                />
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  Used for Public QR code scan & online verification
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Certificate Issue Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. 7 SEP 2026"
                  value={formData.certificateIssueDate}
                  onChange={(e) => setFormData({ ...formData, certificateIssueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Certificate Status (Public Access)
                </label>
                <select
                  value={formData.certificateStatus}
                  onChange={(e) => setFormData({ ...formData, certificateStatus: e.target.value })}
                  className="w-full px-3 py-2 text-sm border-2 border-slate-900 rounded-lg font-bold focus:outline-none focus:bg-sky-50"
                >
                  <option value="draft">Draft (Private - Verification Disabled)</option>
                  <option value="approved">Approved (Public - Scannable & Verified)</option>
                  <option value="revoked">Revoked / Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase text-slate-800 mb-1">
                  Certificate Appreciation / Recommendation Paragraph
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional custom evaluation statement for certificate (leave blank for standard wording)..."
                  value={formData.certificateEvaluation}
                  onChange={(e) => setFormData({ ...formData, certificateEvaluation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border-2 border-slate-900 rounded-lg focus:outline-none focus:bg-sky-50 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-slate-900 rounded-lg text-xs font-black uppercase hover:bg-slate-100 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#86efac] hover:bg-[#4ade80] border-2 border-slate-900 rounded-lg text-xs font-black uppercase cursor-pointer shadow-[3px_3px_0px_0px_#000] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Profile...' : intern ? 'Save Changes' : '+ Add Intern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
