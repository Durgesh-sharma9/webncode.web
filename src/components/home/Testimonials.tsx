import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="section-padding section-surface">
      <div className="container-wide">
        <SectionHeading
          label="Testimonials"
          title="What Our Customers Say"
          description="Organizations across India trust Web n Code products to run their daily operations."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-premium p-8"
            >
              <div className="mb-4 text-5xl leading-none text-primary/30">&ldquo;</div>
              <p className="text-base leading-relaxed text-text-primary">{t.quote}</p>
              <footer className="mt-6 flex items-center gap-4 border-t border-border/60 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary">
                  {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-text-primary">{t.author}</cite>
                  <p className="text-sm text-text-secondary">
                    {t.role}, {t.organization}
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
