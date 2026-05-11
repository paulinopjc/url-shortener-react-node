import { describe, it, expect } from '@jest/globals'
import request from 'supertest'
import { createApp } from '../src/app'

const app = createApp()

describe('POST /api/v1/urls', () => {
  it('creates a short URL and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com/long-page' })

    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      original_url: 'https://example.com/long-page',
    })
    expect(res.body.data.code).toBeDefined()
    expect(res.body.data.id).toBeDefined()
  })

  it('creates a URL with optional title and custom code', async () => {
    const res = await request(app)
      .post('/api/v1/urls')
      .send({
        original_url: 'https://example.com',
        title: 'Example',
        custom_code: 'mycode',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.title).toBe('Example')
    expect(res.body.data.code).toBe('mycode')
  })

  it('returns 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'not-a-url' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation failed')
  })

  it('returns 409 for duplicate custom code', async () => {
    await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com', custom_code: 'taken' })

    const res = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://other.com', custom_code: 'taken' })

    expect(res.status).toBe(409)
  })
})

describe('GET /api/v1/urls', () => {
  it('returns an empty list when no URLs exist', async () => {
    const res = await request(app).get('/api/v1/urls')

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
    expect(res.body.count).toBe(0)
  })

  it('returns all URLs with click counts', async () => {
    await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com' })

    const res = await request(app).get('/api/v1/urls')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].click_count).toBe(0)
  })
})

describe('GET /api/v1/urls/:id', () => {
  it('returns a single URL by ID', async () => {
    const created = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com' })

    const res = await request(app).get(`/api/v1/urls/${created.body.data.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data.original_url).toBe('https://example.com')
  })

  it('returns 404 for non-existent URL', async () => {
    const res = await request(app).get('/api/v1/urls/99999')
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/v1/urls/:id', () => {
  it('deletes a URL and returns 204', async () => {
    const created = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com' })

    const res = await request(app).delete(`/api/v1/urls/${created.body.data.id}`)
    expect(res.status).toBe(204)

    const check = await request(app).get(`/api/v1/urls/${created.body.data.id}`)
    expect(check.status).toBe(404)
  })

  it('returns 404 when deleting non-existent URL', async () => {
    const res = await request(app).delete('/api/v1/urls/99999')
    expect(res.status).toBe(404)
  })
})

describe('GET /r/:code (redirect)', () => {
  it('redirects to the original URL with 301', async () => {
    const created = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com/target' })

    const res = await request(app)
      .get(`/r/${created.body.data.code}`)
      .redirects(0)

    expect(res.status).toBe(301)
    expect(res.headers.location).toBe('https://example.com/target')
  })

  it('returns 404 for unknown code', async () => {
    const res = await request(app).get('/r/nonexistent')
    expect(res.status).toBe(404)
  })

  it('records a click on redirect', async () => {
    const created = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com' })

    await request(app).get(`/r/${created.body.data.code}`).redirects(0)

    const stats = await request(app)
      .get(`/api/v1/urls/${created.body.data.id}/clicks`)

    expect(stats.body.data.total_clicks).toBe(1)
  })
})

describe('GET /api/v1/urls/:id/clicks', () => {
  it('returns click statistics', async () => {
    const created = await request(app)
      .post('/api/v1/urls')
      .send({ original_url: 'https://example.com' })

    const res = await request(app)
      .get(`/api/v1/urls/${created.body.data.id}/clicks`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      total_clicks: 0,
      clicks_today: 0,
      top_referrers: [],
      clicks_per_day: [],
    })
  })

  it('returns 404 for non-existent URL', async () => {
    const res = await request(app).get('/api/v1/urls/99999/clicks')
    expect(res.status).toBe(404)
  })
})

describe('GET /api/health', () => {
  it('returns health check', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
