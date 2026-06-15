import { useState, useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { CheckIcon, ArrowRightIcon } from '../components/ui/Icons'
import { getProductBySlug, products } from '../data/products'
import dtp_db from '../assets/projects/daily-test-pro/dtp_db.png'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play interval effect for screenshots
  useEffect(() => {
    if (product?.screenshots && product.screenshots.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentScreenshot((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1))
      }, 3000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [product, currentScreenshot])

  if (!product) return <Navigate to="/products" replace />

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 2)

  // Split description cleanly
  const descriptionParts = product.description.split('. ').filter(p => p.trim().length > 0)
  const firstParagraph = descriptionParts.slice(0, Math.ceil(descriptionParts.length / 2)).join('. ') + (descriptionParts.length > 1 ? '.' : '')
  const secondParagraph = descriptionParts.slice(Math.ceil(descriptionParts.length / 2)).join('. ') + (descriptionParts.length > 2 ? '.' : '')

  const handleManualChange = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentScreenshot(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#eef5ff] text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/50 py-12 lg:py-16">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 via-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 space-y-5"
            >
              <Link 
                to="/products" 
                className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform mr-1.5">←</span> Back to Products
              </Link>
              
              <div className="inline-block">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 rounded-full border border-blue-200/60 shadow-xs">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                  {product.title}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl font-normal">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  to="/contact" 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-md shadow-blue-500/20 border-0 px-6 py-3 text-sm font-bold rounded-xl transition-all hover:scale-102"
                >
                  Request a Demo
                </Button>
                <Button
                  onClick={() => window.open(product.demoUrl, '_blank')}
                  variant="outline"
                  size="lg"
                  className="border border-slate-300 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-6 py-3 text-sm font-bold rounded-xl transition-all hover:scale-102"
                >
                  Live Demo
                </Button>
              </div>
            </motion.div>
            
            {/* Right Dashboard Mockup Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-7 w-full"
            >
              {product.slug === 'daily-test-manager-pro' ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white p-1.5 transition-transform hover:scale-[1.005] duration-300">
                  <img src={dtp_db} alt="Dashboard Preview" className="w-full h-auto rounded-xl object-cover" />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 p-6" style={{ backgroundColor: product.accentColor }}>
                  <div className="overflow-hidden rounded-xl border border-white/60 bg-white/95 backdrop-blur-xs shadow-sm">
                    <div className="flex items-center gap-2 border-b border-slate-200/60 px-4 py-3 bg-slate-50/50">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: product.color }} />
                      <div className="text-xs font-semibold text-slate-500">{product.title} Operational Panel</div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="rounded-lg border border-slate-200/60 p-3 bg-white/60 shadow-xs">
                            <div className="h-1.5 w-8 rounded mb-2" style={{ backgroundColor: product.color, opacity: 0.5 }} />
                            <div className="h-3 w-12 rounded" style={{ backgroundColor: product.color, opacity: 0.2 }} />
                          </div>
                        ))}
                      </div>
                      <div className="flex h-24 items-end gap-2">
                        {[45, 70, 40, 85, 60, 95, 75].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: product.color, opacity: 0.15 + i * 0.08 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="container mx-auto px-4 max-w-7xl py-12 space-y-12">
        
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          
          {/* Overview Block */}
          <section className="lg:col-span-6 flex flex-col">
            <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-200/50 p-6 sm:p-8 flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h2>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-slate-600 font-normal">
                <p>{firstParagraph}</p>
                {secondParagraph && <p>{secondParagraph}</p>}
              </div>
            </div>
          </section>

          {/* Cleaned & Reduced Features & Benefits Matrix */}
          <section className="lg:col-span-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {/* Features (Sliced to top 3 for clean UI) */}
            <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-200/50 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Core Features</h3>
              <div className="space-y-3">
                {product.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-slate-800 text-sm font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits (Sliced to top 3 for symmetry) */}
            <div className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-200/50 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {product.benefits.slice(0, 3).map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ & Gallery Layout */}
        <section className="grid gap-8 lg:grid-cols-12 pt-4">
          
          {/* FAQ Segment */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {product.faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={faq.question} className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50/50 transition-colors"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span className="text-sm pr-2">{faq.question}</span>
                      <span className={`text-base font-light text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-45 text-blue-600' : ''}`}>＋</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-4 text-slate-500 text-xs leading-relaxed border-t border-slate-50 pt-2.5">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rotating Product Gallery */}
          {product.screenshots && product.screenshots.length > 0 && (
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Product Gallery <span className="text-xs font-normal text-slate-400 ml-1.5">(Auto-sliding)</span>
              </h2>
              <div className="bg-white rounded-2xl border border-slate-200/60 p-3 shadow-md relative group">
                <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[16/10] flex items-center justify-center">
                  <img
                    src={product.screenshots[currentScreenshot]}
                    alt="Platform Slide"
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                  
                  {product.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (timerRef.current) clearInterval(timerRef.current);
                          setCurrentScreenshot((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white text-sm transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (timerRef.current) clearInterval(timerRef.current);
                          setCurrentScreenshot((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white text-sm transition-opacity opacity-0 group-hover:opacity-100"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Dot Trackers */}
                {product.screenshots.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3">
                    {product.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleManualChange(i)}
                        className={`h-2 rounded-full transition-all ${i === currentScreenshot ? 'w-5 bg-blue-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Global Footer Banner */}
        <div className="grid gap-6 lg:grid-cols-12 items-center pt-6 border-t border-slate-200">
          <div className="lg:col-span-5">
            {related.length > 0 && (
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Related:</span>
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white text-xs font-semibold text-slate-800 rounded-xl border border-slate-200/60 hover:border-blue-300 hover:text-blue-600 transition-all shadow-xs"
                  >
                    {p.title} <ArrowRightIcon className="text-blue-500 h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Premium CTA Banner */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 sm:p-8 text-left shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none" />
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Interested in {product.title}?</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">Schedule a seamless personalized technical dashboard walkthrough with our core engineering group.</p>
              </div>
              <Button 
                to="/contact" 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-slate-100 font-bold px-6 py-3 text-sm rounded-xl shrink-0 border border-white transition-all shadow-md active:scale-98"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}