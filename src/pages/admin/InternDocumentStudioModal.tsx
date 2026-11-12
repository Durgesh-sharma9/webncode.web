import { useState, useRef } from 'react'
import axios from 'axios'
import jsPDF from 'jspdf'
import { safeHtml2Canvas } from '../../utils/safeHtml2Canvas'
import { type InternItem, API_BASE } from './types'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { OfferLetterDocument } from '../../components/intern/OfferLetterDocument'
import { CertificateDocument } from '../../components/intern/CertificateDocument'

interface InternDocumentStudioModalProps {
  intern: InternItem
  isOpen: boolean
  onClose: () => void
  onUpdateIntern: (updated: InternItem) => void
  initialTab?: 'offer' | 'certificate'
}

export default function InternDocumentStudioModal({
  intern,
  isOpen,
  onClose,
  onUpdateIntern,
  initialTab = 'offer'
}: InternDocumentStudioModalProps) {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<'offer' | 'certificate'>(initialTab)
  const [isProcessingPdf, setIsProcessingPdf] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const offerLetterRef = useRef<HTMLDivElement>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://webncode.in'
  const publicVerifyUrl = `${origin}/verify-certificate/${encodeURIComponent(intern.certificateRef || intern._id)}`

  // Helper to generate PDF object from element safely
  const generatePdfBlob = async (element: HTMLElement, _filename: string) => {
    const canvas = await safeHtml2Canvas(element, {
      scale: 2.5, // High print quality
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

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight))
    return { pdf, imgData }
  }

  // 1. Download Offer Letter PDF
  const handleDownloadOfferLetter = async () => {
    if (!offerLetterRef.current) return
    try {
      setIsProcessingPdf(true)
      const { pdf } = await generatePdfBlob(
        offerLetterRef.current,
        `Offer_Letter_${intern.name.replace(/\s+/g, '_')}.pdf`
      )
      pdf.save(`Offer_Letter_${intern.name.replace(/\s+/g, '_')}.pdf`)
      showSuccessToast('Offer Letter PDF downloaded successfully')
    } catch (err: any) {
      console.error('Failed to generate offer letter PDF:', err)
      showErrorToast('Failed to generate PDF')
    } finally {
      setIsProcessingPdf(false)
    }
  }

  // 2. Email Offer Letter to Intern
  const handleSendOfferLetterEmail = async () => {
    if (!offerLetterRef.current) return
    try {
      setIsSendingEmail(true)
      const { pdf } = await generatePdfBlob(
        offerLetterRef.current,
        `Offer_Letter_${intern.name.replace(/\s+/g, '_')}.pdf`
      )
      const pdfBase64 = pdf.output('datauristring')

      const res = await axios.post(
        `${API_BASE}/api/interns/${intern._id}/send-offer-letter`,
        { pdfBase64 },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data?.success) {
        showSuccessToast(`Offer Letter emailed to ${intern.email}`)
        onUpdateIntern({ ...intern, offerLetterSentAt: new Date().toISOString() })
      }
    } catch (err: any) {
      console.error('Email sending error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to email offer letter')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // 3. Download Certificate PDF
  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return
    try {
      setIsProcessingPdf(true)
      const { pdf } = await generatePdfBlob(
        certificateRef.current,
        `Certificate_${intern.name.replace(/\s+/g, '_')}.pdf`
      )
      pdf.save(`Certificate_${intern.name.replace(/\s+/g, '_')}.pdf`)
      showSuccessToast('Certificate PDF downloaded successfully')
    } catch (err: any) {
      console.error('Failed to generate certificate PDF:', err)
      showErrorToast('Failed to generate PDF')
    } finally {
      setIsProcessingPdf(false)
    }
  }

  // 4. Email Certificate to Intern
  const handleSendCertificateEmail = async () => {
    if (intern.certificateStatus !== 'approved') {
      showErrorToast('Please approve the certificate first before emailing to candidate')
      return
    }
    if (!certificateRef.current) return

    try {
      setIsSendingEmail(true)
      const { pdf } = await generatePdfBlob(
        certificateRef.current,
        `Certificate_${intern.name.replace(/\s+/g, '_')}.pdf`
      )
      const pdfBase64 = pdf.output('datauristring')

      const res = await axios.post(
        `${API_BASE}/api/interns/${intern._id}/send-certificate`,
        { pdfBase64 },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data?.success) {
        showSuccessToast(`Certificate emailed to ${intern.email}`)
        onUpdateIntern({ ...intern, certificateSentAt: new Date().toISOString() })
      }
    } catch (err: any) {
      console.error('Certificate email sending error:', err)
      showErrorToast(err.response?.data?.message || 'Failed to email certificate')
    } finally {
      setIsSendingEmail(false)
    }
  }

  // 5. Toggle Approval Status
  const handleToggleCertificateStatus = async (newStatus: 'draft' | 'approved' | 'revoked') => {
    try {
      setIsUpdatingStatus(true)
      const res = await axios.patch(
        `${API_BASE}/api/interns/${intern._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data?.success) {
        onUpdateIntern(res.data.data)
        if (newStatus === 'approved') {
          showSuccessToast('Certificate approved! Now publicly accessible and verifiable.')
        } else {
          showSuccessToast(`Certificate status changed to ${newStatus}`)
        }
      }
    } catch (err: any) {
      console.error('Failed to update status:', err)
      showErrorToast(err.response?.data?.message || 'Failed to update certificate status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Copy Public Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicVerifyUrl)
    showSuccessToast('Public verification link copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col font-sans">
      {/* Top Studio Control Bar */}
      <div className="bg-[#0f172a] text-white px-6 py-3.5 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        {/* Left: Intern Title & Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-black uppercase bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600 cursor-pointer"
          >
            ← Back to Interns
          </button>

          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>{intern.name}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {intern.domain}
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {intern.college} • {intern.duration}
            </p>
          </div>

          {/* TWO PRIMARY TABS */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('offer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'offer'
                  ? 'bg-[#0284c7] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📄</span>
              <span>1. Offer Letter</span>
              {intern.offerLetterSentAt && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Emailed" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🎓</span>
              <span>2. Certificate of Internship</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  intern.certificateStatus === 'approved'
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                {intern.certificateStatus}
              </span>
            </button>
          </div>
        </div>

        {/* Right: Actions for Active Tab */}
        <div className="flex items-center gap-3">
          {activeTab === 'offer' ? (
            <>
              <button
                onClick={handleDownloadOfferLetter}
                disabled={isProcessingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-black uppercase rounded-lg border border-slate-600 cursor-pointer disabled:opacity-50"
              >
                <span>📥</span>
                <span>{isProcessingPdf ? 'Rendering PDF...' : 'Download Offer PDF'}</span>
              </button>

              <button
                onClick={handleSendOfferLetterEmail}
                disabled={isSendingEmail || isProcessingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black uppercase rounded-lg shadow cursor-pointer disabled:opacity-50"
              >
                <span>✉️</span>
                <span>{isSendingEmail ? 'Sending Email...' : `Email to ${intern.email}`}</span>
              </button>
            </>
          ) : (
            <>
              {/* Approval status toggle */}
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-300 font-bold">Public Verification:</span>
                {intern.certificateStatus === 'approved' ? (
                  <button
                    onClick={() => handleToggleCertificateStatus('draft')}
                    disabled={isUpdatingStatus}
                    className="text-[11px] px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 rounded font-black uppercase cursor-pointer"
                  >
                    Revoke to Draft
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleCertificateStatus('approved')}
                    disabled={isUpdatingStatus}
                    className="text-[11px] px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-black uppercase cursor-pointer shadow"
                  >
                    ✓ Approve & Publish
                  </button>
                )}
              </div>

              <button
                onClick={handleDownloadCertificate}
                disabled={isProcessingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-black uppercase rounded-lg border border-slate-600 cursor-pointer disabled:opacity-50"
              >
                <span>📥</span>
                <span>{isProcessingPdf ? 'Rendering...' : 'Download Certificate PDF'}</span>
              </button>

              <button
                onClick={handleSendCertificateEmail}
                disabled={isSendingEmail || isProcessingPdf || intern.certificateStatus !== 'approved'}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase rounded-lg shadow cursor-pointer disabled:opacity-50"
                title={intern.certificateStatus !== 'approved' ? 'Approve certificate first' : ''}
              >
                <span>✉️</span>
                <span>{isSendingEmail ? 'Dispatching...' : 'Email Certificate'}</span>
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Sub-bar for Certificate Public Verification Info */}
      {activeTab === 'certificate' && (
        <div className="bg-[#1e293b] px-6 py-2 border-b border-slate-700 text-xs flex flex-wrap items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-400">QR Code Link:</span>
            <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
              {publicVerifyUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer ml-1"
            >
              Copy Link
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={publicVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-black uppercase flex items-center gap-1"
            >
              <span>Open Public Verification Page</span> <span>↗</span>
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              Status:{' '}
              <strong
                className={
                  intern.certificateStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                }
              >
                {intern.certificateStatus.toUpperCase()}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Document View Canvas / Workspace */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex justify-center items-start">
        {activeTab === 'offer' ? (
          <div className="scale-[0.88] origin-top transition-transform">
            <OfferLetterDocument ref={offerLetterRef} intern={intern} />
          </div>
        ) : (
          <div className="scale-[0.88] origin-top transition-transform">
            <CertificateDocument ref={certificateRef} intern={intern} />
          </div>
        )}
      </div>
    </div>
  )
}
