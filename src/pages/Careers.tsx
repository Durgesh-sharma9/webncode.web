import { motion } from 'framer-motion'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { whyJoin, positions, benefits } from '../data/careers'

const typeColors: Record<string, string> = {
  'Full-time': 'bg-primary/10 text-primary',
  Internship: 'bg-accent/10 text-accent',
  Contract: 'bg-navy/10 text-navy',
}

export default function Careers() {
  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Careers</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              Build Products That Matter
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Join a team of engineers, designers, and product thinkers building SaaS products used by organizations across India.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading title="Why Join Us" description="More than a job—a chance to build software that makes a real difference." />
          <div className="grid gap-6 sm:grid-cols-2">
            {whyJoin.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-wide">
          <SectionHeading title="Open Positions" description="Find your next role at Web n Code Technologies." />
          <div className="space-y-4">
            {positions.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card-shadow rounded-2xl border border-border bg-white p-6 transition-all hover:card-shadow-hover"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-navy">{job.title}</h3>
                      <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${typeColors[job.type]}`}>
                        {job.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {job.department} · {job.location}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{job.description}</p>
                  </div>
                  <Button to="/contact" variant="outline" size="sm" className="shrink-0">
                    Apply Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <SectionHeading title="Benefits & Perks" description="We invest in our team's growth, health, and happiness." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 rounded-xl border border-border p-4"
              >
                <div className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span className="text-sm font-medium text-navy">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Join Us?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/60">
            Send us your resume and tell us which role interests you. We review every application personally.
          </p>
          <div className="mt-8">
            <Button to="/contact" size="lg">Apply Now</Button>
          </div>
        </div>
      </section>
    </>
  )
}
