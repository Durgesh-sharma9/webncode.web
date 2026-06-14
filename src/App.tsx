import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Solutions from './pages/Solutions'
import About from './pages/About'
import Careers from './pages/Careers'
import Updates from './pages/Updates'
import Contact from './pages/Contact'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
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
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}
