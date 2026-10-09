# Architecture Decision Record (ADR) 002

## Title
Booking Concurrency Control, 60-Minute Travel Buffers, and Strict Server-Enforced State Machine

## Status
Accepted

## Context
In an on-demand religious marketplace, ceremony timings are sacred and must not be double-booked. Moreover, Hindu priests in metropolitan areas like Hyderabad require travel, purification, and preparation time between ceremonies across different localities (e.g. Madhapur to Kukatpally).

Without rigorous server-side concurrency control:
1. Two customers booking simultaneous ceremonies for the same priest could create overlapping commitments.
2. Back-to-back bookings with zero travel buffer cause priest delays, damaging customer trust.
3. Arbitrary client-side status mutation could allow unauthorized transition of unconfirmed bookings to completed.

## Decisions

### 1. Dual-Interval Overlap Detection with 60-Minute Travel Buffer
- Every ceremony booking calculates `startTime` to `endTime` (based on ritual duration).
- The availability validator expands the occupied window to `[startTime - 60min, endTime + 60min]`.
- Overlap detection checks:
  $$\max(A_{\text{start}} - 60, B_{\text{start}}) < \min(A_{\text{end}} + 60, B_{\text{end}})$$
- If an overlap exists with an existing `PENDING_CONFIRMATION`, `CONFIRMED`, or `IN_PROGRESS` booking, the new request is rejected with a 409 Conflict.

### 2. Strict State Machine
- Allowed transitions:
  - `DRAFT` $\to$ `PENDING_CONFIRMATION`, `CONFIRMED`, `CANCELLED`
  - `PENDING_CONFIRMATION` $\to$ `CONFIRMED`, `CANCELLED`
  - `CONFIRMED` $\to$ `IN_PROGRESS`, `CANCELLED`, `COMPLETED`
  - `IN_PROGRESS` $\to$ `COMPLETED`, `CANCELLED`
  - `CANCELLED` $\to$ `REFUNDED`
- Only assigned pandits or admins may transition to `COMPLETED`.
- Completed or refunded ceremonies can never be cancelled.

### 3. Server-Side Price Recalculation & Immutable Snapshotting
- Prices submitted by clients are completely discarded.
- Totals are computed server-side from base package records + samagri option + standard travel fee + platform fee + tax.
- Once created, a JSON snapshot is stored inside the `Booking` record to protect existing bookings against catalog price fluctuations.
