import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PortalThemeProvider } from './contexts/PortalThemeContext'
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
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import RefundPolicy from './pages/RefundPolicy'
import ShippingPolicy from './pages/ShippingPolicy'

// Admin Portal Pages
import AdminLayout from './pages/admin/AdminLayout'
import LeadsTab from './pages/admin/LeadsTab'
import CareersTab from './pages/admin/CareersTab'
import AffiliatesTab from './pages/admin/AffiliatesTab'
import DevelopersTab from './pages/admin/DevelopersTab'
import ProjectsTab from './pages/admin/ProjectsTab'
import ProjectForm from './pages/admin/ProjectForm'
import UpdatesTab from './pages/admin/UpdatesTab'
import AffiliateAnalyticsTab from './pages/admin/AffiliateAnalyticsTab'

// Affiliate / Partner Portal Pages
import AffiliateLayout from './pages/affiliate/AffiliateLayout'
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard'
import AffiliateLeads from './pages/affiliate/AffiliateLeads'
import AffiliateEarnings from './pages/affiliate/AffiliateEarnings'
import AffiliateSettings from './pages/affiliate/AffiliateSettings'
import AffiliatePortalAnalytics from './pages/affiliate/AffiliatePortalAnalytics'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortalThemeProvider>
          <ScrollToTop />
          <Toast />
          <ErrorBoundary>
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
            
            {/* Legal & Compliance Pages */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="privacy.html" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="terms-and-conditions" element={<Navigate to="/terms" replace />} />
            <Route path="terms.html" element={<TermsOfService />} />
            <Route path="cancellation-refund" element={<RefundPolicy />} />
            <Route path="refund-policy" element={<Navigate to="/cancellation-refund" replace />} />
            <Route path="refund.html" element={<RefundPolicy />} />
            <Route path="shipping-delivery" element={<ShippingPolicy />} />
            <Route path="shipping-policy" element={<Navigate to="/shipping-delivery" replace />} />
            <Route path="shipping.html" element={<ShippingPolicy />} />
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
            <Route path="affiliates/analytics" element={<AffiliateAnalyticsTab />} />
            <Route path="analytics" element={<AffiliateAnalyticsTab />} />
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
            <Route path="analytics" element={<AffiliatePortalAnalytics />} />
            <Route path="links" element={<Navigate to="/affiliate/dashboard" replace />} />
            <Route path="earnings" element={<AffiliateEarnings />} />
            <Route path="settings" element={<AffiliateSettings />} />
          </Route>
        </Routes>
        </ErrorBoundary>
        </PortalThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
