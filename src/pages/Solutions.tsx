import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import { CheckIcon } from '../components/ui/Icons'
import { solutions } from '../data/solutions'

export default function Solutions() {
  return (
    <>
      {/* Structural Hero Header Section */}
      <section className="relative overflow-hidden border-b-2 border-slate-900 bg-[#ebebeb] py-16 md:py-24">
        {/* Background Grid Pattern Accent Asset */}
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl space-y-4"
          >
            <span className="rounded border-2 border-slate-900 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[2px_2px_0px_0px_#000]">
              DEPLOYMENT SUITE
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 leading-none">
              SOLUTIONS FOR <br />
              <span className="inline-block mt-2 bg-[#ff9e7d] border-2 border-slate-900 px-4 py-0.5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                EVERY SECTOR
              </span>
            </h1>
            <p className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-700 max-w-xl pt-2 leading-relaxed">
              See how our SaaS products address real operational challenges across education and enterprise sectors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Control Panel & Solution Cards Grid */}
      <section className="py-16 bg-white border-b-2 border-slate-900">
        <div className="container-wide px-5 md:px-8 space-y-16">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center border-b-2 border-slate-900/10 pb-16 last:border-0 last:pb-0"
            >
              {/* Text Meta Content Column */}
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="rounded border border-slate-900 bg-[#7dd3fc] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider font-mono text-slate-900 shadow-[1px_1px_0px_0px_#000]">
                  {solution.industry}
                </span>
                <h2 className="mt-4 text-2xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {solution.headline}
                </h2>

                {/* Challenges Section */}
                <div className="mt-6 border-2 border-slate-900 p-4 rounded bg-[#fafafa]">
                  <h3 className="text-[10px] font-black uppercase tracking-wider font-mono text-slate-500 border-b border-slate-900/10 pb-1 mb-3">
                    CHALLENGES
                  </h3>
                  <ul className="space-y-2.5 text-xs font-bold uppercase font-mono tracking-wide text-slate-700">
                    {solution.problems.map((problem) => (
                      <li key={problem} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 border border-slate-900 bg-[#ff9e7d]" />
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Micro Product Badges Grid */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {solution.products.map((p) => (
                    <span
                      key={p}
                      className="rounded border border-slate-900 bg-white px-2.5 py-1 text-[10px] font-black uppercase font-mono text-slate-800 shadow-[1.5px_1.5px_0px_0px_#000]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Graphical Box Vector Container Column */}
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-white border-2 border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <div className="mb-5 h-3.5 w-24 border border-slate-900 bg-slate-900" />
                  <div className="space-y-3">
                    {solution.solutions.map((sol, j) => (
                      <div key={sol} className="flex items-center gap-4 border-2 border-slate-900 bg-[#fafafa] p-4 shadow-[2px_2px_0px_0px_#000]">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-900 bg-[#c084fc] font-mono text-xs font-black text-slate-900 shadow-[1px_1px_0px_0px_#000]">
                          0{j + 1}
                        </div>
                        <p className="text-xs font-black uppercase font-mono tracking-wide text-slate-900 leading-tight">
                          {sol}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global Bottom CTA Panel */}
      <section className="relative overflow-hidden bg-[#7dd3fc] border-b-2 border-slate-900 py-20 text-center text-slate-900">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        <div className="container-wide relative px-5 z-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900">
            Find the Right Solution
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm md:text-base font-bold uppercase tracking-wide text-slate-800">
            Not sure which product fits your needs? Our team can help you identify the best solution.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            <Button to="/products" variant="outline" className="w-full sm:w-auto bg-white">
              Explore Products
            </Button>
            <Button to="/contact" variant="primary" className="w-full sm:w-auto">
              Talk to Us
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}