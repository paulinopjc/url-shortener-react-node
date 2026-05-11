import { Request, Response, NextFunction } from 'express'
import * as urlService from '../services/urlService'
import { createUrlSchema } from '../validators/urlValidator'

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createUrlSchema.parse(req.body)
    const url = await urlService.createUrl(body)
    res.status(201).json({ data: url })
  } catch (err) {
    next(err)
  }
}

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const urls = await urlService.getAllUrls()
    res.json({ data: urls, count: urls.length })
  } catch (err) {
    next(err)
  }
}

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await urlService.getUrlById(Number(req.params.id as string))
    res.json({ data: url })
  } catch (err) {
    next(err)
  }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await urlService.deleteUrl(Number(req.params.id as string))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const getClicks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await urlService.getClickStats(Number(req.params.id as string))
    res.json({ data: stats })
  } catch (err) {
    next(err)
  }
}

export const redirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await urlService.getUrlByCode(req.params.code as string)
    await urlService.recordClick(
      url.id,
      (req.get('referer') as string) || null,
      (req.get('user-agent') as string) || null,
      (req.ip as string) || null
    )
    res.redirect(301, url.original_url)
  } catch (err) {
    next(err)
  }
}
