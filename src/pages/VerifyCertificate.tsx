import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas'
import { API_BASE, type InternItem } from './admin/types'
import { CertificateDocument } from '../components/intern/CertificateDocument'
import { showSuccessToast, showErrorToast } from '../components/ui/Toast'

export default function VerifyCertificate() {
  const { ref: paramRef } = useParams<{ ref?: string }>()
  const [searchInput, setSearchInput] = useState<string>(paramRef || '')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    message: string
    status?: string
    intern?: InternItem
  } | null>(null)

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  const handleVerify = async (refCode: string) => {
    if (!refCode.trim()) return
    try {
      setIsLoading(true)
      const encodedRef = encodeURIComponent(refCode.trim())
      const res = await axios.get(`${API_BASE}/api/interns/verify/${encodedRef}`)

      if (res.data) {
        setVerificationResult({
          verified: !!res.data.verified,
          message: res.data.message,
          status: res.data.status,
          intern: res.data.intern
        })
      }
    } catch (err: any) {
      console.error('Verification error:', err)
      setVerificationResult({
        verified: false,
        message: err.response?.data?.message || 'Certificate not found with this reference number.',
        status: 'not_found'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (paramRef) {
      setSearchInput(paramRef)
      handleVerify(paramRef)
    }
  }, [paramRef])

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      handleVerify(searchInput.trim())
    }
  }

  const handleDownloadPdf = async () => {
    if (!certRef.current || !verificationResult?.intern) return
    try {
      setIsDownloadingPdf(true)
      const canvas = await safeHtml2Canvas(certRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight))
      pdf.save(`Verified_Certificate_${verificationResult.intern.name.replace(/\s+/g, '_')}.pdf`)
      showSuccessToast('Verified Certificate PDF downloaded')
    } catch (err) {
      console.error('Failed to download PDF:', err)
      showErrorToast('Failed to download PDF')
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Clean Website-matching Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#86efac] border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000] text-xs font-black uppercase tracking-wider text-slate-900">
            <span>🛡️</span>
            <span>Official Credential Registry</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
            Verify Certificate of Internship
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            Validate the authenticity of internship certificates issued by Web n Code Technologies.
            Enter the Certificate Reference Number below or scan the certificate QR code.
          </p>
        </div>

        {/* Search Reference Card (Neo-Brutalist) */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000]">
          <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Certificate Ref (e.g. WNC/SI/FSD/26/023)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-900 rounded-lg text-slate-900 font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-6 py-3 bg-[#7dd3fc] hover:bg-[#38bdf8] border-2 border-slate-900 text-slate-900 font-black uppercase text-xs rounded-lg transition-all cursor-pointer shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Credential'}
            </button>
          </form>

          {/* Quick Example */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold">Sample Ref:</span>
            <button
              type="button"
              onClick={() => {
                setSearchInput('WNC/SI/FSD/26/023')
                handleVerify('WNC/SI/FSD/26/023')
              }}
              className="text-[#0284c7] hover:underline font-mono font-bold cursor-pointer"
            >
              WNC/SI/FSD/26/023
            </button>
          </div>
        </div>

        {/* Verification Loading State */}
        {isLoading && (
          <div className="p-10 text-center bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000]">
            <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-700">
              Validating Credential with Web n Code Database...
            </p>
          </div>
        )}

        {/* Verification Result Area */}
        {!isLoading && verificationResult && (
          <div className="space-y-6">
            {/* Status Banner */}
            {verificationResult.verified ? (
              <div className="bg-[#f0fdf4] border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#86efac] border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                    ✅
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded font-black text-[10.5px] uppercase tracking-wider bg-[#86efac] text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000] mb-1">
                      Authentic & Verified
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      Official Certificate of Internship
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Issued by Web n Code Technologies • Authorized Signatory: Mr. Narendra Singh
                      Chaudhary
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="px-5 py-2.5 bg-[#86efac] hover:bg-[#4ade80] border-2 border-slate-900 text-slate-900 font-black uppercase text-xs rounded-lg shadow-[3px_3px_0px_0px_#000] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
                >
                  <span>📥</span>
                  <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Verified PDF'}</span>
                </button>
              </div>
            ) : verificationResult.status === 'draft' ? (
              <div className="bg-[#fffbeb] border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fde047] border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                  ⏳
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded font-black text-[10.5px] uppercase tracking-wider bg-[#fde047] text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000] mb-1">
                    Pending Administrative Approval
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Certificate Pending Verification
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    This internship certificate record exists in the system but has not yet received
                    final administrative approval for public release.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#fff1f2] border-2 border-slate-900 rounded-xl p-5 sm:p-6 shadow-[5px_5px_0px_0px_#000] flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#fda4af] border-2 border-slate-900 flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_#000]">
                  ❌
                </div>
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded font-black text-[10.5px] uppercase tracking-wider bg-[#fda4af] text-slate-900 border border-slate-900 shadow-[1px_1px_0px_0px_#000] mb-1">
                    Verification Failed
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    No Matching Certificate Found
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {verificationResult.message} Please check the reference number or contact{' '}
                    <a
                      href="mailto:webncodetechnologies@gmail.com"
                      className="underline text-slate-900 font-bold"
                    >
                      webncodetechnologies@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Verified Details Breakdown & Interactive Certificate */}
            {verificationResult.verified && verificationResult.intern && (
              <div className="space-y-6">
                {/* Metadata Grid (Website UI matching) */}
                <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[5px_5px_0px_0px_#000] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      Candidate Name
                    </span>
                    <p className="text-base font-black text-slate-900">
                      {verificationResult.intern.name}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      Domain / Specialization
                    </span>
                    <p className="text-sm font-bold text-[#0284c7]">
                      {verificationResult.intern.domain}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      Certificate Reference
                    </span>
                    <p className="text-sm font-mono font-bold text-emerald-800">
                      {verificationResult.intern.certificateRef}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      College / Institute
                    </span>
                    <p className="text-slate-800 font-semibold">
                      {verificationResult.intern.college}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      Training Period
                    </span>
                    <p className="text-slate-800 font-semibold font-mono">
                      {verificationResult.intern.duration ||
                        `${verificationResult.intern.startDate} to ${verificationResult.intern.endDate}`}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] text-slate-500 uppercase font-black tracking-wider block mb-1">
                      Issue Date
                    </span>
                    <p className="text-slate-800 font-semibold">
                      {verificationResult.intern.certificateIssueDate}
                    </p>
                  </div>
                </div>

                {/* Certificate Display Workspace */}
                <div className="bg-slate-200 border-2 border-slate-900 rounded-xl p-4 sm:p-8 shadow-[6px_6px_0px_0px_#000] flex justify-center overflow-x-auto">
                  <div className="scale-[0.85] sm:scale-[0.95] origin-top transition-transform">
                    <CertificateDocument ref={certRef} intern={verificationResult.intern} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
