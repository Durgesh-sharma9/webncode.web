import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { process } from '../../data/company'

export default function Process() {
  return (
    <section className="section-padding section-surface">
      <div className="container-wide">
        <SectionHeading
          label="Our Process"
          title="How We Build Products"
          description="A disciplined approach from discovery to deployment ensures every product meets the highest standards."
        />
        <div className="relative">
          <div className="absolute top-10 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 text-xl font-bold gradient-text shadow-lg shadow-primary/20">
                  {step.step}
                </div>
                <h3 className="heading-lg text-text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
