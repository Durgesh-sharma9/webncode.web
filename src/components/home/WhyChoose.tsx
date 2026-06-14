import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { whyChoose } from '../../data/company'

export default function WhyChoose() {
  return (
    <section className="section-padding section-light">
      <div className="container-wide">
        <SectionHeading
          label="Why Web n Code"
          title="Why Choose Web n Code"
          description="We combine deep domain expertise with modern engineering to deliver products you can trust."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group card-premium p-6"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-primary-light group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                <FeatureIcon name={item.icon} className="h-7 w-7" />
              </div>
              <h3 className="heading-lg text-text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
