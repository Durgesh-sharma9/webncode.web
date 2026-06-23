import { motion } from 'framer-motion'
import Button from '../ui/Button'
import ProductShowcase from '../ui/ProductShowcase'
import { company } from '../../data/company'

const proofPoints = [
  'Education ERP and academic workflows',
  'Dashboards for finance, attendance, and results',
  'Cloud-ready products with secure access',
  'Implementation support from planning to launch',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] border-b-2 border-slate-900 pt-[5rem] pb-10 lg:pb-12">
      {/* Dynamic Background Micro Dotted Mesh Matrix */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative px-5 md:px-8 lg:px-12 z-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">

          {/* Left Text Metadata Column */}
          <div>
            {/* Top Pill Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <span className="mb-4 inline-flex items-center gap-2 rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                <span className="h-2 w-2 border border-slate-900 bg-[#86efac]" />
                {company.tagline}
              </span>
            </motion.div>

            {/* Industrial Bold Title Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 leading-none"
            >
              SOFTWARE PRODUCTS THAT <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-0.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                SIMPLIFY OPERATIONS
              </span>
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              className="mt-6 max-w-xl text-sm font-bold uppercase tracking-wide text-slate-700 leading-relaxed"
            >
              {company.description}
            </motion.p>

            {/* Checklist Proof Grid Blocks */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 grid gap-3 sm:grid-cols-2"
            >
              {proofPoints.map((item) => (
                <div key={item} className="flex items-start gap-2.5 border-2 border-slate-900 bg-white p-3 text-xs font-black uppercase font-mono tracking-wide text-slate-900 shadow-[2px_2px_0px_0px_#000]">
                  <span className="mt-0.5 h-3.5 w-3.5 shrink-0 border border-slate-900 bg-[#86efac] flex items-center justify-center font-black text-[10px]">✓</span>
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Global Refactored Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button to="/products" size="md" variant="primary">
                Explore Products
              </Button>
              <Button to="/contact" variant="outline" size="md">
                Contact Us
              </Button>
            </motion.div>

            {/* Dynamic Hard-Shadow Stat Counters Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-8 grid grid-cols-3 gap-3 border-t-2 border-slate-900 pt-5 sm:max-w-lg"
            >
              {[
                { value: '12+', label: 'Products built', color: 'bg-[#93c5fd]' },
                { value: '150+', label: 'Orgs served', color: 'bg-[#c084fc]' },
                { value: '24/7', label: 'Support ready', color: 'bg-[#86efac]' },
              ].map((item) => (
                <div key={item.label} className={`border-2 border-slate-900 ${item.color} p-2.5 shadow-[3px_3px_0px_0px_#000]`}>
                  <div className="text-xl font-black font-mono tracking-tight text-slate-900">{item.value}</div>
                  <div className="mt-1 text-[9px] font-black uppercase tracking-wider font-mono text-slate-700 leading-none">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Dashboard Interactive Canvas Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="w-full lg:mt-[60px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            onClick={() =>
              document
                .getElementById('products-section')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ProductShowcase />
          </motion.div>

        </div>
      </div>
    </section>
  )
}