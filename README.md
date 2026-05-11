# Snip - URL Shortener

Shorten URLs and track clicks. Built with React, Node.js, TypeScript, and PostgreSQL.

**Live:** [url-shortener-react-node.vercel.app](https://url-shortener-react-node.vercel.app)
**API:** [url-shortener-api-XXXX.onrender.com](https://url-shortener-api-XXXX.onrender.com)

## Stack

- **Frontend**: React 19, TypeScript, React Router, Tailwind CSS, Vite
- **Backend**: Express 5, TypeScript, PostgreSQL, Zod
- **Tests**: Jest + Supertest (API), Vitest + React Testing Library (UI)
- **Infra**: Docker Compose for local dev, Render + Vercel + Neon for prod

## Features

- Shorten URLs with auto-generated or custom short codes
- Click analytics: total/daily counts, referrer breakdown, bar chart
- Copy to clipboard
- Zod validation on inputs
- 301 redirects

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/urls` | Create short URL |
| `GET` | `/api/v1/urls` | List all URLs |
| `GET` | `/api/v1/urls/:id` | Get single URL |
| `GET` | `/api/v1/urls/:id/clicks` | Click analytics |
| `DELETE` | `/api/v1/urls/:id` | Delete URL |
| `GET` | `/r/:code` | Redirect (301) |

Postman collection in `postman/url-shortener-api.json`.

## Setup

```bash
# start postgres
docker compose up -d

# backend
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev

# frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Tests

```bash
cd backend && npm test    # 16 tests
cd frontend && npm test   # 4 tests
```

## Deployment

- **Backend** → Render (root: `backend`, start: `node dist/server.js`)
- **Frontend** → Vercel (root: `frontend`)
- **DB** → Neon PostgreSQL

Set `DATABASE_URL`, `FRONTEND_URL`, `NODE_ENV` on Render.
Set `VITE_API_URL` on Vercel.

## License

MIT
