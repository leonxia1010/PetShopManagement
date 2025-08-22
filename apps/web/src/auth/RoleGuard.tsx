import React from 'react'
import { Box, Typography, Paper, Button } from '@mui/material'
import { ErrorOutline } from '@mui/icons-material'
import { useAuth } from './AuthContext'
import { UserRole } from '../types/auth'

interface RoleGuardProps {
  children: React.ReactNode
  roles: UserRole[]
  fallback?: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  roles, 
  fallback 
}) => {
  const { user } = useAuth()

  if (!user) {
    return null // AuthGate should handle this case
  }

  if (!roles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        p={3}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <ErrorOutline
            color="error"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            访问受限
          </Typography>
          <Typography color="text.secondary" paragraph>
            您的角色 <strong>{user.role}</strong> 无权访问此页面。
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            需要以下角色之一：{roles.join(', ')}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            sx={{ mt: 2 }}
          >
            返回
          </Button>
        </Paper>
      </Box>
    )
  }

  return <>{children}</>
}