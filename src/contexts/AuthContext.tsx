import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
  affiliate?: {
    id: string
    referralCode: string
    payoutType?: 'percentage' | 'fixed'
    commissionRate: number
    fixedAmount?: number
    allowedProducts?: string[]
    status: string
    phone?: string
    bankDetails?: {
      upiId?: string
      accountHolder?: string
      accountNumber?: string
      ifscCode?: string
      bankName?: string
    }
  } | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: string; user?: User }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('wnc_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wnc_token'))
  const [isLoading, setIsLoading] = useState(false)

  // Verify token and refresh user profile silently in background
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('wnc_token')
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          timeout: 7000
        })
        if (res.data?.success && res.data?.user) {
          const u = res.data.user
          const mappedUser: User = {
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            affiliate: u.affiliate || null
          }
          setUser(mappedUser)
          localStorage.setItem('wnc_user', JSON.stringify(mappedUser))
          setToken(storedToken)
        }
      } catch (err: any) {
        // ONLY log out if the backend explicitly rejected the token as invalid/expired (HTTP 401)
        // Never log out on nodemon server restarts, network errors, or temporary delays!
        if (err.response?.status === 401) {
          console.warn('Authentication token expired or invalid, logging out.')
          localStorage.removeItem('wnc_token')
          localStorage.removeItem('wnc_user')
          setUser(null)
          setToken(null)
        } else {
          console.info('Backend server reloading or temporarily busy, keeping local session active.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password })
      if (res.data?.success) {
        const receivedToken = res.data.token
        const receivedUser = res.data.user
        localStorage.setItem('wnc_token', receivedToken)
        localStorage.setItem('wnc_user', JSON.stringify(receivedUser))
        setToken(receivedToken)
        setUser(receivedUser)
        return {
          success: true,
          message: res.data.message || 'Login successful',
          role: receivedUser?.role,
          user: receivedUser
        }
      }
      return { success: false, message: res.data?.message || 'Login failed' }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, message: msg }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password })
      if (res.data?.success) {
        const receivedToken = res.data.token
        const receivedUser = res.data.user
        localStorage.setItem('wnc_token', receivedToken)
        localStorage.setItem('wnc_user', JSON.stringify(receivedUser))
        setToken(receivedToken)
        setUser(receivedUser)
        return { success: true, message: res.data.message || 'Registration successful' }
      }
      return { success: false, message: res.data?.message || 'Registration failed' }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Registration failed'
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem('wnc_token')
    localStorage.removeItem('wnc_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
