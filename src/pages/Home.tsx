import Hero from "../components/home/Hero";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Industries from "../components/home/Industries";
import WhyChoose from "../components/home/WhyChoose";
import DeliveryHighlights from "../components/home/DeliveryHighlights";
import TechStack from "../components/home/TechStack";
import Process from "../components/home/Process";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";

/**
 * Core Home Landing Page Template
 * All child components listed below should follow our structured Neo-brutalist tokens:
 * - border-2 border-slate-900 
 * - shadow-[4px_4px_0px_0px_#000]
 * - Solid high-contrast block fills (#ff9e7d, #7dd3fc, #86efac, #c084fc)
 */
export default function Home() {
  return (
    // Outer wrap to ensure standard background matching the permanent layout config
    <div className="bg-[#fafafa] min-h-screen">
      <Hero />
      <FeaturedProducts />
      {/* <LatestUpdates /> */}
      {/* <Industries /> */}
      <WhyChoose />
      <DeliveryHighlights />
      {/* <TechStack /> */}
      {/* <Process /> */}
      <Testimonials />
      <CTA />
    </div>
  );
}