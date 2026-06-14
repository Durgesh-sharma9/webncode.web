import { motion } from 'framer-motion'
import Button from '../ui/Button'
import DashboardShowcase from '../ui/DashboardShowcase'
import { company } from '../../data/company'

const proofPoints = [
  'Education ERP and academic workflows',
  'Dashboards for finance, attendance, and results',
  'Cloud-ready products with secure access',
  'Implementation support from planning to launch',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden gradient-bg pt-4">
      <div className="orb orb-primary w-96 h-96 -top-48 -right-48" />
      <div className="orb orb-accent w-80 h-80 bottom-0 -left-40" />
      
      <div className="container-wide relative px-5 pt-20 pb-12 md:px-8 lg:px-12 lg:pt-24 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_3px_rgba(15,94,215,0.3)] animate-pulse" />
                {company.tagline}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-balance display-lg gradient-text"
            >
              Software products that make operations feel simple
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
            >
              {company.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 grid gap-2.5 sm:grid-cols-2"
            >
              {proofPoints.map((item) => (
                <div key={item} className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-card/80 p-3 text-sm font-medium text-text-primary backdrop-blur-sm card-shadow">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_rgba(15,94,215,0.2)]" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button to="/products" size="lg" className="shadow-xl shadow-primary/30">
                Explore Products
              </Button>
              <Button to="/contact" variant="outline" size="lg" className="border-2">
                Contact Us
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 grid grid-cols-3 gap-3 border-t border-border/60 pt-6 sm:max-w-lg"
            >
              {[
                { value: '12+', label: 'Products built' },
                { value: '150+', label: 'Organizations served' },
                { value: '24/7', label: 'Support ready' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-card/80 p-3 backdrop-blur-sm card-shadow">
                  <div className="text-2xl font-extrabold gradient-text">{item.value}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <DashboardShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
