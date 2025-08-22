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
import { Assignment, ExitToApp } from '@mui/icons-material'
import { useAuth } from '../auth/AuthContext'
import { RoleGuard } from '../auth/RoleGuard'

const TasksPage: React.FC = () => {
  const { user, signOut, getAccessToken } = useAuth()
  const [technicianData, setTechnicianData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const fetchTechnicianData = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await getAccessToken()
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/technician-only`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTechnicianData(data)
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
    fetchTechnicianData()
  }, [])

  return (
    <RoleGuard roles={['technician']}>
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Assignment />
            <Typography variant="h4">今日任务</Typography>
            <Chip label={user?.role} color="success" size="small" />
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
                  技师信息
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
                  onClick={fetchTechnicianData}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? '加载中...' : '获取技师数据'}
                </Button>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {technicianData && (
                  <Alert severity="success">
                    <Typography variant="body2">
                      <strong>API 响应:</strong> {technicianData.message}
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
                  技师功能
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 查看今日预约安排
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 服务完成确认
                </Typography>
                <Typography color="text.secondary" paragraph>
                  • 个人绩效查看
                </Typography>
                <Typography color="text.secondary">
                  • 工作时间记录
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </RoleGuard>
  )
}

export default TasksPage