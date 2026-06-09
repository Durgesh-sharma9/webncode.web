import { motion } from 'framer-motion'
import Button from '../ui/Button'
import DashboardShowcase from '../ui/DashboardShowcase'
import { company } from '../../data/company'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#0F5ED708,_transparent_60%)]" />
      <div className="container-wide section-padding relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {company.tagline}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-balance text-4xl font-extrabold tracking-tight text-navy md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
            >
              Building Modern SaaS Products That{' '}
              <span className="text-primary">Power Growth</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
            >
              {company.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button to="/products" size="lg">
                Explore Products
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Contact Us
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex items-center gap-8 border-t border-border pt-8"
            >
              {[
                { value: '12+', label: 'Products' },
                { value: '150+', label: 'Organizations' },
                { value: '24/7', label: 'Support' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-2xl font-bold text-navy">{item.value}</div>
                  <div className="text-sm text-muted">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <DashboardShowcase />
        </div>
      </div>
    </section>
  )
}
