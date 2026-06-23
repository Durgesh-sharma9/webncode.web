import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { industries } from '../../data/company'

// Configuration mapping to provide exact colors per target sector
const designConfig = [
  { bg: 'bg-blue-50',     iconBg: 'bg-[#7dd3fc]' }, // Schools -> Soft Blue background + Blue Icon box
  { bg: 'bg-purple-50',   iconBg: 'bg-[#c084fc]' }, // Colleges -> Soft Purple background + Purple Icon box
  { bg: 'bg-orange-50',   iconBg: 'bg-[#ff9e7d]' }, // Coaching Institutes -> Soft Orange background + Orange Icon box
  { bg: 'bg-green-50',    iconBg: 'bg-[#86efac]' }  // Organizations -> Soft Green background + Green Icon box
]

export default function Industries() {
  return (
    /* Spacing classes optimized to match home compact pacing standards */
    <section className="pt-10 pb-10 md:pt-14 md:pb-14 bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        {/* REFACTORED: Target inner h2 to maintain an organic single-line layout on desktop views */}
        <div className="md:[&_h2]:whitespace-nowrap">
          <SectionHeading
            label="" /* REMOVED: Small floating label string cleared out */
            title="Built for Organizations That Matter"
            description="Our products serve diverse sectors with tailored solutions for their unique operational needs."
            light={false}
          />
        </div>
        
        {/* Grid Loop Panel Display */}
        {/* REFACTORED: Compacted grid gap from gap-6 to gap-4 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {industries.map((industry, i) => {
            // Pick style configuration safely via index rotation cycle
            const cardStyle = designConfig[i % designConfig.length]

            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                // Heavy solid box containers with micro displacement movement configurations
                /* REFACTORED: Tightened layout profile to crisp p-4 and appended soft tinted background states */
                className={`group border-2 border-slate-900 p-4 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between ${cardStyle.bg}`}
              >
                <div>
                  {/* Rigid Mechanical Brand Color Box for Icons */}
                  {/* REFACTORED: Shrunk container scale to h-10 w-10, lower margin to mb-2, and applied dynamic accents */}
                  <div className={`mb-2 flex h-10 w-10 items-center justify-center border-2 border-slate-900 ${cardStyle.iconBg} text-slate-900 shadow-[2px_2px_0px_0px_#000] transition-colors`}>
                    <FeatureIcon name={industry.icon} className="h-5 w-5 stroke-[2.5]" />
                  </div>

                  {/* Title Header Component */}
                  <h3 className="text-lg font-black uppercase font-mono tracking-tight text-slate-900">
                    {industry.name}
                  </h3>
                  
                  {/* Subtext Description Details */}
                  {/* REFACTORED: Reduced text-top padding separation from mt-3 to mt-1.5 */}
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-700">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}