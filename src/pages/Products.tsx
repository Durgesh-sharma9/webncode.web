import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ui/ProductCard'
import { SearchIcon } from '../components/ui/Icons'
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
      <section className="border-b border-border bg-surface">
        <div className="container-wide section-padding !pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Products
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy md:text-5xl">
              Our SaaS Product Suite
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Explore our portfolio of software products designed to simplify operations for schools, colleges, and organizations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-white py-3 pr-4 pl-12 text-sm text-navy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    category === cat
                      ? 'bg-primary text-white'
                      : 'border border-border bg-white text-muted hover:text-navy'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted">No products match your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
