# CodeVita Practice Hub

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.6%20App%20Router-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Judge0 CE](https://img.shields.io/badge/Judge0%20CE-Sandbox-orange.svg)](https://judge0.com/)
[![Problem Bank](https://img.shields.io/badge/Problems-220%20Validated-brightgreen.svg)](#-problem-bank--validation-engine)
[![Vitest](https://img.shields.io/badge/Vitest-38%2F38%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Passed-brightgreen.svg)](https://playwright.dev/)

**CodeVita Practice Hub** is a full-stack web platform built for engineering and computer science college students preparing for **TCS CodeVita** (Tata Consultancy Services' premier global programming contest) and technical/HR placement interviews.

---

## 1. Key Platform Features

### 💻 1. Problem Bank & Solving Arena
- **220+ Original Algorithmic Problems**: Story-style CodeVita problem statements categorized into 10 major algorithmic disciplines: *Number Theory, Arrays & Pointers, Strings, Matrices, Recursion & Backtracking, Dynamic Programming, Greedy, Graphs (BFS/DFS), Sorting & Searching, and Bit Manipulation*.
- **Balanced Difficulty Distribution**: 75 Easy (33.9%), 95 Medium (43.0%), 51 Hard (23.1%), adhering to official CodeVita contest standards.
- **Monaco Code Editor**: VS Code-powered browser editor with syntax highlighting, automatic indentation, C, C++, Java, and Python starter templates, keyboard shortcuts (`Ctrl+Enter` to run, `Ctrl+Shift+Enter` to submit), theme toggling, and per-problem debounced draft auto-saving.
- **Multi-Language Sandbox**: Submissions run in isolated sandbox environments with strict trailing-whitespace tolerance, per-case timeout enforcement, and memory capping.
- **Hidden Case Shielding**: Test case details for sample cases are visible with stdout/stderr; hidden test cases are strictly sealed and cannot be inspected by candidate browser bundles.

### ⏱️ 2. MockVita Timed Contest Mode
- **Standard Contest Presets**:
  - **90-Minute Sprint**: 3 algorithmic challenges (1 Easy, 1 Medium, 1 Hard).
  - **180-Minute Pre-Qualifier**: 6 algorithmic challenges (2 Easy, 3 Medium, 1 Hard) mirroring actual zonal rounds.
- **Custom Contest Builder**: Configure custom time limits and problem counts.
- **Server-Authoritative Timer**: Refresh-proof countdown timer calculated against server-stored `endsAt` timestamps; prevents client-side clock tampering and auto-submits upon expiry.
- **Live Scoreboard & Analytics**: Compare attempt scores against personal past performances.
- **Post-Contest Review**: Access complete solution editorials with time/space complexity analysis and reference Python implementations after contest completion.

### 🎙️ 3. Mock Interview Mode
- **Round 1: Technical Interview**:
  - Algorithmic live coding challenge (20&ndash;30 min).
  - 5&ndash;8 targeted questions evaluating OOP, DBMS, Operating Systems, Computer Networks, and language-specific internals.
- **Round 2: Managerial / HR Interview**:
  - 8&ndash;10 situational questions testing TCS core values, adaptability, rotational shift readiness, self-introduction, and relocation willingness.
- **Dual-Engine Architecture**:
  - **Claude 3.5 Sonnet Integration**: Role-locked Anthropic Claude interviewer with context-aware follow-ups.
  - **Deterministic Static Fallback**: Curated static question bank with self-rating rubric if API key is missing or calls fail.
- **4-Dimension Scorecard**: Evaluates *Communication*, *Technical Correctness*, *Problem Solving*, and *Confidence*, complemented with individualized strengths, knowledge gaps, and an actionable 7-day preparation roadmap.

### 📊 4. Student Analytics Dashboard
- Solved counts and completion percentages segmented by difficulty (*Easy, Medium, Hard*).
- Interactive topic mastery matrix across all 10 core algorithmic categories.
- Streak counter (current streak and longest consistency streak).
- Personalized weak-topic recommendations derived from candidate submission history.
- Historical record of mock contests and interview performance metrics.

### 🛡️ 5. Role-Protected Admin Operations
- Role-based middleware enforcement (`ADMIN` role required).
- High-level platform telemetry (Total Candidates, Problem Count, Evaluated Submissions, Global Acceptance Rate).
- Problem Manager: Real-time search, filter, draft/published status toggling, and new problem authoring.
- Test Case Engine: Ingest sample and hidden test cases with custom time and memory thresholds.
- Global Submissions Audit Log: Monitor live evaluations across all candidates and languages.

---

## 2. Official Contest Metadata

All contest schedules, stages, and eligibility criteria are maintained in `content/codevita-info.json` and verified against official TCS announcements:

- **Official Contest Portal**: [https://codevita.tcsapps.com](https://codevita.tcsapps.com)
- **Eligibility**: Open to undergraduate and postgraduate students in engineering, science, and related disciplines (Graduation batches 2024&ndash;2027).
- **Allowed Languages**: C, C++, Java, Python.

---

## 3. Technology Stack

- **Framework**: Next.js 13.5.6 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Database & ORM**: PostgreSQL 15 (Docker / Prod) / SQLite (`dev.db` for local zero-config dev) + Prisma ORM 5.22
- **Authentication**: NextAuth.js (Email/Password credentials + Google OAuth adapter)
- **Code Execution**: Dual-engine architecture:
  - **Dockerized Judge0 CE**: Isolated multi-language sandbox with time/memory caps.
  - **Native Local Compilers**: Fallback compiler runner (Python 3, GCC/G++, Clang, JDK).
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **Testing**: Vitest (Unit & Integration tests) + Playwright (Browser E2E)
- **AI Engine**: Anthropic Claude 3.5 Sonnet with deterministic offline rubric fallback

---

## 4. Local Development Setup (Quickstart)

### Prerequisites
- Node.js 18.x or 20.x
- npm 8.x or later
- Python 3.8+ (for problem validation and native judge execution)
- Docker & Docker Compose *(optional for local dev; required for full Judge0 sandbox)*

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*Note: The default `.env` is pre-configured for zero-setup local SQLite development (`file:./dev.db`).*

### Step 3: Initialize Database & Seed Problem Bank
```bash
# Push Prisma schema to database
npm run db:push

# Seed users, 220+ problems, 2,200+ test cases, and tags
npm run seed
```

### Step 4: Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 5. Pre-Seeded Accounts

The seed script creates the following default accounts for testing:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@codevita.hub` | `Admin@CodeVita2026` | Full admin panel (`/admin`), problem creation, test case uploads, submissions audit |
| **Demo Student** | `student@codevita.hub` | `Student@2026` | Solving arena, contests, mock interviews, progress dashboard |

---

## 6. Verification & Automated Test Suites

### 1. Validate Complete 220+ Problem Bank
Validates that every Python reference solution passes 100% of its sample and hidden test cases in the sandbox:
```bash
npm run validate:problems
```
*Expected Output: `Validation Summary: 220 / 220 Passed (0 Failed, 2207 test cases verified)`*

### 2. Unit & Integration Test Suite (Vitest)
Executes all 38 automated test cases covering authentication, judge verdicts, contest timers, admin role barriers, and hidden-case leakage prevention:
```bash
npm run test
```
*Expected Output: `Test Files  7 passed (7) | Tests  38 passed (38)`*

### 3. Playwright End-to-End Suite
Runs headless browser simulation of the complete candidate lifecycle (*Registration &rarr; Login &rarr; Problem Arena &rarr; Solution Submission &rarr; Accepted Verdict*):
```bash
npm run test:e2e
```
*Expected Output: `1 passed (candidate-journey.spec.ts)`*

### 4. Production Next.js Build
Verifies that all 14 static and dynamic App Router routes compile with zero type errors:
```bash
npm run build
```

---

## 7. Production Deployment (Docker Compose)

For production deployment on an Ubuntu/Debian Linux VPS or cloud provider:

```bash
# 1. Start PostgreSQL, Judge0 Sandbox, and Redis
docker compose up -d postgres judge0 redis

# 2. Push database schema and seed data
docker compose run --rm web npm run db:push
docker compose run --rm web npm run seed

# 3. Start web application
docker compose up -d web
```

Refer to **[DEPLOYMENT.md](file:///c:/Users/Deepak%20joshi/Downloads/project/DEPLOYMENT.md)** for detailed Nginx reverse proxy configurations, Let's Encrypt SSL instructions, and cloud deployment guides (Railway / Render + Supabase).

---

## 8. Database Backup & Disaster Recovery

Automated backup and restoration scripts with gzip compression, checksum generation, and 7-day retention cleanup:

```bash
# Create timestamped database backup
./scripts/backup-db.sh ./backups

# Restore database from backup archive
./scripts/restore-db.sh ./backups/codevita_db_YYYYMMDD_HHMMSS.sql.gz --yes
```

---

## 9. Troubleshooting Guide

### 1. Code Execution Fallback & Sandbox Notes
- **Local Dev without Docker**: If Judge0 is not running locally, the system automatically falls back to native compiler execution (`python`, `gcc`, `g++`, `javac`). Ensure Python 3 is in your system `PATH`.
- **Judge0 Connection Refused**: When running Judge0 in Docker, verify `JUDGE0_API_URL` is set to `http://localhost:2358` (or `http://judge0:2358` within Docker network) and test endpoint connectivity with `curl http://localhost:2358/system_info`.

### 2. Windows Defender & Subprocess Latency
- When running `npm run validate:problems` on Windows, background antivirus scanning can occasionally increase process creation latency. The validation script includes automatic retry logic and multi-worker parallelism to ensure deterministic validation passes.

### 3. NextAuth Session Cookie & Cross-Origin Configuration
- When deploying behind a reverse proxy (e.g., Nginx or Cloudflare), ensure `NEXTAUTH_URL` matches your public domain and that `X-Forwarded-Proto: https` is forwarded.
- For local testing, ensure requests navigate to `http://localhost:3000` rather than `http://127.0.0.1:3000` to prevent cookie origin mismatches.

### 4. Anthropic API Key & Mock Interview Fallback
- If `ANTHROPIC_API_KEY` is not provided in `.env`, the mock interview engine seamlessly transitions to the curated static interview bank without interrupting the candidate's session. A notification badge informs the candidate that the deterministic rubric engine is active.

### 5. Contest Timer Server Drift Handling
- Contest time enforcement is server-authoritative. The client receives an ISO timestamp (`endsAt`). If the candidate's device clock drifts, the server verifies `now() <= endsAt + 5s` grace period, guaranteeing fair evaluation regardless of client time settings.

---

## 10. License

This project is developed for educational and competitive programming preparation purposes. TCS and CodeVita are registered trademarks of Tata Consultancy Services Ltd.
