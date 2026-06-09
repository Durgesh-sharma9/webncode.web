import { motion } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import { company, coreValues, techStack, roadmap } from '../data/company'

export default function About() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">About</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              About {company.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{company.tagline}</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">Our Story</h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed">
              <p>
                Web n Code Technologies was founded with a clear mission: build software products that solve real operational problems for schools, colleges, and organizations across India.
              </p>
              <p>
                What started as a small team of engineers passionate about education technology has grown into a product company serving over 150 organizations. We don&apos;t build one-off projects—we build SaaS products that evolve, scale, and improve with every release.
              </p>
              <p>
                Today, our product suite covers student management, examinations, timetabling, and attendance—each product designed to work independently or as part of an integrated platform.
              </p>
            </div>
          </div>
          <div className="card-shadow rounded-2xl border border-border bg-white p-8">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Founded', value: '2020' },
                { label: 'Team Size', value: '40+' },
                { label: 'Products', value: '12+' },
                { label: 'Customers', value: '150+' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{item.value}</div>
                  <div className="mt-1 text-sm text-muted">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide grid gap-12 md:grid-cols-2">
          <div className="card-shadow rounded-2xl border border-border bg-white p-8">
            <h2 className="text-xl font-bold text-navy">Mission</h2>
            <p className="mt-4 leading-relaxed text-muted">
              To empower organizations with modern SaaS products that simplify complex operations, improve productivity, and enable sustainable growth.
            </p>
          </div>
          <div className="card-shadow rounded-2xl border border-border bg-white p-8">
            <h2 className="text-xl font-bold text-navy">Vision</h2>
            <p className="mt-4 leading-relaxed text-muted">
              To become India&apos;s most trusted software product company for education and enterprise operations, known for quality, reliability, and customer success.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading title="Core Values" description="The principles that guide every product decision and every line of code we write." />
          <div className="grid gap-6 sm:grid-cols-2">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-bold text-navy">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide">
          <SectionHeading title="Technology Stack" description="The technologies powering our products and platform." />
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="card-shadow rounded-xl border border-border bg-white px-6 py-4 text-center"
              >
                <div className="font-bold text-navy">{tech.name}</div>
                <div className="text-xs text-muted">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading title="Future Roadmap" description="Where we're headed in the coming years." />
          <div className="grid gap-8 md:grid-cols-3">
            {roadmap.map((phase, i) => (
              <motion.div
                key={phase.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-2xl border border-border p-6"
              >
                <span className="text-sm font-bold text-primary">{phase.year}</span>
                <h3 className="mt-1 text-lg font-bold text-navy">{phase.title}</h3>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
