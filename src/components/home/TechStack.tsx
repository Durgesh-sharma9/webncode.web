import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { techStack } from '../../data/company'

export default function TechStack() {
  return (
    <section className="section-padding section-light">
      <div className="container-wide">
        <SectionHeading
          label="Technology"
          title="Built on a Modern Stack"
          description="Our products are engineered with proven technologies for reliability, performance, and scale."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="card-premium p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-xl font-bold text-white shadow-lg shadow-primary/30">
                {tech.name.charAt(0)}
              </div>
              <h3 className="heading-lg text-text-primary">{tech.name}</h3>
              <p className="mt-2 text-sm text-text-secondary">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
