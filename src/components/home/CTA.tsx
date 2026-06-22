import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="section-padding bg-white border-b-2 border-slate-900">
      <div className="container-wide px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          // Switch to high-contrast master orange-peach tone with solid borders and offset shadow
          className="relative overflow-hidden rounded-md border-2 border-slate-900 bg-[#ff9e7d] px-8 py-16 text-center md:px-16 md:py-20 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
        >
          {/* Flat Micro Dotted Canvas Pattern on background instead of gradients */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Heavy bold title block */}
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              Ready to Transform <br /> Your Operations?
            </h2>
            
            {/* Structural Monospaced Subtext */}
            <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-800 leading-relaxed">
              Discover how Web n Code Technologies can streamline your organization with modern, enterprise-grade SaaS solutions.
            </p>
            
            {/* Interactive Button Sets */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
              {/* Secondary button variant mapping pastel blue token */}
              <Button to="/products" variant="secondary" size="lg" className="w-full sm:w-auto">
                View Products
              </Button>
              {/* White background block with black borders mapping outline token */}
              <Button to="/contact" variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}