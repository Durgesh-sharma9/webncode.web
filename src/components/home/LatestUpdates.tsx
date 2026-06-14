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
    <section className="section-padding section-surface">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group card-premium flex flex-col p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[update.category]}`}>
                  {update.category}
                </span>
                <time className="text-xs text-text-secondary">{formatDate(update.date)}</time>
              </div>
              <h3 className="heading-lg text-text-primary">{update.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{update.excerpt}</p>
              <Link
                to="/updates"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light group-hover:gap-3"
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
