import { motion } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import { company, coreValues, techStack, roadmap } from '../data/company'

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden gradient-bg">
        <div className="orb orb-primary w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-accent w-80 h-80 bottom-0 -left-40" />
        
        <div className="container-wide relative px-5 pt-10 pb-10 md:px-8 lg:px-12 lg:pt-12 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Our Journey
            </span>
            <h1 className="mt-5 display-lg gradient-text">
              About {company.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-secondary md:text-xl">
              {company.tagline || "Building next-generation SaaS products that redefine institutional efficiency right from the tech heart of Rajasthan."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 className="display-md gradient-text">Our Story</h2>
            <div className="mt-6 space-y-6 text-base leading-relaxed text-text-secondary">
              <p>
                <strong className="text-text-primary">Web n Code Technologies</strong> was founded with a clear mission: build world-class software products that solve real operational problems for schools, colleges, and organizations across India.
              </p>
              <p>
                Operating from our main product hub in <span className="font-semibold text-text-primary">Mahapura, Jaipur (Rajasthan)</span>, what started as a small team of passionate engineers has grown into a high-octane product powerhouse serving over 150 organizations. We don't build one-off projects—we engineer robust SaaS ecosystems.
              </p>
              <p>
                Today, our suite powers student management, automated examinations, smart timetabling, and AI-driven attendance—designed to work independently or as one unified platform.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/60 bg-card p-6 card-shadow sm:p-8">
              {[
                { label: 'Founded', value: '2020' },
                { label: 'Team Size', value: '40+' },
                { label: 'SaaS Products', value: '12+' },
                { label: 'Happy Clients', value: '150+' },
              ].map((item) => (
                <div key={item.label} className="group rounded-2xl bg-surface/50 p-5 text-center transition-all duration-300 hover:bg-primary/5">
                  <div className="text-3xl font-extrabold gradient-text transition-transform duration-300 group-hover:scale-105 sm:text-4xl">
                    {item.value}
                  </div>
                  <div className="mt-2 text-xs font-medium uppercase tracking-wider text-muted">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding-compact section-surface">
        <div className="container-wide grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-premium p-8"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-primary to-primary-light" />
            <h2 className="heading-xl text-text-primary">Our Mission</h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              To empower institutions and global enterprises with modern, intuitive SaaS products that simplify complex business workflows, elevate operational productivity, and unlock sustainable growth.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-premium p-8"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-accent to-accent-light" />
            <h2 className="heading-xl text-text-primary">Our Vision</h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">
              To become India's most trusted and reliable software product company, setting new benchmarks for software quality, product architecture, and customer success right from Jaipur.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide">
          <SectionHeading title="Core Values" description="The core engineering principles that guide every single line of code we ship." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-6">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group card-premium p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-mono text-sm font-bold transition-all duration-300 group-hover:from-primary group-hover:to-primary-light group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                  0{i + 1}
                </div>
                <h3 className="mt-4 heading-lg text-text-primary">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-navy via-navy-light to-primary text-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="display-md text-white">Our Tech Stack</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">The cutting-edge technologies powering our products, ensuring blazing-fast speed and military-grade security.</p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center transition-all duration-300 hover:border-primary/50 hover:bg-white/10"
              >
                <div className="font-semibold text-white">{tech.name}</div>
                <div className="mt-0.5 text-xs text-primary-light">{tech.description || "Core Tech"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide">
          <SectionHeading title="Future Roadmap" description="Where we are heading next in our SaaS journey." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roadmap.map((phase, i) => (
              <motion.div
                key={phase.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="card-premium p-6"
              >
                <span className="inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {phase.year}
                </span>
                <h3 className="mt-3 heading-lg text-text-primary">{phase.title}</h3>
                <ul className="mt-4 space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
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