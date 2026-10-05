import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/ui/ScrollToTop'
import Toast from './components/ui/Toast'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Solutions from './pages/Solutions'
import About from './pages/About'
import Careers from './pages/Careers'
import Updates from './pages/Updates'
import Contact from './pages/Contact'
import Login from './pages/Login'

// Admin Portal Pages
import AdminLayout from './pages/admin/AdminLayout'
import LeadsTab from './pages/admin/LeadsTab'
import CareersTab from './pages/admin/CareersTab'
import AffiliatesTab from './pages/admin/AffiliatesTab'
import DevelopersTab from './pages/admin/DevelopersTab'
import ProjectsTab from './pages/admin/ProjectsTab'
import ProjectForm from './pages/admin/ProjectForm'
import UpdatesTab from './pages/admin/UpdatesTab'

// Affiliate / Partner Portal Pages
import AffiliateLayout from './pages/affiliate/AffiliateLayout'
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard'
import AffiliateLeads from './pages/affiliate/AffiliateLeads'
import AffiliateEarnings from './pages/affiliate/AffiliateEarnings'
import AffiliateSettings from './pages/affiliate/AffiliateSettings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Toast />
        <Routes>
          {/* Public Website with Navbar and Footer */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="about" element={<About />} />
            <Route path="careers" element={<Careers />} />
            <Route path="updates" element={<Updates />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Dedicated Login Route */}
          <Route path="login" element={<Login />} />
          <Route path="superadmin" element={<Navigate to="/admin" replace />} />

          {/* Modular Admin Portal Layout & Sub-routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="leads" replace />} />
            <Route path="leads" element={<LeadsTab />} />
            <Route path="careers" element={<CareersTab />} />
            <Route path="affiliates" element={<AffiliatesTab />} />
            <Route path="developers" element={<DevelopersTab />} />
            <Route path="projects" element={<ProjectsTab />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="updates" element={<UpdatesTab />} />
          </Route>

          {/* Dedicated Partner & Affiliate Portal Layout & Sub-routes */}
          <Route path="affiliate" element={<AffiliateLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AffiliateDashboard />} />
            <Route path="leads" element={<AffiliateLeads />} />
            <Route path="links" element={<Navigate to="/affiliate/dashboard" replace />} />
            <Route path="earnings" element={<AffiliateEarnings />} />
            <Route path="settings" element={<AffiliateSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
