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
import AdminLayout from './pages/admin/AdminLayout'
import LeadsTab from './pages/admin/LeadsTab'
import CareersTab from './pages/admin/CareersTab'
import DevelopersTab from './pages/admin/DevelopersTab'
import ProjectsTab from './pages/admin/ProjectsTab'
import ProjectForm from './pages/admin/ProjectForm'

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
            <Route path="developers" element={<DevelopersTab />} />
            <Route path="projects" element={<ProjectsTab />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
