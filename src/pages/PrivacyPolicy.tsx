import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company } from '../data/company'

export default function PrivacyPolicy() {
  const lastUpdated = 'October 8, 2026'

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative selection:bg-[#ff9e7d] pb-24 font-sans">
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
                GOOGLE API LIMITED USE COMPLIANT
              </span>
              <span className="rounded border border-slate-900 bg-[#93c5fd] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono">
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
              Last Updated: <span className="text-slate-900 underline font-black">{lastUpdated}</span> | Umbrella Policy for{' '}
              <span className="text-slate-900 font-black">webncode.in</span> & all associated applications.
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

        {/* Application Scope Banner */}
        <div className="mb-8 p-4 sm:p-5 bg-[#fef9c3] border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase font-mono text-slate-900">
                Single Unified Policy for All Web n Code Applications
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1">
                All applications developed by <strong>Web n code Technologies</strong> (including <strong>Syllabus Tracker</strong>,{' '}
                <strong>CampusCRM</strong>, <strong>TimeTablePro</strong>, <strong>TestMaster</strong>, and <strong>School ERP Pro</strong>) are hosted under the umbrella domain{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-slate-900 font-bold font-mono">webncode.in</code> and share the unified Google Cloud Project consent parameters. This policy covers all apps and user accounts across our ecosystem.
              </p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] space-y-9 leading-relaxed text-slate-800 text-sm sm:text-base">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              1. Introduction & Scope
            </h2>
            <p>
              Welcome to <strong>Web n code Technologies</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We operate the primary domain{' '}
              <strong>webncode.in</strong> (as well as <strong>webncode.com</strong>) and our dedicated suite of web applications and SaaS tools, including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-900 rounded flex items-center gap-2">
                <span className="text-base">📚</span>
                <span><strong>Syllabus Tracker</strong> (Curriculum & Lesson Manager)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-900 rounded flex items-center gap-2">
                <span className="text-base">🏫</span>
                <span><strong>CampusCRM</strong> (School Admissions & Lead CRM)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-900 rounded flex items-center gap-2">
                <span className="text-base">⏰</span>
                <span><strong>TimeTablePro</strong> (Automated Class & Faculty Scheduling)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-900 rounded flex items-center gap-2">
                <span className="text-base">📝</span>
                <span><strong>TestMaster</strong> (Examination, Question Paper & Results Suite)</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-900 rounded flex items-center gap-2 sm:col-span-2">
                <span className="text-base">🎒</span>
                <span><strong>School ERP Pro</strong> (Integrated Campus Management & Student Information System)</span>
              </div>
            </div>
            <p>
              This Privacy Policy describes how your personal information and third-party account data (specifically Google user data) are collected, accessed, stored, utilized, and protected when you visit our website, use any of our web applications, or interact with our services.
            </p>
            <p>
              This document complies with India&apos;s <strong>Information Technology Act, 2000</strong>, the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, and the <strong>Google API Services User Data Policy</strong> (including Limited Use requirements).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              2. Information We Collect
            </h2>
            <p>
              Depending on which Web n Code application you interact with, we collect only the minimal data required to provide and authenticate services:
            </p>

            <div className="space-y-4 pl-2 sm:pl-4 border-l-4 border-slate-900">
              {/* Google Account Information */}
              <div className="p-4 bg-sky-50/60 border-2 border-slate-900 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔑</span>
                  <h3 className="font-black text-slate-900 uppercase font-mono text-sm sm:text-base">
                    A. Google Account Information (OAuth 2.0 Sign-In)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  When you sign in to our applications (such as Syllabus Tracker, CampusCRM, TimeTablePro, or TestMaster) using <strong>Google OAuth (&ldquo;Sign in with Google&rdquo;)</strong>, we collect basic profile details:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li><strong>Full Name:</strong> To personalize your dashboard and account profile.</li>
                  <li><strong>Email Address:</strong> To verify your identity, send critical notifications, and maintain your account login session.</li>
                  <li><strong>Google User Identifier:</strong> A unique numerical ID to securely authenticate future logins.</li>
                  <li><strong>Profile Avatar URL (Optional):</strong> To display your user avatar within the application header.</li>
                </ul>
              </div>

              {/* Google Drive Data */}
              <div className="p-4 bg-amber-50/70 border-2 border-slate-900 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📂</span>
                  <h3 className="font-black text-slate-900 uppercase font-mono text-sm sm:text-base">
                    B. Google Drive Data (Specifically for Syllabus Tracker)
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  <strong>Syllabus Tracker</strong> requests authorized access to Google Drive (using Google Drive API scopes such as <code className="bg-white px-1.5 py-0.5 rounded border border-slate-900 font-mono text-xs">drive.file</code>) strictly to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs sm:text-sm">
                  <li><strong>Read & Open:</strong> Access syllabus files, curriculum outlines, and course materials you select or upload.</li>
                  <li><strong>Save & Organize:</strong> Save lesson plans, syllabus progression, and educational tracker documents directly into your Google Drive storage folder.</li>
                  <li><strong>Sync Workflow:</strong> Keep your syllabus tracker status synchronized across your devices without storing duplicate copies on external servers.</li>
                </ul>
                <div className="mt-2 p-2.5 bg-white border border-slate-900 rounded text-xs text-slate-800 font-bold">
                  ⚠️ Note: Syllabus Tracker does NOT scan, index, read, or access any other personal files, photos, or documents stored in your Google Drive that are not associated with Syllabus Tracker.
                </div>
              </div>

              {/* Institutional & Client Data */}
              <div>
                <h3 className="font-black text-slate-900 uppercase font-mono text-sm">
                  C. School & Organization Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  For institutional subscriptions (School ERP, CampusCRM, TimeTablePro, TestMaster), schools provide authorized administrator names, official school email addresses, teacher schedules, exam schedules, and billing information.
                </p>
              </div>

              {/* Technical Data */}
              <div>
                <h3 className="font-black text-slate-900 uppercase font-mono text-sm">
                  D. Technical & Usage Log Data
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  Standard technical logs including browser type, operating system, IP address, and request timestamps are collected solely for performance monitoring, bug troubleshooting, and threat mitigation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Google Limited Use Disclosure */}
          <section className="space-y-3 p-5 sm:p-6 bg-emerald-50 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#000]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-base sm:text-lg font-black uppercase font-mono text-slate-900">
                3. Google API Services User Data Policy Compliance (Limited Use Disclosure)
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Web n code Technologies&apos; use and transfer of information received from Google APIs to any other app will adhere to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline font-black hover:text-blue-900"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-800 pt-1">
              <p>In accordance with Google&apos;s Limited Use restrictions:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>
                  <strong>No Third-Party Sharing:</strong> We do NOT sell, rent, license, or share user personal data or Google Drive files with any third parties, brokers, or data aggregators.
                </li>
                <li>
                  <strong>No Advertising Use:</strong> Data received through Google APIs is never used for serving advertisements, retargeting, or promotional marketing.
                </li>
                <li>
                  <strong>No AI/ML Model Training:</strong> We do NOT use Google user data or Google Drive files to train, retrain, or improve generalized artificial intelligence (AI) or machine learning (ML) models.
                </li>
                <li>
                  <strong>No Human Inspection:</strong> Humans (including Web n code employees) are prohibited from reading your Google Drive files, unless you explicitly request customer support assistance for a specific file, or where required to comply with law or prevent security breaches.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              4. How We Use Your Information
            </h2>
            <p>We process your data strictly to deliver educational tools and seamless software workflows:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700">
              <li>
                <strong>To provide, maintain, and secure our applications:</strong> Powering Syllabus Tracker, CampusCRM, TimeTablePro, TestMaster, and our School ERP platform.
              </li>
              <li>
                <strong>To sync and manage educational documents:</strong> Syncing lesson plans and syllabus documentation directly within your connected cloud storage.
              </li>
              <li>
                <strong>Identity Authentication:</strong> Validating your identity via Google OAuth to prevent unauthorized account takeovers.
              </li>
              <li>
                <strong>Customer Assistance:</strong> Resolving technical inquiries and maintaining uptime for classroom schedules and student modules.
              </li>
            </ul>
            <div className="p-3 bg-rose-50 border-2 border-slate-900 rounded-lg text-xs font-bold text-rose-900 font-mono">
              🚫 Strict Policy: We never sell, rent, or trade your personal data or Google Drive files with third parties.
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              5. Data Security, Retention & User Control
            </h2>
            <p>
              We employ enterprise-grade security protocols to protect your personal information and connected Google workspace data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  🔒 HTTPS & 256-Bit Encryption
                </span>
                <p className="text-xs text-slate-600">
                  All communications between your browser, our servers, and Google APIs are encrypted in transit via HTTPS using TLS 1.3 / 256-bit SSL protocols.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  🎯 Principle of Least Privilege
                </span>
                <p className="text-xs text-slate-600">
                  Application access scopes are strictly narrowed to the minimum permissions needed to perform core functionality (e.g. per-file Drive access).
                </p>
              </div>
            </div>

            <div className="p-4 bg-purple-50/80 border-2 border-slate-900 rounded-xl space-y-2 mt-3">
              <h3 className="font-black text-slate-900 uppercase font-mono text-xs sm:text-sm flex items-center gap-2">
                <span>🔄</span>
                <span>Revoking Access to Your Google Account</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                You retain complete control over your Google credentials. You can view or revoke Web n code Technologies&apos; access to your Google Account and Google Drive at any time directly through Google:
              </p>
              <div className="pt-1">
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white font-mono text-xs font-black uppercase rounded border border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-800"
                >
                  <span>Open Google Security Settings</span>
                  <span>↗</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Direct URL: https://myaccount.google.com/permissions
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <h3 className="font-black text-slate-900 uppercase font-mono text-xs sm:text-sm">
                Data Retention & Account Deletion Requests
              </h3>
              <p className="text-xs sm:text-sm text-slate-700">
                We store your account profile and authentication tokens only for as long as your account remains active. If you stop using our apps or wish to permanently delete all stored profile records and cached tokens from our servers, simply email us at{' '}
                <a href="mailto:webncodetechnologies@gmail.com" className="text-blue-700 font-bold hover:underline">
                  webncodetechnologies@gmail.com
                </a>
                . Deletion requests are processed within 48 to 72 business hours.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              6. Third-Party Infrastructure & Sub-processors
            </h2>
            <p>
              We do not sell personal data. We only utilize trusted cloud hosting infrastructure under strict data processing agreements:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li><strong>Cloudflare & Secure VPS:</strong> For SSL termination, DDoS protection, and cloud application hosting.</li>
              <li><strong>MongoDB Atlas:</strong> Encrypted-at-rest database storage for tenant configurations.</li>
              <li><strong>Payment Processors (Razorpay):</strong> PCI-DSS compliant gateways for processing subscription invoices.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              7. Your Legal Privacy Rights
            </h2>
            <p>Under Indian DPDP Act 2023 and standard international data privacy principles, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li>Access and review personal information we hold about you.</li>
              <li>Request correction or rectification of any incomplete or inaccurate data.</li>
              <li>Request full erasure and deletion of your profile from our systems.</li>
              <li>Withdraw your consent to data processing at any time.</li>
            </ul>
          </section>

          {/* Section 8: Contact Us */}
          <section className="space-y-3 p-4 sm:p-5 bg-amber-50/80 border-2 border-slate-900 rounded-xl">
            <h2 className="text-base sm:text-lg font-black uppercase font-mono text-slate-900 flex items-center gap-2">
              <span>📬</span>
              <span>8. Contact Us & Privacy Inquiries</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy, your Google data handling, or wish to exercise your privacy rights, please reach out directly:
            </p>

            <div className="bg-white border-2 border-slate-900 rounded-lg p-3.5 space-y-1.5 text-xs sm:text-sm font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
              <p><strong>Company:</strong> Web n code Technologies</p>
              <p><strong>Entity / Project:</strong> Web n code Technologies Suite (webncode.in / webncode.com)</p>
              <p>
                <strong>Support Email:</strong>{' '}
                <a href="mailto:webncodetechnologies@gmail.com" className="text-blue-700 hover:underline font-bold">
                  webncodetechnologies@gmail.com
                </a>
              </p>
              <p><strong>Phone:</strong> {company.phone}</p>
              <p><strong>Registered Address:</strong> {company.address}</p>
              <p><strong>Operating Hours:</strong> Monday – Saturday (10:00 AM – 6:00 PM IST)</p>
            </div>
            <p className="text-xs text-slate-500 italic">
              All privacy and verification inquiries sent to{' '}
              <span className="font-bold text-slate-800">webncodetechnologies@gmail.com</span> receive a response within 24 to 48 hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
