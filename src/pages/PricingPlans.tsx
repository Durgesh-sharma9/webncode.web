import { motion } from 'framer-motion'

const tiers = [
  {
    name: 'Starter SaaS',
    id: 'tier-starter',
    price: '₹14,999',
    description: 'Perfect for small schools or single-branch organizations starting their digital journey.',
    features: [
      'Core Student Management',
      'Basic Attendance Tracker',
      'Standard Examination Module',
      'Email & Community Support',
      'Up to 500 Active Users',
    ],
    bgColor: 'bg-white',
    accentColor: 'bg-[#93c5fd]',
  },
  {
    name: 'Growth Suite',
    id: 'tier-growth',
    price: '₹29,999',
    description: 'Ideal for growing colleges and organizations looking for complete automation.',
    features: [
      'Everything in Starter',
      'Smart Timetabling Engine',
      'Advanced Report Cards Generator',
      'SMS & WhatsApp Integration',
      'Priority 24/7 Support',
      'Unlimited Users',
    ],
    bgColor: 'bg-[#fafafa]',
    accentColor: 'bg-[#ff9e7d]', // Solid master brand identifier
  },
  {
    name: 'Custom Enterprise',
    id: 'tier-enterprise',
    price: 'Custom',
    description: 'Dedicated cloud infrastructure and custom modules built for heavy operations.',
    features: [
      'Tailor-made Custom Features',
      'Dedicated Cloud Server (AWS)',
      'White-labeled Mobile Apps',
      'Dedicated Account Manager',
      'SLA & High-grade Security',
    ],
    bgColor: 'bg-white',
    accentColor: 'bg-[#c084fc]',
  },
]

export default function PricingPlans() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 lg:px-8 border-b-2 border-slate-900">
      {/* Background Grid Accent Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Heading Container */}
      <div className="mx-auto max-w-4xl text-center relative z-10 flex flex-col items-center">
        <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
          PRICING ENGINE
        </span>
        <h2 className="mt-5 text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
          <span className="inline-block bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            TRANSPARENT PLANS
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-sm md:text-base font-bold uppercase tracking-wide text-slate-700">
          Choose a plan that fits your organizational needs. No hidden charges, fully scalable deployment.
        </p>
      </div>

      {/* Cards Display Grid */}
      <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:items-stretch relative z-10">
        {tiers.map((tier, tierIdx) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: tierIdx * 0.08 }}
            className={`relative rounded-md border-2 border-slate-900 p-8 flex flex-col justify-between h-full ${tier.bgColor} shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all`}
          >
            {/* Rigid Corner Custom Badge */}
            {tier.id === 'tier-growth' && (
              <span className="absolute -top-3.5 left-6 rounded border-2 border-slate-900 bg-[#86efac] px-3 py-0.5 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                MOST POPULAR
              </span>
            )}

            <div>
              {/* Plan Header Title */}
              <h3 className="text-xl font-black uppercase font-mono text-slate-900 border-b-2 border-slate-900 pb-1.5 inline-block">
                {tier.name}
              </h3>
              
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-600 leading-relaxed">
                {tier.description}
              </p>

              {/* Pricing Display Frame */}
              <p className="mt-6 flex items-baseline gap-x-1 border-2 border-slate-900 bg-white p-3 shadow-[2px_2px_0px_0px_#000] inline-flex rounded">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900">{tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-xs font-black font-mono uppercase text-slate-500 tracking-tight ml-1">/yr</span>}
              </p>

              {/* Features List Checklist */}
              <ul className="mt-8 space-y-3.5 text-xs font-black uppercase tracking-wide font-mono text-slate-800">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-2.5 items-center">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center border border-slate-900 text-slate-900 ${tier.accentColor}`}>
                      <svg className="h-3 w-3 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Interactive Action CTA Wrapper */}
            <div className="mt-8 pt-2">
              <button
                className={`w-full text-center text-xs font-black uppercase font-mono tracking-wider px-4 py-3 rounded border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all ${
                  tier.id === 'tier-growth'
                    ? 'bg-[#ff9e7d] text-slate-900'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Get Started Today
              </button>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  )
}