import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check routes
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/healthz', (req, res) => {
  res.json({ status: 'ok' })
})

// Authentication and protected routes
app.use('/api/auth', authRoutes)

const startServer = async () => {
  try {
    await prisma.$connect()
    console.log('Database connected successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

startServer()
