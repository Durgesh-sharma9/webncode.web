import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updates, formatDate, type Update } from '../data/updates'

const categories = ['All', 'Product', 'Company', 'Careers'] as const

// Strict Neo-brutalist solid color tokens mapping for discrete tags
const categoryColors: Record<string, string> = {
  Product: 'bg-[#93c5fd] text-slate-900 border border-slate-900',
  Company: 'bg-[#c084fc] text-slate-900 border border-slate-900',
  Careers: 'bg-[#86efac] text-slate-900 border border-slate-900',
}

function UpdateModal({ update, onClose }: { update: Update; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      {/* Rigid Structural Modal Container Card */}
      <motion.article
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-md border-2 border-slate-900 bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className={`rounded px-2.5 py-0.5 text-[10px] font-black uppercase font-mono tracking-wider ${categoryColors[update.category]}`}>
            {update.category}
          </span>
          <button 
            onClick={onClose} 
            className="flex h-7 w-7 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 font-black hover:bg-[#ff9e7d] transition-colors"
          >
            ×
          </button>
        </div>
        <time className="text-xs font-black uppercase font-mono text-slate-500">{formatDate(update.date)}</time>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-tight">
          {update.title}
        </h2>
        <hr className="my-4 border-t-2 border-slate-900/10" />
        <p className="text-sm font-medium leading-relaxed text-slate-700">{update.content}</p>
      </motion.article>
    </motion.div>
  )
}

export default function UpdatesPage() {
  const [filter, setFilter] = useState<string>('All')
  const [selected, setSelected] = useState<Update | null>(null)

  const filtered = updates.filter(
    (u) => filter === 'All' || u.category === filter
  )

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative">
      
      {/* Background Dotted Mesh Grid Texture Layer */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b-2 border-slate-900 bg-[#ebebeb] py-12 lg:py-16">
        <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
              SYSTEM NEWSFEED
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 leading-none">
              NEWS & <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-0.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                ANNOUNCEMENTS
              </span>
            </h1>
            <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-700 max-w-2xl pt-2 leading-relaxed">
              Product releases, company milestones, and career opportunities from Web n Code Technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Listing Content Workspace */}
      <section className="py-12 relative z-10">
        <div className="container-wide px-5 md:px-8 space-y-10">
          
          {/* Action Filter Button Grid Panel */}
          <div className="flex flex-wrap gap-2.5 border-2 border-slate-900 p-4 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-md max-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded px-4 py-2 text-xs font-black uppercase tracking-wider font-mono transition-all border-2 border-slate-900 ${
                  filter === cat
                    ? 'bg-[#7dd3fc] text-slate-900 shadow-[2.5px_2.5px_0px_0px_#000] translate-y-[-1px]'
                    : 'bg-white text-slate-700 hover:bg-slate-50 shadow-[1px_1px_0px_0px_#000]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Loop Matrix Block */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((update, i) => (
              <motion.article
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => setSelected(update)}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded px-2.5 py-0.5 text-[9px] font-black uppercase font-mono tracking-wider ${categoryColors[update.category]}`}>
                      {update.category}
                    </span>
                    <time className="text-[10px] font-black uppercase font-mono text-slate-500">{formatDate(update.date)}</time>
                  </div>
                  
                  <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 group-hover:underline leading-tight">
                    {update.title}
                  </h2>
                  
                  <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600 line-clamp-3">
                    {update.excerpt}
                  </p>
                </div>

                {/* Bottom Trigger Action Indicator Line */}
                <div className="mt-5 pt-3 border-t border-slate-900/10">
                  <span className="inline-block text-xs font-black uppercase font-mono text-slate-900 group-hover:bg-[#ff9e7d] border border-transparent group-hover:border-slate-900 px-2 py-1 transition-all">
                    Read article →
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Global Portal Modal Mount Layer */}
      <AnimatePresence>
        {selected && <UpdateModal update={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}