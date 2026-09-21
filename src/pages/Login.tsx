import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/ui/Logo'
import onlyLogo from '../assets/onlylogoo.png'
import { showSuccessToast, showErrorToast } from '../components/ui/Toast'

interface FloatingLogo {
  id: number
  size: number
  side: 'left' | 'right'
  offset: string
  top: string
  opacity: number
  anim: string
  duration: string
  delay: string
}

const FLOATING_LOGOS: FloatingLogo[] = [
  // Left Side
  { id: 1,  size: 44, side: 'left', offset: '18px',  top: '73%', opacity: 0.40, anim: 'floatSideA', duration: '5.8s', delay: '0s' },
  { id: 2,  size: 72, side: 'left', offset: '140px', top: '11%', opacity: 0.30, anim: 'floatSideB', duration: '7.2s', delay: '0.6s' },
  { id: 3,  size: 36, side: 'left', offset: '280px', top: '47%', opacity: 0.36, anim: 'floatSideC', duration: '5.5s', delay: '1.2s' },
  { id: 4,  size: 58, side: 'left', offset: '60px',  top: '88%', opacity: 0.38, anim: 'floatSideD', duration: '6.4s', delay: '0.4s' },
  { id: 5,  size: 90, side: 'left', offset: '22px',  top: '28%', opacity: 0.28, anim: 'floatSideA', duration: '8.0s', delay: '1.0s' },
  { id: 6,  size: 48, side: 'left', offset: '190px', top: '61%', opacity: 0.34, anim: 'floatSideB', duration: '6.6s', delay: '1.8s' },
  { id: 7,  size: 30, side: 'left', offset: '380px', top: '4%',  opacity: 0.38, anim: 'floatSideC', duration: '5.2s', delay: '0.2s' },
  { id: 8,  size: 62, side: 'left', offset: '95px',  top: '38%', opacity: 0.36, anim: 'floatSideD', duration: '6.0s', delay: '2.0s' },
  { id: 9,  size: 42, side: 'left', offset: '330px', top: '82%', opacity: 0.30, anim: 'floatSideA', duration: '7.4s', delay: '0.8s' },
  { id: 10, size: 80, side: 'left', offset: '50px',  top: '17%', opacity: 0.26, anim: 'floatSideB', duration: '8.2s', delay: '1.5s' },

  // Right Side
  { id: 11, size: 54, side: 'right', offset: '25px',  top: '35%', opacity: 0.38, anim: 'floatSideC', duration: '6.0s', delay: '0.2s' },
  { id: 12, size: 76, side: 'right', offset: '170px', top: '7%',  opacity: 0.28, anim: 'floatSideD', duration: '7.8s', delay: '0.9s' },
  { id: 13, size: 38, side: 'right', offset: '310px', top: '69%', opacity: 0.36, anim: 'floatSideA', duration: '5.6s', delay: '1.6s' },
  { id: 14, size: 66, side: 'right', offset: '15px',  top: '91%', opacity: 0.40, anim: 'floatSideB', duration: '6.5s', delay: '0.5s' },
  { id: 15, size: 84, side: 'right', offset: '220px', top: '52%', opacity: 0.26, anim: 'floatSideC', duration: '8.4s', delay: '1.3s' },
  { id: 16, size: 46, side: 'right', offset: '75px',  top: '22%', opacity: 0.38, anim: 'floatSideD', duration: '6.2s', delay: '2.1s' },
  { id: 17, size: 32, side: 'right', offset: '390px', top: '79%', opacity: 0.34, anim: 'floatSideA', duration: '5.4s', delay: '0.4s' },
  { id: 18, size: 70, side: 'right', offset: '130px', top: '43%', opacity: 0.30, anim: 'floatSideB', duration: '7.0s', delay: '1.7s' },
  { id: 19, size: 50, side: 'right', offset: '260px', top: '15%', opacity: 0.36, anim: 'floatSideC', duration: '6.8s', delay: '0.6s' },
  { id: 20, size: 88, side: 'right', offset: '40px',  top: '58%', opacity: 0.24, anim: 'floatSideD', duration: '8.6s', delay: '1.1s' },
]

interface ScreenFloatingLogo {
  id: number
  size: number
  top?: string
  bottom?: string
  left?: string
  right?: string
  opacity: number
  anim: string
  duration: string
  delay: string
}

// Top Zone Floating Logos (Above brand header)
const TOP_FLOATING_LOGOS: ScreenFloatingLogo[] = [
  { id: 201, size: 28, top: '18px', left: '6%',  opacity: 0.38, anim: 'floatTopA', duration: '5.8s', delay: '0s' },
  { id: 202, size: 44, top: '14px', right: '10%', opacity: 0.35, anim: 'floatTopB', duration: '6.6s', delay: '0.7s' },
  { id: 203, size: 22, top: '62px', left: '44%', opacity: 0.42, anim: 'floatTopA', duration: '5.2s', delay: '1.2s' },
  { id: 204, size: 36, top: '60px', right: '5%', opacity: 0.36, anim: 'floatTopB', duration: '6.0s', delay: '0.4s' },
]

// Bottom Zone Floating Logos
const BOTTOM_FLOATING_LOGOS: ScreenFloatingLogo[] = [
  { id: 301, size: 56, bottom: '18px', left: '5%',  opacity: 0.30, anim: 'floatBottomA', duration: '7.0s', delay: '0.3s' },
  { id: 302, size: 72, bottom: '16px', right: '6%', opacity: 0.28, anim: 'floatBottomB', duration: '7.6s', delay: '0.8s' },
  { id: 303, size: 30, bottom: '22px', left: '45%', opacity: 0.42, anim: 'floatBottomA', duration: '5.4s', delay: '1.4s' },
  { id: 304, size: 46, bottom: '80px', left: '12%', opacity: 0.36, anim: 'floatBottomB', duration: '6.2s', delay: '0.5s' },
  { id: 305, size: 38, bottom: '86px', right: '14%', opacity: 0.34, anim: 'floatBottomA', duration: '6.6s', delay: '1.9s' },
  { id: 306, size: 24, bottom: '88px', left: '38%', opacity: 0.44, anim: 'floatBottomB', duration: '5.0s', delay: '0.6s' },
]

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Global floating <w> logos state
  const [floatingLogosEnabled, setFloatingLogosEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('wnc_login_floating_logos')
    return saved === null ? true : saved === 'true'
  })

  // Redirect to /admin if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  // Fetch floating logo global setting from backend
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
        console.warn('Failed to fetch global floating logo setting:', err)
      }
    }
    fetchGlobalSetting()
  }, [])

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setAuthError(null)

    if (!email.trim() || !password) {
      setAuthError('Please provide both email and password')
      return
    }

    setIsLoggingIn(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        showSuccessToast('Successfully signed in!')
        navigate('/admin', { replace: true })
      } else {
        const errorMsg = res.message || 'Invalid email or password'
        setAuthError(errorMsg)
        showErrorToast(errorMsg)
      }
    } catch (err: any) {
      const msg = err?.message || 'Unable to sign in. Please check your credentials.'
      setAuthError(msg)
      showErrorToast(msg)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col justify-center items-center px-4 py-6 sm:py-8 relative selection:bg-[#ff9e7d] overflow-x-hidden font-mono">
      {/* Subtle Background Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Smooth Floating Keyframes for Side Flanks & Top/Bottom Zones */}
      <style>{`
        @keyframes floatSideA {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-38px) translateX(16px) rotate(8deg); }
          66% { transform: translateY(24px) translateX(-12px) rotate(-6deg); }
        }
        @keyframes floatSideB {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(35px) translateX(-16px) rotate(-8deg); }
          66% { transform: translateY(-28px) translateX(14px) rotate(6deg); }
        }
        @keyframes floatSideC {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          40% { transform: translateY(-44px) translateX(-14px) rotate(-9deg); }
          70% { transform: translateY(22px) translateX(16px) rotate(7deg); }
        }
        @keyframes floatSideD {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          40% { transform: translateY(38px) translateX(18px) rotate(9deg); }
          70% { transform: translateY(-24px) translateX(-12px) rotate(-7deg); }
        }
        @keyframes floatTopA {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          35% { transform: translateY(-10px) translateX(12px) rotate(7deg); }
          70% { transform: translateY(8px) translateX(-10px) rotate(-6deg); }
        }
        @keyframes floatTopB {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          35% { transform: translateY(10px) translateX(-12px) rotate(-7deg); }
          70% { transform: translateY(-8px) translateX(10px) rotate(6deg); }
        }
        @keyframes floatBottomA {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          35% { transform: translateY(-16px) translateX(14px) rotate(8deg); }
          70% { transform: translateY(14px) translateX(-12px) rotate(-7deg); }
        }
        @keyframes floatBottomB {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          35% { transform: translateY(16px) translateX(-14px) rotate(-8deg); }
          70% { transform: translateY(-14px) translateX(12px) rotate(7deg); }
        }
      `}</style>

      {/* Top-Left Back Button (Corner of Screen) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border-2 border-slate-900 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:bg-[#ff9e7d] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all"
        >
          <span>←</span>
          <span>Back</span>
        </Link>
      </div>

      {/* Top & Bottom Floating Logos — mobile only (sm:hidden on desktop) */}
      {floatingLogosEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 sm:hidden">
          {TOP_FLOATING_LOGOS.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none select-none"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                width: `${item.size}px`,
                height: `${item.size}px`,
                opacity: item.opacity,
                animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              <img
                src={onlyLogo}
                alt=""
                className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
              />
            </div>
          ))}

          {BOTTOM_FLOATING_LOGOS.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none select-none"
              style={{
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                width: `${item.size}px`,
                height: `${item.size}px`,
                opacity: item.opacity,
                animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              <img
                src={onlyLogo}
                alt=""
                className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
              />
            </div>
          ))}
        </div>
      )}

      {/* Centered Sign In Form Container */}
      <div className="w-full max-w-md sm:max-w-lg relative z-10 flex flex-col items-start">
        {/* Desktop Floating Logos hugging Left and Right of the Box (hidden on mobile) */}
        {floatingLogosEnabled &&
          FLOATING_LOGOS.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none select-none z-0 hidden sm:block"
              style={{
                top: item.top,
                ...(item.side === 'left'
                  ? { right: `calc(100% + ${item.offset})` }
                  : { left: `calc(100% + ${item.offset})` }),
                width: `${item.size}px`,
                height: `${item.size}px`,
                opacity: item.opacity,
                animation: `${item.anim} ${item.duration} ease-in-out infinite`,
                animationDelay: item.delay,
              }}
            >
              <img
                src={onlyLogo}
                alt=""
                className="w-full h-full object-contain filter contrast-125 drop-shadow-xs"
              />
            </div>
          ))}

        {/* Logo & Brand Header */}
        <div className="w-full text-left mb-6 relative z-20">
          <div className="mb-3.5 inline-block hover:translate-y-[-1px] transition-transform">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase leading-tight mt-1">
            Sign In
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base font-bold text-slate-600">
            Welcome back! Please enter your credentials to continue.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white border-2 border-slate-900 rounded-2xl p-8 sm:p-12 py-10 sm:py-14 shadow-[6px_6px_0px_0px_#0f172a] min-h-[420px] sm:min-h-[460px] flex flex-col justify-center relative z-20">
          {/* Top-Right Button on Box with CodePilot Icon */}
          <div className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-10">
            <a
              href="https://codepilot.webncode.in"
              title="Go to Code Pilot"
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#f0f9ff] hover:bg-[#e0f2fe] border-2 border-slate-900 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#0f172a] transition-all cursor-pointer select-none"
            >
              <img
                src="https://codepilot.webncode.in/logo.jpg"
                alt="CodePilot"
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-md object-cover border border-slate-900"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span>Login to Code Pilot</span>
              <span className="text-xs sm:text-sm font-black">→</span>
            </a>
          </div>
          {authError && (
            <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-600 text-rose-900 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2.5 shadow-[2px_2px_0px_0px_#e11d48]">
              <span>✕</span>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6 sm:space-y-7">
            {/* Email Input */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-[#fcfcfd] border-2 border-slate-900 rounded-xl text-sm sm:text-base text-slate-900 font-bold shadow-[2px_2px_0px_0px_#000] focus:bg-white focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none transition-all"
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 mb-2.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 pr-16 bg-[#fcfcfd] border-2 border-slate-900 rounded-xl text-sm sm:text-base text-slate-900 font-bold shadow-[2px_2px_0px_0px_#000] focus:bg-white focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-900 text-xs font-black uppercase px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 rounded-lg cursor-pointer transition-colors select-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 sm:py-4.5 bg-[#ff9e7d] hover:bg-[#ff8a65] border-2 border-slate-900 text-slate-900 font-black uppercase tracking-wider text-sm sm:text-base rounded-xl shadow-[4px_4px_0px_0px_#0f172a] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#0f172a] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security & System Trust Badge */}
        <div className="mt-4 text-center w-full relative z-20">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-3.5 py-1 rounded-full shadow-xs">
            <span className="text-emerald-600">●</span>
            <span>256-Bit Encrypted Secure Connection • Web n Code</span>
          </div>
        </div>
      </div>
    </div>
  )
}
