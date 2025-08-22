import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Chip,
} from '@mui/material'
import { EventNote, ExitToApp } from '@mui/icons-material'
import { useAuth } from '../auth/AuthContext'
import { RoleGuard } from '../auth/RoleGuard'

const BookingsPage: React.FC = () => {
  const { user, signOut, getAccessToken } = useAuth()
  const [clerkData, setClerkData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const fetchClerkData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getAccessToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/clerk-only`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setClerkData(data)
      } else {
        setError(`API Error: ${response.status}`)
      }
    } catch (err) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClerkData()
  }, [])

  return (
    <RoleGuard roles={['clerk']}>
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <EventNote />
            <Typography variant="h4">预约管理</Typography>
            <Chip label={user?.role} color="secondary" size="small" />
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
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  前台信息
                </Typography>
                <Typography>
                  <strong>ID:</strong> {user?.id}
                </Typography>
                <Typography>
                  <strong>邮箱:</strong> {user?.email}
                </Typography>
                <Typography>
                  <strong>角色:</strong> {user?.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  API 测试
                </Typography>
                <Button
                  variant="contained"
                  onClick={fetchClerkData}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? '加载中...' : '获取前台数据'}
                </Button>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {clerkData && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>API 响应:</strong> {clerkData.message}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  前台功能
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 客户预约录入与管理
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 支付确认与订单生成
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 客户信息维护
                </Typography>
                <Typography color="text.secondary">
                  • 日程安排查看
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  )
}

export default BookingsPage