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
    <div className="min-h-screen bg-gradient-to-b from-[#f8fbff] to-[#eef5ff] text-slate-800 antialiased selection:bg-blue-500 selection:text-white relative">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/5 via-cyan-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Modern Header / Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/50 py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs">
              ⚡ Web n Code Suite
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Explore Our{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
                SaaS Products
              </span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 font-normal max-w-2xl pt-1">
              Discover native operational suites engineered from scratch to simplify architecture automation, testing lifecycles, and database compliance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Control Panel & Listings Section */}
      <section className="container mx-auto px-4 max-w-7xl py-10 space-y-10 relative z-10">
        
        {/* Re-designed Modern & Balanced Search Control Bar Container */}
        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm backdrop-blur-md">
          <div className="grid gap-4 lg:grid-cols-12 items-center">
            
            {/* Search Input Field Layout (Takes 5 columns) */}
            <div className="relative lg:col-span-5 group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search products (e.g., HireHub, Attendance...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pr-10 pl-12 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium shadow-2xs"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 font-light text-xl transition-colors cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Filter Category Buttons Pills Box Layout (Takes 7 columns) */}
            <div className="lg:col-span-7 flex flex-wrap gap-2 lg:justify-end items-center">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    category === cat
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20 border-transparent scale-102'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 shadow-3xs hover:scale-101'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="relative min-h-[350px]">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div 
                layout 
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="flex flex-col h-full"
                  >
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Enhanced Empty Search Result UI Layout State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-md py-20 text-center flex flex-col items-center justify-center space-y-4"
              >
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-slate-100 border border-slate-200 text-slate-400 shadow-inner">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">No products found</h3>
                  <p className="text-sm text-slate-400 max-w-xs">We couldn't find anything matching your keywords.</p>
                </div>
                <button
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
    </div>
  )
}