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
import { Dashboard, ExitToApp } from '@mui/icons-material'
import { useAuth } from '../auth/AuthContext'
import { RoleGuard } from '../auth/RoleGuard'

const DashboardPage: React.FC = () => {
  const { user, signOut, getAccessToken } = useAuth()
  const [managerData, setManagerData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const fetchManagerData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getAccessToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/manager-only`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setManagerData(data)
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
    fetchManagerData()
  }, [])

  return (
    <RoleGuard roles={['manager']}>
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Dashboard />
            <Typography variant="h4">店长仪表板</Typography>
            <Chip label={user?.role} color="primary" size="small" />
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
                  用户信息
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
                  onClick={fetchManagerData}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? '加载中...' : '获取管理员数据'}
                </Button>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {managerData && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>API 响应:</strong> {managerData.message}
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
                  管理功能
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 财务数据管理与报表
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 分成规则配置
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 员工绩效统计
                </Typography>
                <Typography color="text.secondary">
                  • 系统设置与用户管理
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  )
}

export default DashboardPage