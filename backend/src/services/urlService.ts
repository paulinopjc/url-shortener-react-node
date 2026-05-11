import pool from '../db/connection'
import { generateCode } from '../lib/generateCode'
import { HttpError } from '../middleware/errorHandler'
import { Url, Click, ClickStats, CreateUrlInput } from '../types'

// query used by both getAll and getById - joins click count onto urls
const URL_WITH_CLICKS = `
  SELECT u.*, COALESCE(c.click_count, 0)::int AS click_count
  FROM urls u
  LEFT JOIN (
    SELECT url_id, COUNT(*) AS click_count FROM clicks GROUP BY url_id
  ) c ON c.url_id = u.id`

export const createUrl = async (input: CreateUrlInput): Promise<Url> => {
  const code = input.custom_code || generateCode()

  // check if code already exists
  const existing = await pool.query('SELECT id FROM urls WHERE code = $1', [code])
  if (existing.rows.length > 0) {
    throw new HttpError(409, `Code "${code}" is already taken`)
  }

  const result = await pool.query(
    'INSERT INTO urls (code, original_url, title) VALUES ($1, $2, $3) RETURNING *',
    [code, input.original_url, input.title || null]
  )
  return result.rows[0]
}

export const getAllUrls = async (): Promise<Url[]> => {
  const result = await pool.query(URL_WITH_CLICKS + ' ORDER BY u.created_at DESC')
  return result.rows
}

export async function getUrlById(id: number): Promise<Url> {
  const result = await pool.query(URL_WITH_CLICKS + ' WHERE u.id = $1', [id])
  if (result.rows.length === 0) throw new HttpError(404, 'URL not found')
  return result.rows[0]
}

export async function getUrlByCode(code: string): Promise<Url> {
  const result = await pool.query('SELECT * FROM urls WHERE code = $1', [code])
  if (result.rows.length === 0) throw new HttpError(404, 'Short URL not found')
  return result.rows[0]
}

export async function deleteUrl(id: number): Promise<void> {
  const result = await pool.query('DELETE FROM urls WHERE id = $1 RETURNING id', [id])
  if (result.rows.length === 0) throw new HttpError(404, 'URL not found')
}

export const recordClick = async (
  urlId: number,
  referrer: string | null,
  userAgent: string | null,
  ipAddress: string | null
): Promise<Click> => {
  const result = await pool.query(
    'INSERT INTO clicks (url_id, referrer, user_agent, ip_address) VALUES ($1, $2, $3, $4) RETURNING *',
    [urlId, referrer, userAgent, ipAddress]
  )
  return result.rows[0]
}

export async function getClickStats(urlId: number): Promise<ClickStats> {
  // make sure the url exists first
  const urlCheck = await pool.query('SELECT id FROM urls WHERE id = $1', [urlId])
  if (urlCheck.rows.length === 0) throw new HttpError(404, 'URL not found')

  const [totalRes, todayRes, referrerRes, dailyRes] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS total FROM clicks WHERE url_id = $1', [urlId]),
    pool.query(
      'SELECT COUNT(*)::int AS total FROM clicks WHERE url_id = $1 AND created_at >= CURRENT_DATE',
      [urlId]
    ),
    pool.query(
      `SELECT COALESCE(referrer, 'Direct') AS referrer, COUNT(*)::int AS count
       FROM clicks WHERE url_id = $1
       GROUP BY referrer ORDER BY count DESC LIMIT 10`,
      [urlId]
    ),
    pool.query(
      `SELECT created_at::date AS date, COUNT(*)::int AS count
       FROM clicks WHERE url_id = $1
       GROUP BY created_at::date ORDER BY date DESC LIMIT 30`,
      [urlId]
    ),
  ])

  return {
    total_clicks: totalRes.rows[0].total,
    clicks_today: todayRes.rows[0].total,
    top_referrers: referrerRes.rows,
    clicks_per_day: dailyRes.rows,
  }
}
