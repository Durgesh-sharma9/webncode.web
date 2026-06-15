import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ArrowRightIcon, CheckIcon } from './Icons'

interface ProductCardProps {
  product: Product
  index?: number
}

function ProductVisual({ product }: { product: Product }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const cardTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Individual loop for card screenshots (Runs every 3.5 seconds for distinct smooth feeling)
  useEffect(() => {
    if (product.screenshots && product.screenshots.length > 1) {
      cardTimerRef.current = setInterval(() => {
        setCurrentImgIdx((prev) => (prev === product.screenshots.length - 1 ? 0 : prev + 1))
      }, 3500)
    }

    return () => {
      if (cardTimerRef.current) clearInterval(cardTimerRef.current)
    }
  }, [product.screenshots])

  return (
    <div className="relative h-48 overflow-hidden bg-slate-950 flex items-center justify-center border-b border-slate-100 group-hover:border-slate-200/20">
      
      {/* Background soft ambient tracking fluid color wrapper */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-multiply transition-opacity duration-500 group-hover:opacity-25" 
        style={{ backgroundColor: product.color || '#2563eb' }}
      />
      
      {/* Auto-rotating continuous dynamic screen snapshot image rendering layer */}
      <img
        src={product.screenshots && product.screenshots[currentImgIdx] ? product.screenshots[currentImgIdx] : ''}
        alt={`${product.title} view`}
        className="h-full w-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-102"
      />
      
      {/* Shadow layer over bottom mask overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/10 pointer-events-none" />
      
      {/* Glassmorphic Category Badge Tag styling */}
      <span className="absolute top-3 right-3 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-white/50 shadow-xs">
        {product.category}
      </span>
      
      {/* Mini Active Image Pips Tracking bars indicators */}
      {product.screenshots && product.screenshots.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-slate-950/40 backdrop-blur-xs px-2 py-1 rounded-full z-10 transition-opacity opacity-60 group-hover:opacity-100">
          {product.screenshots.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentImgIdx ? 'w-3 bg-white' : 'w-1 bg-white/40'}`}
            />
          ))}
        </div>
      )}

      {/* Corporate Solid Brand Color Bottom Stripe border track bar line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]">
        <div 
          className="h-full w-1/5 transition-all duration-500 ease-out group-hover:w-full" 
          style={{ backgroundColor: product.color || '#2563eb' }}
        />
      </div>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Brand color shadow glow properties calculations configurations
  const dynamicGlowEffect = {
    boxShadow: `0 12px 35px -12px ${product.color ? `${product.color}25` : 'rgba(37,99,235,0.15)'}`
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ y: -5, ...dynamicGlowEffect }}
      className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col h-full transition-all duration-300"
    >
      {/* Self-changing image preview showcase strip */}
      <ProductVisual product={product} />
      
      {/* Structural Metadata details column content blocks */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        
        <div className="space-y-1.5 flex-1">
          {/* Dynamic title component with custom state color switches */}
          <h3 className="text-base font-bold text-slate-900 tracking-tight transition-colors">
            <span 
              className="transition-colors duration-200"
              style={{ color: 'inherit' }}
            >
              {product.title}
            </span>
          </h3>
          
          <p className="text-xs leading-relaxed text-slate-500 font-normal line-clamp-3">
            {product.shortDescription}
          </p>
        </div>

        {/* Tailored minimalist features bullet array indicators */}
        <ul className="space-y-2 pt-3 border-t border-slate-100">
          {product.features.slice(0, 2).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <div 
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-opacity-10"
                style={{ backgroundColor: `${product.color || '#2563eb'}12`, color: product.color || '#2563eb' }}
              >
                <CheckIcon className="h-2.5 w-2.5 stroke-[3.5]" />
              </div>
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </ul>

        {/* Action Button Navigation links controls */}
        <div className="pt-1.5">
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-all group/btn"
          >
            <span className="relative">
              Learn More
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-blue-600 transition-all group-hover/btn:w-full" />
            </span>
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </motion.article>
  )
}