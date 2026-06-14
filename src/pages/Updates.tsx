import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updates, formatDate, type Update } from '../data/updates'

const categories = ['All', 'Product', 'Company', 'Careers'] as const

const categoryColors: Record<string, string> = {
  Product: 'bg-primary/10 text-primary',
  Company: 'bg-navy/10 text-navy',
  Careers: 'bg-accent/10 text-accent',
}

function UpdateModal({ update, onClose }: { update: Update; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.article
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColors[update.category]}`}>
            {update.category}
          </span>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl">×</button>
        </div>
        <time className="text-sm text-text-secondary">{formatDate(update.date)}</time>
        <h2 className="mt-2 display-sm text-text-primary">{update.title}</h2>
        <p className="mt-4 leading-relaxed text-text-secondary">{update.content}</p>
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
    <>
      <section className="border-b border-border/60 section-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Updates</span>
            <h1 className="mt-4 display-md text-text-primary">
              News & Announcements
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              Product releases, company milestones, and career opportunities from Web n Code Technologies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide">
          <div className="mb-10 flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'border border-border bg-card text-text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((update, i) => (
              <motion.article
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group card-premium flex cursor-pointer flex-col p-6"
                onClick={() => setSelected(update)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColors[update.category]}`}>
                    {update.category}
                  </span>
                  <time className="text-xs text-text-secondary">{formatDate(update.date)}</time>
                </div>
                <h2 className="heading-lg text-text-primary group-hover:text-primary transition-colors">
                  {update.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
                  {update.excerpt}
                </p>
                <span className="mt-4 text-sm font-semibold text-primary">Read more →</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && <UpdateModal update={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}
