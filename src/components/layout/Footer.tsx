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
    <footer className="border-t border-border bg-navy text-white">
      <div className="container-wide section-padding !py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <LogoIcon />
              <div>
                <div className="text-sm font-bold leading-tight">{company.name}</div>
                <div className="text-xs text-white/50">{company.tagline}</div>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {company.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Products
            </h4>
            <ul className="space-y-2.5">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
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
            <div className="mt-5 flex gap-3">
              {Object.entries(company.social).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold uppercase text-white/70 transition-colors hover:bg-primary hover:text-white"
                  aria-label={platform}
                >
                  {platform[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Building software that powers growth.
          </p>
        </div>
      </div>
    </footer>
  )
}
