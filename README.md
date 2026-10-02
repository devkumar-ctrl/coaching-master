# YuvaBot — Coaching Platform

Monorepo with two independent Next.js 15 apps:

| Directory| Role | Deploy target |
| --- | --- | --- |
| `frontend/` | Public site + dashboards (App Router, Tailwind) | **Netlify** |
| `backend/` | API routes, NextAuth, MongoDB, payments, email | **Vercel** |

The frontend talks to the backend through the `/api/*` rewrite in
`frontend/next.config.ts`, so every browser request stays same-origin and the
backend needs no CORS configuration.

## Local development

```bash
npm run install:all   # installs both workspaces
npm run dev           # backend :4000, frontend :3000
```

Copy the templates and fill them in:

```bash
cp backend/.env.example  backend/.env.local
cp frontend/.env.example frontend/.env.local
```

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step runbook
(Netlify frontend + Vercel backend, environment variables, custom domains).

## Seed data

```bash
node backend/scripts/seed-courses.mjs
```

## Security notes

- Never commit `.env.local` — it is gitignored. Only `.env.example` is tracked.
- Do not paste real credentials into this README, source files, or issue
  trackers. Diagnostic endpoints (`/api/debug/*`, `/api/test-*`) are restricted
  to signed-in admins.