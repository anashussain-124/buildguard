# BuildGuard AI

**AI-powered contract risk analysis for construction teams**

BuildGuard AI helps contractors and legal teams upload PDF or DOCX contracts, automatically extract contract text, and generate a clear risk report with red flags, clause recommendations, and a recommended next step.

## Features
- User registration and login via Supabase auth
- PDF / DOCX contract upload
- Contract text extraction with `pdfplumber` and `python-docx`
- OpenRouter LLM analysis with structured risk JSON output
- Contract history dashboard and analysis report pages
- Vercel-compatible frontend/backend deployment

## Tech Stack
- Backend: FastAPI + Python
- Frontend: Next.js App Router + Tailwind CSS
- Database/Auth: Supabase
- LLM: OpenRouter (`meta-llama/llama-3.3-70b-instruct:free`)
- Deployment: Vercel

## Environment Variables
Create a `.env` file in the project root with:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_32_BYTE_STRING
NEXT_PUBLIC_API_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
```

IMPORTANT: `JWT_SECRET` must be a cryptographically random string of at least 32 bytes. Never use the example placeholder in production. Generate one with:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

> `NEXT_PUBLIC_API_URL` is used by the frontend proxy and local development. In production on Vercel, the relative `/api` proxy route is used automatically.

## Infrastructure Setup

### Upstash Redis (Rate Limiting)

BuildGuard AI uses [Upstash Redis](https://upstash.com) for distributed rate limiting across serverless instances. When configured, rate limits are enforced via Redis `INCR` + `EXPIRE` atomic operations. When Redis is unavailable (e.g., local development without credentials), the backend automatically falls back to an in-memory rate limiter.

#### Setup Steps

1. Create an account at [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (choose a region close to your deployment)
3. Copy the **REST URL** and **REST Token** from the dashboard
4. Add to your `.env`:

```env
UPSTASH_REDIS_URL=https://your-instance.upstash.io
UPSTASH_REDIS_TOKEN=your_upstash_token
```

5. Add the same variables to your Vercel project settings (Environment Variables)

#### Behavior

| Scenario | Rate Limiter Used | Health Check `redis` Field |
|---|---|---|
| Upstash configured & reachable | Redis (Upstash) | `connected` |
| Upstash configured but error | In-memory fallback | `fallback` |
| No Upstash credentials | In-memory fallback | `fallback` |

#### Rate Limit Headers

All rate-limited responses (HTTP 429) include standard rate limit headers:

| Header | Description |
|---|---|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in current window (0 when blocked) |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |

#### Rate Limits by Endpoint

| Endpoint | Max Requests | Window |
|---|---|---|
| `/analyze` | 3 | 60s |
| `/upload` | 5 | 60s |
| `/auth/login` | 5 | 60s |
| `/auth/register` | 3 | 60s |
| `/contracts` | 30 | 60s |
| `/analysis` | 30 | 60s |
| Default | 10 | 60s |

#### Dependency

Add to `backend/requirements.txt`:
```
upstash-redis>=1.0.0
```

### Supabase (Database & Auth)

BuildGuard AI uses Supabase for PostgreSQL database and authentication. The health check endpoint performs a lightweight `SELECT id FROM users LIMIT 1` query to verify connectivity.

## Setup

1. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

2. Run the backend locally:

```bash
uvicorn backend.main:app --reload
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

4. Start the frontend dev server:

```bash
npm run dev
```

5. Visit `http://localhost:3000`

## Frontend Routing
- `/` – Landing page
- `/auth/login` – Login page
- `/auth/register` – Signup page
- `/dashboard` – Contract history and credits
- `/upload` – Upload and analyze a contract
- `/analysis/[id]` – View risk report
- `/pricing` – Plan details

## Backend API Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /upload`
- `POST /analyze/{contract_id}`
- `GET /analysis/{contract_id}`
- `GET /contracts`
- `DELETE /contracts/{contract_id}`

## Deployment

### Architecture

- **Frontend**: Next.js on Vercel → https://frontend-mu-drab-54.vercel.app
- **Backend**: FastAPI on Railway → https://backend-production-cfa2b.up.railway.app
- The frontend proxies `/api/*` requests to the backend via Next.js rewrites (see `frontend/next.config.mjs`)

### Quick Deploy Steps

1. Deploy backend to Railway from the `backend/` directory (Dockerfile is auto-detected via `railway.json`)
2. Set all required env vars on Railway (see `.env.example` or run `bash scripts/set_railway_env.sh`)
3. Set `NEXT_PUBLIC_API_URL` on Vercel to the Railway backend URL (or run `bash scripts/set_vercel_env.sh`)
4. Deploy frontend to Vercel from the repo root
5. Verify: `bash scripts/post_deploy_check.sh`

## Domain Setup

### Option A — Vercel custom domain (recommended)
1. Vercel dashboard → your project → Settings → Domains
2. Add your .in domain (e.g. buildguard.in)
3. Add the CNAME record your DNS provider shows (e.g. cname.vercel-dns.com)
4. Wait for SSL (usually < 2 min)
5. Update Railway env var:
     ALLOWED_ORIGINS=https://buildguard.in,https://www.buildguard.in
6. Redeploy Railway service for the CORS change to take effect

### Option B — Railway custom domain (if backend also needs a subdomain)
1. Railway dashboard → backend service → Settings → Domains → Add domain
2. Add api.buildguard.in
3. Add the CNAME record Railway shows
4. Update Vercel env var:
     NEXT_PUBLIC_API_URL=https://api.buildguard.in
5. Redeploy Vercel: vercel --prod

### DNS records summary (fill in your domain)
| Type  | Name | Value                        | Purpose           |
|-------|------|------------------------------|-------------------|
| CNAME | @    | cname.vercel-dns.com         | Frontend (Vercel) |
| CNAME | www  | cname.vercel-dns.com         | www redirect      |
| CNAME | api  | [Railway CNAME value]        | Backend API       |

## Notes
- Use a Supabase service role key for `SUPABASE_SERVICE_KEY`.
- The backend stores contract metadata and analysis results in Supabase tables.
- The frontend proxies auth and contract APIs through `/api`.
- Security headers (CSP, X-Frame-Options, etc.) are configured in `frontend/next.config.mjs` and `frontend/middleware.ts`.
- LLM output is strictly validated via Pydantic models in `backend/utils.py`.
- JWT tokens use HS256 with `iss` and `aud` claims; access tokens expire in 15 minutes.

## Monitoring

BuildGuard AI uses [Sentry](https://sentry.io/) for error tracking and performance monitoring across both frontend and backend.

### Alert Rule Recommendations

Configure the following alert rules in your Sentry project for production monitoring:

1. **High Error Rate** — Trigger when error rate exceeds 5% of total requests in a 5-minute window. Escalate to on-call.
2. **LLM Analysis Latency** — Alert when `contract_analysis` transaction p95 exceeds 60 seconds (OpenRouter fallback chain may be slow).
3. **LLM Failure Rate** — Alert when the `llm.analyze` transaction failure rate exceeds 10% (all fallback models exhausted).
4. **API 5xx Spike** — Trigger when backend 5xx responses exceed 1% of total requests in a 5-minute window.
5. **Frontend JS Errors** — Alert when client-side error count exceeds a baseline of 50 errors/hour.
6. **Auth Anomalies** — Monitor `AUTH_EVENT` logs for repeated 401/403 responses from a single user (potential brute force or token abuse).

### Source Map Uploads

Source maps are automatically uploaded to Sentry during CI builds on the `main` branch only. This enables readable stack traces for JavaScript errors. The `SENTRY_AUTH_TOKEN` is sourced from GitHub Secrets.

---

Built for a fast MVP launch with minimal configuration.
