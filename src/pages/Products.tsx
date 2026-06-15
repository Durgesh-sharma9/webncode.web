import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon } from '../components/ui/Icons'
import ProductCard from '../components/ui/ProductCard'
import { products, productCategories } from '../data/products'

export default function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesSearch =
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [search, category])

  return (
    <>
      <section className="relative overflow-hidden gradient-bg">
        <div className="orb orb-primary w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-accent w-80 h-80 bottom-0 -left-40" />
        
        <div className="container-wide relative px-5 pt-6 pb-6 md:px-8 lg:px-12 lg:pt-8 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Web n Code Suite
            </span>
            <h1 className="mt-3 display-lg gradient-text">
              Our SaaS Products
            </h1>
            <p className="mt-3 text-base leading-relaxed text-text-secondary md:text-lg">
              Explore our native product suite built from the ground up to solve operation management, automation, and data complexities.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding-compact section-surface">
        <div className="container-wide">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-5 w-5 text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search products (e.g., HireHub, Attendance...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card py-3.5 pr-4 pl-12 text-sm text-text-primary shadow-sm outline-none transition-all duration-200 placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    category === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'border border-border bg-card text-text-secondary hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((product, i) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <ProductCard product={product} index={i} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto max-w-md py-20 text-center"
                >
                  <h3 className="heading-lg text-text-primary">No products found</h3>
                  <p className="mt-2 text-sm text-text-secondary">We couldn't find anything matching your keywords.</p>
                  <button
                    onClick={() => { setSearch(''); setCategory('All'); }}
                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  )
}