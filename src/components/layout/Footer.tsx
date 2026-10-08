import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { company } from '../../data/company'
import { products } from '../../data/products'
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa'

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/careers', label: 'Careers' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
]

const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/cancellation-refund', label: 'Cancellation & Refund' },
  { to: '/shipping-delivery', label: 'Digital Delivery' },
]

export default function Footer() {
  return (
    <footer className="border-t-4 border-slate-900 bg-[#ebebeb] text-slate-900">
      <div className="container-wide px-5 py-16 md:px-8 lg:px-12">
        {/* Clean 4-Column Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Bio */}
          <div className="space-y-4">
            <Logo className="text-slate-900" />
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700 leading-relaxed">
              {company.footerDescription}
            </p>
          </div>

          {/* Quick Links & Legal Policies */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2 mb-5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs sm:text-sm font-black uppercase font-mono text-slate-700 hover:text-slate-900 hover:underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-3 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Compliance & Legal
            </h4>
            <ul className="space-y-1.5">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs font-bold font-mono text-slate-600 hover:text-slate-950 hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>→</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products List */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Products
            </h4>
            <ul className="space-y-2.5">
              {products.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-xs sm:text-sm font-black uppercase font-mono text-slate-700 hover:text-slate-900 hover:underline inline-block"
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Connect
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-700">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="text-xs sm:text-sm font-semibold normal-case text-slate-800 hover:text-slate-900 hover:underline transition-all break-all"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="hover:text-slate-900 hover:underline transition-all"
                >
                  {company.phone}
                </a>
              </li>
              <li className="leading-relaxed font-mono text-xs tracking-tight normal-case text-slate-600">
                {company.address}
              </li>
            </ul>

            {/* Neo-brutalist Social Blocks */}
            <div className="mt-5 flex gap-2.5">
              {company.social &&
                Object.entries(company.social).map(([platform, url]) => {
                  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                    linkedin: FaLinkedin,
                    instagram: FaInstagram,
                    youtube: FaYoutube,
                    x: FaTwitter,
                  }
                  const Icon = iconMap[platform.toLowerCase()]
                  return (
                    <a
                      key={platform}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-[#ff9e7d] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all"
                      aria-label={platform}
                    >
                      {Icon ? <Icon className="h-4 w-4" /> : (platform[0] || '').toUpperCase()}
                    </a>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Direct Page Links (No Popups) */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t-2 border-slate-900 pt-7 sm:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-black uppercase font-mono text-slate-600">
            <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/privacy-policy" className="hover:text-slate-950 underline">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-slate-950 underline">
                Terms
              </Link>
              <span>•</span>
              <Link to="/cancellation-refund" className="hover:text-slate-950 underline">
                Refund
              </Link>
              <span>•</span>
              <Link to="/shipping-delivery" className="hover:text-slate-950 underline">
                Delivery
              </Link>
            </div>
          </div>
          <p className="text-xs font-black uppercase font-mono border-2 border-slate-900 bg-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-slate-900">
            BUILDING SOFTWARE THAT POWERS GROWTH.
          </p>
        </div>
      </div>
    </footer>
  )
}