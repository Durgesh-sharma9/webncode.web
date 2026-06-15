import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import ScreenshotGallery from '../components/ui/ScreenshotGallery'
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
      <section className="border-b border-border/60 section-surface">
        <div className="container-wide section-padding-compact">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <div>
              <Link to="/products" className="text-sm font-semibold text-primary hover:text-primary-light">
                ← Back to Products
              </Link>
              <span className="mt-4 mb-2 block text-sm font-bold uppercase tracking-wider text-primary">
                {product.category}
              </span>
              <h1 className="display-md gradient-text">
                {product.title}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                {product.shortDescription}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button to="/contact" size="lg" className="shadow-xl shadow-primary/30">
                  Request a Demo
                </Button>
                <Button
                  onClick={() => window.open(product.demoUrl, '_blank')}
                  variant="outline"
                  size="lg"
                  className="border-2"
                >
                  Live Demo
                </Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card-premium overflow-hidden"
              style={{ backgroundColor: product.accentColor }}
            >
              <div className="p-6">
                <div className="overflow-hidden rounded-xl border border-white/60 bg-card">
                  <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: product.color }} />
                    <div className="text-xs text-text-secondary">{product.title} Dashboard</div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="rounded-lg border border-border/60 p-3">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding-compact section-light">
        <div className="container-wide container-narrow">
          <h2 className="display-sm text-text-primary">Overview</h2>
          <p className="mt-4 text-base leading-relaxed text-text-secondary">{product.description}</p>
        </div>
      </section>

      <section className="section-padding-compact section-surface">
        <div className="container-wide">
          <h2 className="mb-8 text-center display-sm text-text-primary">Key Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="card-premium flex items-start gap-3 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <span className="font-semibold text-text-primary">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-light">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="display-sm text-text-primary">Benefits</h2>
              <p className="mt-4 text-text-secondary">
                Organizations using {product.title} experience measurable improvements in efficiency and outcomes.
              </p>
              <ul className="mt-8 space-y-4">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-lg shadow-primary/30">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span className="text-text-primary/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-premium p-8"
            >
              <h3 className="heading-xl text-text-primary">Screenshots</h3>
              <div className="mt-4">
                <ScreenshotGallery screenshots={product.screenshots} productName={product.title} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding-compact section-surface">
        <div className="container-wide container-narrow">
          <h2 className="mb-6 text-center display-sm text-text-primary">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {product.faqs.map((faq, i) => (
              <div key={faq.question} className="card-premium overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-text-primary"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.question}
                  <span className="text-primary text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-6 pb-4 text-text-secondary leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-compact section-light">
        <div className="container-wide">
          {related.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-4 heading-xl text-text-primary">Related Products</h2>
              <div className="flex flex-wrap gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="group card-premium flex items-center gap-2 px-5 py-3 transition-all hover:border-primary hover:bg-primary/5"
                  >
                    <span className="font-semibold text-text-primary">{p.title}</span>
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-navy via-navy-light to-primary px-8 py-16 text-center"
          >
            <h2 className="display-md text-white">Interested in {product.title}?</h2>
            <p className="mt-4 text-lg text-white/70">Get in touch with our team to schedule a demo or learn more.</p>
            <div className="mt-8">
              <Button to="/contact" size="lg" className="bg-white text-navy hover:bg-surface hover:text-primary shadow-xl shadow-white/20">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
