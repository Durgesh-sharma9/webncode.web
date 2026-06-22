// Is line mein react-router-dom se useLocation ko import karein 👇
import { Outlet, useLocation } from 'react-router-dom' 
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import PageTransition from '../ui/PageTransition'

export default function Layout() {
  const location = useLocation() // Yeh useLocation ab smoothly chalega!

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] text-slate-900 selection:bg-[#ff9e7d]">
      <Navbar />
      <main className="flex-1 pt-[4rem]">
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