import { useEffect } from 'react'
import { company } from '../../data/company'

export type LegalTabType = 'privacy' | 'terms' | 'refund' | 'shipping'

interface LegalModalProps {
  isOpen: boolean
  activeTab: LegalTabType
  onClose: () => void
  onTabChange: (tab: LegalTabType) => void
}

export default function LegalModal({
  isOpen,
  activeTab,
  onClose,
  onTabChange,
}: LegalModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs: { id: LegalTabType; label: string; icon: string }[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
    { id: 'terms', label: 'Terms of Service', icon: '📜' },
    { id: 'refund', label: 'Cancellation & Refund', icon: '💳' },
    { id: 'shipping', label: 'Shipping & Delivery', icon: '🚀' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs font-mono">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_#0f172a] overflow-hidden z-10 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#ebebeb] border-b-2 border-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-[#ff9e7d] border-2 border-slate-900 rounded-lg text-base sm:text-lg shadow-[2px_2px_0px_0px_#000]">
              ⚖️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-tight leading-tight">
                {company.name}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-600 font-bold">
                Official Legal Agreements & Compliance Documents
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white hover:bg-rose-100 border-2 border-slate-900 rounded-full font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-colors"
            title="Close popup"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-2.5 bg-[#f8fafc] border-b-2 border-slate-900 shrink-0">
          {tabs.map((t) => {
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg border-2 border-slate-900 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#ff9e7d]'
                    : 'bg-white hover:bg-slate-100 text-slate-700 shadow-[1px_1px_0px_0px_#000]'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-xs sm:text-sm font-sans leading-relaxed text-slate-800">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b-2 border-slate-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded font-mono inline-block mb-1">
                  IT ACT 2000 & DPDP ACT 2023 COMPLIANCE
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase font-mono text-slate-900">
                  Privacy Policy
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Last Updated: October 8, 2026 | Effective across all Web n Code platforms
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">1. Commitment to Data Privacy</h4>
                <p>
                  <strong>{company.name}</strong> (&ldquo;Web n Code&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is committed to safeguarding personal and institutional data. This policy details how we collect, store, and process records when you access our platforms, software applications (School ERP Pro, Attendance Management, Web Builder Pro), or partner portals.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">2. Information We Collect</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Client Institutional Details:</strong> School name, principal/management contact, authorized phone numbers, official email, billing address, GSTIN.</li>
                  <li><strong>Student & Academic Records:</strong> As a cloud SaaS processor, school ERP data (attendance, grades, parent phone numbers) is processed exclusively under institutional authorization.</li>
                  <li><strong>Partner / Affiliate Details:</strong> Legal name, contact details, bank account, and UPI ID for authorized commission settlements.</li>
                  <li><strong>Technical Logs:</strong> IP address, browser type, device information, and authentication security logs.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">3. Purpose & Data Security</h4>
                <p>
                  Data is processed strictly for authenticating accounts, delivering cloud ERP instances, generating tax invoices, and providing post-launch support. All communications are protected using 256-bit SSL/TLS encryption. We do <strong>NOT</strong> sell, trade, or rent client records to third-party advertisers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">4. Third-Party Sub-processors</h4>
                <p>
                  Data is stored on secure cloud servers (VPS / MongoDB Atlas) and processed through RBI-authorized payment gateways (e.g., Razorpay) and TRAI-compliant transactional SMS/WhatsApp gateways.
                </p>
              </section>

              <section className="p-3.5 bg-amber-50 border-2 border-slate-900 rounded-xl space-y-1 font-mono text-xs">
                <h4 className="font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>Grievance Redressal Officer</span>
                </h4>
                <p><strong>Designation:</strong> Grievance Officer, {company.name}</p>
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p><strong>Phone:</strong> {company.phone} (Mon–Sat, 10 AM – 6 PM IST)</p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b-2 border-slate-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#93c5fd] border border-slate-900 rounded font-mono inline-block mb-1">
                  CONTRACTUAL AGREEMENT
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase font-mono text-slate-900">
                  Terms of Service
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Last Updated: October 8, 2026 | Governing all product subscriptions & client access
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">1. Acceptance of Terms</h4>
                <p>
                  By accessing <strong>webncode.com</strong>, subscribing to our SaaS software, or registering administrative credentials, you agree to comply with and be bound by these Terms of Service.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">2. Intellectual Property & License</h4>
                <p>
                  All software code, algorithms, user interfaces, branding, and designs remain the proprietary intellectual property of <strong>{company.name}</strong>. Clients receive a non-exclusive, non-transferable revocable license to utilize the subscribed software modules during the active subscription period. Reverse engineering, decompilation, or unauthorized sublicensing is strictly prohibited.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">3. Subscription, Pricing & Billing</h4>
                <p>
                  Software access is billed on recurring terms (Annual / Term-based) as outlined in your official Service Proposal. All charges are subject to statutory Goods and Services Tax (GST) under Indian tax laws. Subscriptions must be renewed prior to expiry to ensure uninterrupted cloud operations.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">4. Service Uptime & Limitation of Liability</h4>
                <p>
                  We strive for a 99.5% service availability SLA. In no event shall Web n Code Technologies be held liable for indirect, incidental, or consequential damages. Aggregate liability under any claim is capped at the subscription fees received by Web n Code in the preceding 3 months.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">5. Governing Law & Jurisdiction</h4>
                <p>
                  These Terms are governed by the laws of India. Any legal dispute or controversy shall fall under the exclusive jurisdiction of the competent courts in <strong>Jaipur, Rajasthan, India</strong>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: CANCELLATION & REFUND */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="border-b-2 border-slate-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#fde047] border border-slate-900 rounded font-mono inline-block mb-1">
                  PAYMENT GATEWAY COMPLIANCE
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase font-mono text-slate-900">
                  Cancellation & Refund Policy
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Last Updated: October 8, 2026 | Transparent refund and cancellation guidelines
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">1. Pre-Purchase Live Demonstrations</h4>
                <p>
                  Web n Code provides <strong>free comprehensive live demonstrations</strong> of our software solutions prior to onboarding so institutions can thoroughly verify features, workflows, and compatibility before committing to a purchase.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">2. Cancellation Terms</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Upcoming Renewals:</strong> Subscriptions can be cancelled by submitting written notice at least <strong>15 business days</strong> prior to the renewal date.</li>
                  <li><strong>Pre-Deployment:</strong> If a cancellation is requested within 24 hours of payment before cloud instance setup has started, a full refund (minus nominal gateway fees) is issued.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">3. Refund Eligibility & Exclusions</h4>
                <p>
                  Refunds are approved in cases of duplicate charges, non-delivery of credentials beyond committed SLA (&gt;7 days), or major unresolved technical defects confirmed by our engineering team within 7 days of escalation. Refunds are not provided for change of mind after instance customization and data migration have begun.
                </p>
              </section>

              <section className="p-4 bg-emerald-50 border-2 border-slate-900 rounded-xl space-y-1 font-mono text-xs">
                <h4 className="font-black uppercase text-emerald-950 flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>Refund Processing Timeline: 5 to 7 Working Days</span>
                </h4>
                <p className="text-slate-700 font-sans">
                  Approved refunds are credited directly to the <strong>original payment method</strong> (Bank Account / UPI / Card) within <strong>5 to 7 business days</strong>.
                </p>
                <p className="text-slate-500 font-mono pt-1">
                  To request a refund, email: <strong>{company.email}</strong> with your school name & invoice number.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="border-b-2 border-slate-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#86efac] border border-slate-900 rounded font-mono inline-block mb-1">
                  DIGITAL SAAS FULFILLMENT
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase font-mono text-slate-900">
                  Shipping & Delivery Policy
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Last Updated: October 8, 2026 | Electronic delivery & cloud instance provisioning
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">1. 100% Digital Electronic Delivery</h4>
                <p>
                  <strong>{company.name}</strong> delivers cloud software applications and web-based SaaS platforms. We do <strong>NOT</strong> dispatch physical packages, CDs, or hardware units. Zero physical shipping or courier transit charges apply to any service.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">2. Delivery Timelines</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 border border-slate-900 rounded-lg">
                    <span className="font-black font-mono text-xs block text-slate-900 mb-0.5">⚡ Standard SaaS Modules</span>
                    <p className="text-xs text-slate-600">Provisioned and delivered electronically within <strong>24 to 48 business hours</strong> of payment confirmation.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-900 rounded-lg">
                    <span className="font-black font-mono text-xs block text-slate-900 mb-0.5">🛠️ Custom Institutional Setup</span>
                    <p className="text-xs text-slate-600">Complex multi-branch deployments and custom data imports are delivered within <strong>7 to 14 business days</strong>.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-black text-sm uppercase font-mono text-slate-900">3. Mode of Delivery & Confirmation</h4>
                <p>
                  Dedicated instance URLs, administrator credentials, and setup walkthroughs are delivered directly to the client&apos;s authorized email address and registered WhatsApp number. Fulfillment is complete once administrative credentials are provided and tested.
                </p>
              </section>

              <section className="p-3 bg-slate-100 border border-slate-900 rounded-lg font-mono text-xs">
                <p><strong>Deployment Desk:</strong> {company.email} | {company.phone}</p>
                <p><strong>Office:</strong> {company.address}</p>
              </section>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#f1f5f9] border-t-2 border-slate-900 flex items-center justify-between shrink-0 font-mono text-xs">
          <span className="text-slate-500 font-bold truncate">
            {company.name} • Registered in Jaipur, Rajasthan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-black uppercase shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
