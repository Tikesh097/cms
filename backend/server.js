import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initializeDatabase } from './models/db.js'
import candidatesRouter from './routes/candidates.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://cmsassignment.netlify.app/'
]

app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server & Postman requests
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS not allowed'), false)
    }
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Initialize database
await initializeDatabase()

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Candidate Management System API is running',
    timestamp: new Date().toISOString()
  })
})

app.use('/api/candidates', candidatesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
  console.log(`🌐 Accepting requests from ${FRONTEND_URL}`)
})
