import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTA() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center md:px-16 md:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#0F5ED720,_transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Ready to Explore Our Products?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/60">
              Discover how Web n Code Technologies can transform your organization&apos;s operations with modern SaaS solutions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to="/products" size="lg">
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
