import { describe, it, expect } from 'vitest';
import {
  calculateBookingPrice,
  calculatePartnerPayout,
  calculateCancellationRefund,
} from '@/lib/pricing';

describe('Pricing Engine & Commission Calculations', () => {
  it('calculates full price breakdown with FULL_SAMAGRI_INCLUDED', () => {
    const breakdown = calculateBookingPrice({
      basePanditFee: 4000,
      baseSamagriCost: 2000,
      samagriOption: 'FULL_SAMAGRI_INCLUDED',
    });

    expect(breakdown.panditFee).toBe(4000);
    expect(breakdown.samagriCost).toBe(2000);
    expect(breakdown.travelCost).toBe(300);
    expect(breakdown.platformFee).toBe(400); // 10% of 4000
    expect(breakdown.taxes).toBe(72); // 18% of 400 platform fee
    expect(breakdown.totalAmount).toBe(4000 + 2000 + 300 + 400 + 72);
    expect(breakdown.currency).toBe('INR');
  });

  it('calculates price when customer provides all samagri (CUSTOMER_ARRANGED)', () => {
    const breakdown = calculateBookingPrice({
      basePanditFee: 5000,
      baseSamagriCost: 2500,
      samagriOption: 'CUSTOMER_ARRANGED',
    });

    expect(breakdown.samagriCost).toBe(0);
    expect(breakdown.totalAmount).toBe(5000 + 0 + 300 + 500 + 90);
  });

  it('calculates price with PARTIAL_SAMAGRI (50% samagri cost)', () => {
    const breakdown = calculateBookingPrice({
      basePanditFee: 3000,
      baseSamagriCost: 1000,
      samagriOption: 'PARTIAL_SAMAGRI',
    });

    expect(breakdown.samagriCost).toBe(500);
  });

  it('correctly splits partner payout and platform commission', () => {
    const breakdown = calculateBookingPrice({
      basePanditFee: 4000,
      baseSamagriCost: 1500,
      samagriOption: 'FULL_SAMAGRI_INCLUDED',
    });

    const split = calculatePartnerPayout(breakdown);

    // Pandit gets: 85% of 4000 (3400) + 100% samagri (1500) + travel (300) = 5200
    expect(split.panditPayoutAmount).toBe(3400 + 1500 + 300);
    // Platform commission is remainder of totalAmount
    expect(split.platformCommissionAmount).toBe(breakdown.totalAmount - split.panditPayoutAmount);
  });
});

describe('Cancellation & Refund Policy Calculations', () => {
  const scheduledDate = '2026-10-20';
  const startTime = '10:00';

  it('grants 100% refund (minus flat ₹150 fee) when cancelled >= 48 hours prior', () => {
    // 72 hours before
    const cancelTime = new Date('2026-10-17T10:00:00+05:30');
    const result = calculateCancellationRefund(5000, scheduledDate, startTime, cancelTime);

    expect(result.refundPercentage).toBe(100);
    expect(result.cancellationFee).toBe(150);
    expect(result.refundableAmount).toBe(4850);
  });

  it('grants 75% refund when cancelled between 24 and 48 hours prior', () => {
    // 30 hours before
    const cancelTime = new Date('2026-10-19T04:00:00+05:30');
    const result = calculateCancellationRefund(5000, scheduledDate, startTime, cancelTime);

    expect(result.refundPercentage).toBe(75);
    expect(result.refundableAmount).toBe(3750);
    expect(result.cancellationFee).toBe(1250);
  });

  it('grants 50% refund when cancelled between 12 and 24 hours prior', () => {
    // 16 hours before
    const cancelTime = new Date('2026-10-19T18:00:00+05:30');
    const result = calculateCancellationRefund(4000, scheduledDate, startTime, cancelTime);

    expect(result.refundPercentage).toBe(50);
    expect(result.refundableAmount).toBe(2000);
    expect(result.cancellationFee).toBe(2000);
  });

  it('grants 0% refund when cancelled < 12 hours prior', () => {
    // 4 hours before
    const cancelTime = new Date('2026-10-20T06:00:00+05:30');
    const result = calculateCancellationRefund(5000, scheduledDate, startTime, cancelTime);

    expect(result.refundPercentage).toBe(0);
    expect(result.refundableAmount).toBe(0);
    expect(result.cancellationFee).toBe(5000);
  });
});
