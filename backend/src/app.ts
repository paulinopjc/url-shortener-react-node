import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import urlRoutes from './routes/urlRoutes'
import { redirect } from './controllers/urlController'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

export const createApp = () => {
  const app = express()

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())

  app.use(cors({ origin: allowedOrigins }))
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'))
  }
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/v1/urls', urlRoutes)

  app.get('/r/:code', redirect)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
