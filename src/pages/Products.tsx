import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon } from '../components/ui/Icons'
import ProductCard from '../components/ui/ProductCard'
import { products, productCategories } from '../data/products'

export default function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const panelRef = useRef(null)

  // Handle outside click to close the dropdown panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsFilterPanelOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 relative pt-24 pb-12 overflow-hidden">
      
      {/* Background Matrix Grid Pattern Decorator */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* ------------------------------------------------ */}
      {/* SECTION 1: TOP ROW & MAIN PRODUCTS (Fade + Slide Up) */}
      {/* ------------------------------------------------ */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container mx-auto px-4 max-w-7xl relative z-20"
      >
        
        {/* Header & Filter Controls Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b-[3px] border-slate-900 pb-6 relative z-50 gap-4">
          
          {/* Neo-brutalist Box for Heading */}
          <div className="inline-block bg-white border-3 border-slate-900 px-6 py-3 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] self-start sm:self-auto">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none m-0">
              Our Products
            </h1>
          </div>

          {/* Filter Container wrapped in ref for outside-click tracking */}
          <div className="relative w-full sm:w-auto" ref={panelRef}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-3 border-slate-900 text-sm font-black uppercase font-mono tracking-wider shadow-[4px_4px_0px_0px_#000] transition-colors ${
                isFilterPanelOpen ? 'bg-[#ff9e7d] translate-y-[2px] shadow-[2px_2px_0px_0px_#000]' : 'bg-[#86efac]'
              }`}
            >
              <span className="text-lg leading-none">⚙</span> FILTER
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
              {isFilterPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-4 w-[calc(100vw-2rem)] sm:w-80 bg-white border-3 border-slate-900 rounded-md shadow-[6px_6px_0px_0px_#000] overflow-hidden z-50 origin-top-right text-left"
                >
                  <div className="p-4 bg-[#ebebeb] border-b-3 border-slate-900 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase font-mono text-slate-900">Search & Filter</h3>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFilterPanelOpen(false)}
                      className="text-slate-900 hover:text-[#ff9e7d] font-black text-2xl leading-none transition-colors"
                    >
                      &times;
                    </motion.button>
                  </div>

                  <div className="p-4 space-y-5">
                    {/* Search Input Box */}
                    <div className="relative group">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-4 w-4 text-slate-900 stroke-[2.5]"/>
                      </div>
                      <input
                        type="text"
                        placeholder="SEARCH..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded border-2 border-slate-900 bg-white py-2.5 pr-8 pl-10 text-xs font-mono font-black uppercase tracking-wider text-slate-900 outline-none shadow-[2px_2px_0px_0px_#000] focus:bg-[#fafafa] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                      />
                      {search && (
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSearch('')}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-900 hover:text-slate-600 font-black text-lg cursor-pointer"
                        >
                          &times;
                        </motion.button>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider font-mono text-slate-500">Categories</span>
                      <div className="flex flex-wrap gap-2">
                        {productCategories.map((cat) => (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`rounded px-3 py-1.5 text-[10px] font-black uppercase tracking-wider font-mono transition-all border-2 border-slate-900 ${
                              category === cat
                                ? 'bg-[#7dd3fc] text-slate-900 shadow-[2px_2px_0px_0px_#000] translate-y-[-1px]'
                                : 'bg-white text-slate-700 hover:bg-slate-50 shadow-[1px_1px_0px_0px_#000]'
                            }`}
                          >
                            {cat}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Products Grid Area */}
        <div className="relative min-h-[350px] mb-16 mt-6">
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
                    // Stagger effect: upward movement (20px) with 0.08s delay
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
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
                className="mx-auto max-w-md py-16 text-center flex flex-col items-center justify-center border-3 border-dashed border-slate-900 p-8 rounded-md bg-white"
              >
                <div className="flex h-14 w-14 items-center justify-center border-3 border-slate-900 bg-[#ff9e7d] shadow-[3px_3px_0px_0px_#000]">
                  <SearchIcon className="h-6 w-6 text-slate-900 stroke-[3]"/>
                </div>
                <div className="space-y-1 mt-5">
                  <h3 className="text-lg font-black uppercase font-mono text-slate-900">No products discovered</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 pt-1">Zero modules matched current query criteria.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSearch(''); setCategory('All'); }}
                  className="mt-6 inline-flex items-center justify-center px-5 py-2.5 bg-[#86efac] border-3 border-slate-900 text-slate-900 text-sm font-black uppercase font-mono tracking-wider shadow-[3px_3px_0px_0px_#000] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  Reset Filter System
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ------------------------------------------------ */}
      {/* SECTION 2: WHY CHOOSE WEB N CODE? (Fade + Slide From Left) */}
      {/* ------------------------------------------------ */}
      <motion.section 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-t-[3px] border-slate-900 bg-white py-12 lg:py-16 z-10"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
              Why Choose <br className="sm:hidden" />
              <span className="inline-block mt-2 sm:mt-0 sm:ml-2 bg-[#c084fc] border-2 border-slate-900 px-3 py-1 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                Web N Code?
              </span>
            </h2>
          </div>

          {/* Compact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Modern SaaS Products', icon: '🚀', color: 'bg-[#86efac]' },
              { title: 'Secure Systems', icon: '🔒', color: 'bg-[#fde047]' },
              { title: 'Scalable Solutions', icon: '📈', color: 'bg-[#7dd3fc]' },
              { title: 'Dedicated Support', icon: '🤝', color: 'bg-[#ff9e7d]' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                // Alternating left/right animation with slight scale
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                className={`p-4 border-2 border-slate-900 ${feature.color} shadow-[4px_4px_0px_0px_#000] flex items-center gap-4`}
              >
                <div className="h-10 w-10 shrink-0 bg-white border-2 border-slate-900 flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_#000] rounded-sm">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-black uppercase font-mono tracking-wider text-slate-900 leading-tight">
                  {feature.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------ */}
      {/* SECTION 3: READY TO GROW YOUR ORGANIZATION? (Fade + Slide From Right) */}
      {/* ------------------------------------------------ */}
      <motion.section 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative border-t-[3px] border-slate-900 bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] py-12 lg:py-16 z-10 overflow-hidden"
      >
        
        {/* Subtle Matrix Dotted Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-0" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
             
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <motion.h2 
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none mb-4"
          >
            Ready to grow your organization?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-700 mb-8 max-w-xl mx-auto leading-relaxed"
          >
            We build practical software solutions for schools, sports academies, and organizations.
          </motion.p>
          
          <div className="flex justify-center">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-3.5 bg-slate-900 border-3 border-slate-900 text-white text-sm font-black uppercase font-mono tracking-widest shadow-[4px_4px_0px_0px_#ff9e7d] transition-shadow duration-300 hover:shadow-[6px_6px_0px_0px_#ff9e7d]"
              >
                Contact Us
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ------------------------------------------------ */}
      {/* FOOTER (Fade Up) */}
      {/* ------------------------------------------------ */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative border-t-[3px] border-slate-900 bg-[#BAE6FD] py-4 z-10 text-center"
      >
        <div className="container mx-auto px-4">
          <p className="text-[10px] sm:text-xs font-black uppercase font-mono tracking-widest text-slate-900">
            © {new Date().getFullYear()} Web N Code Suite.
          </p>
        </div>
      </motion.footer>
      
    </div>
  )
}