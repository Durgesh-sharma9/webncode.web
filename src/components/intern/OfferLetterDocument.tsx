import { forwardRef } from 'react'
import { type InternItem } from '../../pages/admin/types'

interface OfferLetterDocumentProps {
  intern: InternItem
}

export const OfferLetterDocument = forwardRef<HTMLDivElement, OfferLetterDocumentProps>(
  ({ intern }, ref) => {
    // Extract first name for salutation
    const cleanName = intern.name.replace(/^(mr\.|ms\.|mrs\.|dr\.)\s+/i, '').trim()
    const firstName = cleanName.split(' ')[0] || cleanName

    return (
      <div
        ref={ref}
        id="offer-letter-document"
        className="w-[794px] min-h-[1123px] bg-white text-[#1e293b] p-[48px] relative mx-auto font-sans flex flex-col justify-between overflow-hidden select-none"
        style={{
          boxSizing: 'border-box',
          lineHeight: 1.5,
          fontSize: '13.5px',
          color: '#1e293b',
          letterSpacing: '0.02px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#0284c7] z-20" />

        {/* Center Corporate Background Watermark Logo (Tilted / Slanted at -33deg) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <img
            src="/intern-assets/clean_watermark_logo.png"
            alt="Web n Code Logo Watermark"
            className="w-[620px] h-auto object-contain opacity-[0.08] select-none"
            style={{
              transform: 'rotate(-33deg) scale(1.1)',
              filter: 'contrast(115%)'
            }}
          />
        </div>

        {/* Header Section */}
        <div className="relative z-10" style={{ letterSpacing: '0.02px' }}>
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <img
                src="/intern-assets/wnc_logo_mark.png"
                alt="Web n Code"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  ;(e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div>
                <h1 className="text-[22px] font-black tracking-tight text-[#0f172a] leading-none mb-1">
                  Web n Code Technologies
                </h1>
                <p className="text-[12px] font-bold text-[#0284c7] tracking-wider uppercase">
                  Code. Innovate. Grow.
                </p>
              </div>
            </div>

            <div className="text-right text-[11.5px] text-[#475569] space-y-0.5 font-medium">
              <p className="flex items-center justify-end gap-1.5">
                <span>✉</span> <span>webncodetechnologies@gmail.com</span>
              </p>
              <p className="flex items-center justify-end gap-1.5">
                <span>✆</span> <span>+91 8947919195</span>
              </p>
            </div>
          </div>

          {/* Date & Addressee */}
          <div className="mt-6 space-y-1">
            <p className="font-semibold text-[#1e293b]">
              <span className="text-[#64748b]">Date: </span>
              <span>{intern.offerLetterDate || '1 July 2026'}</span>
            </p>
            <div className="mt-3">
              <p className="text-[#475569] font-medium">To</p>
              <p className="font-bold text-[#0f172a] text-[15px]">{intern.name}</p>
              <p className="font-mono text-[#334155] text-[12.5px] mt-0.5">
                <span className="font-semibold">Ref – </span>
                <span>{intern.offerLetterRef || 'WNC/SI/FSD/26/001'}</span>
              </p>
              <p className="font-bold text-[#0284c7] text-[14.5px] mt-2 pb-1 inline-block border-b-2 border-[#0284c7]">
                Subject – Summer Internship Offer Letter
              </p>
            </div>
          </div>

          {/* Salutation */}
          <p className="mt-4 font-bold text-[#0f172a]">Dear {firstName},</p>

          {/* Main Body */}
          <div className="mt-3 space-y-3 leading-relaxed text-[#334155] text-[13px]" style={{ letterSpacing: '0.02px' }}>
            <p>
              This is to inform you that <strong className="text-[#0f172a]">{intern.name}</strong>
              {intern.course && intern.course.trim() ? (
                <>
                  , a student of <strong className="text-[#0f172a]">{intern.course}</strong>
                </>
              ) : null}
              {intern.college && intern.college.trim() ? (
                <>
                  {' '}at <strong className="text-[#0f172a]">{intern.college}</strong>
                </>
              ) : null}
              , has been offered an <span className="capitalize">{intern.mode || 'offline'}</span> summer internship at{' '}
              <strong className="text-[#0f172a]">Web n Code Technologies, Jaipur</strong>
              {intern.duration || (intern.startDate && intern.endDate) ? (
                <>
                  , for the period from{' '}
                  <strong className="text-[#0f172a]">{intern.duration || `${intern.startDate} to ${intern.endDate}`}</strong>
                </>
              ) : null}
              . This summer internship will provide you with valuable hands-on experience and exposure to industry best
              practices, enhancing your technical and professional skills.
            </p>

            <p>
              You will be working on a <strong className="text-[#0f172a]">{intern.domain || 'Full Stack Development'}</strong>{' '}
              summer internship. We wish you all the best for your future endeavors.
            </p>
          </div>

          {/* Details Section */}
          <div className="mt-5" style={{ letterSpacing: '0.02px' }}>
            <h3 className="font-bold text-[#0f172a] text-[13.5px] uppercase tracking-wide border-b border-[#e2e8f0] pb-1 mb-2 text-[#0284c7]">
              Summer Internship Details:
            </h3>
            <ul className="space-y-1.5 text-[13px] text-[#334155] pl-4 list-disc marker:text-[#0284c7]">
              {intern.domain && intern.domain.trim() ? (
                <li>
                  <strong className="text-[#0f172a]">Position:&nbsp;</strong>
                  <span>{intern.domain}</span>
                </li>
              ) : null}
              {intern.department && intern.department.trim() ? (
                <li>
                  <strong className="text-[#0f172a]">Department:&nbsp;</strong>
                  <span>{intern.department}</span>
                </li>
              ) : null}
              {intern.duration || (intern.startDate && intern.endDate) ? (
                <li>
                  <strong className="text-[#0f172a]">Duration:&nbsp;</strong>
                  <span>{intern.duration || `${intern.startDate} to ${intern.endDate}`}</span>
                </li>
              ) : null}
              {intern.stipend && intern.stipend.trim() ? (
                <li>
                  <strong className="text-[#0f172a]">Stipend:&nbsp;</strong>
                  <span>{intern.stipend}</span>
                </li>
              ) : null}
              {intern.location && intern.location.trim() ? (
                <li>
                  <strong className="text-[#0f172a]">Location:&nbsp;</strong>
                  <span>{intern.location}</span>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-5" style={{ letterSpacing: '0.02px' }}>
            <h3 className="font-bold text-[#0f172a] text-[13.5px] uppercase tracking-wide border-b border-[#e2e8f0] pb-1 mb-2 text-[#0284c7]">
              Terms and Conditions:
            </h3>
            <ul className="space-y-1.5 text-[12.5px] text-[#334155] pl-4 list-disc marker:text-[#0284c7]">
              <li>This summer internship does not constitute an offer of employment.</li>
              <li>You are expected to adhere to the confidentiality policies of the company.</li>
              <li>
                Any intellectual property developed during the summer internship shall remain the property of Web n Code
                Technologies.
              </li>
              <li>
                You are required to maintain professionalism and ethical conduct throughout the summer internship period.
              </li>
            </ul>
          </div>

          {/* Acceptance Callout */}
          <div
            className="mt-5 text-[12.5px] text-[#334155] leading-relaxed bg-[#f0f9ff] p-3 rounded border border-[#bae6fd]"
            style={{ letterSpacing: '0.02px' }}
          >
            To confirm your acceptance of this offer, kindly sign and return a copy of this letter by:{' '}
            <strong className="text-[#0f172a]">{intern.acceptanceDueDate || '3rd July 2026'}</strong>. Should you have any
            questions or require further information, please feel free to reach out. We are excited to welcome you and are
            confident that this summer internship will be a valuable and enriching experience for you.
          </div>

          {/* Signatory Section */}
          <div className="mt-6 flex justify-between items-end" style={{ letterSpacing: '0.02px' }}>
            <div>
              <p className="font-bold text-[#0f172a] text-[13.5px]">Warm Regards,</p>
              <p className="font-extrabold text-[#0f172a] text-[14px] mt-0.5">For Web n Code Technologies</p>

              {/* Signature Image */}
              <div className="h-16 my-1 flex items-center">
                <img
                  src="/intern-assets/narendra_signature.png"
                  alt="Narendra Singh Chaudhary Signature"
                  className="h-14 w-auto object-contain"
                />
              </div>

              <div className="border-t border-[#94a3b8] pt-1 w-64">
                <p className="font-bold text-[#0f172a] text-[13px]">Authorized Signatory,</p>
                <p className="font-bold text-[#0f172a] text-[13px]">Mr. Narendra Singh Chaudhary</p>
                <p className="text-[#475569] text-[12px] font-medium">(Founder/Director)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div
          className="mt-8 pt-3 border-t-2 border-[#0284c7] text-center text-[11px] text-[#475569] space-y-1 relative z-10"
          style={{ letterSpacing: '0.02px' }}
        >
          <p className="font-medium">
            <span className="text-[#0284c7]">mailto:webncodetechnologies@gmail.com</span> |{' '}
            <span className="text-[#334155]">+91 8947919195</span> |{' '}
            <span className="font-bold text-[#0f172a]">www.webncode.in</span>
          </p>
          <p className="text-[#64748b]">Jaipur, Rajasthan, India</p>
        </div>
      </div>
    )
  }
)

OfferLetterDocument.displayName = 'OfferLetterDocument'
