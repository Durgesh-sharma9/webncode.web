import { forwardRef, useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { type InternItem } from '../../pages/admin/types'

interface CertificateDocumentProps {
  intern: InternItem
}

export const CertificateDocument = forwardRef<HTMLDivElement, CertificateDocumentProps>(
  ({ intern }, ref) => {
    const [qrDataUrl, setQrDataUrl] = useState<string>('')

    // Generate dynamic scannable QR Code
    useEffect(() => {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://webncode.in'
      const verifyUrl = `${origin}/verify-certificate/${encodeURIComponent(intern.certificateRef || intern._id)}`

      QRCode.toDataURL(verifyUrl, {
        width: 340,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      })
        .then((url: string) => setQrDataUrl(url))
        .catch((err: unknown) => console.error('QR code generation error:', err))
    }, [intern.certificateRef, intern._id])

    // Clean name for prominent display
    const candidateName = intern.name.replace(/^(mr\.|ms\.|mrs\.|dr\.)\s+/i, '').trim().toUpperCase()

    return (
      <div
        ref={ref}
        id="certificate-document"
        className="w-[826px] h-[1070px] relative mx-auto bg-white overflow-hidden select-none"
        style={{
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Clean Official Certificate Frame with Watermark and Ghost Text Completely Removed */}
        <img
          src="/intern-assets/certificate_base_template.png?v=clean4"
          alt="Certificate Frame"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Official Tagline: Code. Innovate. Grow. */}
        <div
          className="absolute left-0 right-0 text-center z-10 bg-transparent pointer-events-none"
          style={{ top: '18.8%' }}
        >
          <p
            className="text-[12px] font-bold text-[#0284c7] uppercase font-sans leading-none"
            style={{ letterSpacing: '0.08em' }}
          >
            Code. Innovate. Grow.
          </p>
        </div>

        {/* Dynamic Candidate Name - Perfectly Centered Vertically */}
        <div
          className="absolute left-0 right-0 text-center px-12 z-10 bg-transparent"
          style={{ top: '41.8%' }}
        >
          <h2
            className="text-[34px] font-black uppercase tracking-tight text-[#0052cc] leading-none"
            style={{
              fontFamily: "'Cinzel', 'Times New Roman', serif, Georgia",
              letterSpacing: '0.04em',
              textShadow: '0 1px 1px rgba(0,0,0,0.03)'
            }}
          >
            {candidateName}
          </h2>
        </div>

        {/* Dynamic Internship Domain / Track */}
        <div
          className="absolute left-0 right-0 text-center px-14 z-10 bg-transparent"
          style={{ top: '53.0%' }}
        >
          <h3
            className="text-[23px] font-black uppercase tracking-wider text-[#0066cc] leading-none"
            style={{ letterSpacing: '0.06em' }}
          >
            {intern.domain || 'FULL STACK DEVELOPMENT'}
          </h3>
        </div>

        {/* Dynamic Duration Period */}
        <div
          className="absolute left-0 right-0 text-center px-16 z-10 bg-transparent"
          style={{ top: '57.2%' }}
        >
          <p className="text-[14px] font-bold text-[#1e293b] tracking-wide leading-none">
            from{' '}
            <span className="uppercase text-[#0f172a] font-extrabold">
              {intern.startDate || '22 JULY 2026'}
            </span>{' '}
            to{' '}
            <span className="uppercase text-[#0f172a] font-extrabold">
              {intern.endDate || '5 SEP 2026'}
            </span>
          </p>
        </div>

        {/* Dynamic Evaluation / Appreciation Text */}
        <div
          className="absolute left-0 right-0 mx-auto px-16 text-center z-10 bg-transparent"
          style={{ top: '61.4%', maxWidth: '690px' }}
        >
          <p
            className="text-[12.2px] text-[#334155] leading-[1.6] text-center font-normal"
            style={{ lineHeight: 1.55, letterSpacing: '0.02px' }}
          >
            {intern.certificateEvaluation ||
              `During the internship, ${intern.name} demonstrated a strong willingness to learn, contributed effectively to the assigned tasks and showed good problem-solving skills. We appreciate dedication and effort throughout the internship period and are confident that this summer internship will be valuable for future endeavors.`}
          </p>
        </div>

        {/* Dynamic Date & Certificate Ref (Bottom Right - Aligned with Original PDF coordinates) */}
        <div
          className="absolute text-left z-10 font-sans bg-transparent"
          style={{ top: '77.0%', left: '56.0%' }}
        >
          <p className="text-[13.5px] font-bold text-[#1e293b] tracking-tight leading-none mb-2">
            Date: <span className="font-extrabold">{intern.certificateIssueDate || '7 SEP 2026'}</span>
          </p>
          <p className="text-[12.5px] font-bold text-[#1e293b] tracking-tight leading-none">
            Certificate Ref:{' '}
            <span className="font-mono font-bold text-[#0052cc]">
              {intern.certificateRef || 'WNC/SI/FSD/26/023'}
            </span>
          </p>
        </div>

        {/* Scannable Dynamic QR Code (Bottom Right - Aligned flush with Date & Ref at left: 56.0%) */}
        <div
          className="absolute z-10 p-1.5 bg-white border border-[#cbd5e1] rounded flex flex-col items-center"
          style={{
            top: '82.8%',
            left: '56.0%',
            width: '122px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan to Verify Certificate"
              className="w-[102px] h-[102px] object-contain block"
            />
          ) : (
            <div className="w-[102px] h-[102px] bg-[#f8fafc] flex items-center justify-center text-[10px] text-[#94a3b8]">
              Generating...
            </div>
          )}
          <span className="text-[8.5px] font-black text-[#475569] uppercase tracking-wider mt-1">
            SCAN TO VERIFY
          </span>
        </div>
      </div>
    )
  }
)

CertificateDocument.displayName = 'CertificateDocument'
