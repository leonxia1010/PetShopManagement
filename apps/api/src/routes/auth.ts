import { Router } from 'express'
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Get current user info
router.get('/me', authenticateToken, (req, res) => {
  const authReq = req as AuthenticatedRequest
  res.json({
    id: authReq.user.id,
    email: authReq.user.email,
    role: authReq.user.role,
  })
})

// Manager-only endpoint
router.get('/manager-only', authenticateToken, requireRole(['manager']), (req, res) => {
  res.json({
    message: 'Welcome to manager dashboard',
    data: 'Sensitive manager data here',
    user: (req as AuthenticatedRequest).user,
  })
})

// Clerk-only endpoint
router.get('/clerk-only', authenticateToken, requireRole(['clerk']), (req, res) => {
  res.json({
    message: 'Welcome to clerk interface',
    data: 'Booking and customer data here',
    user: (req as AuthenticatedRequest).user,
  })
})

// Technician-only endpoint
router.get('/technician-only', authenticateToken, requireRole(['technician']), (req, res) => {
  res.json({
    message: 'Welcome to technician workspace',
    data: 'Daily tasks and appointments here',
    user: (req as AuthenticatedRequest).user,
  })
})

// Multi-role endpoint (clerk and technician can access)
router.get('/staff-only', authenticateToken, requireRole(['clerk', 'technician']), (req, res) => {
  res.json({
    message: 'Staff workspace',
    data: 'Shared staff resources',
    user: (req as AuthenticatedRequest).user,
  })
})

export default router