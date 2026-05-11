import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import urlRoutes from './routes/urlRoutes'
import { redirect } from './controllers/urlController'
import { errorHandler, notFound } from './middleware/errorHandler'

export const createApp = () => {
  const app = express()

  app.use(helmet())

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())

  app.use(cors({ origin: allowedOrigins }))
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
  }
  app.use(express.json({ limit: '10kb' }))

  // rate limiting - skip in test
  if (process.env.NODE_ENV !== 'test') {
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
    app.use('/api/v1/urls', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }))
  }

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/v1/urls', urlRoutes)

  app.get('/r/:code', redirect)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
