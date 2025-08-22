import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { User, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // 开发模式检查
      if (import.meta.env.DEV) {
        const devUser = localStorage.getItem('dev-user')
        console.log('Dev mode - checking localStorage:', devUser)
        if (devUser) {
          try {
            const userData = JSON.parse(devUser)
            console.log('Dev mode - setting user:', userData)
            setUser(userData)
            setLoading(false)
            return
          } catch (e) {
            console.log('Dev mode - parse error, clearing localStorage')
            localStorage.removeItem('dev-user')
          }
        }
      }

      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      
      if (session?.user) {
        await updateUserFromSession(session)
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // 监听localStorage变化以支持开发模式用户切换
  useEffect(() => {
    if (!import.meta.env.DEV) return

    const handleStorageChange = () => {
      const devUser = localStorage.getItem('dev-user')
      if (devUser) {
        try {
          setUser(JSON.parse(devUser))
        } catch (e) {
          localStorage.removeItem('dev-user')
          setUser(null)
        }
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const updateUserFromSession = async (session: Session) => {
    try {
      // Get user role from backend /me endpoint
      const token = session.access_token
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role,
        })
      } else {
        console.error('Failed to fetch user data from backend')
        setUser(null)
      }
    } catch (error) {
      console.error('Error updating user from session:', error)
      setUser(null)
    }
  }

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    // 开发模式清除本地存储
    if (import.meta.env.DEV) {
      localStorage.removeItem('dev-user')
      setUser(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    setUser(null)
  }

  const getAccessToken = async (): Promise<string | null> => {
    // 开发模式返回dev token
    if (import.meta.env.DEV && user?.id?.startsWith('dev-')) {
      return `dev-${user.role}`
    }

    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    getAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}