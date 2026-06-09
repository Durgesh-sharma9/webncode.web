import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../../data/products'
import { ArrowRightIcon, CheckIcon } from './Icons'

interface ProductCardProps {
  product: Product
  index?: number
}

function ProductVisual({ product }: { product: Product }) {
  return (
    <div
      className="relative h-44 overflow-hidden rounded-t-2xl"
      style={{ backgroundColor: product.accentColor }}
    >
      <div className="absolute inset-0 p-5">
        <div className="card-shadow h-full overflow-hidden rounded-xl border border-white/60 bg-white">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: product.color }} />
            <div className="h-1.5 w-20 rounded bg-muted/20" />
          </div>
          <div className="p-3">
            <div className="mb-2 h-2 w-24 rounded" style={{ backgroundColor: product.color, opacity: 0.7 }} />
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded border border-border p-2">
                  <div className="mb-1 h-1 w-6 rounded bg-muted/20" />
                  <div className="h-3 w-8 rounded" style={{ backgroundColor: product.color, opacity: 0.3 }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              {[60, 80, 45, 90, 70].map((w, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${w * 0.3}px`, backgroundColor: product.color, opacity: 0.2 + i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group card-shadow flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1"
    >
      <ProductVisual product={product} />
      <div className="flex flex-1 flex-col p-6">
        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
          {product.category}
        </span>
        <h3 className="text-xl font-bold text-navy">{product.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {product.shortDescription}
        </p>
        <ul className="mt-4 space-y-1.5">
          {product.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-navy/80">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          to={`/products/${product.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light"
        >
          Learn More
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}
