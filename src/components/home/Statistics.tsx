import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import AnimatedCounter from '../ui/AnimatedCounter'
import { stats } from '../../data/company'

// Discrete bright retro tech colors mapped dynamically by grid index
const blockColors = ['bg-[#93c5fd]', 'bg-[#c084fc]', 'bg-[#86efac]', 'bg-[#ff9e7d]']

export default function Statistics() {
  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="By the Numbers"
          title="Trusted by Organizations Nationwide"
          description="Our track record speaks to the reliability and impact of our software products."
        />
        
        {/* Statistics Structural Columns Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`group border-2 border-slate-900 p-6 rounded-md ${blockColors[i % blockColors.length]} text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all`}
            >
              {/* Internal Counter Output Wrap Block */}
              <div className="text-3xl md:text-4xl font-black font-mono tracking-tight border-b-2 border-slate-900 pb-2 flex items-baseline gap-0.5">
                <AnimatedCounter value={stat.value} />
                {stat.suffix && <span className="text-xl font-black text-slate-800">{stat.suffix}</span>}
              </div>

              {/* Statistical Metadata Label Details */}
              <div className="mt-3 text-xs font-black uppercase font-mono tracking-wider text-slate-700 leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}