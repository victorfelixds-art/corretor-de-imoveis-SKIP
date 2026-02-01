import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types'

export const authService = {
  // Login with email and password
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign up with email, password and metadata
  signUp: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) throw error
    return data
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Recover password
  recoverPassword: async (email: string) => {
    // Redirect to root so the user is logged in via magic link and then redirected to app
    const redirectTo = `${window.location.origin}/`
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    if (error) throw error
  },

  // Get current user profile from database
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data as Profile
  },
}
