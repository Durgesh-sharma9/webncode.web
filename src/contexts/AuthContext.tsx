import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import axios from 'axios'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wnc_token'))
  const [isLoading, setIsLoading] = useState(true)

  // Verify token and load current user profile on app load
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('wnc_token')
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const res = await axios.get(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        if (res.data?.success && res.data?.user) {
          const u = res.data.user
          setUser({
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role
          })
          setToken(storedToken)
        } else {
          localStorage.removeItem('wnc_token')
          setUser(null)
          setToken(null)
        }
      } catch (err) {
        console.error('Session restoration failed:', err)
        localStorage.removeItem('wnc_token')
        setUser(null)
        setToken(null)
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
        setToken(receivedToken)
        setUser(receivedUser)
        return { success: true, message: res.data.message || 'Login successful' }
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
