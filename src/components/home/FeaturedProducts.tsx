import SectionHeading from '../ui/SectionHeading'
import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { products } from '../../data/products'

export default function FeaturedProducts() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <SectionHeading
          label="Our Products"
          title="Software Built for Real Operations"
          description="Purpose-built SaaS products that solve everyday challenges for schools, colleges, and organizations."
        />
        <div className="grid gap-8 md:grid-cols-2">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/products" variant="outline">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
