import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=callback_failed')
          return
        }

        if (data.session) {
          // Wait a moment for auth context to update
          setTimeout(() => {
            // Redirect based on user role
            if (user) {
              switch (user.role) {
                case 'manager':
                  navigate('/dashboard')
                  break
                case 'clerk':
                  navigate('/bookings')
                  break
                case 'technician':
                  navigate('/tasks/today')
                  break
                default:
                  navigate('/')
              }
            } else {
              navigate('/')
            }
          }, 1000)
        } else {
          navigate('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [navigate, user])

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress size={60} sx={{ mb: 2 }} />
      <Typography variant="h6">正在登录...</Typography>
      <Typography variant="body2" color="text.secondary">
        请稍候，正在验证您的身份
      </Typography>
    </Box>
  )
}

export default AuthCallbackPage