# PujaConnect — Production-Ready Online Pandit Booking Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-teal.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest Tests](https://img.shields.io/badge/Tests-21%20Passed-brightgreen.svg)](https://vitest.dev/)

**PujaConnect** is an online religious services marketplace that connects devotees with verified Hindu pandits for sacred ceremonies, home pujas, life events (*samskaras*), and Vedic havans.

Designed for an initial launch in **Hyderabad, India**, PujaConnect provides an experience comparable in polish to a high-end home-services platform. It is not merely a telephone directory; it features fixed itemized pricing, transparent samagri supply tiers, server-side concurrency protection, automated cancellation refund policies, and operational administrative oversight.

---

## 1. Key Platform Features

### 🌸 Customer Experience
- **Ceremony Discovery**: Browse database-driven ceremonies (Griha Pravesh, Satyanarayan Puja, Ganesh Puja, Maha Rudrabhishek, etc.) filtered by occasion.
- **AI Ritual & Priest Assistant**: Natural language search (e.g. *"I need a Telugu pandit for Griha Pravesh in Kukatpally next Sunday with samagri"*) with a deterministic offline NLP fallback.
- **Service Packages**: Compare Basic, Standard, and Premium packages with explicit inclusions, exclusions, and duration.
- **Samagri Options**: Choose between *Full Samagri Included* (pandit brings all herbs, ghee, and havan woods), *Partial Samagri*, or *Customer Arranged*.
- **Booking Engine**: Live slot availability validation, time overlap protection with **60-minute travel/purification buffers**, and server-side pricing recalculation.
- **Payment Processing**: Integrated Razorpay checkout and a built-in **Realistic Sandbox Simulator** for instant verification testing.
- **Devotee Dashboard**: View upcoming pujas, review assigned priest credentials, download invoices, cancel with policy-calculated refunds, or post verified reviews.

### 🕉️ Pandit Partner Portal
- **Partner Onboarding**: Application collecting Vedic pathashala education, traditions (*Krishna Yajurveda, Smartha, Vaishnava*), languages, and Hyderabad service localities.
- **Trust & Verification**: Secure submission of identity proofs (Aadhaar, PAN, Veda Pathashala certificates). Documents are stored privately and accessible only to administrators.
- **Schedule Management**: Block dates when unavailable or engaged in temple duties.
- **Operational Schedule**: Accept bookings, inspect customer special instructions (gotra, smoke-free havan setups), and update ceremony status (*Arrived / In Progress* $\to$ *Completed*).
- **Earnings & Payouts**: Clear financial breakdown (gross dakshina, platform commission, net payable balance).

### 🛡️ Administrator Operations Portal
- **Marketplace Health Metrics**: GMV, Platform Commission, Total Devotees, Registered Priests, Refunds Processed, and Ceremony Completion Rate.
- **Partner Verification Review**: Inspect submitted credentials, approve verified partners, reject with reasons, or request additional information (all logged to `AuditLog`).
- **Emergency Reassignment**: Reassign upcoming ceremonies to alternative verified priests in the same locality with automatic customer and priest notifications.
- **Audit Trails**: Complete status history preserved for every booking state transition.

---

## 2. Architecture & Design Principles

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js (App Router)                     │
│   Tailwind CSS  •  Lucide Icons  •  Warm Indian Aesthetics  │
├─────────────────────────────────────────────────────────────┤
│                    Application API Layer                    │
│   Auth (JWT/bcrypt)  •  Zod Validation  •  RBAC Middleware  │
├──────────────────────────────┬──────────────────────────────┤
│        Booking Engine        │        Payment Engine        │
│  • 60m Travel Buffer         │  • Razorpay REST Integration │
│  • Concurrency Locking       │  • Realistic Sandbox Adapter │
│  • Immutable Price Snapshots │  • HMAC Signature Validation │
│  • Strict State Machine      │  • Webhook Idempotency       │
├──────────────────────────────┴──────────────────────────────┤
│                   Relational Database Layer                 │
│         Prisma ORM  •  SQLite (Dev) / PostgreSQL (Prod)     │
└─────────────────────────────────────────────────────────────┘
```

- **Visual Identity**: Warm ivory (`#FDFBF7`), muted saffron (`#E06D14`), deep temple maroon (`#7B1828`), and restrained gold accents (`#D4AF37`).
- **Financial Consistency**: Integer math in INR rupees and minor units prevents floating-point rounding errors.
- **Booking Concurrency**: Multi-layered checks guarantee no priest is double-booked across overlapping intervals:
  $$\max(A_{\text{start}} - 60\text{min}, B_{\text{start}}) < \min(A_{\text{end}} + 60\text{min}, B_{\text{end}})$$

---

## 3. Pre-Seeded Accounts for Testing

The database seed script initializes ready-to-test accounts:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@pujaconnect.com` | `Admin@1234` | Full operational control, partner verification & reassignment |
| **Devotee Customer** | `customer@pujaconnect.com` | `Password@123` | Active customer in Madhapur with past & upcoming bookings |
| **Verified Pandit** | `pandit.shastri@pujaconnect.com` | `Password@123` | Pt. Rama Shastri (18y exp, Krishna Yajurveda, Approved) |
| **Verified Pandit** | `pandit.narasimha@pujaconnect.com` | `Password@123` | Pt. Narasimha Murthy (12y exp, Vaishnava, Approved) |
| **Pending Pandit** | `pandit.raghav@pujaconnect.com` | `Password@123` | Pt. Raghavendra Acharya (Pending admin verification review) |

---

## 4. Quickstart Guide (Local Development)

### Prerequisites
- Node.js 18.x
- npm 8.x or later

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(The default `.env` is already configured for zero-setup SQLite development)*

### Step 3: Initialize Database & Seed Sample Data
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### Step 4: Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 5. Automated Testing

Run the Vitest test suite:
```bash
npm test
```

### Test Coverage Summary:
- **Unit Tests**:
  - `pricing.test.ts`: Base fee calculations, samagri tiers, platform commissions, and cancellation refund percentages ($\ge 48\text{h} \to 100\%$, $24\text{--}48\text{h} \to 75\%$, $12\text{--}24\text{h} \to 50\%$, $< 12\text{h} \to 0\%$).
  - `booking-engine.test.ts`: Time conversion, 60-minute travel buffer overlap collision, booking number generation, and state machine transition rules.
  - `validations.test.ts`: Zod schema validation boundaries for bookings, registrations, and reviews.
- **Integration Tests**:
  - `booking-workflow.test.ts`: Password hashing (bcrypt), JWT sessions, payment HMAC signature validation, and deterministic NLP ritual discovery.

---

## 6. Docker & Containerized Deployment

Run the complete platform with Docker:
```bash
docker-compose up --build
```
This launches the Next.js container and a healthy PostgreSQL 15 database instance.

---

## 7. Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Database connection string | `file:./dev.db` (or PostgreSQL URL) |
| `JWT_SECRET` | Secret key for HTTP-only session cookies | 64+ char random string |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `ENABLE_SANDBOX_PAYMENTS`| Enable built-in payment simulator | `true` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (optional in sandbox) | `rzp_test_placeholder` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `rzp_secret_placeholder` |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay Webhook Secret | `rzp_webhook_secret_placeholder` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | `""` *(Deterministic NLP handles offline queries)* |
| `DEFAULT_CITY` | Primary operations city | `Hyderabad` |

---

## 8. Cancellation & Refund Policy Rules

- **$\ge 48$ Hours Before Ceremony**: **100% Refund** (minus ₹150 payment gateway/processing fee).
- **24 to 48 Hours Before Ceremony**: **75% Refund** (25% retained to compensate reserved priest schedule).
- **12 to 24 Hours Before Ceremony**: **50% Refund** (50% retained for priest schedule and samagri sourcing).
- **$< 12$ Hours Before Ceremony**: **Non-Refundable** (Pandit schedule blocked and perishable materials procured).
