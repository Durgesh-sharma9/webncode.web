import SectionHeading from '../ui/SectionHeading'
import ProductCard from '../ui/ProductCard'
import Button from '../ui/Button'
import { products } from '../../data/products'

export default function FeaturedProducts() {
  const featuredProducts = products.slice(0, 4)

  return (
    <section className="section-padding section-surface">
      <div className="container-wide">
        <SectionHeading
          label="Our Products"
          title="Software Built for Real Operations"
          description="Purpose-built SaaS products that solve everyday challenges for schools, colleges, and organizations."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/products" variant="outline" size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
