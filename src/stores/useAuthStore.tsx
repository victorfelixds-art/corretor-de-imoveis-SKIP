import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Profile } from '@/types'
import { authService } from '@/services/auth'
import { supabase } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: Profile | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<void>
  signUp: (name: string, email: string, password?: string) => Promise<void>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Function to handle session updates
    const handleSession = async (currentSession: Session | null) => {
      if (!mounted) return

      setSession(currentSession)

      if (currentSession?.user) {
        try {
          const profile = await authService.getProfile(currentSession.user.id)
          if (mounted) {
            setUser(profile)
          }
        } catch (error) {
          console.error('Failed to load profile', error)
          if (mounted) setUser(null)
        }
      } else {
        if (mounted) setUser(null)
      }

      if (mounted) setIsLoading(false)
    }

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
    })

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Reset loading state on auth change to ensure UI updates correctly
      // But only if we are transitioning states
      handleSession(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required')
    setIsLoading(true)
    try {
      await authService.login(email, password)
      // State update is handled by onAuthStateChange
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const signUp = async (name: string, email: string, password?: string) => {
    if (!password) throw new Error('Password is required')
    setIsLoading(true)
    try {
      await authService.signUp(name, email, password)
      // State update is handled by onAuthStateChange
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!session?.user) return
    try {
      const profile = await authService.getProfile(session.user.id)
      setUser(profile)
    } catch (error) {
      console.error('Failed to refresh profile', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        logout,
        refreshProfile,
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
