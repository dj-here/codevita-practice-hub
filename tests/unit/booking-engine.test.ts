import { describe, it, expect } from 'vitest';
import {
  timeToMinutes,
  minutesToTime,
  doIntervalsOverlap,
  generateBookingNumber,
  validateStateTransition,
} from '@/lib/booking-engine';

describe('Booking Engine & Time Concurrency Protection', () => {
  it('converts time strings to minutes and back accurately', () => {
    expect(timeToMinutes('09:30')).toBe(570);
    expect(timeToMinutes('00:00')).toBe(0);
    expect(timeToMinutes('23:59')).toBe(1439);

    expect(minutesToTime(570)).toBe('09:30');
    expect(minutesToTime(0)).toBe('00:00');
  });

  it('detects direct time interval overlap', () => {
    // A: 09:00 - 11:00 (540 to 660)
    // B: 10:00 - 12:00 (600 to 720)
    const overlaps = doIntervalsOverlap(540, 660, 600, 720, 0);
    expect(overlaps).toBe(true);
  });

  it('enforces 60-minute travel and preparation buffer between ceremonies', () => {
    // Ceremony A: 09:00 - 11:00 (540 to 660)
    // Ceremony B: 11:30 - 13:00 (690 to 780)
    // Gap is only 30 minutes. With 60 min travel buffer, this must be rejected as an overlap!
    const overlapsWithBuffer = doIntervalsOverlap(540, 660, 690, 780, 60);
    expect(overlapsWithBuffer).toBe(true);

    // Ceremony C: 12:30 - 14:00 (750 to 840)
    // Gap is 90 minutes. With 60 min buffer, this should NOT overlap.
    const noOverlap = doIntervalsOverlap(540, 660, 750, 840, 60);
    expect(noOverlap).toBe(false);
  });

  it('generates valid auditable booking numbers', () => {
    const bookingNum = generateBookingNumber('HYD');
    expect(bookingNum).toMatch(/^PC-HYD-\d{6}-\d{4}$/);
  });

  it('enforces Booking State Machine transitions', () => {
    // Valid: DRAFT -> CONFIRMED
    expect(validateStateTransition('DRAFT', 'CONFIRMED', 'CUSTOMER').valid).toBe(true);

    // Valid: CONFIRMED -> IN_PROGRESS
    expect(validateStateTransition('CONFIRMED', 'IN_PROGRESS', 'PANDIT').valid).toBe(true);

    // Valid: IN_PROGRESS -> COMPLETED by Pandit
    expect(validateStateTransition('IN_PROGRESS', 'COMPLETED', 'PANDIT').valid).toBe(true);

    // Invalid: Customer trying to mark COMPLETED
    const invalidComplete = validateStateTransition('IN_PROGRESS', 'COMPLETED', 'CUSTOMER');
    expect(invalidComplete.valid).toBe(false);

    // Invalid: COMPLETED -> CANCELLED
    const invalidCancel = validateStateTransition('COMPLETED', 'CANCELLED', 'ADMIN');
    expect(invalidCancel.valid).toBe(false);
  });
});
