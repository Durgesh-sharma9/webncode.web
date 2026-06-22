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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative">
      
      {/* Background Matrix Grid Pattern Decorator */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Structural Hero / Header Section */}
      <section className="relative overflow-hidden border-b-2 border-slate-900 bg-[#ebebeb] py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            <span className="inline-flex items-center rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
              ⚡ WEB N CODE SUITE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 leading-none">
              EXPLORE OUR <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-0.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                SAAS PRODUCTS
              </span>
            </h1>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700 max-w-2xl pt-2 leading-relaxed">
              Discover native operational suites engineered from scratch to simplify architecture automation, testing lifecycles, and database compliance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Control Panel & Listings Section */}
      <section className="container mx-auto px-4 max-w-7xl py-10 space-y-10 relative z-10">
        
        {/* Rigid Search & Filter Bar Wrapper */}
        <div className="bg-white border-2 border-slate-900 p-5 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-4 lg:grid-cols-12 items-center">
            
            {/* Search Input Box */}
            <div className="relative lg:col-span-5 group">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <SearchIcon className="h-5 w-5 text-slate-900 stroke-[2.5]" />
              </div>
              <input
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border-2 border-slate-900 bg-white py-3.5 pr-10 pl-12 text-xs font-mono font-black uppercase tracking-wider text-slate-900 outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-900 hover:text-slate-600 font-black text-lg cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Filter Category Block Actions */}
            <div className="lg:col-span-7 flex flex-wrap gap-2.5 lg:justify-end items-center">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded px-4 py-2 text-xs font-black uppercase tracking-wider font-mono transition-all border-2 border-slate-900 ${
                    category === cat
                      ? 'bg-[#7dd3fc] text-slate-900 shadow-[3px_3px_0px_0px_#000] translate-y-[-1px]'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Product Grid Area Framework */}
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
                    transition={{ duration: 0.2, delay: i * 0.01 }}
                    className="flex flex-col h-full"
                  >
                    <ProductCard product={product} index={i} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Flat Empty Search Block Engine */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-md py-16 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-900 p-8 rounded-md bg-white"
              >
                <div className="flex h-12 w-12 items-center justify-center border-2 border-slate-900 bg-[#ff9e7d] shadow-[2px_2px_0px_0px_#000]">
                  <SearchIcon className="h-5 w-5 text-slate-900 stroke-[3]" />
                </div>
                <div className="space-y-1 mt-4">
                  <h3 className="text-base font-black uppercase font-mono text-slate-900">No products discovered</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Zero modules matched current query criteria.</p>
                </div>
                <button
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="mt-5 inline-flex items-center justify-center px-4 py-2 bg-[#86efac] border-2 border-slate-900 text-slate-900 text-xs font-black uppercase font-mono tracking-wider shadow-[2px_2px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
                >
                  Reset Filter System
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
    </div>
  )
}