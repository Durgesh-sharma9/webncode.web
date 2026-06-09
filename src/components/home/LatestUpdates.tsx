import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { updates, formatDate } from '../../data/updates'
import { ArrowRightIcon } from '../ui/Icons'

const categoryColors: Record<string, string> = {
  Product: 'bg-primary/10 text-primary',
  Company: 'bg-navy/10 text-navy',
  Careers: 'bg-accent/10 text-accent',
}

export default function LatestUpdates() {
  const featured = updates.filter((u) => u.featured).slice(0, 3)

  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          label="What's New"
          title="Latest Updates"
          description="Product releases, company milestones, and opportunities from Web n Code Technologies."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((update, i) => (
            <motion.article
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group card-shadow flex flex-col rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[update.category]}`}>
                  {update.category}
                </span>
                <time className="text-xs text-muted">{formatDate(update.date)}</time>
              </div>
              <h3 className="text-lg font-bold text-navy">{update.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{update.excerpt}</p>
              <Link
                to="/updates"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light"
              >
                Read More
                <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
