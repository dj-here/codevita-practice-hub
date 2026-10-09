# PujaConnect — Production Deployment Guide

This guide details how to run PujaConnect live on the public internet, from immediate instant tunnels to managed cloud hosting (Vercel, Render, Railway) and self-hosted Docker on a VPS.

---

## 1. Instant Public HTTPS Tunnel (Live Right Now!)

PujaConnect is currently exposed to the public internet via Cloudflare Quick Tunnel:

- **Live URL**: `https://portfolio-edgar-introducing-biographies.trycloudflare.com`
- **SSL / HTTPS**: Included automatically.
- **Port**: Forwarded directly to `http://localhost:3000`.

### How to re-run the tunnel anytime:
```powershell
npm run tunnel
```
Or directly:
```powershell
.\cloudflared.exe tunnel --url http://localhost:3000
```

---

## 2. Option A: Deploy to Vercel + Neon / Supabase (Recommended for Production)

Vercel is the native platform for Next.js and provides instant global CDN, edge routing, and automated SSL.

### Step 1: Push your project to GitHub
```powershell
# If you haven't set up a GitHub repository yet:
git remote add origin https://github.com/YOUR_USERNAME/pujaconnect.git
git branch -M main
git push -u origin main
```

### Step 2: Get a Free Cloud PostgreSQL Database
Sign up for a free PostgreSQL database on either:
- **[Neon.tech](https://neon.tech)** (Serverless Postgres, free tier)
- **[Supabase](https://supabase.com)** (Managed Postgres, free tier)

Copy the `DATABASE_URL` connection string provided (e.g. `postgresql://user:pass@ep-xyz.us-east-2.aws.neon.tech/pujaconnect?sslmode=require`).

### Step 3: Import Project into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your `pujaconnect` repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon/Supabase PostgreSQL connection string.
   - `JWT_SECRET`: A secure 64-character random string (e.g., run `openssl rand -base64 32`).
   - `NEXT_PUBLIC_APP_URL`: `https://your-domain.vercel.app`
   - `ENABLE_SANDBOX_PAYMENTS`: `true` (or `false` when using live Razorpay keys)
   - `RAZORPAY_KEY_ID`: `rzp_test_...`
   - `RAZORPAY_KEY_SECRET`: `...`
   - `DEFAULT_CITY`: `Hyderabad`
4. Click **Deploy**.

### Step 4: Run Prisma Migration & Seed on Cloud DB
From your local terminal with the cloud `DATABASE_URL` set in `.env`:
```powershell
npm run db:push
npm run db:seed
```
Your Vercel deployment will immediately be live and fully functional with all categories, rituals, and test accounts.

---

## 3. Option B: Deploy to Railway / Render (All-in-One)

[Railway.app](https://railway.app) and [Render.com](https://render.com) provide both a Node.js web service and a PostgreSQL database in a single dashboard.

### Railway Deployment:
1. Go to [railway.app](https://railway.app) -> **New Project** -> **Deploy from GitHub repo**.
2. Add a **PostgreSQL** plugin in Railway.
3. Link the `DATABASE_URL` environment variable from PostgreSQL to the web service.
4. Set build command: `npm run build`.
5. Set start command: `npm start`.

---

## 4. Option C: Self-Hosted Docker Compose on VPS (Ubuntu / AWS / DigitalOcean)

If deploying to a virtual private server:

```bash
# 1. Clone repository on the server
git clone https://github.com/YOUR_USERNAME/pujaconnect.git
cd pujaconnect

# 2. Configure .env file
cp .env.example .env

# 3. Start PostgreSQL and Next.js via Docker Compose
docker compose up -d --build

# 4. Initialize Database Schema & Seed Data
docker compose exec web npx prisma db push
docker compose exec web node scripts/seed.js
```

---

## 5. Production Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?schema=public` |
| `JWT_SECRET` | 32+ char secret for JWT authentication | `b85006e06d14d4af37...` |
| `NEXT_PUBLIC_APP_URL` | Public canonical URL | `https://pujaconnect.com` |
| `ENABLE_SANDBOX_PAYMENTS` | Enables mock Razorpay flow for tests | `true` (sandbox) or `false` (live) |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for verifying payment webhooks | `...` |
| `GEMINI_API_KEY` | Optional: Google Gemini API key for ritual AI | `AIzaSy...` |
| `DEFAULT_CITY` | Primary operational city | `Hyderabad` |
| `NODE_ENV` | Runtime environment | `production` |
