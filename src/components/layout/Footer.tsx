import { Link } from 'react-router-dom'
import { LogoIcon } from '../ui/Icons'
import { company } from '../../data/company'
import { products } from '../../data/products'

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/careers', label: 'Careers' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-gradient-to-br from-navy via-navy-light to-primary text-white">
      <div className="container-wide section-padding !py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <LogoIcon />
              <div>
                <div className="text-sm font-bold leading-tight tracking-tight">{company.name}</div>
                <div className="text-xs text-white/60 font-medium tracking-wide">{company.tagline}</div>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {company.description}
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white/50">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-all hover:text-white hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white/50">
              Products
            </h4>
            <ul className="space-y-3">
              {products.slice(0, 6).map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-sm text-white/70 transition-all hover:text-white hover:translate-x-1 inline-block"
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-wider text-white/50">
              Connect
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">
                  {company.email}
                </a>
              </li>
              <li>
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                  {company.phone}
                </a>
              </li>
              <li className="leading-relaxed">{company.address}</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {Object.entries(company.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xs font-bold uppercase text-white/70 transition-all hover:bg-primary hover:text-white hover:scale-110"
                  aria-label={platform}
                >
                  {platform[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/50 font-medium">
            Building software that powers growth.
          </p>
        </div>
      </div>
    </footer>
  )
}
