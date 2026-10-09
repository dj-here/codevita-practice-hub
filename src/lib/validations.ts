import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number').optional().or(z.literal('')),
  role: z.enum(['CUSTOMER', 'PANDIT']).default('CUSTOMER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const bookingCreationSchema = z.object({
  ritualId: z.string().min(1, 'Ritual is required'),
  packageId: z.string().min(1, 'Package is required'),
  panditId: z.string().optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  ceremonyAddress: z.string().min(5, 'Ceremony address is required'),
  city: z.string().default('Hyderabad'),
  locality: z.string().min(2, 'Locality is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Indian PIN code').optional().or(z.literal('')),
  language: z.string().default('Telugu'),
  samagriOption: z.enum(['CUSTOMER_ARRANGED', 'PARTIAL_SAMAGRI', 'FULL_SAMAGRI_INCLUDED']).default('FULL_SAMAGRI_INCLUDED'),
  specialInstructions: z.string().max(1000).optional(),
  bookingMode: z.enum(['INSTANT', 'REQUEST_BASED']).default('INSTANT'),
});

export const bookingCancellationSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason for cancellation'),
});

export const panditOnboardingSchema = z.object({
  bio: z.string().min(20, 'Please write at least 20 characters about your experience and background'),
  experienceYears: z.number().int().min(1, 'Experience must be at least 1 year').max(60),
  traditions: z.string().min(2, 'Please specify your Vedic/ritual traditions'),
  languages: z.string().min(2, 'Please list the languages you speak and conduct pujas in'),
  serviceLocalities: z.string().min(3, 'Please select your service localities'),
  samagriProvided: z.boolean().default(true),
  travelRadiusKm: z.number().int().min(5).max(100).default(25),
});

export const panditVerificationReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED']),
  rejectionReason: z.string().optional(),
  adminNotes: z.string().optional(),
});

export const paymentVerificationSchema = z.object({
  bookingId: z.string().min(1),
  transactionNumber: z.string().min(1),
  provider: z.enum(['RAZORPAY', 'SANDBOX_SIMULATOR']),
  providerOrderId: z.string().optional(),
  providerPaymentId: z.string().optional(),
  signature: z.string().optional(),
  simulatedSuccess: z.boolean().optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  ritualQualityRating: z.number().int().min(1).max(5),
  punctualityRating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(15, 'Please provide more details in the message'),
  bookingId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export const aiDiscoverySchema = z.object({
  query: z.string().min(3, 'Query must be at least 3 characters'),
  city: z.string().default('Hyderabad'),
});
