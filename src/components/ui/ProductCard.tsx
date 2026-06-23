import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ArrowRightIcon, CheckIcon } from './Icons'

interface ProductCardProps {
  product: Product
  index?: number
}

function ProductVisual({ product }: { product: Product }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const cardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasDedicatedImage = Boolean(product.image)
  const hasSlideshow = !hasDedicatedImage && product.screenshots && product.screenshots.length > 1

  useEffect(() => {
    return () => {
      if (cardTimerRef.current) clearInterval(cardTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!hasSlideshow) return

    cardTimerRef.current = setInterval(() => {
      setCurrentImgIdx((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1))
    }, 3500)

    return () => {
      if (cardTimerRef.current) clearInterval(cardTimerRef.current)
    }
  }, [hasSlideshow, product.screenshots])

  return (
    <div className="relative h-48 overflow-hidden bg-slate-100 flex items-center justify-center border-b-2 border-slate-900 group">
      <img
        src={
          product.image ||
          (product.screenshots && product.screenshots[currentImgIdx]
            ? product.screenshots[currentImgIdx]
            : '')
        }
        alt={`${product.title} view`}
        className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
      />
      
      <span className="absolute top-3 right-3 rounded border-2 border-slate-900 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
        {product.category}
      </span>
      
      {!hasDedicatedImage && product.screenshots && product.screenshots.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-white border-2 border-slate-900 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-10">
          {product.screenshots.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 border border-slate-900 transition-all ${idx === currentImgIdx ? 'w-4 bg-[#ff9e7d]' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      // Card wrapper transformations with permanent hard offsets
      className="group bg-white border-2 border-slate-900 rounded-md overflow-hidden flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-150"
    >
      {/* Image Preview Window */}
      <ProductVisual product={product} />
      
      {/* Details Area */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        
        <div className="space-y-2 flex-1">
          {/* Heavy Block Title Heading */}
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
            {product.title}
          </h3>
          
          <p className="text-xs leading-relaxed text-slate-700 font-medium line-clamp-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Flat Checklist Blocks */}
        <ul className="space-y-2 pt-4 border-t-2 border-slate-900/10">
          {product.features.slice(0, 2).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-slate-800 font-bold uppercase tracking-wide font-mono">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center border border-slate-900 bg-[#86efac] text-slate-900">
                <CheckIcon className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </ul>

        {/* Neo-brutalist Text Action Trigger */}
        <div className="pt-2">
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest font-mono text-slate-900 hover:text-slate-900 bg-[#ff9e7d] border border-slate-900 px-2.5 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
          >
            <span>Get Started</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </motion.article>
  )
}
