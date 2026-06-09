import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { techStack } from '../../data/company'

export default function TechStack() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <SectionHeading
          label="Technology"
          title="Built on a Modern Stack"
          description="Our products are engineered with proven technologies for reliability, performance, and scale."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-shadow rounded-2xl border border-border bg-white p-6 text-center transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
            >
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-lg font-bold text-white">
                {tech.name.charAt(0)}
              </div>
              <h3 className="font-bold text-navy">{tech.name}</h3>
              <p className="mt-1 text-sm text-muted">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
