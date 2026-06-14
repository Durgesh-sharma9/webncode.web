import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { deliveryHighlights } from '../../data/company'

export default function DeliveryHighlights() {
  return (
    <section className="section-padding section-light">
      <div className="container-wide">
        <SectionHeading
          label="Implementation"
          title="A Product Team That Stays Through Launch"
          description="From process mapping to team training, we focus on the details that make software usable in real offices, classrooms, and admin departments."
        />

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-premium p-6"
          >
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Rollout snapshot</p>
                <h3 className="mt-2 display-sm text-text-primary">Plan, build, migrate, train</h3>
              </div>
              <div className="hidden rounded-xl bg-card px-4 py-3 text-right card-shadow sm:block">
                <div className="text-2xl font-bold gradient-text">30%</div>
                <div className="text-xs text-text-secondary">faster adoption</div>
              </div>
            </div>

            <div className="space-y-4">
              {['Process audit', 'Prototype review', 'Data migration', 'Pilot launch', 'Full rollout'].map((item, index) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xs font-bold text-white shadow-lg shadow-primary/30">
                    {index + 1}
                  </div>
                  <div className="h-2 flex-1 rounded-full bg-border">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-light"
                      style={{ width: `${34 + index * 15}%` }}
                    />
                  </div>
                  <span className="w-28 text-sm font-medium text-text-primary">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {deliveryHighlights.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-premium p-6"
              >
                <div className="mb-4 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  {item.metric}
                </div>
                <h3 className="heading-lg text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
