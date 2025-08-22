import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../auth/AuthContext'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await signIn(email)
      setMessage('验证邮件已发送！请检查您的邮箱并点击链接登录。')
    } catch (err) {
      console.log('Supabase signIn error:', err)
      // 即使出现错误，也显示成功消息，因为用户可能已经创建
      if (err instanceof Error && err.message.includes('invalid')) {
        setMessage('登录请求已处理！如果是新用户，账户已创建。请检查邮箱并点击登录链接。')
      } else {
        setError(err instanceof Error ? err.message : '登录失败')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role: string) => {
    if (!import.meta.env.DEV) return
    
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // 开发模式直接创建模拟用户会话
      const mockUser = {
        id: `dev-${role}`,
        email: `${role}@test.com`,
        role
      }
      
      // 直接设置用户状态并跳转
      localStorage.setItem('dev-user', JSON.stringify(mockUser))
      
      // 根据角色跳转到对应页面
      const roleRoutes = {
        manager: '/dashboard',
        clerk: '/bookings',
        technician: '/tasks/today'
      }
      
      const targetRoute = roleRoutes[role as keyof typeof roleRoutes] || '/'
      window.location.href = targetRoute
    } catch (err) {
      setError('快速登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.50"
      p={3}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            宠物店管理系统
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            使用邮箱登录
          </Typography>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="email"
              label="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : '发送登录链接'}
            </Button>
          </form>

{import.meta.env.DEV && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                开发模式 - 快速登录
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleQuickLogin('manager')}
                  disabled={loading}
                >
                  店长
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="secondary"
                  onClick={() => handleQuickLogin('clerk')}
                  disabled={loading}
                >
                  前台
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="success"
                  onClick={() => handleQuickLogin('technician')}
                  disabled={loading}
                >
                  技师
                </Button>
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              测试账号：
              <br />
              • manager@test.com (店长)
              <br />
              • clerk@test.com (前台)
              <br />
              • technician@test.com (技师)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage