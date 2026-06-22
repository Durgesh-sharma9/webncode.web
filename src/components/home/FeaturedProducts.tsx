import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { products } from '../../data/products'

export default function FeaturedProducts() {
  // Slicing first 4 items for layout grid symmetry
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="section-padding bg-white border-b-2 border-slate-900 relative">
      {/* Background Matrix Dotted Accent Mesh Pattern */}
      <div className="absolute inset-0 opacity-[0.10] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container-wide relative z-10 px-5 md:px-8 lg:px-12">
        <SectionHeading
          label="Our Products"
          title="Software Built for Real Operations"
          description="Purpose-built SaaS products that solve everyday challenges for schools, colleges, and organizations."
        />

        {/* Dynamic Refactored Brutalist Grid Cards Layout */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Dynamic Centered All Products Trigger Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <Button to="/products" variant="outline" size="lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}