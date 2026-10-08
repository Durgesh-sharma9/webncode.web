import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company } from '../data/company'

export default function PrivacyPolicy() {
  const lastUpdated = 'October 8, 2026'

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative selection:bg-[#ff9e7d] pb-20 font-sans">
      {/* Background Micro Grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 lg:pt-28 bg-[#ebebeb] border-b-2 border-slate-900 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-left">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono shadow-[2px_2px_0px_0px_#0f172a]">
                LEGAL COMPLIANCE
              </span>
              <span className="rounded border border-slate-900 bg-[#86efac] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono">
                IT ACT 2000 & DPDP ACT 2023
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-tight font-mono">
              PRIVACY <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_#0f172a]">
                POLICY
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-bold text-slate-600 font-mono">
              Last Updated: <span className="text-slate-900 underline font-black">{lastUpdated}</span> | Effective for all products, websites, and services operated by {company.name}.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Legal Content Container */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Navigation Tabs between Legal Docs */}
        <div className="mb-8 flex flex-wrap gap-2 pb-4 border-b-2 border-slate-900 font-mono text-xs">
          <Link
            to="/privacy-policy"
            className="px-3.5 py-1.5 bg-slate-900 text-white border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000]"
          >
            🔒 Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            📜 Terms of Service
          </Link>
          <Link
            to="/cancellation-refund"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            💳 Cancellation & Refund
          </Link>
          <Link
            to="/shipping-delivery"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            🚀 Digital Delivery Policy
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] space-y-8 leading-relaxed text-slate-800 text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              1. Introduction & Commitment
            </h2>
            <p>
              Welcome to <strong>{company.name}</strong> (&ldquo;Web n Code&rdquo;, &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). We specialize in developing and hosting specialized SaaS solutions, including School ERP Pro, Attendance Management Systems, Web Builder Pro, Campus CRM, and customized organizational platforms.
            </p>
            <p>
              We value your trust and are steadfastly dedicated to safeguarding your personal data and digital privacy. This Privacy Policy clarifies how we collect, store, process, transfer, and protect information when you visit our website (<strong>webncode.com</strong>), use our web and mobile applications, engage with our client portals, or partner with us as an affiliate representative.
            </p>
            <p>
              This policy is formulated in compliance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and India&apos;s <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              2. Information We Collect
            </h2>
            <p>
              We collect information to provide robust cloud software, verify school onboarding, deliver customer support, and ensure transactional security:
            </p>
            
            <div className="space-y-3 pl-2 sm:pl-4 border-l-4 border-slate-900">
              <div>
                <h3 className="font-black text-slate-900 uppercase font-mono text-sm">A. Information You Voluntarily Provide</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li><strong>Client & Organization Data:</strong> Institution name, principal/director name, authorized administrator phone numbers, official email addresses, billing addresses, and GST numbers.</li>
                  <li><strong>Inquiries & Contact Requests:</strong> Name, phone number, school location, and product interest submitted via contact forms or software demo requests.</li>
                  <li><strong>Partner / Affiliate Portal Data:</strong> Full legal name, phone number, email address, bank account details, and UPI ID for commission payouts.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-slate-900 uppercase font-mono text-sm">B. Student & Educational Records (Data Processor Role)</h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  When schools utilize our School ERP software, the respective educational institution acts as the <strong>Data Fiduciary / Controller</strong>, and Web n Code acts as the <strong>Data Processor</strong>. Student attendance, exam grades, timetable, and parent contact details entered into our systems are governed strictly by the school&apos;s authorization and used solely for institutional management.
                </p>
              </div>

              <div>
                <h3 className="font-black text-slate-900 uppercase font-mono text-sm">C. Technical & Usage Information</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li>IP address, browser type, device specifications, operating system, and session timestamps.</li>
                  <li>Log records generated during portal authentication to deter unauthorized access and identity theft.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              3. Purpose & Legal Basis of Processing
            </h2>
            <p>Your data is processed strictly for legitimate operational purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>Provision of Services:</strong> Creating and hosting dedicated school tenant databases, authenticating administrative accounts, and activating cloud features.</li>
              <li><strong>Demonstrations & Support:</strong> Scheduling software walkthroughs, responding to inquiries, and delivering post-launch maintenance.</li>
              <li><strong>Billing & Invoicing:</strong> Generating tax invoices, processing subscription renewals, and maintaining statutory accounting records under Indian tax laws.</li>
              <li><strong>Partner Settlements:</strong> Calculating and crediting authorized commission payouts to registered affiliates.</li>
              <li><strong>Security & Fraud Prevention:</strong> Protecting our infrastructure against unauthorized access, DDoS attacks, and security vulnerabilities.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              4. Data Protection & Security Architecture
            </h2>
            <p>
              We implement industry-standard administrative, technical, and physical security safeguards to protect data from accidental loss, destruction, alteration, or unauthorized disclosure:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">🔐 Data Encryption</span>
                <p className="text-xs text-slate-600">All data in transit is encrypted using 256-bit SSL/TLS protocol. Databases are secured behind strict firewall rules.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">🛡️ Access Restrictions</span>
                <p className="text-xs text-slate-600">Role-based access controls (RBAC) ensure only authorized personnel can access infrastructure under non-disclosure obligations.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">💾 Automated Backups</span>
                <p className="text-xs text-slate-600">Automated encrypted snapshots are maintained to prevent catastrophic data loss and ensure rapid disaster recovery.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">🚫 No Third-Party Selling</span>
                <p className="text-xs text-slate-600">We do NOT sell, rent, or trade your personal information or school client databases to marketing agencies or third parties.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              5. Data Sharing & Third-Party Service Providers
            </h2>
            <p>
              We only share information with reputable third-party sub-processors necessary to operate our cloud infrastructure, subject to confidentiality agreements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>Cloud Infrastructure Providers:</strong> Secure hosting environments (VPS, MongoDB Atlas, Cloudflare CDN) for reliable platform uptime.</li>
              <li><strong>Payment Gateways:</strong> RBI-authorized payment processors (e.g., Razorpay, Cashfree) for secure online collections. We do not store raw credit/debit card numbers or net banking passwords.</li>
              <li><strong>SMS & WhatsApp Gateway Partners:</strong> Authorized telecommunication providers for delivering transactional OTPs and school notifications.</li>
              <li><strong>Legal Authorities:</strong> Where mandated by court orders, statutory law, or governmental authorities under Indian jurisdiction.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              6. Data Retention Policy
            </h2>
            <p>
              We retain institutional and personal records only as long as necessary to fulfill the operational purposes detailed in this policy, maintain active software subscriptions, or adhere to statutory accounting and tax retention requirements under Indian laws. Upon contract expiry or formal account closure, client tenant data can be securely handed over or permanently deleted upon formal written request.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              7. Your Legal Rights
            </h2>
            <p>Under applicable Indian data protection principles, you possess the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li>Request confirmation regarding whether we process your personal data.</li>
              <li>Request correction or updating of inaccurate personal records.</li>
              <li>Request erasure of your personal data where retention is no longer legally mandated.</li>
              <li>Withdraw processing consent at any time for non-essential communications.</li>
            </ul>
          </section>

          {/* Section 8: Grievance Officer */}
          <section className="space-y-3 p-4 sm:p-5 bg-amber-50/80 border-2 border-slate-900 rounded-xl">
            <h2 className="text-base sm:text-lg font-black uppercase font-mono text-slate-900 flex items-center gap-2">
              <span>⚖️</span>
              <span>8. Grievance Officer & Statutory Contact</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700">
              In accordance with the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection Act, 2023</strong>, the details of our designated Grievance Officer are provided below:
            </p>
            
            <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 space-y-1 text-xs sm:text-sm font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
              <p><strong>Designation:</strong> Grievance Redressal Officer</p>
              <p><strong>Company:</strong> {company.name}</p>
              <p><strong>Address:</strong> {company.address}</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${company.email}`} className="text-blue-700 hover:underline font-bold">
                  {company.email}
                </a>
              </p>
              <p><strong>Phone:</strong> {company.phone}</p>
              <p><strong>Office Hours:</strong> Monday – Saturday (10:00 AM – 6:00 PM IST)</p>
            </div>
            <p className="text-xs text-slate-500 italic">
              All grievances received will be acknowledged within 24 hours and addressed within statutory timelines.
            </p>
          </section>

        </div>

      </div>
    </div>
  )
}
