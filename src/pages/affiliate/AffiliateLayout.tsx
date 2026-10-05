import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { showSuccessToast } from '../../components/ui/Toast'
import logoImg from '../../assets/logoooo.png'

export default function AffiliateLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard: redirect to /login if unauthenticated or not an affiliate
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true })
      } else if (user?.role === 'admin') {
        // If an admin logs in, take them to superadmin portal
        navigate('/admin', { replace: true })
      }
    }
  }, [isLoading, isAuthenticated, user, navigate])

  const handleLogout = () => {
    logout()
    showSuccessToast('Logged out successfully')
    navigate('/login', { replace: true })
  }

  // Navigation Items (Simplified without link marketing kit)
  const navItems = [
    { to: '/affiliate/dashboard', label: 'Overview', icon: '📊' },
    { to: '/affiliate/leads', label: 'My Client Leads', icon: '🎯' },
    { to: '/affiliate/earnings', label: 'Earnings & Payouts', icon: '💰' },
    { to: '/affiliate/settings', label: 'Bank & UPI Settings', icon: '🏦' },
  ]

  // Find active label for breadcrumb
  const currentNav = navItems.find((n) => location.pathname.startsWith(n.to))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-mono">
        <div className="p-6 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black uppercase text-slate-800">Loading Partner Portal...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'affiliate') {
    return null
  }

  const payoutType = user?.affiliate?.payoutType || 'percentage'
  const commissionRate = user?.affiliate?.commissionRate ?? 10
  const fixedAmount = user?.affiliate?.fixedAmount ?? 0

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col antialiased selection:bg-[#ff9e7d] font-mono text-slate-900">
      
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-screen">
        
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r-2 border-slate-900 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-0 md:translate-x-0 max-md:-translate-x-full'
          }`}
        >
          <div>
            {/* Top Brand Banner */}
            <div className="p-5 border-b-2 border-slate-900 flex items-center justify-between bg-[#f8fafc]">
              <Link to="/affiliate/dashboard" className="flex items-center gap-2.5">
                <img src={logoImg} alt="Web n Code" className="h-7 w-auto object-contain" />
                <div>
                  <span className="text-sm font-black tracking-tight uppercase block leading-none">Web n Code</span>
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">Partner Portal</span>
                </div>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 border border-slate-900 rounded font-black text-xs hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Partner Info Badge */}
            <div className="p-4 mx-3 my-4 bg-[#f1f5f9] border-2 border-slate-900 rounded-lg text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-500">Status</span>
                <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-600 text-emerald-800 rounded font-black tracking-wider text-[11px]">
                  Active Partner
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-black uppercase text-slate-500">Reward</span>
                <span className="font-black text-emerald-700">
                  {payoutType === 'fixed' ? `₹${fixedAmount.toLocaleString('en-IN')} Flat` : `${commissionRate}% / Deal`}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="px-3 space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 border-slate-900 text-xs font-black uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-[3px_3px_0px_0px_#ff9e7d] translate-x-[2px]'
                        : 'bg-white text-slate-700 hover:bg-[#ff9e7d]/20 hover:text-slate-900 shadow-[2px_2px_0px_0px_#000]'
                    }`
                  }
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom user profile & Logout */}
          <div className="p-4 border-t-2 border-slate-900 bg-[#f8fafc] space-y-3">
            <div className="text-xs">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Logged In As</span>
              <p className="font-black text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex-1 py-1.5 px-2 bg-white border border-slate-900 rounded font-bold text-[10px] uppercase text-center hover:bg-slate-100"
              >
                View Website ↗
              </Link>
              <button
                onClick={handleLogout}
                className="py-1.5 px-3 bg-rose-50 border border-rose-500 text-rose-700 rounded font-black text-[10px] uppercase hover:bg-rose-100"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar */}
          <header className="h-16 bg-white border-b-2 border-slate-900 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 border-2 border-slate-900 rounded-md bg-white hover:bg-slate-100"
              >
                ☰
              </button>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600">
                <span className="hidden sm:inline">Partner Portal</span>
                <span className="hidden sm:inline">/</span>
                <span className="text-slate-900">{currentNav?.label || 'Dashboard'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 bg-rose-50 border-2 border-slate-900 rounded-md font-black text-xs uppercase tracking-wider text-rose-700 shadow-[2px_2px_0px_0px_#000] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Sub-page Outlet */}
          <main className="flex-1 p-3.5 sm:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
            <Outlet />
          </main>
        </div>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-900 grid grid-cols-4 py-1.5 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] font-mono">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-[2px_2px_0px_0px_#ff9e7d]'
                  : 'text-slate-600 hover:text-slate-900'
              }`
            }
          >
            <span className="text-base leading-none mb-1">{item.icon}</span>
            <span className="truncate max-w-[70px] text-[9px]">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
