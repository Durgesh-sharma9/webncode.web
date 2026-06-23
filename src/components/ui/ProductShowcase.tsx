import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '../../data/products'

export default function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
      }, 4000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const currentProduct = products[currentIndex]

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
        <div className="relative aspect-[16/10] bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentProduct.screenshots[0]}
              alt={currentProduct.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>

          {/* Product Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="text-lg font-black uppercase font-mono tracking-tight text-white">
                {currentProduct.title}
              </h3>
              <p className="mt-2 text-xs font-medium text-slate-200 line-clamp-2">
                {currentProduct.shortDescription}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-2 border-t-2 border-slate-900 bg-[#ebebeb] py-3">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 border border-slate-900 transition-all ${
                index === currentIndex ? 'w-6 bg-[#ff9e7d]' : 'w-2.5 bg-slate-200'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating Animated Neo-brutalist Badge (Bottom Left) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -left-4 border-2 border-slate-900 bg-white p-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:-left-8 max-w-[240px]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-slate-900 bg-[#86efac] font-mono text-xs font-black shadow-[1px_1px_0px_0px_#000]">
            ✓
          </div>
          <div>
            <div className="text-xs font-black uppercase font-mono text-slate-900 leading-tight">Live Demo</div>
            <div className="text-[10px] font-bold font-mono tracking-tight text-slate-600 mt-0.5">
              {currentProduct.title}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
