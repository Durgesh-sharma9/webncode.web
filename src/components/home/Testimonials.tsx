import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { testimonials } from '../../data/testimonials'

// FIX 5: Cycle top border accents and quote text highlights across cards while maintaining neo-brutalist styling
const borderAccents = [
  { border: 'border-t-[#7dd3fc]', text: 'text-[#7dd3fc]' }, // Card 1 -> Blue Top Border & Text Accent
  { border: 'border-t-[#ff9e7d]', text: 'text-[#ff9e7d]' }, // Card 2 -> Orange Top Border & Text Accent
  { border: 'border-t-[#86efac]', text: 'text-[#86efac]' }, // Card 3 -> Green Top Border & Text Accent
  { border: 'border-t-[#c084fc]', text: 'text-[#c084fc]' }  // Card 4 -> Purple Top Border & Text Accent
]

export default function Testimonials() {
  return (
    /* FIX 8: Reduced top and bottom section spacing to eliminate excess white space */
    <section className="pt-10 pb-10 md:pt-14 md:pb-14 bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label=""
          title="What Our Customers Say"
          description="Organizations across India trust Web n Code products to run their daily operations."
        />
        
        {/* Quote Block Container Grids */}
        {/* FIX 7: Tightened layout gap matrix layout spacing from gap-6 to gap-4 */}
        <div className="grid gap-4 md:grid-cols-2 pt-4">
          {testimonials.map((t, i) => {
            const currentAccent = borderAccents[i % borderAccents.length];

            return (
              <motion.blockquote
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                /* FIX 1, 2 & 5: Added compact padding (p-4 md:p-5) and specific neo-brutalist top accent borders */
                className={`group bg-white border-2 ${currentAccent.border} border-slate-900 p-4 md:p-5 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between`}
              >
                <div>
                  {/* Rigid Structural Industrial Quote Marker */}
                  {/* FIX 6: Made quote mark larger, applied custom color accent, and set better spacing (mb-3) */}
                  <div className={`mb-3 font-mono text-5xl font-black ${currentAccent.text} select-none leading-none drop-shadow-[1.5px_1.5px_0px_#0f172a]`}>
                    “
                  </div>
                  
                  {/* Core Feedback Body Paragraph */}
                  {/* FIX 3: Reduced size slightly to text-xs sm:text-[13px] for a cleaner, high-scannability SaaS look */}
                  <p className="text-xs sm:text-[13px] font-medium leading-relaxed text-slate-700">
                    {t.quote}
                  </p>
                </div>

                {/* Author Metadata Footer Grid Block */}
                {/* REFACTORED: Tightened internal vertical separation spaces */}
                <footer className="mt-4 flex items-center gap-3 border-t-2 border-slate-900/10 pt-3">
                  {/* Fixed Monospace Avatar Block Component */}
                  {/* FIX 4: Shrunk initials avatar box down from h-11 w-11 to a crisp h-9 w-9 sizing frame */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#7dd3fc] font-mono text-[10px] font-black text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000] uppercase">
                    {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  {/* Meta details blocks */}
                  <div>
                    <cite className="not-italic text-xs font-black uppercase tracking-tight text-slate-900 block font-mono">
                      {t.author}
                    </cite>
                    <p className="text-[9px] font-black uppercase tracking-wide font-mono text-slate-500 mt-0.5">
                      {t.role}, <span className="text-[#ff9e7d]">{t.organization}</span>
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            )
          })}
        </div>
      </div>
    </section>
  )
}