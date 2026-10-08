import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import { company } from '../../data/company'
import { products } from '../../data/products'
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa'
import LegalModal, { type LegalTabType } from '../ui/LegalModal'

const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/careers', label: 'Careers' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalTab, setLegalTab] = useState<LegalTabType>('privacy')

  const openLegal = (tab: LegalTabType) => {
    setLegalTab(tab)
    setLegalModalOpen(true)
  }

  return (
    <footer className="border-t-4 border-slate-900 bg-[#ebebeb] text-slate-900">
      <div className="container-wide px-5 py-16 md:px-8 lg:px-12">
        {/* Restored Clean 4-Column Grid to avoid any text collision */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Company Bio */}
          <div className="space-y-4">
            <Logo className="text-slate-900" />
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700 leading-relaxed">
              {company.footerDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm font-black uppercase font-mono text-slate-700 hover:text-slate-900 hover:underline inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('privacy')}
                  className="text-sm font-black uppercase font-mono text-slate-700 hover:text-slate-900 hover:underline inline-block cursor-pointer text-left"
                >
                  Legal Policies ⚖️
                </button>
              </li>
            </ul>
          </div>

          {/* Products List */}
          <div>
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Products
            </h4>
            <ul className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.slug}`}
                    className="text-sm font-black uppercase font-mono text-slate-700 hover:text-slate-900 hover:underline inline-block"
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider font-mono text-slate-900 border-b-2 border-slate-900 pb-1 inline-block">
              Connect
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase tracking-wide text-slate-700">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm font-semibold normal-case text-slate-800 hover:text-slate-900 hover:underline transition-all break-all"
                >
                  {company.email}
                </a>
              </li>
              <li>
                <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="hover:text-slate-900 hover:underline transition-all">
                  {company.phone}
                </a>
              </li>
              <li className="leading-relaxed font-mono text-xs tracking-tight normal-case">{company.address}</li>
            </ul>
            
            {/* Neo-brutalist Social Blocks */}
            <div className="mt-6 flex gap-3">
              {company.social && Object.entries(company.social).map(([platform, url]) => {
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
                    className="flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-[#ff9e7d] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all"
                    aria-label={platform}
                  >
                    {Icon ? <Icon className="h-5 w-5" /> : (platform[0] || '').toUpperCase()}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Links trigger the Modal directly without navigating away */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-slate-900 pt-8 sm:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs font-black uppercase font-mono text-slate-600">
            <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openLegal('privacy')}
                className="hover:text-slate-950 underline cursor-pointer"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('terms')}
                className="hover:text-slate-950 underline cursor-pointer"
              >
                Terms
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('refund')}
                className="hover:text-slate-950 underline cursor-pointer"
              >
                Refund
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('shipping')}
                className="hover:text-slate-950 underline cursor-pointer"
              >
                Delivery
              </button>
            </div>
          </div>
          <p className="text-xs font-black uppercase font-mono border-2 border-slate-900 bg-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-slate-900">
            BUILDING SOFTWARE THAT POWERS GROWTH.
          </p>
        </div>
      </div>

      {/* Interactive Legal Policy Popup Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        activeTab={legalTab}
        onClose={() => setLegalModalOpen(false)}
        onTabChange={(tab) => setLegalTab(tab)}
      />
    </footer>
  )
}