# Intelligent Code Snippet Search with AI (MVP)

This repository contains a full-stack MVP: React + MUI frontend and Node/Express backend with MongoDB, Redis caching, and OpenAI integration.

Folders:
- backend/ - Express API, Mongoose models, Redis caching, AI endpoint, seed script, tests
- frontend/ - Vite + React + MUI app

Requirements
- Node 18+, Docker (optional for DB caching), MongoDB, Redis

Quick start (dev) — local (no Docker)

1) Start MongoDB and Redis locally.

macOS (Homebrew) example:

```bash
# Install (if needed)
brew install mongodb-community@6.0
brew install redis

# Start services
brew services start mongodb-community@6.0
brew services start redis
```

Alternatively use your OS package manager or managed services (MongoDB Atlas, Redis Cloud). Set `MONGO_URI` and `REDIS_URL` accordingly in `backend/.env`.

2) Backend:

```bash
cd backend
npm install
cp .env.example .env # edit values (MONGO_URI, REDIS_URL, OPENAI_API_KEY, JWT_SECRET)
npm run seed
npm run dev
```

3) Frontend:

```bash
cd frontend
npm install
npm run dev
```
Environment variables
- backend/.env.example
- frontend/.env.example

API Overview
- `GET /api/snippets?q=&language=&tag=&page=&limit=` - public search, cached in Redis for anonymous
- `GET /api/snippets/:id` - snippet details (cached)
- `POST /api/snippets/:id/rate` - protected, body { value }
- `POST /api/snippets/:id/favorite` - protected
- `DELETE /api/snippets/:id/favorite` - protected
- `GET /api/me/favorites` - protected
- `POST /api/ai/suggest` - body { query, topSnippetIds }

Testing
- Backend tests use Jest + Supertest:
```bash
cd backend
npm install
npm test
```

Notes & tradeoffs
- Ratings stored in separate `Rating` collection to allow efficient per-user unique votes and aggregation.
- Search uses Mongo text index; Redis caches search results for anonymous users only.
- AI endpoint uses OpenAI; prompt and payloads are truncated to avoid huge inputs.
