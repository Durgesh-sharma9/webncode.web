import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { products } from '../../data/products'

export default function FeaturedProducts() {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Carousel Movement manual click handler
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current
      const scrollOffset = direction === 'left' ? -340 : 340
      carouselRef.current.scrollTo({
        left: scrollLeft + scrollOffset,
        behavior: 'smooth'
      })
    }
  }

  // Smooth SaaS auto-scroll calculation loop
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        
        // Loop infinitely back to the starting item once user reaches the edge boundary
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scroll('right')
        }
      }
    }, 3500) // Advances smoothly every 3.5 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <section
      id="products-section"
      className="pt-10 pb-10 md:pt-14 md:pb-12 bg-white border-b-2 border-slate-900 relative scroll-mt-16"
    >
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="" /* REMOVED: Badge header badge dropped completely */
          title="Software Built for Real Operations"
          description="Purpose-built SaaS products that solve everyday challenges for schools, colleges, and organizations."
        />
        
        {/* Manual Control Triggers - Separate row below subtitle */}
        <div className="hidden md:flex justify-end items-center gap-3 mb-4 z-20">
          <button
            onClick={() => scroll('left')}
            className="flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
            aria-label="Scroll Left"
          >
            ←
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white font-black text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all"
            aria-label="Scroll Right"
          >
            →
          </button>
        </div>

        {/* Swipeable Carousel Element Frame wrapper */}
        <div 
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pt-4 pb-4 scroll-smooth scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {products.map((product, i) => (
            <div key={product.id} className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>

        {/* Bottom Static Catalog Link Trigger Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 md:mt-10 text-center"
        >
          <Button to="/products" variant="outline" size="lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}