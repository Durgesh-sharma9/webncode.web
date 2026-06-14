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
    mostPopular: false,
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
    mostPopular: true,
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
    mostPopular: false,
  },
]

export default function PricingPlans() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Subtle background glow */}
      <div className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-200 to-purple-200 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600 uppercase tracking-wider">Pricing</h2>
        <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Transparent Plans for Every Scale
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
          Choose a plan that fits your organizational needs. No hidden charges, fully scalable deployment.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:items-center">
        {tiers.map((tier, tierIdx) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: tierIdx * 0.1 }}
            className={`relative rounded-3xl p-8 ring-1 transition-all duration-300 hover:shadow-xl ${
              tier.mostPopular
                ? 'bg-slate-900 ring-slate-900 shadow-xl lg:py-12 text-white'
                : 'bg-white ring-slate-200 text-slate-900'
            }`}
          >
            {tier.mostPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                Most Popular
              </span>
            )}

            <h3 className={`text-xl font-bold tracking-tight ${tier.mostPopular ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {tier.name}
            </h3>
            
            <p className={`mt-4 text-sm leading-6 ${tier.mostPopular ? 'text-slate-300' : 'text-slate-600'}`}>
              {tier.description}
            </p>

            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
              {tier.price !== 'Custom' && <span className={`text-sm font-semibold ${tier.mostPopular ? 'text-slate-400' : 'text-slate-500'}`}>/yearly</span>}
            </p>

            <button
              className={`mt-6 block w-full rounded-xl px-3 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 ${
                tier.mostPopular
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus-visible:outline-indigo-600'
              }`}
            >
              Get Started Today
            </button>

            <ul className={`mt-8 space-y-3 text-sm leading-6 xl:mt-10 ${tier.mostPopular ? 'text-slate-300' : 'text-slate-600'}`}>
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3 items-center">
                  <svg
                    className={`h-5 w-5 flex-none ${tier.mostPopular ? 'text-indigo-400' : 'text-indigo-600'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}