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
    <div className="relative h-48 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      <img
        src={product.screenshots[0]}
        alt={product.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-60" />
      <span className="absolute top-3 right-3 rounded-lg bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-lg dark:bg-slate-800/95 dark:text-primary-light">
        {product.category}
      </span>
      <div className="absolute bottom-3 left-3 right-3">
        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-accent" />
      </div>
    </div>
  )
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group card-premium flex flex-col overflow-hidden"
    >
      <ProductVisual product={product} />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="heading-lg text-text-primary group-hover:text-primary transition-colors">{product.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">
          {product.shortDescription}
        </p>
        <ul className="mt-4 space-y-2">
          {product.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-text-primary/80">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          to={`/products/${product.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-light group-hover:gap-3"
        >
          Learn More
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}
