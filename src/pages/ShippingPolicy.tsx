import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company } from '../data/company'

export default function ShippingPolicy() {
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
                SERVICE FULFILLMENT
              </span>
              <span className="rounded border border-slate-900 bg-[#86efac] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono">
                DIGITAL SAAS DELIVERY
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-900 leading-tight font-mono">
              SHIPPING & <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_#0f172a]">
                DELIVERY POLICY
              </span>
            </h1>

            <p className="mt-4 text-xs sm:text-sm font-bold text-slate-600 font-mono">
              Last Updated: <span className="text-slate-900 underline font-black">{lastUpdated}</span> | Explaining electronic delivery, cloud instance provisioning, and digital software handover.
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
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            💳 Cancellation & Refund
          </Link>
          <Link
            to="/shipping-delivery"
            className="px-3.5 py-1.5 bg-slate-900 text-white border-2 border-slate-900 rounded font-black uppercase shadow-[2px_2px_0px_0px_#000]"
          >
            🚀 Digital Delivery Policy
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_#000] space-y-8 leading-relaxed text-slate-800 text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              1. Digital Services & No Physical Shipping
            </h2>
            <p>
              <strong>{company.name}</strong> (&ldquo;Web n Code&rdquo;) operates exclusively as a technological software product company. We engineer and deliver cloud-hosted SaaS (Software-as-a-Service) applications, school management portals, website builder instances, and digital institutional platforms.
            </p>
            <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded-xl font-mono text-xs sm:text-sm text-emerald-950 font-bold space-y-1">
              <p>📦 <strong>Notice on Physical Goods:</strong></p>
              <p>
                We do NOT sell, warehouse, or transport any physical commodities. Consequently, no physical postal transit, freight courier, or physical shipping charges apply to any of our services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              2. Mode of Electronic Delivery
            </h2>
            <p>All software solutions and licenses are fulfilled 100% electronically through the following channels:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>Electronic Mail (Email):</strong> Portal URLs, dedicated subdomains (e.g., <code>yourschool.webncode.com</code>), administrative login credentials, and tax invoices are transmitted to the client&apos;s authorized email address.</li>
              <li><strong>Secure Client Portals:</strong> Access keys, student ERP databases, and administrative consoles are provisioned via our secure HTTPS cloud servers.</li>
              <li><strong>WhatsApp / Direct Telephony:</strong> Verification codes, implementation milestones, and direct technical onboarding links are shared with school leadership.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              3. Service Fulfillment & Provisioning Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  ⚡ Standard SaaS Modules (School ERP Pro, Attendance, Web Builder)
                </span>
                <p className="text-xs text-slate-700">
                  Instance provisioning, secure tenant database setup, and administrator credentials are delivered within <strong>24 to 48 business hours</strong> following successful subscription payment confirmation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl">
                <span className="font-black text-xs uppercase font-mono block text-slate-900 mb-1">
                  🛠️ Custom Institutional Workflows & Data Migration
                </span>
                <p className="text-xs text-slate-700">
                  For complex multi-campus institutions requiring custom module modifications, student data bulk migration, and customized report cards, delivery is conducted in structured phases within <strong>7 to 14 business days</strong> as defined in the Service Proposal.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              4. Confirmation of Delivery
            </h2>
            <p>Delivery of our digital services is considered successfully completed upon:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li>Transmission of the dedicated live software portal URL and super-admin credentials to the client&apos;s registered email address.</li>
              <li>Completion of the inaugural administrative walkthrough or initial system demonstration call by our technical deployment engineer.</li>
              <li>Verification that the client administrative user has successfully authenticated into the deployed dashboard.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              5. Delivery Delays & Exceptional Circumstances
            </h2>
            <p>
              While we guarantee rapid provisioning, fulfillment timelines may occasionally experience minor delays due to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700">
              <li>Delay by client school in providing necessary student/teacher data sheets or custom domain DNS records.</li>
              <li>Unverified payment transactions awaiting banking clearance or UTR reconciliation.</li>
              <li>Government gazetted holidays or force majeure telecommunication disruptions.</li>
            </ul>
            <p className="text-xs text-slate-600 font-mono mt-1">
              In any such event, our deployment team will proactively communicate updated delivery milestones with authorized school representatives.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
              6. Technical Support & Post-Delivery Handover
            </h2>
            <p>
              Delivery of credentials is only the first step. Web n Code provides continuous post-delivery technical support, video tutorials, and dedicated account manager assistance to ensure smooth institutional adoption.
            </p>
            <p>
              For immediate fulfillment tracking or delivery verification inquiries, contact our Deployment Desk at <strong>{company.email}</strong> or <strong>{company.phone}</strong>.
            </p>
          </section>

          {/* Contact Box */}
          <section className="pt-3 border-t-2 border-slate-200">
            <div className="bg-[#f8fafc] border-2 border-slate-900 rounded-xl p-4 font-mono text-xs space-y-1">
              <p className="font-black uppercase text-slate-900">Digital Fulfillment & Deployment Office:</p>
              <p><strong>Company:</strong> {company.name}</p>
              <p><strong>Operational Base:</strong> {company.address}</p>
              <p><strong>Email:</strong> <a href={`mailto:${company.email}`} className="text-blue-700 hover:underline">{company.email}</a></p>
              <p><strong>Phone:</strong> {company.phone}</p>
            </div>
          </section>

        </div>

      </div>
    </div>
  )
}
