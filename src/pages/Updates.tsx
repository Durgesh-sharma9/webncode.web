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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[update.category]}`}>
            {update.category}
          </span>
          <button onClick={onClose} className="text-muted hover:text-navy text-xl">×</button>
        </div>
        <time className="text-sm text-muted">{formatDate(update.date)}</time>
        <h2 className="mt-2 text-2xl font-bold text-navy">{update.title}</h2>
        <p className="mt-4 leading-relaxed text-muted">{update.content}</p>
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
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Updates</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              News & Announcements
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Product releases, company milestones, and career opportunities from Web n Code Technologies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-primary text-white'
                    : 'border border-border text-muted hover:text-navy'
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group card-shadow flex cursor-pointer flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:card-shadow-hover hover:-translate-y-1"
                onClick={() => setSelected(update)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[update.category]}`}>
                    {update.category}
                  </span>
                  <time className="text-xs text-muted">{formatDate(update.date)}</time>
                </div>
                <h2 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                  {update.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
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
