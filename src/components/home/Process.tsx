import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { process as processSteps } from '../../data/company'

// Step sequence fixed high-contrast color palette tokens matching screenshot rule
const stepColors = ['bg-[#ff9e7d]', 'bg-[#7dd3fc]', 'bg-[#86efac]', 'bg-[#c084fc]', 'bg-[#93c5fd]']

export default function Process() {
  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Our Process"
          title="How We Build Products"
          description="A disciplined approach from discovery to deployment ensures every product meets the highest standards."
        />
        
        <div className="relative mt-12">
          {/* Rigid Mechanical Line Connector instead of fuzzy gradient tracks */}
          <div className="absolute top-10 right-0 left-0 hidden h-[3px] bg-slate-900 lg:block z-0" />
          
          {/* 5-Column Dynamic Step Grid Mapping */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="relative flex flex-col items-center text-center bg-white border-2 border-slate-900 p-5 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all"
              >
                {/* Rigid Structural Numeric Badge Box */}
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center border-2 border-slate-900 ${stepColors[i % stepColors.length]} text-slate-900 font-mono text-xl font-black shadow-[3px_3px_0px_0px_#000]`}>
                  {step.step || `0${i + 1}`}
                </div>
                
                {/* Title Header Block Component */}
                <h3 className="text-base font-black uppercase font-mono tracking-tight text-slate-900">
                  {step.title}
                </h3>
                
                {/* Step Subtext Details */}
                <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}