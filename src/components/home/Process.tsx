import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { process } from '../../data/company'

export default function Process() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeading
          label="Our Process"
          title="How We Build Products"
          description="A disciplined approach from discovery to deployment ensures every product meets the highest standards."
        />
        <div className="relative">
          <div className="absolute top-8 right-0 left-0 hidden h-0.5 bg-border lg:block" />
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-primary bg-white text-lg font-bold text-primary">
                  {step.step}
                </div>
                <h3 className="font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
