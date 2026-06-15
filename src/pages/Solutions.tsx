import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { CheckIcon } from '../components/ui/Icons'
import { solutions } from '../data/solutions'

export default function Solutions() {
  return (
    <>
      <section className="relative overflow-hidden gradient-bg border-b border-border/60">
        <div className="orb orb-primary w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-accent w-80 h-80 bottom-0 -left-40" />
        <div className="container-wide section-padding-compact !pb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Solutions
            </span>
            <h1 className="mt-4 display-lg gradient-text">
              Solutions for Every Sector
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              See how our SaaS products address real operational challenges across education and enterprise sectors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide space-y-8">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="grid gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {solution.industry}
                </span>
                <h2 className="mt-2 display-sm gradient-text">{solution.headline}</h2>

                <div className="mt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
                    Challenges
                  </h3>
                  <ul className="space-y-3">
                    {solution.problems.map((problem) => (
                      <li key={problem} className="flex items-start gap-3 text-text-primary/80">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                        {problem}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted">
                    Our Solutions
                  </h3>
                  <ul className="space-y-3">
                    {solution.solutions.map((sol) => (
                      <li key={sol} className="flex items-start gap-3 text-text-primary/80">
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        {sol}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {solution.products.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="card-premium p-8">
                  <div className="mb-6 h-2 w-24 rounded bg-gradient-to-r from-primary to-primary-light" />
                  <div className="space-y-3">
                    {solution.solutions.map((sol, j) => (
                      <div key={sol} className="flex items-center gap-4 rounded-xl bg-surface p-4 hover:bg-surface-hover transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary">
                          {j + 1}
                        </div>
                        <p className="text-sm font-medium text-text-primary">{sol}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-navy via-navy-light to-primary">
        <div className="container-wide text-center">
          <h2 className="display-md text-white">Find the Right Solution</h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-white/70">
            Not sure which product fits your needs? Our team can help you identify the best solution.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button to="/products" className="bg-white text-navy hover:bg-surface hover:text-primary shadow-xl shadow-white/20">Explore Products</Button>
            <Button to="/contact" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white hover:!text-navy border-2">
              Talk to Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
