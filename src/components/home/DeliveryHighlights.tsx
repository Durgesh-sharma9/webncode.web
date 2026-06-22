import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { industries } from '../../data/company'

export default function Industries() {
  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        {/* Switched light to false to align perfectly with the new flat crisp background theme */}
        <SectionHeading
          label="Industries"
          title="Built for Organizations That Matter"
          description="Our products serve diverse sectors with tailored solutions for their unique operational needs."
          light={false}
        />
        
        {/* Grid Loop Panel Display */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              // Heavy solid box containers with micro displacement movement configurations
              className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              {/* Rigid Mechanical Brand Color Box for Icons */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center border-2 border-slate-900 bg-[#c084fc] text-slate-900 shadow-[2px_2px_0px_0px_#000] group-hover:bg-[#ff9e7d] transition-colors">
                <FeatureIcon name={industry.icon} className="h-6 w-6 stroke-[2.5]" />
              </div>

              {/* Title Header Component */}
              <h3 className="text-lg font-black uppercase font-mono tracking-tight text-slate-900">
                {industry.name}
              </h3>
              
              {/* Subtext Description Details */}
              <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700">
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}