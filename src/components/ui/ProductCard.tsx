import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ArrowRightIcon, CheckIcon } from './Icons'

interface ProductCardProps {
  product: Product
  index?: number
}

interface ThemeConfig {
  badge: string;
  checkBg: string;
  btnBg: string;
  cardAccent: string;
  indicatorActive: string;
  contentBg: string;
}

// FIX: Upgraded explicitly mapped backgrounds and badges to stronger `100` pastel shades
const predefinedThemes: Record<string, ThemeConfig> = {
  'Web Builder Pro': {
    badge: 'bg-blue-100 text-blue-900',
    checkBg: 'bg-[#7dd3fc]',
    btnBg: 'bg-[#7dd3fc]',
    cardAccent: 'border-t-[#7dd3fc]',
    indicatorActive: 'bg-[#7dd3fc]',
    contentBg: 'bg-blue-100'
  },
  'Timetable Pro': {
    badge: 'bg-orange-100 text-orange-900',
    checkBg: 'bg-[#ff9e7d]',
    btnBg: 'bg-[#ff9e7d]',
    cardAccent: 'border-t-[#ff9e7d]',
    indicatorActive: 'bg-[#ff9e7d]',
    contentBg: 'bg-orange-100'
  },
  'Star Sports': {
    badge: 'bg-green-100 text-green-900',
    checkBg: 'bg-[#86efac]',
    btnBg: 'bg-[#86efac]',
    cardAccent: 'border-t-[#86efac]',
    indicatorActive: 'bg-[#86efac]',
    contentBg: 'bg-green-100'
  },
  'Daily Test Manager Pro': {
    badge: 'bg-purple-100 text-purple-900',
    checkBg: 'bg-[#c084fc]',
    btnBg: 'bg-[#c084fc]',
    cardAccent: 'border-t-[#c084fc]',
    indicatorActive: 'bg-[#c084fc]',
    contentBg: 'bg-purple-100'
  },
  'Attendance Pro': {
    badge: 'bg-yellow-100 text-yellow-900',
    checkBg: 'bg-[#fde047]',
    btnBg: 'bg-[#fde047]',
    cardAccent: 'border-t-[#fde047]',
    indicatorActive: 'bg-[#fde047]',
    contentBg: 'bg-yellow-100'
  },
  'HireHub': {
    badge: 'bg-cyan-100 text-cyan-900',
    checkBg: 'bg-[#22d3ee]',
    btnBg: 'bg-[#22d3ee]',
    cardAccent: 'border-t-[#22d3ee]',
    indicatorActive: 'bg-[#22d3ee]',
    contentBg: 'bg-cyan-100'
  }
}

// FIX: Array of professional fallback pastel themes for any new, unmapped products
const fallbackThemes: ThemeConfig[] = [
  { // Pink Theme
    badge: 'bg-pink-100 text-pink-900',
    checkBg: 'bg-[#f9a8d4]', btnBg: 'bg-[#f9a8d4]', cardAccent: 'border-t-[#f9a8d4]', indicatorActive: 'bg-[#f9a8d4]', contentBg: 'bg-pink-100'
  },
  { // Teal Theme
    badge: 'bg-teal-100 text-teal-900',
    checkBg: 'bg-[#5eead4]', btnBg: 'bg-[#5eead4]', cardAccent: 'border-t-[#5eead4]', indicatorActive: 'bg-[#5eead4]', contentBg: 'bg-teal-100'
  },
  { // Indigo Theme
    badge: 'bg-indigo-100 text-indigo-900',
    checkBg: 'bg-[#a5b4fc]', btnBg: 'bg-[#a5b4fc]', cardAccent: 'border-t-[#a5b4fc]', indicatorActive: 'bg-[#a5b4fc]', contentBg: 'bg-indigo-100'
  },
  { // Rose Theme
    badge: 'bg-rose-100 text-rose-900',
    checkBg: 'bg-[#fda4af]', btnBg: 'bg-[#fda4af]', cardAccent: 'border-t-[#fda4af]', indicatorActive: 'bg-[#fda4af]', contentBg: 'bg-rose-100'
  }
]

// FIX: Helper function to guarantee a theme is ALWAYS applied (no more white fallbacks)
function getProductTheme(title: string): ThemeConfig {
  // 1. If explicitly defined, return it immediately
  if (predefinedThemes[title]) return predefinedThemes[title]
  
  // 2. Otherwise, assign a consistent fallback mathematically based on the product name
  const hash = Array.from(title).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return fallbackThemes[hash % fallbackThemes.length]
}

function ProductVisual({ product, theme }: { product: Product; theme: ThemeConfig }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const cardTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasSlideshow = product.screenshots && product.screenshots.length > 1

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
          product.screenshots && product.screenshots[currentImgIdx]
            ? product.screenshots[currentImgIdx]
            : ''
        }
        alt={`${product.title} view`}
        className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
      />
      
      <span className={`absolute top-3 right-3 rounded border-2 border-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${theme.badge}`}>
        {product.category}
      </span>
      
      {hasSlideshow && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-white border-2 border-slate-900 px-2 py-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-10">
          {product.screenshots.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 border border-slate-900 transition-all ${idx === currentImgIdx ? `w-4 ${theme.indicatorActive}` : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  // Resolve current active design tokens matching product metadata safely
  const theme = getProductTheme(product.title)

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`group bg-white border-2 border-t-4 border-slate-900 rounded-md overflow-hidden flex flex-col h-full shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-150 ${theme.cardAccent}`}
    >
      <ProductVisual product={product} theme={theme} />
      
      {/* Target Content area dynamically tinted to `100` shade */}
      <div className={`flex flex-1 flex-col p-5 space-y-4 ${theme.contentBg}`}>
        <div className="space-y-2 flex-1">
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
            {product.title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-700 font-medium line-clamp-3">
            {product.shortDescription}
          </p>
        </div>

        <ul className="space-y-2 pt-4 border-t-2 border-slate-900/10">
          {product.features.slice(0, 2).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-slate-800 font-bold uppercase tracking-wide font-mono">
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center border border-slate-900 text-slate-900 ${theme.checkBg}`}>
                <CheckIcon className="h-3 w-3 stroke-[3]" />
              </div>
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </ul>

        <div className="pt-2">
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest font-mono text-slate-900 hover:text-slate-900 border border-slate-900 px-2.5 py-1.5 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all ${theme.btnBg}`}
          >
            <span>Get Started</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  )
}