import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoIcon, MenuIcon, CloseIcon, SunIcon, MoonIcon } from '../ui/Icons'
import Button from '../ui/Button'
import { company } from '../../data/company'
import { useTheme } from '../../contexts/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-lg'
          : 'glass'
      }`}
    >
      <nav className="container-wide flex h-[4.5rem] items-center justify-between px-5 md:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <LogoIcon />
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-text-primary leading-tight tracking-tight">{company.name}</div>
            <div className="text-xs font-medium text-muted tracking-wide">{company.tagline}</div>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <Button to="/products" size="sm" className="shadow-lg shadow-primary/25">
            Explore Products
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            className="rounded-xl p-2.5 text-text-primary hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border glass lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 text-base font-semibold rounded-xl transition-all ${
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
              <div className="mt-4 pt-4 border-t border-border">
                <Button to="/products" className="w-full" onClick={() => setMobileOpen(false)}>
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
