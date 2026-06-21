# Deployment Guide

## Local Development

### Prerequisites

| Tool | Version |
|---|---|
| Python | ≥ 3.11 |
| Node.js | ≥ 18 |
| Docker + Docker Compose | Latest |

### Quick Start

```bash
# 1. Clone and enter project
git clone <repo-url>
cd Crypto-Market-Intelligence-Hub

# 2. Install Python dependencies
make install-dev

# 3. Copy environment file
cp .env.example .env
# Edit .env with your values

# 4. Run the data pipeline
make run

# 5. Start FastAPI backend
make api
# → http://localhost:8000/docs

# 6. Start Streamlit dashboard (new terminal)
make dashboard
# → http://localhost:8501

# 7. Start Next.js frontend (new terminal)
make frontend-dev
# → http://localhost:3000
```

---

## Docker Compose (Recommended)

```bash
# Build all images
make docker-build

# Start all services
make docker-up
# → API:       http://localhost:8000
# → Dashboard: http://localhost:8501
# → Redis:     localhost:6379

# View logs
docker compose logs -f

# Stop everything
make docker-down
```

### Services

| Service | Image | Port |
|---|---|---|
| `api` | `deployment/docker/Dockerfile.api` | 8000 |
| `dashboard` | `deployment/docker/Dockerfile.dashboard` | 8501 |
| `redis` | `redis:7-alpine` | 6379 |

---

## Vercel (Frontend)

### Prerequisites

1. Create a [Vercel account](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`
3. Add GitHub secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

### Manual Deploy

```bash
cd frontend
vercel --prod
```

### Automatic Deploy (GitHub Actions)

The [deploy-vercel.yml](../.github/workflows/deploy-vercel.yml) workflow auto-deploys on every push to `main` that modifies `frontend/`.

### Environment Variables on Vercel

Set in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your FastAPI backend URL |

---

## CI/CD Pipeline

| Workflow | Trigger | Actions |
|---|---|---|
| `ci.yml` | Push / PR to main | Lint → Test → Coverage → Docker build |
| `data-pipeline.yml` | Daily 06:00 UTC | Fetch latest prices → Commit |
| `deploy-vercel.yml` | Push to main (frontend/) | Build → Deploy to Vercel |

---

## Production Checklist

- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Generate a strong `SECRET_KEY`
- [ ] Set up Redis for caching
- [ ] Configure `SENTRY_DSN` for error monitoring
- [ ] Enable HTTPS (reverse proxy: nginx / Caddy)
- [ ] Set up proper `ALLOWED_ORIGINS` for CORS
- [ ] Review `data/` volume mounts for persistence
- [ ] Set up log rotation for `logs/` directory
