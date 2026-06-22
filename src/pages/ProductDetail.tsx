import { useState, useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { ArrowRightIcon } from '../components/ui/Icons'
import { getProductBySlug, products } from '../data/products'
import dtp_db from '../assets/projects/daily-test-pro/dtp_db.png'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const descriptionParts = product.description.split('. ').filter(p => p.trim().length > 0)
  const firstParagraph = descriptionParts.slice(0, Math.ceil(descriptionParts.length / 2)).join('. ') + (descriptionParts.length > 1 ? '.' : '')
  const secondParagraph = descriptionParts.slice(Math.ceil(descriptionParts.length / 2)).join('. ') + (descriptionParts.length > 2 ? '.' : '')

  const handleManualChange = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrentScreenshot(index)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-[#ff9e7d]">
      
      {/* Dynamic Structural Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-slate-900 bg-[#ebebeb] py-12 lg:py-16">
        <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
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
                className="inline-flex items-center text-xs font-black uppercase font-mono text-slate-600 hover:text-slate-900 hover:underline group"
              >
                <span className="group-hover:-translate-x-1 transition-transform mr-1.5">←</span> Back to Products
              </Link>
              
              <div className="block">
                <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                <span className="inline-block bg-[#ff9e7d] border-2 border-slate-900 px-3 py-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  {product.title}
                </span>
              </h1>
              
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700 max-w-xl leading-relaxed">
                {product.shortDescription}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button to="/contact" size="md" variant="primary">
                  Request a Demo
                </Button>
                <Button
                  onClick={() => window.open(product.demoUrl, '_blank')}
                  variant="outline"
                  size="md"
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
                <div className="relative rounded-md overflow-hidden border-2 border-slate-900 bg-white p-1 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                  <img src={dtp_db} alt="Dashboard Preview" className="w-full h-auto object-cover border border-slate-200" />
                </div>
              ) : (
                <div className="relative rounded-md overflow-hidden border-2 border-slate-900 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]" style={{ backgroundColor: product.accentColor || '#ebebeb' }}>
                  <div className="overflow-hidden rounded border-2 border-slate-900 bg-white shadow-[3px_3px_0px_0px_#000]">
                    <div className="flex items-center gap-2 border-b-2 border-slate-900 px-4 py-3 bg-[#ebebeb]">
                      <div className="h-3 w-3 rounded-full border border-slate-900" style={{ backgroundColor: product.color || '#000' }} />
                      <div className="text-xs font-black uppercase font-mono text-slate-800">{product.title} Operational Panel</div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="border-2 border-slate-900 p-3 bg-white shadow-[2px_2px_0px_0px_#000]">
                            <div className="h-2 w-8 border border-slate-900 mb-2" style={{ backgroundColor: product.color || '#000', opacity: 0.6 }} />
                            <div className="h-3 w-12 border border-slate-900/30 bg-slate-100" />
                          </div>
                        ))}
                      </div>
                      <div className="flex h-24 items-end gap-2 border-b-2 border-l-2 border-slate-900 p-1 bg-[#fafafa]">
                        {[45, 70, 40, 85, 60, 95, 75].map((h, i) => (
                          <div key={i} className="flex-1 border-t-2 border-x border-slate-900" style={{ height: `${h}%`, backgroundColor: product.color || '#7dd3fc' }} />
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

      {/* Main Content Area */}
      <div className="container mx-auto px-4 max-w-7xl py-12 space-y-12">
        
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          
          {/* Overview Block */}
          <section className="lg:col-span-7 flex flex-col">
            <div className="bg-white border-2 border-slate-900 p-6 sm:p-8 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex-1">
              <div className="flex items-center gap-3 mb-5 border-b-2 border-slate-900 pb-2 inline-block">
                <h2 className="text-xl font-black uppercase font-mono text-slate-900 tracking-tight">System Overview</h2>
              </div>
              <div className="space-y-4 text-sm font-medium leading-relaxed text-slate-700">
                <p>{firstParagraph}</p>
                {secondParagraph && <p>{secondParagraph}</p>}
              </div>
            </div>
          </section>

          {/* Core Layout Matrix Side columns */}
          <section className="lg:col-span-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {/* Features */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xs font-black uppercase tracking-wider font-mono text-slate-400 mb-4">Core Features</h3>
              <div className="space-y-3">
                {product.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-slate-900 text-xs font-black uppercase tracking-wide font-mono">
                    <span className="h-4 w-4 border border-slate-900 bg-[#86efac] flex items-center justify-center font-bold text-[10px]">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xs font-black uppercase tracking-wider font-mono text-slate-400 mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {product.benefits.slice(0, 3).map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2.5 text-slate-800 text-xs font-black uppercase tracking-wide font-mono">
                    <span className="h-4 w-4 border border-slate-900 bg-[#93c5fd] flex items-center justify-center font-bold text-[10px]">+</span>
                    <span className="truncate">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ & Gallery Track Framework */}
        <section className="grid gap-8 lg:grid-cols-12 pt-4">
          
          {/* FAQ Segment */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-black uppercase tracking-tight font-mono text-slate-900">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {product.faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={faq.question} className="bg-white border-2 border-slate-900 rounded shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between px-5 py-4 text-left font-black uppercase font-mono text-xs text-slate-800 hover:bg-[#fafafa]"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span className="pr-2">{faq.question}</span>
                      <span className={`text-sm font-black transition-transform duration-150 ${isOpen ? 'rotate-45 text-[#ff9e7d]' : ''}`}>＋</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="px-5 pb-4 text-slate-600 text-xs font-medium border-t border-slate-200 pt-3 bg-[#fafafa]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Gallery Carousel Section */}
          {product.screenshots && product.screenshots.length > 0 && (
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-black uppercase tracking-tight font-mono text-slate-900">
                Product Gallery <span className="text-xs font-black text-slate-400 font-mono ml-1.5">(AUTO-SLIDE)</span>
              </h2>
              <div className="bg-white border-2 border-slate-900 p-3 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative group">
                <div className="relative overflow-hidden rounded bg-slate-900 aspect-[16/10] flex items-center justify-center border border-slate-900">
                  <img
                    src={product.screenshots[currentScreenshot]}
                    alt="Platform Slide"
                    className="w-full h-full object-contain"
                  />
                  
                  {product.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (timerRef.current) clearInterval(timerRef.current);
                          setCurrentScreenshot((prev) => (prev === 0 ? product.screenshots.length - 1 : prev - 1));
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] text-sm font-black text-slate-900 transition-all hover:bg-[#ff9e7d]"
                      >
                        ←
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (timerRef.current) clearInterval(timerRef.current);
                          setCurrentScreenshot((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000] text-sm font-black text-slate-900 transition-all hover:bg-[#ff9e7d]"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>

                {/* Box trackers indexers */}
                {product.screenshots.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {product.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleManualChange(i)}
                        className={`h-2.5 border border-slate-900 transition-all ${i === currentScreenshot ? 'w-5 bg-[#ff9e7d]' : 'w-2.5 bg-slate-200'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Global Footer Banner */}
        <div className="grid gap-6 lg:grid-cols-12 items-center pt-8 border-t-2 border-slate-900">
          <div className="lg:col-span-5">
            {related.length > 0 && (
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-wider mr-1">Related Modules:</span>
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.slug}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white text-xs font-black uppercase font-mono text-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-[#7dd3fc] transition-all"
                  >
                    {p.title} <ArrowRightIcon className="text-slate-900 h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Call to Action Card Element */}
          <div className="lg:col-span-7">
            <div className="border-2 border-slate-900 bg-slate-900 p-6 sm:p-8 text-left shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 rounded-md">
              <div className="space-y-1 relative z-10">
                <h3 className="text-base sm:text-lg font-black uppercase font-mono text-white tracking-tight">Interested in {product.title}?</h3>
                <p className="text-xs font-medium text-slate-400 max-w-md leading-relaxed uppercase tracking-wide">Schedule a personalized technical metrics walkthrough with our deployment engineers.</p>
              </div>
              <Button 
                to="/contact" 
                size="md" 
                className="bg-white !text-slate-900 hover:bg-[#ff9e7d] border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"
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