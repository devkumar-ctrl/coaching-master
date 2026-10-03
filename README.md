# YuvaBot Lab — Backend

Next.js 15 API routes, Auth.js v5 authentication and the data layer for YuvaBot
Lab. Deployed to **Vercel**. MongoDB runs on Atlas.

The frontend lives in a separate repository and is deployed to Netlify:
[`coaching-master-frontend`](https://github.com/devkumar-ctrl/coaching-master-frontend).

## Architecture

```
Browser
   │  https://<site>.netlify.app
   ▼
Netlify ── frontend (proxies /api/* here)
   │
   ▼
Vercel  ── this app (API routes + Auth.js)
   │
   ▼
MongoDB Atlas · Cloudinary · Razorpay · SMTP
```

This app is only reached through the frontend's `/api/*` rewrite, so all requests
are same-origin from the browser's point of view and **no CORS configuration is
required**.

## Requirements

- Node.js 22
- A MongoDB connection string (Atlas or local)

## Local development

```bash
npm ci
cp .env.example .env.local     # then fill in the values
npm run dev
```

`MONGODB_URI` is connected **lazily**, so it is not required for `npm run build` —
only when a request actually touches the database. Build the backend first, then
point the frontend's `NEXT_PUBLIC_API_URL` at the resulting URL.

## Environment variables

See `.env.example` for the annotated list. The essentials:

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | yes (runtime) | MongoDB Atlas connection string |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `AUTH_URL` | yes | **Frontend** origin, not this app's own origin |
| `CLOUDINARY_*` | yes for uploads | Image uploads |
| `SMTP_*` / `EMAIL_*` | yes for OTP login | Nodemailer; Gmail needs a 16-char App Password |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | optional | Without these `/api/payments` returns 503 |
| `NEXT_PUBLIC_APP_URL` | yes | Public site URL |

> **Names are `AUTH_SECRET` / `AUTH_URL`** — this is NextAuth v5 (Auth.js v5).
> The legacy `NEXTAUTH_*` names are not read.

`AUTH_URL` must be the **frontend** origin (`https://<site>.netlify.app`).
Auth.js builds signin/signout/callback redirects and the `callback-url` cookie
against this value, so pointing it at the Vercel origin breaks the login flow.

## Deploying to Vercel

1. Connect this repository to the project.
2. **Root Directory must be empty** — this repository *is* the app.
3. Framework is detected as Next.js (`vercel.json` sets `framework: nextjs`).
4. Set the environment variables above in the Vercel dashboard.
5. Deploy.

## Smoke test

```bash
curl -i https://<your-app>.vercel.app/api/health      # expect 200 {"status":"ok"}
curl -i https://<your-app>.vercel.app/api/auth/session
```

Then, through the frontend domain, `/api/health` and `/api/auth/session` should
return the same. If they return a plain-text `Internal Server Error` only via the
Netlify domain, the frontend's rewrite target is wrong — see the frontend README.

## Docs

- `EMAIL_SETUP.md` — SMTP / app-password setup
- `VERCEL_DEPLOYMENT_GUIDE.md` — Vercel deployment notes
- `YUVABOT_CONTENT.md` — source content for seeding courses and testimonials