import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="section-padding section-surface">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-light to-primary px-8 py-16 text-center md:px-16 md:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,94,215,0.3),_transparent_50%)]" />
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="display-md text-white">
              Ready to Transform Your Operations?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Discover how Web n Code Technologies can streamline your organization with modern, enterprise-grade SaaS solutions.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button to="/products" size="lg" className="bg-white text-navy hover:bg-surface hover:text-primary shadow-xl shadow-white/20">
                View Products
              </Button>
              <Button to="/contact" variant="outline" size="lg" className="!border-white/30 !text-white hover:!bg-white hover:!text-navy">
                Contact Us
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
