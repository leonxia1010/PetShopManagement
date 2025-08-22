export type UserRole = 'manager' | 'clerk' | 'technician'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
  getAccessToken: () => Promise<string | null>
}