import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { testimonials } from '../../data/testimonials'

export default function Testimonials() {
  return (
    <section className="section-padding bg-white">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-shadow rounded-2xl border border-border bg-white p-8"
            >
              <div className="mb-4 text-4xl leading-none text-primary/20">&ldquo;</div>
              <p className="text-base leading-relaxed text-navy/80">{t.quote}</p>
              <footer className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-navy">{t.author}</cite>
                  <p className="text-sm text-muted">
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
