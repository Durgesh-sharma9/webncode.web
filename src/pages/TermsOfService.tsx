import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company } from '../data/company'

export default function TermsOfService() {
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
                LEGAL AGREEMENT
              </span>
              <span className="rounded border border-slate-900 bg-[#93c5fd] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono">
                TERMS & CONDITIONS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-tight font-mono">
              TERMS OF <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_#0f172a]">
                SERVICE
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-bold text-slate-600 font-mono">
              Last Updated: <span className="text-slate-900 underline font-black">{lastUpdated}</span> | Governing the use of all Web n Code Technologies software platforms, client portals & services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Navigation Tabs between Legal Docs */}
        <div className="mb-8 flex flex-wrap gap-2 pb-4 border-b-2 border-slate-900 font-mono text-xs">
          <Link
            to="/privacy-policy"
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            🔒 Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="px-3.5 py-1.5 bg-slate-900 text-white border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000]"
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
              1. Agreement to Terms
            </h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) establish a legally binding contractual agreement between you (whether individually or representing an educational institution, organization, or corporate entity) and <strong>{company.name}</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), having its principal office at {company.address}.
            </p>
            <p>
              By accessing our website (<strong>webncode.in</strong> / <strong>webncode.com</strong>), registering an account, signing in with Google, subscribing to any software product (including <strong>Syllabus Tracker</strong>, <strong>CampusCRM</strong>, <strong>TimeTablePro</strong>, <strong>TestMaster</strong>, <strong>School ERP Pro</strong>, and <strong>Attendance Management System</strong>), or using our Affiliate portal, you explicitly acknowledge that you have read, understood, and agreed to be bound by all of these Terms.
            </p>
            <p className="text-xs text-slate-600 bg-amber-50 p-3 border border-amber-300 rounded font-mono">
              <strong>Notice:</strong> If you do not agree with all of these terms, you are expressly prohibited from using our services and must discontinue use immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              2. Intellectual Property Rights & License Grant
            </h2>
            <p>
              Unless otherwise clearly stated, all proprietary source code, software architecture, databases, UI/UX designs, algorithms, documentation, trademarks, and logos contained in our services are the exclusive intellectual property of <strong>{company.name}</strong> and are protected by applicable Indian copyright, patent, and trademark statutes.
            </p>
            <p>
              Subject to your compliance with these Terms and receipt of applicable subscription fees, Web n Code grants you a non-exclusive, non-transferable, revocable license to access and utilize the subscribed cloud SaaS modules solely for your internal institutional operations during the agreed active subscription term.
            </p>
            <p className="font-bold text-slate-900">You may not:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li>Modify, decompile, disassemble, or reverse-engineer any portion of the source code or platform backend.</li>
              <li>Sublicense, lease, rent, redistribute, or resell our software licenses without an executed Partner Agreement.</li>
              <li>Scrape, index, or extract data via automated bots or unauthorized crawlers.</li>
              <li>Circumvent or tamper with security measures, licensing validation tokens, or access controls.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              3. Client Accounts & Credential Security
            </h2>
            <p>
              To access institutional management dashboards, client administrators must complete registration with accurate, complete, and current institutional information. You are solely responsible for safeguarding the confidentiality of your login credentials (usernames, passwords, and 2FA tokens) and for all actions conducted under your account.
            </p>
            <p>
              You agree to notify Web n Code immediately at <strong>{company.email}</strong> upon detecting any suspected unauthorized account usage or security compromise.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              4. Subscription, Pricing & Billing Terms
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-700">
              <li><strong>Pricing Plans:</strong> Services are billed based on pre-agreed subscription tiers (Annual, Semi-Annual, or Term-based) as outlined in your official Service Proposal or Invoice.</li>
              <li><strong>Invoicing & Taxes:</strong> All pricing quotes are subject to applicable statutory Goods and Services Tax (GST) under Indian tax laws. Official GST tax invoices will be issued for all payments.</li>
              <li><strong>Payment Modes:</strong> Payments must be remitted via authorized banking channels (NEFT/RTGS, UPI, Corporate Net Banking, or authorized Payment Gateway partners).</li>
              <li><strong>Renewals:</strong> Subscriptions must be renewed prior to the expiration of the active service tenure to prevent automatic suspension of cloud instances or school portal access.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              5. Service Availability, SLA & Maintenance
            </h2>
            <p>
              We strive to maintain a <strong>99.5% service uptime</strong> for our cloud production environments. However, occasional scheduled maintenance windows, emergency server updates, or unavoidable third-party telecommunication disruptions may cause transient downtime.
            </p>
            <p>
              Whenever feasible, scheduled system upgrades are conducted during non-peak hours (night-time or weekends) with prior notification to client administrative contacts.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              6. Client Data Ownership & Data Protection
            </h2>
            <p>
              All academic, financial, attendance, and student records uploaded by an educational institution to their dedicated tenant instance remain the exclusive property of the client institution. Web n Code acts solely as a technological custodian and cloud processor.
            </p>
            <p>
              We treat client information with strict confidentiality and process it strictly in accordance with our <Link to="/privacy-policy" className="text-blue-700 underline font-bold">Privacy Policy</Link> and applicable Indian data protection laws.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              7. Affiliate & Partner Code of Conduct
            </h2>
            <p>
              Individuals registering as sales affiliates or authorized partners agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li>Represent Web n Code Technologies products honestly, accurately, and professionally.</li>
              <li>Not make false promises, misleading technical claims, or unauthorized contractual commitments.</li>
              <li>Submit only legitimate, verified institutional leads with direct principal/director contact information.</li>
              <li>Abide by the official commission payout schedules reviewed and approved by Web n Code administrators.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              8. Limitation of Liability & Warranty Disclaimer
            </h2>
            <p>
              Our software products and cloud services are provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, whether express or implied.
            </p>
            <p>
              To the fullest extent permitted by law, in no event shall <strong>{company.name}</strong>, its directors, employees, or partners be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, or special damages (including loss of profits, lost data, or business interruption) arising from your use of or inability to use the software.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              Our cumulative aggregate liability for any claims under these terms shall be limited to the total subscription fees paid by you to Web n Code in the three (3) months preceding the incident.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              9. Indemnification
            </h2>
            <p>
              You agree to defend, indemnify, and hold harmless {company.name}, its affiliates, officers, and staff from any claims, damages, liabilities, and expenses (including reasonable attorney fees) arising from your breach of these Terms, unauthorized data uploads, or infringement of third-party rights.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              10. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms and your use of our services are governed by and construed in accordance with the <strong>laws of the Republic of India</strong>, without regard to conflict of law principles.
            </p>
            <p className="bg-slate-100 p-3 border-2 border-slate-900 rounded font-mono text-xs sm:text-sm font-bold text-slate-900">
              Any legal dispute, controversy, or claim arising out of or relating to these Terms or our services shall be subject to the exclusive jurisdiction of the competent courts located in <strong>Jaipur, Rajasthan, India</strong>.
            </p>
          </section>

          {/* Section 11: Contact */}
          <section className="space-y-3 pt-3 border-t-2 border-slate-200">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900">
              11. Inquiries & Legal Notices
            </h2>
            <p className="text-xs sm:text-sm text-slate-700">
              For any questions regarding these Terms of Service or to issue a legal notice, please contact:
            </p>
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-lg p-4 font-mono text-xs space-y-1">
              <p><strong>Legal & Compliance Desk</strong></p>
              <p><strong>Entity:</strong> {company.name}</p>
              <p><strong>Address:</strong> {company.address}</p>
              <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-700 hover:underline">{company.email}</a></p>
              <p><strong>Phone:</strong> {company.phone}</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
