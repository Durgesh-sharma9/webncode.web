import { motion } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { whyJoin, positions, benefits } from '../data/careers'

const typeColors: Record<string, string> = {
  'Full-time': 'bg-primary/10 text-primary',
  Internship: 'bg-accent/10 text-accent',
  Contract: 'bg-navy-light/10 text-navy',
}

export default function Careers() {
  return (
    <>
      <section className="relative overflow-hidden gradient-bg">
        <div className="orb orb-primary w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-accent w-80 h-80 bottom-0 -left-40" />
        
        <div className="container-wide relative px-5 pt-4 pb-4 md:px-8 lg:px-12 lg:pt-6 lg:pb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Join Our Product Core
            </span>
            <h1 className="mt-3 display-lg gradient-text">
              Build Products That Scale & Matter
            </h1>
            <p className="mt-3 text-base leading-relaxed text-text-secondary md:text-lg">
              Join an elite team of engineers, designers, and system thinkers in Mahapura, Jaipur, building next-generation SaaS ecosystems used all over India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding-compact section-light">
        <div className="container-wide">
          <SectionHeading title="Why Join Us" description="More than just a standard workspace—a product sandbox designed to maximize human potential." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {whyJoin.map((item, i) => (
              <motion.div
                key={item.title}
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
                <h3 className="mt-4 heading-lg text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-surface">
        <div className="container-wide">
          <SectionHeading title="Open Positions" description="Explore job openings across various tech domains. Your next challenge is waiting." />
          <div className="mt-12 space-y-4">
            {positions.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group card-premium p-6"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="heading-lg text-text-primary">{job.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${typeColors[job.type] || 'bg-surface text-text-secondary'}`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 items-center text-xs font-bold uppercase tracking-wider text-muted">
                      <span>{job.department}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-primary">{job.location}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {job.description}
                    </p>
                  </div>

                  <div className="shrink-0 pt-2 lg:pt-0">
                    <Button 
                      to="/contact" 
                      variant="outline" 
                      size="lg"
                      className="w-full lg:w-auto border-2"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide">
          <SectionHeading title="Benefits & Perks" description="We invest heavily in our team's mental health, technical stack setup, and holistic happiness." />
          <div className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="flex items-center gap-3.5 card-premium p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-text-primary">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-navy via-navy-light to-primary py-20 text-center text-white lg:py-24">
        <div className="absolute inset-0 -z-10 grid-pattern opacity-10" />
        <div className="container-wide">
          <h2 className="display-md text-white">
            Ready to Build Your Legacy?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Drop your resume, portfolio link, or GitHub handle. We don't care about paper certificates; we care about the clean code you build.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button to="/contact" size="lg" className="w-full sm:w-auto bg-white text-navy hover:bg-surface hover:text-primary shadow-xl shadow-white/20">
              Upload Resume
            </Button>
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Or mail us at hr@webncode.com</span>
          </div>
        </div>
      </section>
    </>
  )
}