import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { deliveryHighlights } from '../../data/company'

export default function DeliveryHighlights() {
  return (
    <section className="section-padding bg-[#fafafa] border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Implementation"
          title="A Product Team That Stays Through Launch"
          description="From process mapping to team training, we focus on the details that make software usable in real offices, classrooms, and admin departments."
        />

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] pt-4">
          
          {/* Left Side: Rollout Status Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="mb-6 flex items-center justify-between border-b-2 border-slate-900/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase font-mono tracking-wider text-slate-400">Rollout snapshot</p>
                <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-slate-900">Plan, build, migrate, train</h3>
              </div>
              <div className="hidden rounded border-2 border-slate-900 bg-[#86efac] px-4 py-2 text-right shadow-[2px_2px_0px_0px_#000] sm:block">
                <div className="text-xl font-black font-mono text-slate-900">30%</div>
                <div className="text-[10px] font-black uppercase font-mono text-slate-700 leading-none mt-0.5">faster adoption</div>
              </div>
            </div>

            {/* Industrial Square Progress Tracks */}
            <div className="space-y-4">
              {['Process audit', 'Prototype review', 'Data migration', 'Pilot launch', 'Full rollout'].map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#c084fc] font-mono text-xs font-black text-slate-900 shadow-[1px_1px_0px_0px_#000]">
                    0{index + 1}
                  </div>
                  <div className="h-4 flex-1 border-2 border-slate-900 bg-slate-100 p-0.5 rounded-sm">
                    <div
                      className="h-full border border-slate-900 bg-[#ff9e7d]"
                      style={{ width: `${34 + index * 15}%` }}
                    />
                  </div>
                  <span className="w-28 text-xs font-black uppercase font-mono tracking-wide text-slate-900 text-right">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Metrics Key Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            {deliveryHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 inline-flex rounded border border-slate-900 bg-[#7dd3fc] px-2.5 py-0.5 text-[10px] font-black uppercase font-mono tracking-wider text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]">
                    {item.metric}
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-xs font-medium leading-relaxed text-slate-700">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}