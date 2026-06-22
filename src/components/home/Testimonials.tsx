import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Testimonials"
          title="What Our Customers Say"
          description="Organizations across India trust Web n Code products to run their daily operations."
        />
        
        {/* Quote Block Container Grids */}
        <div className="grid gap-6 md:grid-cols-2 pt-4">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-white border-2 border-slate-900 p-6 sm:p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rigid Structural Industrial Quote Marker */}
                <div className="mb-4 font-mono text-4xl font-black text-slate-900 select-none leading-none">
                  ""
                </div>
                
                {/* Core Feedback Body Paragraph */}
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-700">
                  {t.quote}
                </p>
              </div>

              {/* Author Metadata Footer Grid Block */}
              <footer className="mt-6 flex items-center gap-4 border-t-2 border-slate-900/10 pt-5">
                {/* Fixed Monospace Avatar Block Component */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#7dd3fc] font-mono text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] uppercase">
                  {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                
                {/* Meta details blocks */}
                <div>
                  <cite className="not-italic text-sm font-black uppercase tracking-tight text-slate-900 block font-mono">
                    {t.author}
                  </cite>
                  <p className="text-[10px] font-black uppercase tracking-wide font-mono text-slate-500 mt-0.5">
                    {t.role}, <span className="text-[#ff9e7d]">{t.organization}</span>
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}