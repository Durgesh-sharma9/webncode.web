import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import LatestUpdates from '../components/home/LatestUpdates'
import Industries from '../components/home/Industries'
import WhyChoose from '../components/home/WhyChoose'
import TechStack from '../components/home/TechStack'
import Process from '../components/home/Process'
import Statistics from '../components/home/Statistics'
import Testimonials from '../components/home/Testimonials'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <LatestUpdates />
      <Industries />
      <WhyChoose />
      <TechStack />
      <Process />
      <Statistics />
      <Testimonials />
      <CTA />
    </>
  )
}
