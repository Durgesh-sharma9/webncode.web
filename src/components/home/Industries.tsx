import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { industries } from '../../data/company'

export default function Industries() {
  return (
    <section className="section-padding bg-gradient-to-br from-navy via-navy-light to-primary text-white">
      <div className="container-wide">
        <SectionHeading
          label="Industries"
          title="Built for Organizations That Matter"
          description="Our products serve diverse sectors with tailored solutions for their unique operational needs."
          light
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary-light">
                <FeatureIcon name={industry.icon} className="h-7 w-7" />
              </div>
              <h3 className="heading-lg">{industry.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
