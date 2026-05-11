import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' })
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    // don't leak field details in production
    if (process.env.NODE_ENV === 'production') {
      res.status(400).json({ error: 'Validation failed' })
      return
    }
    const issues = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    res.status(400).json({ error: 'Validation failed', details: issues })
    return
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
