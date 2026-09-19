import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { showSuccessToast, showErrorToast } from '../../components/ui/Toast'
import { API_BASE } from './types'

export default function AdminLayout() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Global floating <w> logos toggle state
  const [floatingLogosEnabled, setFloatingLogosEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('wnc_login_floating_logos')
    return saved === null ? true : saved === 'true'
  })
  const [isUpdatingFloatingLogos, setIsUpdatingFloatingLogos] = useState(false)

  // Auth guard: redirect to /login if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  // Fetch current floating logo global setting from backend
  useEffect(() => {
    const fetchGlobalSetting = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/settings/floating-logos`)
        if (res.data?.success) {
          const val = Boolean(res.data.enabled)
          setFloatingLogosEnabled(val)
          localStorage.setItem('wnc_login_floating_logos', String(val))
        }
      } catch (err) {
        console.warn('Failed to fetch global floating logo setting from server:', err)
      }
    }
    fetchGlobalSetting()
  }, [])

  const handleToggleFloatingLogos = async () => {
    const next = !floatingLogosEnabled
    setFloatingLogosEnabled(next)
    localStorage.setItem('wnc_login_floating_logos', String(next))
    setIsUpdatingFloatingLogos(true)

    try {
      await axios.put(
        `${API_BASE}/api/settings/floating-logos`,
        { enabled: next },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      )
      showSuccessToast(`Global floating <w> logos turned ${next ? 'ON' : 'OFF'} for all visitors!`)
    } catch (err) {
      console.error('Failed to sync global setting with server:', err)
      setFloatingLogosEnabled(!next)
      localStorage.setItem('wnc_login_floating_logos', String(!next))
      showErrorToast('Failed to update global setting on server. Please try again.')
    } finally {
      setIsUpdatingFloatingLogos(false)
    }
  }

  const handleLogout = () => {
    logout()
    showSuccessToast('Logged out successfully')
    navigate('/login', { replace: true })
  }

  // Navigation Items
  const navItems = [
    { to: '/admin/leads', label: 'Client Leads', icon: '📬' },
    { to: '/admin/careers', label: 'Careers & Resumes', icon: '💼' },
    { to: '/admin/developers', label: 'Developers Team', icon: '👨‍💻' },
    { to: '/admin/projects', label: 'Projects Directory', icon: '📁' },
    { to: '/admin/projects/new', label: '+ Add Project', icon: '✨' },
  ]

  // Determine active section title for topbar breadcrumb
  const currentNav = navItems.find((n) => location.pathname === n.to || (n.to === '/admin/leads' && location.pathname === '/admin'))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono">
        <div className="p-6 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black uppercase text-slate-800">Verifying SuperAdmin Credentials...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col antialiased selection:bg-slate-900 selection:text-white font-mono">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <div className="flex flex-1 relative">
        {/* ================= LEFT SIDEBAR (STICKY FULL HEIGHT) ================= */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r-2 border-slate-900 z-50 flex flex-col justify-between transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Top Brand Block */}
          <div>
            <div className="p-4 border-b-2 border-slate-900 flex items-center justify-between bg-[#fde047]">
              <Link to="/admin" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_#000]">
                  &lt;w&gt;
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-950 leading-none">
                    Web n Code
                  </div>
                  <div className="text-[10px] font-bold text-slate-800 uppercase tracking-widest leading-none mt-1">
                    SuperAdmin
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-black/10 rounded-lg border border-slate-900 text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-1.5">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Main Menu
              </div>

              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.to ||
                  (item.to === '/admin/leads' && location.pathname === '/admin')

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 text-xs font-black uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_#fde047]'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border-transparent hover:border-slate-900'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Bottom Controls: Global Setting & User */}
          <div className="p-3 border-t-2 border-slate-900 bg-slate-50 space-y-3">
            {/* Global Floating <w> Logos Toggle */}
            <div className="p-2.5 bg-white border-2 border-slate-900 rounded-lg shadow-[1.5px_1.5px_0px_0px_#000]">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase text-slate-900 truncate">
                    Global &lt;w&gt; Logos
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold">
                    {floatingLogosEnabled ? 'Visible to visitors' : 'Hidden everywhere'}
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={floatingLogosEnabled}
                    onChange={handleToggleFloatingLogos}
                    disabled={isUpdatingFloatingLogos}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none border-2 border-slate-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-slate-900 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-400"></div>
                </label>
              </div>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] font-black text-slate-900 uppercase truncate">
                  {user?.name || 'Administrator'}
                </div>
                <div className="text-[9px] text-slate-500 truncate">{user?.email || 'admin@webncode.in'}</div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-slate-900 rounded-lg text-xs font-black shadow-[1px_1px_0px_0px_#000] cursor-pointer"
                title="Logout"
              >
                🚪
              </button>
            </div>

            <Link
              to="/"
              target="_blank"
              className="block text-center py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-900 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]"
            >
              Public Website ↗
            </Link>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP NAVBAR */}
          <header className="sticky top-0 bg-white border-b-2 border-slate-900 z-30 px-4 py-3 flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Drawer Trigger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 bg-[#fde047] border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_#000] text-slate-900 font-bold"
              >
                ☰
              </button>

              <div>
                <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 leading-none">
                  {currentNav?.label || 'SuperAdmin Hub'}
                </h1>
                <span className="text-[10px] font-bold text-slate-500">
                  Web n Code Technologies • Mission Control
                </span>
              </div>
            </div>

            {/* Quick Actions in Navbar */}
            <div className="flex items-center gap-2">
              <Link
                to="/admin/projects/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fde047] hover:bg-[#facc15] border-2 border-slate-900 rounded-lg text-xs font-black uppercase tracking-wider text-slate-950 shadow-[2px_2px_0px_0px_#000]"
              >
                <span>✨</span>
                <span>New Project</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg text-xs font-black uppercase tracking-wider text-slate-800 shadow-[2px_2px_0px_0px_#000]"
              >
                Logout
              </button>
            </div>
          </header>

          {/* DYNAMIC CHILD VIEW VIA REACT ROUTER OUTLET */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
