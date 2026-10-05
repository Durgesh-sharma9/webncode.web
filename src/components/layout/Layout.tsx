import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom' 
import { AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from './Footer'
import PageTransition from '../ui/PageTransition'

export default function Layout() {
  const location = useLocation()

  // Track affiliate referral param on any landing page
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search)
      const ref = params.get('ref') || params.get('referral')
      if (ref) {
        const cleanRef = ref.trim().toUpperCase()
        const existing = localStorage.getItem('wnc_referral_code')
        if (existing !== cleanRef) {
          localStorage.setItem('wnc_referral_code', cleanRef)
          const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')
          axios.post(`${API_BASE}/api/affiliates/track-click`, { referralCode: cleanRef }).catch(() => {})
        }
      }
    } catch (e) {}
  }, [location.search])

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-slate-900 selection:bg-[#ff9e7d]">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}