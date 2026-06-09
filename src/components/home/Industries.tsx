import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { FeatureIcon } from '../ui/Icons'
import { industries } from '../../data/company'

export default function Industries() {
  return (
    <section className="section-padding bg-navy text-white">
      <div className="container-wide">
        <SectionHeading
          label="Industries"
          title="Built for Organizations That Matter"
          description="Our products serve diverse sectors with tailored solutions for their unique operational needs."
          light
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
                <FeatureIcon name={industry.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">{industry.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{industry.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
