import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { whyChoose } from '../../data/company'

// Heavy brutalist icon accent badges
const blockAccents = ['bg-[#ff9e7d]', 'bg-[#7dd3fc]', 'bg-[#86efac]', 'bg-[#c084fc]', 'bg-[#93c5fd]', 'bg-white']

// REFACTORED: Soft, professional pastel background map keeping the style readable and premium
const cardBackgrounds = [
  'bg-orange-50/70',
  'bg-blue-50/70',
  'bg-green-50/70',
  'bg-purple-50/70',
  'bg-yellow-50/70',
  'bg-slate-50/70'
]

export default function WhyChoose() {
  return (
    /* Vertical section spacing optimized */
    <section className="pt-10 pb-10 md:pt-14 md:pb-14 bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label=""
          title="Why Choose Web n Code ?"
          description="We combine deep domain expertise with modern engineering to deliver products you can trust."
        />
        
        {/* Why Choose Solid Columns Grid */}
        {/* REFACTORED: Reduced column gap from gap-6 to gap-4 md:gap-5 */}
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              /* REFACTORED: Added dynamic subtle soft pastel backgrounds, reduced internal padding to p-4 */
              className={`group border-2 border-slate-900 p-4 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col items-start ${cardBackgrounds[i % cardBackgrounds.length]}`}
            >
              {/* Square Icon Bracket Box with Dynamic Colors on Cycle */}
              {/* REFACTORED: Reduced icon footprint slightly from h-12 w-12 to h-10 w-10 and margin to mb-2 */}
              <div className={`mb-2 flex h-10 w-10 items-center justify-center border-2 border-slate-900 ${blockAccents[i % blockAccents.length]} text-slate-900 shadow-[2px_2px_0px_0px_#000]`}
              >
                <FeatureIcon name={item.icon} className="h-5 w-5 stroke-[2.5]" />
              </div>

              {/* Identity Header Title */}
              <h3 className="text-lg font-black uppercase font-mono tracking-tight text-slate-900">
                {item.title}
              </h3>
              
              {/* Detailed Operational Subtext */}
              {/* REFACTORED: Closed gap down from mt-3 to mt-1.5 for a compact SaaS flow */}
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-700">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}