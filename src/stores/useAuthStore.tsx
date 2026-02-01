import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Profile } from '@/types'
import { authService } from '@/services/auth'

interface AuthContextType {
  user: Profile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<void>
  signUp: (name: string, email: string, password?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('pdfcorretor_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password?: string) => {
    setIsLoading(true)
    try {
      // Password ignored in mock
      const profile = await authService.login(email)
      setUser(profile)
      localStorage.setItem('pdfcorretor_user', JSON.stringify(profile))
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password?: string) => {
    setIsLoading(true)
    try {
      const profile = await authService.signUp(name, email)
      setUser(profile)
      localStorage.setItem('pdfcorretor_user', JSON.stringify(profile))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('pdfcorretor_user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuthStore = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthStore must be used within an AuthProvider')
  }
  return context
}

export default useAuthStore
