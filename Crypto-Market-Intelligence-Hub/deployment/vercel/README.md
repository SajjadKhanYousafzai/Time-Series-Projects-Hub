# Vercel Deployment

## Prerequisites

1. Sign up at [vercel.com](https://vercel.com)
2. Install CLI: `npm install -g vercel`

## First-Time Setup

```bash
cd frontend
vercel login
vercel link            # link to existing or create new project
```

## Manual Deploy

```bash
cd frontend
vercel --prod
```

## GitHub Auto-Deploy

Add these secrets to your GitHub repo (Settings → Secrets → Actions):

| Secret | How to get |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | vercel.com → Team Settings → General |
| `VERCEL_PROJECT_ID` | `cat frontend/.vercel/project.json` after `vercel link` |

The [deploy-vercel.yml](../../.github/workflows/deploy-vercel.yml) workflow will auto-deploy on every push to `main` that touches `frontend/`.

## Environment Variables

Set in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | Your FastAPI backend URL (e.g. Railway, Render, or ngrok for dev) |
