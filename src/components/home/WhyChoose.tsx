import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { whyChoose } from '../../data/company'

export default function WhyChoose() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          label="Why Web n Code"
          title="Why Choose Web n Code"
          description="We combine deep domain expertise with modern engineering to deliver products you can trust."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border p-6 transition-all duration-300 hover:border-primary/30 hover:card-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <FeatureIcon name={item.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
