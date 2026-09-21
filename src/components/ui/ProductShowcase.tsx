import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { products as staticProducts, type Product } from '../../data/products'

export default function ProductShowcase() {
  const [productsList, setProductsList] = useState<Product[]>(staticProducts)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Fetch live projects from backend so SuperAdmin changes to "Syllabus Tracker" and other showcase items appear instantly
  useEffect(() => {
    const fetchShowcaseProjects = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')
        const res = await axios.get(`${API_BASE}/api/projects`)
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const dbProjects = res.data.data
          // Featured projects selected by SuperAdmin, or fallback to all
          const featured = dbProjects.filter((p: any) => p.isFeatured)
          const sourceProjects = featured.length > 0 ? featured : dbProjects

          const mapped: Product[] = sourceProjects.map((p: any, idx: number) => {
            // Find static product with matching slug or use fallback screenshot
            const matchStatic = staticProducts.find(
              (sp) => sp.slug === p.slug || sp.title.toLowerCase() === p.title.toLowerCase()
            )
            const fallbackScreenshot = matchStatic?.screenshots?.[0] || staticProducts[idx % staticProducts.length]?.screenshots?.[0]

            return {
              id: p._id || String(idx),
              slug: p.slug,
              title: p.title,
              shortDescription: p.shortDescription,
              description: p.description || '',
              category: p.category || 'Education',
              features: p.features || [],
              benefits: matchStatic?.benefits || [],
              faqs: matchStatic?.faqs || [],
              color: p.color || '#7dd3fc',
              accentColor: p.accentColor || '#38bdf8',
              screenshots: p.images && p.images.length > 0 ? p.images : [fallbackScreenshot],
              demoUrl: p.demoUrl || matchStatic?.demoUrl || ''
            }
          })

          setProductsList(mapped)
        }
      } catch (err) {
        console.warn('Failed to load dynamic showcase projects, using local cache:', err)
      }
    }

    fetchShowcaseProjects()
  }, [])

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!isPaused && productsList.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= productsList.length - 1 ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, productsList.length])

  // Safeguard currentIndex
  const safeIndex = currentIndex >= productsList.length ? 0 : currentIndex
  const currentProduct = productsList[safeIndex] || staticProducts[0]

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const currentScreenshot =
    (currentProduct.screenshots && currentProduct.screenshots[0]) ||
    staticProducts[0].screenshots[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Browser Window Container with Neo-Brutalist Border & Heavy Shadow */}
      <div className="overflow-hidden rounded-md border-2 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        {/* Browser Header Mac-Style Pills */}
        <div className="flex items-center gap-2 border-b-2 border-slate-900 bg-[#ebebeb] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-red-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-yellow-400" />
            <div className="h-3 w-3 rounded-full border border-slate-900 bg-green-400" />
          </div>
          <div className="mx-auto flex h-7 items-center justify-center border-2 border-slate-900 rounded bg-white px-4 text-xs font-mono font-black text-slate-800 shadow-[1px_1px_0px_0px_#000]">
            {currentProduct.title}
          </div>
        </div>

        {/* Product Screenshot Carousel */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentProduct.id}-${safeIndex}`}
              src={currentScreenshot}
              alt={currentProduct.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                // Fallback to static screenshot on load error
                const target = e.target as HTMLImageElement
                target.src = staticProducts[0].screenshots[0]
              }}
            />
          </AnimatePresence>

          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-5 sm:p-6">
            <motion.div
              key={`text-${currentProduct.id}-${safeIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-base sm:text-lg font-black uppercase font-mono tracking-tight text-white drop-shadow-md">
                {currentProduct.title}
              </h3>
              <p className="mt-1.5 text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                {currentProduct.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 border-t-2 border-slate-900 bg-[#ebebeb] py-3">
          {productsList.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 border border-slate-900 transition-all cursor-pointer ${
                index === safeIndex ? 'w-6 bg-[#ff9e7d]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Animated Neo-brutalist Badge (Bottom Left) with Click-to-Open Live Demo */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 sm:-left-8 max-w-[260px] z-20"
      >
        {currentProduct.demoUrl ? (
          <a
            href={currentProduct.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border-2 border-slate-900 bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-[#f0fdf4] transition-colors cursor-pointer group"
            title={`Open Live Demo for ${currentProduct.title}`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#86efac] group-hover:bg-[#4ade80] font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000] transition-colors">
              ✓
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase font-mono text-slate-900 leading-tight flex items-center gap-1">
                <span>Live Demo</span>
                <span className="text-[10px] text-emerald-600">↗</span>
              </div>
              <div className="text-[10px] font-bold font-mono tracking-tight text-slate-600 mt-0.5 truncate">
                {currentProduct.title}
              </div>
            </div>
          </a>
        ) : (
          <div className="flex items-center gap-3 border-2 border-slate-900 bg-white p-2.5 sm:p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#86efac] font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000]">
              ✓
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black uppercase font-mono text-slate-900 leading-tight">
                Live Demo
              </div>
              <div className="text-[10px] font-bold font-mono tracking-tight text-slate-600 mt-0.5 truncate">
                {currentProduct.title}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

