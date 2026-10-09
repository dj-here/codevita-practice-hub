import { BookingStatus, UserRole } from '@/types';
import prisma from './prisma';
import { calculateBookingPrice, calculatePartnerPayout } from './pricing';

const TRAVEL_BUFFER_MINUTES = 60; // 1-hour buffer between ceremonies for travel and purification

/**
 * Valid transitions map for the Booking State Machine
 */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PENDING_CONFIRMATION', 'CONFIRMED', 'CANCELLED'],
  PENDING_CONFIRMATION: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'COMPLETED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: ['REFUNDED'],
  REFUNDED: [],
};

/**
 * Converts "HH:MM" string to minutes from start of day (0 to 1440).
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from start of day back to "HH:MM".
 */
export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Checks whether two time windows overlap, taking into account a safety travel buffer.
 */
export function doIntervalsOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number,
  bufferMinutes: number = TRAVEL_BUFFER_MINUTES
): boolean {
  // Window A with buffer: [startA - buffer, endA + buffer]
  const bufferedStartA = Math.max(0, startA - bufferMinutes);
  const bufferedEndA = endA + bufferMinutes;

  return Math.max(bufferedStartA, startB) < Math.min(bufferedEndA, endB);
}

/**
 * Verifies if a pandit is available for a requested date and time interval.
 */
export async function isPanditAvailable(
  panditId: string,
  date: string, // "YYYY-MM-DD"
  startTimeStr: string,
  durationHours: number,
  excludeBookingId?: string
): Promise<{ available: boolean; conflictReason?: string }> {
  // 1. Check if pandit has explicitly blocked the date
  const blockedRecord = await prisma.panditAvailability.findUnique({
    where: {
      panditId_date: {
        panditId,
        date,
      },
    },
  });

  if (blockedRecord && blockedRecord.isBlocked) {
    return { available: false, conflictReason: 'Pandit has marked this date as unavailable' };
  }

  // 2. Fetch all active bookings for this pandit on this date
  const activeBookings = await prisma.booking.findMany({
    where: {
      panditId,
      scheduledDate: date,
      status: {
        in: ['PENDING_CONFIRMATION', 'CONFIRMED', 'IN_PROGRESS'],
      },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: {
      id: true,
      bookingNumber: true,
      startTime: true,
      endTime: true,
      status: true,
    },
  });

  const requestStartMin = timeToMinutes(startTimeStr);
  const requestEndMin = requestStartMin + Math.round(durationHours * 60);

  for (const booking of activeBookings) {
    const existingStartMin = timeToMinutes(booking.startTime);
    const existingEndMin = timeToMinutes(booking.endTime);

    if (doIntervalsOverlap(requestStartMin, requestEndMin, existingStartMin, existingEndMin, TRAVEL_BUFFER_MINUTES)) {
      return {
        available: false,
        conflictReason: `Overlaps with an existing ${booking.status} booking (${booking.startTime} - ${booking.endTime}) including 60m travel buffer`,
      };
    }
  }

  return { available: true };
}

/**
 * Generates an auditable booking number: e.g. PC-HYD-202610-7492
 */
export function generateBookingNumber(city: string = 'HYD'): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cityCode = city.slice(0, 3).toUpperCase();
  return `PC-${cityCode}-${dateStr}-${randomSuffix}`;
}

/**
 * Validates state transition according to role and state machine.
 */
export function validateStateTransition(
  currentStatus: BookingStatus,
  targetStatus: BookingStatus,
  userRole: UserRole
): { valid: boolean; error?: string } {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid status transition from ${currentStatus} to ${targetStatus}`,
    };
  }

  // Role permissions on transitions
  if (targetStatus === 'COMPLETED') {
    if (userRole !== 'PANDIT' && userRole !== 'ADMIN') {
      return { valid: false, error: 'Only the assigned pandit or administrator can mark a booking completed' };
    }
  }

  if (targetStatus === 'CANCELLED') {
    if (currentStatus === 'COMPLETED' || currentStatus === 'REFUNDED') {
      return { valid: false, error: 'Completed or refunded bookings cannot be cancelled' };
    }
  }

  return { valid: true };
}
