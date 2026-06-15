import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { CheckIcon, ArrowRightIcon } from '../components/ui/Icons'
import { getProductBySlug, products } from '../data/products'
import dtp_db from '../assets/projects/daily-test-pro/dtp_db.png'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  if (!product) return <Navigate to="/products" replace />

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 2)

  // Split description into two paragraphs
  const descriptionParts = product.description.split('. ').filter(p => p.length > 0)
  const firstParagraph = descriptionParts.slice(0, Math.ceil(descriptionParts.length / 2)).join('. ') + (descriptionParts.length > 1 ? '.' : '')
  const secondParagraph = descriptionParts.slice(Math.ceil(descriptionParts.length / 2)).join('. ') + '.'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#eef5ff]">
      {/* Compact Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/60">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 via-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="container-wide py-8 lg:py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2"
          >
            {/* Left Content */}
            <div className="space-y-4">
              <Link 
                to="/products" 
                className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="ml-1">Back to Products</span>
              </Link>
              
              <div className="inline-flex">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200/50 shadow-sm">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  {product.title}
                </span>
              </h1>
              
              <p className="text-base leading-relaxed text-slate-600 max-w-md">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-1">
                <Button 
                  to="/contact" 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 border-0 px-6 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Request a Demo
                </Button>
                <Button
                  onClick={() => window.open(product.demoUrl, '_blank')}
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-6 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-105"
                >
                  Live Demo
                </Button>
              </div>
            </div>
            
            {/* Right Screenshot */}
            <div className="relative">
              {product.slug === 'daily-test-manager-pro' ? (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/25 border border-slate-200/50 bg-white"
                  whileHover={{ scale: 1.01 }}
                >
                  <img
                    src={dtp_db}
                    alt="Daily Test Manager Pro Dashboard"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/3 to-cyan-500/3 pointer-events-none" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/25 border border-slate-200/50"
                  style={{ backgroundColor: product.accentColor }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="p-6">
                    <div className="overflow-hidden rounded-xl border border-white/60 bg-white/90 backdrop-blur-sm">
                      <div className="flex items-center gap-2 border-b border-slate-200/60 px-4 py-3">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: product.color }} />
                        <div className="text-xs font-medium text-slate-600">{product.title} Dashboard</div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="rounded-lg border border-slate-200/60 p-3 bg-slate-50/50">
                              <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: product.color, opacity: 0.5 }} />
                              <div className="h-3 w-12 rounded" style={{ backgroundColor: product.color, opacity: 0.2 }} />
                            </div>
                          ))}
                        </div>
                        <div className="flex h-28 items-end gap-2">
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
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compact Overview Card */}
      <section className="py-8 lg:py-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
              
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30">
                    <CheckIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                </div>
                
                <div className="space-y-3 text-base leading-relaxed text-slate-600">
                  <p>{firstParagraph}</p>
                  {secondParagraph && <p>{secondParagraph}</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compact Features Grid */}
      <section className="py-8 lg:py-10 bg-white/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Key Features</h2>
          </motion.div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="group bg-white rounded-xl p-4 shadow-md shadow-slate-200/50 border border-slate-200/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-slate-900 text-sm">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Benefits Cards */}
      <section className="py-8 lg:py-10">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Benefits</h2>
          </motion.div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-md shadow-slate-200/50 border border-slate-200/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30 mt-0.5">
                  <CheckIcon className="h-3.5 w-3.5" />
                </div>
                <span className="text-slate-700 font-medium text-sm leading-relaxed">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + Screenshots Side-by-Side Layout */}
      <section className="py-8 lg:py-10 bg-white/50">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:gap-12 lg:grid-cols-[40%_60%]"
          >
            {/* Left: FAQ Accordion (40%) */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {product.faqs.map((faq, i) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl shadow-md shadow-slate-200/50 border border-slate-200/50 overflow-hidden"
                  >
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-slate-900 hover:bg-slate-50/50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="text-sm">{faq.question}</span>
                      <motion.span
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-blue-500 text-lg"
                      >
                        +
                      </motion.span>
                    </button>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: openFaq === i ? 'auto' : 0,
                        opacity: openFaq === i ? 1 : 0
                      }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 text-slate-600 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Screenshot Gallery (60%) */}
            {product.screenshots && product.screenshots.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Screenshots</h2>
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/50 p-4">
                  <div className="relative" style={{ maxHeight: '380px' }}>
                    <img
                      src={product.screenshots[currentScreenshot]}
                      alt={`${product.title} Screenshot ${currentScreenshot + 1}`}
                      className="w-full h-auto rounded-xl object-contain mx-auto"
                      style={{ maxHeight: '380px' }}
                    />
                    
                    {product.screenshots.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentScreenshot((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentScreenshot((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
                        >
                          →
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {product.screenshots.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentScreenshot(i)}
                              className={`h-2 w-2 rounded-full transition-colors ${i === currentScreenshot ? 'bg-blue-500' : 'bg-slate-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Related Products & CTA */}
      <section className="py-8 lg:py-10 bg-white/50">
        <div className="container-wide">
          {related.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-4">Related Products</h2>
              <div className="flex flex-wrap gap-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="group flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md shadow-slate-200/50 border border-slate-200/50 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200/50 transition-all"
                  >
                    <span className="font-semibold text-slate-900 text-sm">{p.title}</span>
                    <ArrowRightIcon className="transition-transform group-hover:translate-x-1 text-blue-500 h-4 w-4" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 lg:px-10 py-10 lg:py-12 text-center shadow-xl shadow-slate-900/30"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Interested in {product.title}?
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-xl mx-auto">
              Get in touch with our team to schedule a demo or learn more.
            </p>
            <Button 
              to="/contact" 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/20 px-8 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-105"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
