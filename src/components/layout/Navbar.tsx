import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, CloseIcon } from '../ui/Icons'
import Button from '../ui/Button'
import Logo from '../ui/Logo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/careers', label: 'Careers' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Permanent Neo-brutalist style logic for active/inactive links
  const linkClass = ({ isActive }: { isActive: boolean }) => {
    return `relative px-4 py-2 text-xs font-black uppercase tracking-wider font-mono transition-all duration-200 ${
      isActive
        ? 'text-slate-900 bg-white border-2 border-slate-900 rounded-md shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
        : 'text-slate-700 hover:text-slate-900 hover:underline'
    }`
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-[#ebebeb] border-b-2 border-slate-900 transition-all duration-300">
      <nav className="container-wide flex h-[4rem] items-center justify-between px-5 md:px-8 lg:px-12">
        <Logo size="md" />

        {/* Desktop Links */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Permanent Neo-Brutalist CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Button 
            to="/products" 
            size="sm" 
            className="!bg-[#7dd3fc] !text-slate-900 border-2 border-slate-900 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
          >
            Explore Products
          </Button>
        </div>

        {/* Mobile Menu Trigger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="text-slate-900 border-2 border-slate-900 bg-white p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Layout */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t-2 border-slate-900 lg:hidden bg-[#ebebeb]"
          >
            <div className="flex flex-col gap-1 px-5 py-6">
              <div className="mb-4">
                <Logo size="sm" showText={false} />
              </div>
              
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-black uppercase tracking-widest font-mono rounded-lg transition-all border border-transparent ${
                      isActive
                        ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                        : 'text-slate-700 hover:bg-white/50'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              
              <div className="mt-4 pt-4 border-t border-slate-300">
                <Button 
                  to="/products" 
                  className="w-full !bg-[#7dd3fc] !text-slate-900 border-2 border-slate-900 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" 
                  onClick={() => setMobileOpen(false)}
                >
                  Explore Products
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}