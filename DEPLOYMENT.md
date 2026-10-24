# CodeVita Practice Hub &mdash; Production Deployment & Operations Guide

This guide provides step-by-step instructions for deploying, securing, scaling, and maintaining **CodeVita Practice Hub** in production environments.

---

## 1. Architecture & System Topology

```
                         [ Internet Users / Students ]
                                      │
                                      ▼ HTTPS (443)
                      ┌──────────────────────────────┐
                      │    Nginx / Cloudflare Proxy  │
                      │   (SSL Termination & Cache)  │
                      └──────────────┬───────────────┘
                                     │
                                     ▼ HTTP (3000)
                 ┌───────────────────────────────────────┐
                 │    Next.js App Server (Node 18/20)    │
                 │   App Router, Monaco Editor, NextAuth │
                 └───────┬───────────────────────┬───────┘
                         │                       │
      Prisma ORM (5432)  ▼                       ▼ Sandbox API (2358)
  ┌─────────────────────────────┐         ┌─────────────────────────────┐
  │     PostgreSQL Database     │         │      Judge0 CE Sandbox      │
  │  Users, 220+ Problems, TCs, │         │  Dockerized Isolation Engine│
  │  Submissions & Scorecards   │         │  C, C++, Java, Python 3     │
  └─────────────────────────────┘         └──────────────┬──────────────┘
                                                         │
                                                         ▼
                                          ┌─────────────────────────────┐
                                          │   Isolated Worker Sandbox   │
                                          │  • No Network Access        │
                                          │  • Memory Limit (512 MB)    │
                                          │  • Execution Time Limit (3s)│
                                          │  • PID & Output Cap (64 KB) │
                                          └─────────────────────────────┘
```

---

## 2. Environment Variables Reference

Create a production `.env` file based on `.env.example`. All variables must be set with secure values:

| Variable | Required | Default / Format | Description |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/dbname?schema=public` | Production PostgreSQL connection string with SSL mode where applicable. |
| `NEXTAUTH_URL` | **Yes** | `https://codevita.yourdomain.com` | Canonical public URL of the application. |
| `NEXTAUTH_SECRET` | **Yes** | `openssl rand -base64 32` | 32+ character cryptographic secret for signing session cookies and JWTs. |
| `JUDGE0_API_URL` | **Yes** | `http://judge0:2358` or `http://localhost:2358` | HTTP endpoint of the Judge0 CE API. |
| `JUDGE0_API_KEY` | Conditional | String (optional if self-hosted without auth) | Authentication token if using a protected or managed Judge0 provider. |
| `ANTHROPIC_API_KEY` | Optional | `sk-ant-api03-...` | Claude 3.5 Sonnet API key for dynamic mock interviews. If blank, system falls back to static rubric bank. |
| `GOOGLE_CLIENT_ID` | Optional | `*.apps.googleusercontent.com` | Google OAuth 2.0 Client ID for social login. |
| `GOOGLE_CLIENT_SECRET` | Optional | Client secret string | Google OAuth 2.0 Client Secret. |
| `ADMIN_NAME` | Optional | `System Administrator` | Default admin user created during seed. |
| `ADMIN_EMAIL` | Optional | `admin@codevita.hub` | Default admin email address. |
| `ADMIN_PASSWORD` | Optional | High-entropy string | Initial admin account password. |
| `NEXT_PUBLIC_APP_URL` | **Yes** | `https://codevita.yourdomain.com` | Client-accessible base URL. |
| `NEXT_PUBLIC_CODEVITA_PORTAL_URL` | **Yes** | `https://codevita.tcsapps.com` | Official TCS CodeVita contest portal link. |

---

## 3. Approach A: Self-Hosted Docker on a Linux VPS

Recommended for full control over Judge0 sandbox execution and lowest latency. Minimum specs: **2 vCPUs, 4 GB RAM, 40 GB SSD (Ubuntu 22.04 / 24.04 LTS or Debian 12)**.

### Step 1: Install Docker and Host Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx certbot python3-certbot-nginx

# Install Docker Engine & Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Configure Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### Step 3: Clone Codebase and Configure Environment
```bash
git clone https://github.com/your-org/codevita-practice-hub.git /opt/codevita-hub
cd /opt/codevita-hub

# Copy and configure environment variables
cp .env.example .env
nano .env
```
Ensure:
- `NEXTAUTH_SECRET` is generated via `openssl rand -base64 32`.
- `NEXTAUTH_URL` is set to your domain (e.g. `https://codevita.example.com`).
- `DATABASE_URL` is configured to `postgresql://postgres:StrongPasswordHere@postgres:5432/codevita_hub?schema=public`.

### Step 4: Build and Launch Containers
```bash
# Launch database and Judge0 sandbox in background
docker compose up -d postgres judge0 redis

# Run database migrations and seed all 220+ problems
docker compose run --rm web npm run db:push
docker compose run --rm web npm run seed

# Validate problem bank in production sandbox
docker compose run --rm web npm run validate:problems

# Start web application
docker compose up -d web
```

### Step 5: Configure Nginx Reverse Proxy with SSL
Create `/etc/nginx/sites-available/codevita`:
```nginx
server {
    listen 80;
    server_name codevita.example.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```
Enable site and obtain SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/codevita /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Issue Let's Encrypt SSL
sudo certbot --nginx -d codevita.example.com
```

### Step 6: Systemd Service for Automatic Boot
Create `/etc/systemd/system/codevita-hub.service`:
```ini
[Unit]
Description=CodeVita Practice Hub Docker Services
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/codevita-hub
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```
Enable the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable codevita-hub
```

---

## 4. Approach B: Managed Cloud Platforms (Render / Railway + Supabase)

### Step 1: Provision Managed PostgreSQL
1. Create a PostgreSQL database on **Supabase**, **Neon**, or **Railway**.
2. Enable connection pooling (`pgbouncer` on port 6543 or native pooler).
3. Copy the pooled connection string into `DATABASE_URL`.

### Step 2: Deploy Next.js Web Service on Railway / Render
1. Connect repository to Railway or Render.
2. Build Command:
   ```bash
   npm run db:push && npm run seed && npm run build
   ```
3. Start Command:
   ```bash
   npm run start
   ```
4. Set Environment Variables in dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `JUDGE0_API_URL`
   - `ANTHROPIC_API_KEY` (optional)

---

## 5. Security & Isolation Safeguards

1. **Sandbox Boundaries**:
   - Judge0 runs user submissions in unprivileged Docker containers.
   - Network interface disabled (`--net=none`) on evaluation workers.
   - Resource ceilings: 512 MB memory, 3.0s CPU time limit, max 64 processes.
2. **Hidden Test Case Confidentiality**:
   - Hidden test case inputs, outputs, and candidate standard output/error are never transferred across public APIs (`stdout: null`, `stderr: null`).
3. **Submission Throttling**:
   - Sliding-window rate limiters prevent denial-of-service on execution workers (maximum 1 submission per 3 seconds per candidate).
4. **Authoritative Timers**:
   - Contest submission timestamps are calculated on the server using `endsAt` boundaries stored in PostgreSQL. Late submissions are rejected regardless of client system clock adjustments.

---

## 6. Automated Database Backup & Disaster Recovery

### Automated Daily Cron Job
Add the following cron entry to backup daily at 02:00 AM UTC:
```bash
sudo crontab -e
```
```cron
0 2 * * * cd /opt/codevita-hub && ./scripts/backup-db.sh /var/backups/codevita >> /var/log/codevita-backup.log 2>&1
```

### Manual Backup Command
```bash
./scripts/backup-db.sh ./backups
```

### Disaster Recovery Restore Command
```bash
./scripts/restore-db.sh ./backups/codevita_db_YYYYMMDD_HHMMSS.sql.gz --yes
```

---

## 7. Zero-Downtime Application Updates

To deploy code updates with zero downtime:
```bash
cd /opt/codevita-hub
git pull origin main

# Rebuild image in background
docker compose build web

# Push schema changes if applicable
docker compose run --rm web npx prisma db push

# Perform rolling restart of web service
docker compose up -d --no-deps --build web
```
