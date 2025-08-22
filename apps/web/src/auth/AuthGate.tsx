import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { useAuth } from './AuthContext'

interface AuthGateProps {
  children: React.ReactNode
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // 开发模式调试
  if (import.meta.env.DEV) {
    console.log('AuthGate - user:', user)
    console.log('AuthGate - loading:', loading)
    console.log('AuthGate - location:', location.pathname)
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}