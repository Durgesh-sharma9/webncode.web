import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast } from '../../components/ui/Toast'

export default function AffiliateLinks() {
  const { user } = useAuth()
  const referralCode = user?.affiliate?.referralCode || 'REF'
  const allowedProducts = user?.affiliate?.allowedProducts || []
  const origin = window.location.origin

  const mainLink = `${origin}/?ref=${referralCode}`

  const allProductLinks = [
    {
      name: 'School ERP Pro',
      slug: 'school-erp-pro',
      description: 'Complete school management ERP (students, fees, attendance, results, parent portal).',
      url: `${origin}/products/school-erp-pro?ref=${referralCode}`
    },
    {
      name: 'Timetable Pro',
      slug: 'timetable-pro',
      description: 'Smart academic scheduling, teacher allocation & period management.',
      url: `${origin}/products/timetable-pro?ref=${referralCode}`
    },
    {
      name: 'Attendance Management System',
      slug: 'attendance-management-system',
      description: 'Biometric integration, SMS absence alerts, and automated monthly analytics.',
      url: `${origin}/products/attendance-management-system?ref=${referralCode}`
    },
    {
      name: 'Result Management System',
      slug: 'result-management-system',
      description: 'Grade card generation, marksheet printing, and performance rank sheets.',
      url: `${origin}/products/result-management-system?ref=${referralCode}`
    },
    {
      name: 'Web Builder Pro',
      slug: 'web-builder-pro',
      description: 'No-code dynamic website builder for schools, colleges, and academies.',
      url: `${origin}/products/web-builder-pro?ref=${referralCode}`
    }
  ]

  const productLinks = allowedProducts.length > 0
    ? allProductLinks.filter((p) => allowedProducts.includes(p.name))
    : allProductLinks

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const handleCopy = (link: string, slug: string) => {
    navigator.clipboard.writeText(link)
    setCopiedSlug(slug)
    showSuccessToast('Link copied to clipboard!')
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  // QR Code URL via reliable public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(mainLink)}`

  return (
    <div className="space-y-6 font-mono text-slate-900">
      
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#dbeafe] border border-slate-900 rounded">
          PROMOTION ENGINE
        </span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight mt-1">
          Referral Links & Marketing Kit
        </h1>
        <p className="text-xs text-slate-600 font-bold">
          Share these links on WhatsApp, email, or in client meetings. Any visitor who inquires is automatically linked to your account.
        </p>
      </div>

      {/* Main Link & QR Code Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Link Box */}
        <div className="lg:col-span-2 bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Primary Website Referral Link
              </span>
              <span className="px-2 py-0.5 bg-blue-100 border border-blue-600 text-blue-800 rounded font-black text-xs">
                Code: {referralCode}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 mb-2">
              All-In-One Company Showcase Link
            </h3>
            <p className="text-xs text-slate-600 mb-4 font-bold">
              Sends schools or clients to the official Web n Code homepage. Includes interactive demos, why choose us, client testimonials, and product previews.
            </p>

            <div className="p-3 bg-[#f8fafc] border-2 border-slate-900 rounded-lg flex items-center justify-between gap-3 overflow-hidden">
              <span className="font-mono text-xs text-blue-700 font-bold truncate">
                {mainLink}
              </span>
              <button
                onClick={() => handleCopy(mainLink, 'main')}
                className="px-3 py-1.5 bg-[#86efac] border border-slate-900 rounded font-black text-xs uppercase hover:bg-[#4ade80] transition-colors whitespace-nowrap shadow-[1px_1px_0px_0px_#000]"
              >
                {copiedSlug === 'main' ? 'Copied ✓' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Quick Pitching Tips */}
          <div className="mt-6 pt-4 border-t-2 border-slate-100 text-xs text-slate-600 space-y-1">
            <p className="font-black uppercase text-slate-900">💡 How cookie & link tracking works:</p>
            <p>1. When anyone clicks your link, your referral tag is securely recorded in their browser session.</p>
            <p>2. If they fill out the contact form or request a demo, that lead will appear under your partner portal instantly.</p>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
            Instant Scan QR Code
          </span>
          <div className="p-3 border-2 border-slate-900 rounded-lg bg-white shadow-[2px_2px_0px_0px_#000] mb-3">
            <img src={qrCodeUrl} alt="Referral QR Code" className="w-36 h-36 object-contain" />
          </div>
          <p className="text-[11px] text-slate-600 font-bold max-w-[200px]">
            Show this QR code to school principals or decision makers to open your referral link directly on their mobile phone.
          </p>
        </div>

      </div>

      {/* Product-Specific Referral Links */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black uppercase text-slate-900 tracking-tight">
                Product-Specific Referral Links
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#fef08a] border border-slate-900 rounded">
                {allowedProducts.length > 0 ? `${productLinks.length} Permitted Products` : 'All Products Access'}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              Promoting a specific software? Send direct product links with pre-configured features and live demo screens.
            </p>
          </div>
        </div>

        {productLinks.length === 0 ? (
          <div className="p-8 bg-white border-2 border-slate-900 rounded-xl text-center shadow-[3px_3px_0px_0px_#000]">
            <p className="text-sm font-black uppercase text-slate-700">No authorized products assigned</p>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Your partner account does not have any active product permissions yet. Contact SuperAdmin to enable access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productLinks.map((prod) => (
            <div
              key={prod.slug}
              className="bg-white border-2 border-slate-900 rounded-lg p-4 shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-black uppercase text-sm text-slate-900">{prod.name}</h3>
                  <span className="text-[9px] font-black uppercase bg-slate-100 border border-slate-900 px-1.5 py-0.5 rounded">
                    Direct Link
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-bold mb-3">{prod.description}</p>
              </div>

              <div className="p-2 bg-[#f8fafc] border border-slate-900 rounded flex items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-blue-700 truncate font-mono">
                  {prod.url}
                </span>
                <button
                  onClick={() => handleCopy(prod.url, prod.slug)}
                  className="px-2.5 py-1 bg-white border border-slate-900 rounded font-black text-[10px] uppercase hover:bg-[#ff9e7d] transition-colors whitespace-nowrap shadow-[1px_1px_0px_0px_#000]"
                >
                  {copiedSlug === prod.slug ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

    </div>
  )
}
