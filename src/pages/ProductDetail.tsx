import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { CheckIcon, ArrowRightIcon } from '../components/ui/Icons'
import { getProductBySlug, products } from '../data/products'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!product) return <Navigate to="/products" replace />

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 2)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div>
              <Link to="/products" className="text-sm font-medium text-primary hover:text-primary-light">
                ← Back to Products
              </Link>
              <span className="mt-4 mb-2 block text-sm font-semibold uppercase tracking-wider text-primary">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-navy md:text-5xl">
                {product.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {product.shortDescription}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/contact" size="lg">
                  Request a Demo
                </Button>
                <Button to="/contact" variant="outline" size="lg">
                  Contact Sales
                </Button>
              </div>
            </div>
            <div
              className="card-shadow-hover overflow-hidden rounded-2xl border border-border"
              style={{ backgroundColor: product.accentColor }}
            >
              <div className="p-6">
                <div className="overflow-hidden rounded-xl border border-white/60 bg-white">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: product.color }} />
                    <div className="text-xs text-muted">{product.title} Dashboard</div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="rounded-lg border border-border p-3">
                          <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: product.color, opacity: 0.5 }} />
                          <div className="h-4 w-12 rounded" style={{ backgroundColor: product.color, opacity: 0.2 }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex h-32 items-end gap-2">
                      {[50, 70, 45, 85, 60, 90, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t"
                          style={{ height: `${h}%`, backgroundColor: product.color, opacity: 0.15 + i * 0.08 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">Overview</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{product.description}</p>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-surface">
        <div className="container-wide">
          <h2 className="mb-10 text-center text-2xl font-bold text-navy">Key Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-white p-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <CheckIcon className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium text-navy">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy">Benefits</h2>
              <p className="mt-3 text-muted">
                Organizations using {product.title} experience measurable improvements in efficiency and outcomes.
              </p>
              <ul className="mt-8 space-y-4">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <CheckIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-navy/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-shadow rounded-2xl border border-border bg-white p-8">
              <h3 className="font-bold text-navy">Screenshots</h3>
              <div className="mt-4 space-y-4">
                {['Dashboard View', 'Reports Panel', 'Settings'].map((screen) => (
                  <div key={screen} className="overflow-hidden rounded-xl border border-border">
                    <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: product.color }} />
                      <span className="text-xs text-muted">{screen}</span>
                    </div>
                    <div className="p-4" style={{ backgroundColor: product.accentColor }}>
                      <div className="h-24 rounded-lg bg-white/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-surface">
        <div className="container-wide max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {product.faqs.map((faq, i) => (
              <div key={faq.question} className="overflow-hidden rounded-xl border border-border bg-white">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-navy"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.question}
                  <span className="text-primary text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-4 text-muted leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related + CTA */}
      <section className="section-padding">
        <div className="container-wide">
          {related.length > 0 && (
            <div className="mb-16">
              <h2 className="mb-6 text-xl font-bold text-navy">Related Products</h2>
              <div className="flex flex-wrap gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="group flex items-center gap-2 rounded-xl border border-border px-5 py-3 transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <span className="font-semibold text-navy">{p.title}</span>
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-2xl bg-navy px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-white">Interested in {product.title}?</h2>
            <p className="mt-3 text-white/60">Get in touch with our team to schedule a demo or learn more.</p>
            <div className="mt-6">
              <Button to="/contact" size="lg">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
