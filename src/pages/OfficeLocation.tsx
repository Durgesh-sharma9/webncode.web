import { motion } from 'framer-motion'

export default function OfficeLocation() {
  return (
    <div className="relative py-24 text-center bg-[#fafafa] border-t-2 border-b-2 border-slate-900 overflow-hidden">
      {/* Dynamic Background Dotted Grid Pattern matching global aesthetic */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="container-wide relative z-10 px-5 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white border-2 border-slate-900 p-8 md:p-12 max-w-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        >
          {/* Location Badge Indicator */}
          <span className="inline-flex items-center rounded border-2 border-slate-900 bg-[#7dd3fc] px-3 py-1 text-xs font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
            HQ PIPELINE
          </span>

          {/* Main Neo-brutalist Heading */}
          <h2 className="mt-6 text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
            OUR JAIPUR OFFICE <br />
            <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-1 text-2xl md:text-4xl shadow-[3px_3px_0px_0px_#000]">
              COMING SOON
            </span>
          </h2>

          {/* Industrial placeholder text describing location block */}
          <p className="mt-6 text-xs md:text-sm font-black uppercase tracking-wider font-mono text-slate-500 leading-relaxed max-w-md mx-auto">
            We are engineering a state-of-the-art product sandbox workspace in Mahapura, Jaipur. System deployment is scheduled shortly.
          </p>
        </motion.div>
      </div>
    </div>
  )
}