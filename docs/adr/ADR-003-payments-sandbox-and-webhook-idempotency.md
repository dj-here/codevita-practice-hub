# Architecture Decision Record (ADR) 003

## Title
Payment Provider Abstraction, Realistic Sandbox Simulator, and Webhook Idempotency

## Status
Accepted

## Context
Deploying an online booking marketplace for the Indian market requires integrating Razorpay (UPI, Credit/Debit cards, NetBanking). However:
1. In local development or automated test pipelines, live payment credentials and payment gateway accounts may be unavailable.
2. Webhook delivery from payment gateways can be retried multiple times due to temporary network fluctuations, risking duplicate status transitions or double notifications.
3. Client-side payment redirects must never be trusted as proof of payment.

## Decisions

### 1. Dual-Provider Adapter Pattern
- The `PaymentGatewayService` provides a unified interface:
  - If live Razorpay API keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are present, it invokes the official Razorpay Orders API.
  - If keys are missing or `ENABLE_SANDBOX_PAYMENTS=true`, it engages the built-in **Realistic Sandbox Simulator**.
- The simulator generates standard simulated orders (`order_sim_*`), executes cryptographic signature verification, and allows testing both success and simulated failure flows without actual money.

### 2. Idempotent Payment Processing
- Before transitioning a booking to `CONFIRMED`, `PaymentGatewayService.processPaymentConfirmation` checks `transaction.status === 'SUCCESS'`.
- If already processed, it returns immediately with `{ success: true, alreadyProcessed: true }`, ensuring webhooks or multiple client callbacks never trigger duplicate partner earnings or double notifications.

### 3. Cryptographic Signature Verification
- In live mode, Razorpay HMAC SHA-256 signatures are verified using `crypto.createHmac('sha256', secret).update(body).digest('hex')`.
- Fake frontend confirmations are rejected with a 401 Unauthorized.
