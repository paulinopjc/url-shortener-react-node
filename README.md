# Snip - URL Shortener

Full-stack URL shortener with click analytics dashboard. Shorten URLs, track clicks, view referrer stats and daily click charts.

**Live:** [url-shortener-react-node.vercel.app](https://url-shortener-react-node.vercel.app)
**API:** [url-shortener-api-XXXX.onrender.com](https://url-shortener-api-XXXX.onrender.com)

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Frontend  | React 19, TypeScript, React Router 7, Tailwind CSS 4 |
| Backend   | Express 5, TypeScript, Node.js                    |
| Database  | PostgreSQL 16                                     |
| Validation| Zod 4                                             |
| Testing   | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |
| DevOps    | Docker Compose, Vite 8                            |

## Project Structure

```
url-shortener-react-node/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Entry point
│   │   ├── app.ts                 # Express app setup
│   │   ├── controllers/           # Route handlers
│   │   ├── routes/                # Express routes
│   │   ├── services/              # Business logic + DB access
│   │   ├── db/                    # Connection pool + migrations
│   │   ├── middleware/            # Error handler, 404
│   │   ├── validators/            # Zod schemas
│   │   ├── types/                 # TypeScript interfaces
│   │   └── lib/                   # Code generator utility
│   └── tests/                     # Jest + Supertest tests
├── frontend/
│   ├── src/
│   │   ├── main.tsx               # React entry point
│   │   ├── App.tsx                # Router setup
│   │   ├── api/                   # Axios client + API functions
│   │   ├── pages/                 # Dashboard, UrlDetail, NotFound
│   │   ├── components/            # Reusable UI components
│   │   └── types/                 # TypeScript interfaces
│   └── tests/                     # Vitest + RTL tests
├── postman/                       # Postman collection
├── docker-compose.yml             # Local PostgreSQL
└── README.md
```

## API Endpoints

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | `/api/v1/urls`          | Create a shortened URL               |
| GET    | `/api/v1/urls`          | List all URLs with click counts      |
| GET    | `/api/v1/urls/:id`      | Get a single URL by ID               |
| GET    | `/api/v1/urls/:id/clicks` | Get click analytics for a URL      |
| DELETE | `/api/v1/urls/:id`      | Delete a URL and its click data      |
| GET    | `/r/:code`              | Redirect to original URL (301)       |
| GET    | `/api/health`           | Health check                         |

## Documentation

Import the Postman collection from `postman/url-shortener-api.json` to explore the API interactively.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)

### Backend

```bash
cd backend
cp .env.example .env

# Start PostgreSQL
cd .. && docker compose up -d && cd backend

# Install dependencies and run migrations
npm install
npm run migrate

# Start dev server
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env

npm install
npm run dev
```

### Run Tests

```bash
# Backend (16 tests)
cd backend
npm test

# Frontend (4 tests)
cd frontend
npm test
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment

| Service  | Platform | Config                               |
| -------- | -------- | ------------------------------------ |
| Backend  | Render   | Root: `backend`, Build: `npm run build`, Start: `node dist/server.js` |
| Frontend | Vercel   | Root: `frontend`, Framework: Vite    |
| Database | Neon     | PostgreSQL (free tier)               |

### Environment Variables (Production)

**Backend (Render):**
- `DATABASE_URL` - Neon PostgreSQL connection string
- `FRONTEND_URL` - Vercel frontend URL
- `NODE_ENV` - `production`

**Frontend (Vercel):**
- `VITE_API_URL` - Render backend URL + `/api/v1`

## Features

- Shorten any URL with auto-generated or custom short codes
- Click tracking with referrer, user agent, and IP logging
- Analytics dashboard: total clicks, clicks today, daily chart, top referrers
- Copy short URL to clipboard
- Input validation with Zod (URL format, custom code format)
- Responsive design with Tailwind CSS
- 301 redirects for SEO-friendly short links
- 20 automated tests (16 backend + 4 frontend)

## License

MIT
