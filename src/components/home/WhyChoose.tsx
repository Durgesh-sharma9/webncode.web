import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { whyChoose } from '../../data/company'

// Discrete high-contrast retro accents layout palette
const blockAccents = ['bg-[#ff9e7d]', 'bg-[#7dd3fc]', 'bg-[#86efac]', 'bg-[#c084fc]', 'bg-[#93c5fd]', 'bg-white']

export default function WhyChoose() {
  return (
    <section className="pt-12 pb-16 md:pt-16 md:pb-24 bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Why Web n Code"
          title="Why Choose Web n Code"
          description="We combine deep domain expertise with modern engineering to deliver products you can trust."
        />
        
        {/* Why Choose Solid Columns Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-4">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col items-start"
            >
              {/* Square Icon Bracket Box with Dynamic Colors on Cycle */}
              <div className={`mb-5 flex h-12 w-12 items-center justify-center border-2 border-slate-900 ${blockAccents[i % blockAccents.length]} text-slate-900 shadow-[2px_2px_0px_0px_#000]`}
              >
                <FeatureIcon name={item.icon} className="h-6 w-6 stroke-[2.5]" />
              </div>

              {/* Identity Header Title */}
              <h3 className="text-lg font-black uppercase font-mono tracking-tight text-slate-900">
                {item.title}
              </h3>
              
              {/* Detailed Operational Subtext */}
              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}