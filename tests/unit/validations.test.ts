import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  bookingCreationSchema,
  reviewSchema,
} from '@/lib/validations';

describe('Zod Validation Boundaries', () => {
  it('validates user registration', () => {
    const valid = registerSchema.safeParse({
      name: 'Rama Shastri',
      email: 'shastri@example.com',
      password: 'SecurePassword123',
      phone: '9849012345',
      role: 'PANDIT',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = registerSchema.safeParse({
      name: 'Test User',
      email: 'not-an-email',
      password: '123',
    });
    expect(invalidEmail.success).toBe(false);
  });

  it('validates booking creation format and requirements', () => {
    const validBooking = bookingCreationSchema.safeParse({
      ritualId: 'rit_123',
      packageId: 'pkg_456',
      scheduledDate: '2026-10-25',
      startTime: '09:00',
      ceremonyAddress: 'Flat 402, Aditya Sunshine, Madhapur',
      city: 'Hyderabad',
      locality: 'Madhapur',
      pincode: '500081',
      language: 'Telugu',
      samagriOption: 'FULL_SAMAGRI_INCLUDED',
    });
    expect(validBooking.success).toBe(true);

    // Invalid date format
    const invalidDate = bookingCreationSchema.safeParse({
      ritualId: 'rit_123',
      packageId: 'pkg_456',
      scheduledDate: '25-10-2026', // wrong format
      startTime: '09:00',
      ceremonyAddress: 'Madhapur',
      locality: 'Madhapur',
    });
    expect(invalidDate.success).toBe(false);
  });

  it('validates review ratings boundaries', () => {
    const validReview = reviewSchema.safeParse({
      bookingId: 'bk_123',
      rating: 5,
      ritualQualityRating: 5,
      punctualityRating: 5,
      comment: 'Excellent ceremony with pure Sanskrit recitation.',
    });
    expect(validReview.success).toBe(true);

    // Rating > 5
    const outOfBounds = reviewSchema.safeParse({
      bookingId: 'bk_123',
      rating: 6,
      ritualQualityRating: 5,
      punctualityRating: 5,
      comment: 'Valid comment length here',
    });
    expect(outOfBounds.success).toBe(false);
  });
});
