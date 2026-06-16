import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon, CloseIcon } from '../ui/Icons'
import Button from '../ui/Button'
import Logo from '../ui/Logo'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/about', label: 'About' },
  { to: '/careers', label: 'Careers' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // Current URL path tracking hook to sync custom styles
  const location = useLocation()
  const isAboutPage = location.pathname === '/about'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Custom link layout structure based on route state
  const linkClass = ({ isActive }: { isActive: boolean }) => {
    if (isAboutPage) {
      return `relative px-4 py-2 text-xs font-black uppercase tracking-wider font-mono transition-all duration-200 ${
        isActive
          ? 'text-slate-900 bg-white border-2 border-slate-900 rounded-md shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
          : 'text-slate-700 hover:text-slate-900 hover:underline'
      }`
    }
    return `relative px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`
  }

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isAboutPage
          ? 'bg-[#ebebeb] border-b-2 border-slate-900' // Matches About page background perfectly
          : scrolled
            ? 'glass-strong shadow-lg'
            : 'glass'
      }`}
    >
      <nav className="container-wide flex h-[4rem] items-center justify-between px-5 md:px-8 lg:px-12">
        <Logo size="md" />

        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Dynamic explore products button template matching theme */}
        <div className="hidden lg:flex items-center gap-3">
          {isAboutPage ? (
            <Button 
              to="/products" 
              size="sm" 
              className="!bg-[#7dd3fc] !text-slate-900 border-2 border-slate-900 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              Explore Products
            </Button>
          ) : (
            <Button to="/products" size="sm" className="shadow-lg shadow-primary/25">
              Explore Products
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className={`rounded-xl p-2 transition-colors ${
              isAboutPage 
                ? 'text-slate-900 border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                : 'text-text-primary hover:bg-surface'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Slider Variant Control Layout */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden border-t-2 border-slate-900 lg:hidden ${
              isAboutPage ? 'bg-[#ebebeb]' : 'glass'
            }`}
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
                    isAboutPage
                      ? `px-4 py-3 text-sm font-black uppercase tracking-widest font-mono rounded-lg transition-all border border-transparent ${
                          isActive
                            ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                            : 'text-slate-700 hover:bg-white/50'
                        }`
                      : `px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                        }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className={`mt-4 pt-4 border-t ${isAboutPage ? 'border-slate-300' : 'border-border'}`}>
                {isAboutPage ? (
                  <Button 
                    to="/products" 
                    className="w-full !bg-[#7dd3fc] !text-slate-900 border-2 border-slate-900 font-mono font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" 
                    onClick={() => setMobileOpen(false)}
                  >
                    Explore Products
                  </Button>
                ) : (
                  <Button to="/products" className="w-full" onClick={() => setMobileOpen(false)}>
                    Explore Products
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}