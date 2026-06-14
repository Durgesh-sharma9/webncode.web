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
      <section className="border-b border-border/60 section-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Contact</span>
            <h1 className="mt-4 display-md text-text-primary">
              Get in Touch
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-secondary">
              Have questions about our products? Want to schedule a demo? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium p-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
                  ✓
                </div>
                <h2 className="display-sm text-text-primary">Message Sent!</h2>
                <p className="mt-4 text-text-secondary">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="card-premium p-8">
                <h2 className="mb-6 heading-xl text-text-primary">Send us a message</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-text-primary">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20 bg-card"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20 bg-card"
                      placeholder="you@organization.com"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-text-primary">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20 bg-card"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-text-primary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/20 bg-card"
                    placeholder="Tell us about your requirements..."
                  />
                </div>
                <div className="mt-6">
                  <Button type="submit" size="lg" className="shadow-xl shadow-primary/30">
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="card-premium p-8">
              <h2 className="heading-xl text-text-primary">Company Details</h2>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">Email</div>
                  <a href={`mailto:${company.email}`} className="mt-1 block font-medium text-primary hover:text-primary-light">
                    {company.email}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">Phone</div>
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="mt-1 block font-medium text-text-primary">
                    {company.phone}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">Address</div>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{company.address}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-border/60 pt-6">
                <div className="text-xs font-bold uppercase tracking-wider text-muted">Follow Us</div>
                <div className="mt-3 flex gap-3">
                  {Object.entries(company.social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-xs font-bold uppercase text-text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30"
                    >
                      {platform[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy via-navy-light to-primary p-6 text-white">
              <h3 className="heading-lg">Business Hours</h3>
              <p className="mt-3 text-sm text-white/70">
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
