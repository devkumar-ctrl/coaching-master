# Deployment Runbook

Frontend → **Netlify**, Backend → **Vercel**, from a single GitHub repository.

## Architecture

```
Browser
   │  https://<site>.netlify.app
   ▼
Netlify  ── frontend (Next.js App Router, SSR + static)
   │
   │  /api/*  ──► rewritten by frontend/next.config.ts
   ▼
Vercel   ── backend (Next.js API routes + NextAuth)
   │
   ▼
MongoDB Atlas · Cloudinary · Razorpay · SMTP
```

Because `NEXT_PUBLIC_API_URL` is only a **rewrite target**, the browser never
calls Vercel directly. Cookies stay same-origin and **no CORS setup is needed**.

> Deploy the **backend first**. You need its URL before building the frontend.

---

## Step 0 — Push the repo to GitHub

Neither service can deploy from a non-git folder, and both platforms redeploy on
push.

```bash
cd /home/awesome/Downloads/coaching-master
git init
git add .
git commit -m "Prepare monorepo for Netlify (frontend) + Vercel (backend) deploy"
gh repo create yuvabot --private --source=. --push
```

`.env.local` is gitignored, so no secrets are committed. Verify before pushing:

```bash
git ls-files | grep -E '\.env' # should list ONLY .env.example files
```

---

## Step 1 — Deploy the backend to Vercel

**Via dashboard**

1. <https://vercel.com/new> → import the repo.
2. **Root Directory** → `backend`  *(the important step)*
3. Framework Preset → **Next.js** (auto-detected).
4. Add the environment variables below (all environments).
5. Deploy.

**Via CLI**

```bash
npm i -g vercel
cd backend
vercel link          # creates the project link
vercel env pull .env.local
vercel deploy --prod # or: vercel --prod
```

### Backend environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | **yes** | `mongodb+srv://user:pass@cluster.mongodb.net/coaching` |
| `AUTH_SECRET` | **yes** | `openssl rand -base64 32` |
| `AUTH_URL` | **yes** | The **Netlify frontend** URL (see Step 2). Update after the frontend exists. |
| `CLOUDINARY_CLOUD_NAME` | **yes** | |
| `CLOUDINARY_API_KEY` | **yes** | |
| `CLOUDINARY_API_SECRET` | **yes** | |
| `SMTP_HOST` | for OTP login | `smtp.gmail.com` |
| `SMTP_PORT` | for OTP login | `465` |
| `EMAIL_USER` | for OTP login | |
| `EMAIL_PASSWORD` | for OTP login | Gmail **App Password**, not the account password |
| `EMAIL_FROM` | recommended | `"YuvaBot Lab" <you@example.com>` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | for payments | `/api/payments` returns 503 without them |
| `DAILY_API_KEY` / `DAILY_DOMAIN` | for meetings | |
| `ZOOM_*` | optional | |

> `MONGODB_URI` and `AUTH_SECRET` are **not** needed for the build step — the DB
> connection is created lazily and Auth.js defers secret validation. Only
> runtime requests need them.

### Verify

```bash
curl https://<your-backend>.vercel.app/api/health
```

---

## Step 2 — Deploy the frontend to Netlify

1. <https://app.netlify.com/start> → **Add new site** → **Import an existing project**.
2. Select the repo.
3. **Base directory** → `frontend` (matches `netlify.toml`).
4. Build command `npm run build`, publish directory is set automatically by
   `@netlify/plugin-nextjs` — **leave it blank**.
5. Add the environment variables below, then **Deploy site**.

### Frontend environment variables

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://<your-backend>.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://<your-site>.netlify.app` |

`NEXT_PUBLIC_*` values are **baked into the client bundle at build time**. If you
change one you must trigger a fresh deploy (Clear cache → re-run deploy), or the
old value is used.

### Verify

```bash
curl -I https://<your-site>.netlify.app
curl -s https://<your-site>.netlify.app/api/health   # proxied through to Vercel
```

If that returns Vercel's JSON, the rewrite is wired correctly.

---

## Step 3 — Go back and set `AUTH_URL` on Vercel

Auth.js builds its redirects against `AUTH_URL`, so it must be the **frontend**
origin. Once the Netlify URL exists:

Vercel → your project → **Settings → Environment Variables** → set
`AUTH_URL=https://<your-site>.netlify.app` → **redeploy**.

Leaving this as the Vercel URL makes sign-out and error redirects bounce users
to the API host instead of the site.

---

## Step 4 — Custom domains (optional)

| Host | Where | Note |
| --- | --- | --- |
| `yuvabot.com` | Netlify | Primary site domain |
| `api.yuvabot.com` | Vercel | Optional; then set `NEXT_PUBLIC_API_URL=https://api.yuvabot.com` and `AUTH_URL=https://yuvabot.com` |

After changing either URL, redeploy both apps.

---

## Post-deploy smoke test

```bash
SITE=https://<your-site>.netlify.app

curl -s $SITE/api/health                 # backend reachable through the proxy
open $SITE/auth/register                # create an account (sends OTP email)
open $SITE/auth/signin                   # sign in with password + OTP
open $SITE/dashboard
open $SITE/admin                         # admin role only
```

Admin-only diagnostics (all now require an admin session):

```bash
curl -s $SITE/api/health                 # public, no auth
curl -s $SITE/api/debug/collections      # 401/403 without an admin cookie
curl -s $SITE/api/test-smtp              # 401/403 without an admin cookie
```

---

## Troubleshooting

**Frontend loads but every API call 404s / returns HTML**
`NEXT_PUBLIC_API_URL` was set after the build. Rebuild the site so the value is
inlined into the bundle.

**Login loops or redirects to the Vercel domain**
`AUTH_URL` points at the backend. Set it to the frontend origin and redeploy.

**`/api/auth/*` fails with `UntrustedHost`**
Add `AUTH_TRUST_HOST=true` to the Vercel project. `trustHost: true` is already
set in `backend/auth.ts`, but setting the variable is harmless and covers
proxied deployments.

**`MongooseServerSelectionError` / "Too many connections"**
MongoDB Atlas connection limit reached. The pool is capped at
`maxPoolSize: 5` per function instance in `backend/lib/db.ts`; on the free M0
tier (100 connections) use Vercel connection pooling or upgrade to M10.

**OTP emails never arrive**
Gmail blocks ordinary logins from datacenter IPs. Verify SMTP config with the
admin-only `/api/test-smtp`, and prefer a transactional provider (Resend,
SendGrid, SES) over a Gmail account for production.

**Build fails with `key_id or oauthToken is mandatory`**
Should be fixed — Razorpay is now constructed lazily inside the request handler.
If it reappears, set `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` on Vercel.

**`/api/socket` returns 501**
Expected. In-process Socket.IO cannot run on serverless; meetings use
Daily.co / Jitsi. See the comment in `backend/app/api/socket/route.ts`.

---

## CI notes

Both apps build with **no environment variables present**, so `npm run build`
works in any clean CI runner:

```bash
npm run install:all
npm run build:backend
npm run build:frontend
```