# Architecture Decision Record (ADR) 001

## Title
Core Stack, Architectural Boundaries, and Database Architecture for PujaConnect

## Status
Accepted

## Context
PujaConnect is an online religious services marketplace connecting customers with verified Hindu pandits for sacred rituals, ceremonies, and pujas.
The system requires:
1. High responsiveness, mobile-first design, accessible UI with Indian aesthetic tokens.
2. Strong database consistency to prevent double-booking, protect financial snapshots, and guarantee transactional integrity.
3. Secure role-based access control (RBAC) across Customers, Pandits, Administrators, and Support staff.
4. Flexible payment engine supporting Indian market flows (Razorpay) with a realistic sandbox simulation mode for offline/developer testing.
5. Deterministic booking availability and pricing calculations on the server.
6. Zero-friction local development while providing a clear production deployment path.

## Decisions

### 1. Framework: Next.js App Router (TypeScript)
- **Choice**: Next.js App Router with React Server Components, Route Handlers, and Server Actions.
- **Rationale**: Next.js provides a unified fullstack TypeScript experience. Server-side validation, secure HTTP-only cookie sessions, and edge-friendly rendering eliminate unnecessary microservice hops while keeping business logic close to data access.

### 2. Database & ORM: Prisma ORM with SQLite for Dev / PostgreSQL for Prod
- **Choice**: Prisma ORM with SQLite for zero-config local run, coupled with PostgreSQL compatibility for production.
- **Rationale**:
  - In local environments, requiring a manual local PostgreSQL installation or Docker daemon creates onboarding friction.
  - SQLite provides 100% immediate relational transactions, foreign keys, and indexes in a self-contained database file.
  - Prisma provides type-safe queries and seamless migration to PostgreSQL (e.g. Supabase, Neon, AWS RDS) by changing the datasource provider and `DATABASE_URL`.
  - Financial calculations avoid floating-point errors by using integer rupee / paise amounts.

### 3. State Machine & Booking Concurrency
- **Choice**: Explicit booking state machine (`DRAFT` -> `PENDING_CONFIRMATION` -> `CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED`, `CANCELLED`, `REFUNDED`).
- **Rationale**: Client transitions are strictly forbidden. Double bookings are prevented by verifying overlapping time slots including buffer intervals (60-minute travel/preparation buffer) within database transactions.

### 4. Financial Snapshotting
- **Choice**: Immutable JSON snapshots stored inside the `Booking` entity (`priceSnapshot`, `cancellationPolicySnapshot`).
- **Rationale**: Future changes to ritual catalog pricing or cancellation policies must never retroactively alter existing or historical bookings.

### 5. Multi-Tiered AI Integration
- **Choice**: Pluggable AI service with Gemini API integration and an intelligent offline NLP fallback.
- **Rationale**: Core discovery must never fail when an external AI API key is missing, network is down, or rate limits are reached. A deterministic fallback guarantees 100% system availability.
