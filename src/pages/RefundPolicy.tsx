import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company } from '../data/company'

export default function RefundPolicy() {
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
                CUSTOMER PROTECTION
              </span>
              <span className="rounded border border-slate-900 bg-[#fde047] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono">
                CANCELLATION & REFUNDS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-tight font-mono">
              CANCELLATION & <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_#0f172a]">
                REFUND POLICY
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-bold text-slate-600 font-mono">
              Last Updated: <span className="text-slate-900 underline font-black">{lastUpdated}</span> | Transparent guidelines regarding software subscription cancellations, demo guarantees, and refunds.
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
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            📜 Terms of Service
          </Link>
          <Link
            to="/cancellation-refund"
            className="px-3.5 py-1.5 bg-slate-900 text-white border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000]"
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
              1. Overview & Service Nature
            </h2>
            <p>
              At <strong>{company.name}</strong> (&ldquo;Web n Code&rdquo;), we develop and operate specialized software products and cloud SaaS platforms under our umbrella domain <strong>webncode.in</strong> (including <strong>Syllabus Tracker</strong>, <strong>CampusCRM</strong>, <strong>TimeTablePro</strong>, <strong>TestMaster</strong>, and <strong>School ERP Pro</strong>) for schools, colleges, sports academies, and educational institutions.
            </p>
            <p>
              Because our solutions involve digital cloud infrastructure provisioning, institutional database configuration, data migration, and dedicated server instance allocation, we maintain a transparent, fair, and legally compliant Cancellation and Refund Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              2. Pre-Purchase Free Demonstrations
            </h2>
            <p>
              To ensure complete client satisfaction and eliminate purchase uncertainty, Web n Code provides <strong>comprehensive, complimentary live demonstrations</strong> of our software solutions (such as School ERP Pro, Attendance Management System, Web Builder Pro) prior to onboarding.
            </p>
            <p>
              We strongly encourage school principals, trustees, and management committees to explore all features, verify technical compatibility, and clarify workflow requirements during the demo period prior to finalizing subscription contracts.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              3. Subscription Cancellation Policy
            </h2>
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  📅 Annual / Recurring Subscriptions
                </span>
                <p className="text-xs sm:text-sm text-slate-700">
                  Clients may cancel their upcoming subscription renewal by providing a written notice at least <strong>15 business days</strong> prior to the renewal billing date. Once cancelled, your services will remain active until the end of the current paid billing cycle, after which automatic renewal and invoicing will cease.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border-2 border-slate-900 rounded-lg">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  ⚡ Pre-Deployment Cancellation
                </span>
                <p className="text-xs sm:text-sm text-slate-700">
                  If an order cancellation request is submitted in writing within <strong>24 hours of payment</strong> and prior to cloud server provisioning or institutional database setup, a <strong>full refund</strong> (minus nominal gateway processing charges, if applicable) will be processed.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              4. Refund Eligibility Criteria
            </h2>
            <p>Refunds are evaluated and granted under the following valid conditions:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>Duplicate Billing:</strong> If your account was inadvertently charged more than once for the same subscription or invoice due to technical or network glitches.</li>
              <li><strong>Major Technical Defect:</strong> If the deployed software suffers a critical, reproducible defect or prolonged server outage (&gt;72 consecutive hours) that prevents essential core operations, and our technical engineering team is unable to rectify it within <strong>7 business days</strong> of formal escalation.</li>
              <li><strong>Non-Delivery:</strong> If Web n Code fails to deliver cloud instance access credentials within the committed delivery timeframe (&gt;7 business days) without prior mutually agreed rescheduling.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              5. Non-Refundable Scenarios
            </h2>
            <p>Refunds will <strong>not</strong> be granted in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>Change of mind after the cloud instance has been provisioned, customized, and user training has commenced.</li>
              <li>Lack of usage or adoption by client staff after credentials and modules were successfully delivered.</li>
              <li>Third-party service failures outside our control (e.g., school&apos;s local internet outages, client hardware failure, or third-party WhatsApp API rate limits).</li>
              <li>Custom software development contracts, custom domain registrations, or third-party SMS/WhatsApp gateway credit purchases that have already been incurred with telecommunication carriers.</li>
              <li>Accounts terminated due to a breach of our <Link to="/terms" className="text-blue-700 underline font-bold">Terms of Service</Link> or fraudulent conduct.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              6. Refund Processing Timeline & Method
            </h2>
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm font-black text-slate-900">
                <span>⏱️</span>
                <span>PROCESSING WINDOW: 5 TO 7 WORKING DAYS</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Once an authorized refund request is received and verified by our billing team, the approved refund will be credited within <strong>5 to 7 business days</strong> directly to the <strong>original payment method</strong> (Source Bank Account / UPI / Credit Card / Net Banking) used during the initial transaction.
              </p>
              <p className="text-xs text-slate-500 font-mono">
                * Note: Dependent upon individual banking partners and RBI clearing cycles, the credit confirmation may take 2-3 additional business days to reflect on your physical account statement.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              7. How to Initiate a Cancellation or Refund Request
            </h2>
            <p>To request a cancellation or refund, please follow this simple procedure:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
              <li>Send an official email to our Billing Desk at <strong>{company.email}</strong>.</li>
              <li>Use the subject line: <code>[Refund Request] - &lt;Your School/Organization Name&gt; - Invoice #</code>.</li>
              <li>Include: Institution name, registered contact number, payment receipt/UTR number, and clear details regarding the reason for your request.</li>
              <li>Our accounts desk will acknowledge your ticket within <strong>24 business hours</strong> and guide you through the verification process.</li>
            </ol>
          </section>

          {/* Contact Box */}
          <section className="pt-3 border-t-2 border-slate-200">
            <div className="bg-amber-50/80 border-2 border-slate-900 rounded-xl p-4 font-mono text-xs space-y-1">
              <p className="font-black uppercase text-slate-900">Billing & Accounts Desk:</p>
              <p><strong>Entity:</strong> {company.name}</p>
              <p><strong>Address:</strong> {company.address}</p>
              <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-700 hover:underline">{company.email}</a></p>
              <p><strong>Phone:</strong> {company.phone} (10 AM – 6 PM IST, Mon–Sat)</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
