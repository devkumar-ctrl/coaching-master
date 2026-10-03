# YuvaBot Lab — Frontend

Next.js 15 (App Router) marketing site, course catalogue and dashboards for
YuvaBot Lab Private Limited. Deployed to **Netlify**.

The backend lives in a separate repository and is deployed to Vercel:
[`coaching-master-backend`](https://github.com/devkumar-ctrl/coaching-master-backend).

## Architecture

```
Browser
   │  https://<site>.netlify.app          (same-origin, always)
   ▼
Netlify ── this app (SSR + static)
   │
   │  /api/*  ──► rewritten by next.config.ts
   ▼
Vercel  ── backend (Next.js API routes + Auth.js)
   │
   ▼
MongoDB Atlas · Cloudinary · Razorpay · SMTP
```

Every API call in this app is a **relative** `fetch("/api/...")`. Nothing calls
the backend cross-origin, so no CORS setup is needed anywhere. If you see
`Internal Server Error` on `/api/*`, the rewrite is pointing at the wrong
origin — see the troubleshooting note below.

## Requirements

- Node.js 22 (pinned in `netlify.toml`; the Netlify plugin refuses Node 20)
- The backend running locally on port `4000` for development

## Local development

```bash
npm ci
cp .env.example .env.local     # then edit as needed
npm run dev                    # http://localhost:3000
```

Start the backend first. With `NEXT_PUBLIC_API_URL=http://localhost:4000`, the
rewrite proxies `/api/*` to the local backend.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend **origin** only, no trailing `/api` — the target of the `/api/*` rewrite |
| `NEXT_PUBLIC_APP_URL` | Public site URL, must match the backend's `AUTH_URL` |

> **`NEXT_PUBLIC_*` values are inlined into the client bundle at build time.**
> Changing one requires a rebuild/redeploy; setting it at runtime has no effect.
> For production both are set in `netlify.toml` under `[build.environment]`, so
> Netlify builds are reproducible without dashboard configuration.

## Deploying to Netlify

1. Connect this repository to the site.
2. Build settings — leave **Base directory empty** (this repo *is* the app):
   | Setting | Value |
   | --- | --- |
   | Base directory | *(empty)* |
   | Build command | `npm run build` |
   | Publish directory | `.next` |
   | Node version | `22` |
3. Deploy. Pushes to `main` deploy automatically.

### Troubleshooting: every `/api/*` route returns 500

`next.config.ts` compiles the rewrite target into the build's routes manifest, so
a missing `NEXT_PUBLIC_API_URL` is baked in permanently and cannot be fixed
without a rebuild. `next.config.ts` now **throws** on a production build that is
missing the variable, so this cannot ship silently — but if you ever remove the
value from `netlify.toml`, expect a failed build rather than a working site.

If `/api/health` returns a plain-text `Internal Server Error`, check:

- `NEXT_PUBLIC_API_URL` is the backend origin, and that the backend is up:
  `curl -i https://<backend>/api/health`
- The build was a clean rebuild (Netlify: **Clear build cache and deploy site**),
  since a stale cache can reuse an old routes manifest.

## Security notes

- `/api/admin/*` and other privileged routes are authorised by the backend; the
  frontend only hides UI. Never treat client-side checks as access control.
- Debug/test routes that the backend protects are not linked from this app.