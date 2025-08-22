import React from 'react'
import { 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  Grid,
  Chip 
} from '@mui/material'
import { 
  Dashboard, 
  EventNote, 
  Assignment, 
  ExitToApp 
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

const HomePage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // 开发模式自动跳转到对应角色页面
  React.useEffect(() => {
    if (import.meta.env.DEV && user?.role) {
      const roleRoutes = {
        manager: '/dashboard',
        clerk: '/bookings', 
        technician: '/tasks/today'
      }
      const targetRoute = roleRoutes[user.role as keyof typeof roleRoutes]
      if (targetRoute) {
        navigate(targetRoute, { replace: true })
      }
    }
  }, [user, navigate])

  const { data: healthStatus, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get('/api/healthz')
      return response.data
    },
  })

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const getRoleActions = () => {
    switch (user?.role) {
      case 'manager':
        return [
          {
            title: '店长仪表板',
            description: '财务管理、分成配置、绩效统计',
            icon: <Dashboard />,
            path: '/dashboard',
            color: 'primary' as const,
          },
        ]
      case 'clerk':
        return [
          {
            title: '预约管理',
            description: '客户预约、支付确认、订单生成',
            icon: <EventNote />,
            path: '/bookings',
            color: 'secondary' as const,
          },
        ]
      case 'technician':
        return [
          {
            title: '今日任务',
            description: '预约安排、服务确认、绩效查看',
            icon: <Assignment />,
            path: '/tasks/today',
            color: 'success' as const,
          },
        ]
      default:
        return []
    }
  }

  const roleActions = getRoleActions()

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            宠物店管理系统
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" color="text.secondary">
              欢迎回来，{user?.email}
            </Typography>
            <Chip 
              label={user?.role} 
              color={
                user?.role === 'manager' ? 'primary' : 
                user?.role === 'clerk' ? 'secondary' : 'success'
              } 
              size="small" 
            />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExitToApp />}
          onClick={handleSignOut}
        >
          退出登录
        </Button>
      </Box>

      <Grid container spacing={3}>
        {roleActions.map((action) => (
          <Grid item xs={12} md={6} lg={4} key={action.path}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                '&:hover': { elevation: 6 }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(action.icon, { 
                    sx: { fontSize: 48 },
                    color: action.color
                  })}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                系统状态
              </Typography>
              {isLoading ? (
                <Typography color="text.secondary">检查中...</Typography>
              ) : healthStatus ? (
                <Typography color="success.main">
                  ✅ 系统正常: {healthStatus.status}
                </Typography>
              ) : (
                <Typography color="error.main">
                  ❌ 系统异常
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HomePage
