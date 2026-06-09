import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { company } from '../data/company'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Have questions about our products? Want to schedule a demo? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-shadow rounded-2xl border border-border bg-white p-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-navy">Message Sent!</h2>
                <p className="mt-3 text-muted">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card-shadow rounded-2xl border border-border bg-white p-8">
                <h2 className="mb-6 text-xl font-bold text-navy">Send us a message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="you@organization.com"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-navy">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <div className="mt-6">
                  <Button type="submit" size="lg">
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="card-shadow rounded-2xl border border-border bg-white p-8">
              <h2 className="text-xl font-bold text-navy">Company Details</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">Email</div>
                  <a href={`mailto:${company.email}`} className="mt-1 block font-medium text-primary hover:text-primary-light">
                    {company.email}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">Phone</div>
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="mt-1 block font-medium text-navy">
                    {company.phone}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">Address</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{company.address}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted">Follow Us</div>
                <div className="mt-3 flex gap-3">
                  {Object.entries(company.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-xs font-bold uppercase text-navy transition-colors hover:bg-primary hover:text-white"
                    >
                      {platform[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-navy p-6 text-white">
              <h3 className="font-bold">Business Hours</h3>
              <p className="mt-2 text-sm text-white/60">
                Monday – Friday: 9:00 AM – 6:00 PM IST<br />
                Saturday: 10:00 AM – 2:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
