import { Profile } from '@/types'

// Mock database
const MOCK_USERS: Profile[] = [
  {
    id: 'user-corretor-1',
    name: 'João Corretor',
    email: 'corretor@example.com',
    role: 'corretor',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'user-admin-1',
    name: 'Maria Admin',
    email: 'admin@example.com',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const authService = {
  login: async (email: string): Promise<Profile> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.email === email)
        if (user) {
          resolve(user)
        } else {
          // Auto-register mock for demo purposes if not found, or reject
          // For spec compliance, we'll simulate a login error if not found in mock list for specialized accounts,
          // but let's allow "corretor@example.com" and "admin@example.com" to work.
          // For other emails, we could mock a dynamic user login for testing SignUp flow.
          if (email.includes('error')) {
            reject(new Error('Credenciais inválidas'))
          } else {
            // Dynamic temporary user for testing sign up flow persistence
            resolve({
              id: `user-${Date.now()}`,
              name: 'Novo Usuário',
              email,
              role: 'corretor',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
          }
        }
      }, 800)
    })
  },

  signUp: async (name: string, email: string): Promise<Profile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: Profile = {
          id: `user-${Date.now()}`,
          name,
          email,
          role: 'corretor',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        MOCK_USERS.push(newUser)
        resolve(newUser)
      }, 1000)
    })
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500)
    })
  },

  recoverPassword: async (email: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log(`Recovery email sent to ${email}`)
      setTimeout(() => resolve(), 1000)
    })
  },
}
