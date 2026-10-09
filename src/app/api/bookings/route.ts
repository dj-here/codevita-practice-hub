import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { bookingCreationSchema } from '@/lib/validations';
import { calculateBookingPrice, calculatePartnerPayout } from '@/lib/pricing';
import { generateBookingNumber, isPanditAvailable, minutesToTime, timeToMinutes } from '@/lib/booking-engine';
import { notificationService } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'You must be signed in to book a ritual' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bookingCreationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const {
      ritualId,
      packageId,
      panditId,
      scheduledDate,
      startTime,
      ceremonyAddress,
      city,
      locality,
      pincode,
      language,
      samagriOption,
      specialInstructions,
      bookingMode,
    } = parsed.data;

    // 1. Fetch ritual and package directly from DB to prevent client price tampering
    const ritual = await prisma.ritual.findUnique({
      where: { id: ritualId },
    });
    if (!ritual) {
      return NextResponse.json({ error: 'Selected ritual not found' }, { status: 404 });
    }

    const pkg = await prisma.servicePackage.findUnique({
      where: { id: packageId },
    });
    if (!pkg || pkg.ritualId !== ritualId) {
      return NextResponse.json({ error: 'Selected package does not belong to this ritual' }, { status: 400 });
    }

    // 2. Calculate ceremony endTime based on ritual duration
    const startMinutes = timeToMinutes(startTime);
    const durationMinutes = Math.round(ritual.durationHours * 60);
    const endMinutes = startMinutes + durationMinutes;
    const endTime = minutesToTime(endMinutes);

    // 3. If pandit is specified, check availability and conflict buffer
    let verifiedPanditId = panditId;
    if (verifiedPanditId) {
      const availabilityCheck = await isPanditAvailable(
        verifiedPanditId,
        scheduledDate,
        startTime,
        ritual.durationHours
      );

      if (!availabilityCheck.available) {
        return NextResponse.json(
          { error: `The selected pandit is not available for this time slot: ${availabilityCheck.conflictReason}` },
          { status: 409 }
        );
      }
    } else {
      // Auto-assign first available approved pandit in locality/language if instant booking
      const matchingPandits = await prisma.panditProfile.findMany({
        where: {
          verificationStatus: 'APPROVED',
          isAvailable: true,
          languages: { contains: language },
          serviceLocalities: { contains: locality },
        },
      });

      for (const p of matchingPandits) {
        const check = await isPanditAvailable(p.id, scheduledDate, startTime, ritual.durationHours);
        if (check.available) {
          verifiedPanditId = p.id;
          break;
        }
      }
    }

    // 4. Server-side price calculation
    const priceBreakdown = calculateBookingPrice({
      basePanditFee: pkg.panditFee,
      baseSamagriCost: pkg.samagriCost,
      samagriOption,
      locality,
    });

    const { panditPayoutAmount, platformCommissionAmount } = calculatePartnerPayout(priceBreakdown);
    const bookingNumber = generateBookingNumber(city);

    // 5. Create booking inside transaction
    const initialStatus = 'PENDING_CONFIRMATION';

    const newBooking = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: session.userId,
          panditId: verifiedPanditId || null,
          ritualId: ritual.id,
          packageId: pkg.id,
          status: initialStatus,
          bookingMode,
          scheduledDate,
          startTime,
          endTime,
          ceremonyAddress,
          city,
          locality,
          pincode: pincode || null,
          language,
          samagriOption,
          specialInstructions: specialInstructions || null,
          priceSnapshot: JSON.stringify(priceBreakdown),
          totalAmount: priceBreakdown.totalAmount,
          panditPayoutAmount,
          platformCommissionAmount,
          cancellationPolicySnapshot: 'Standard PujaConnect Cancellation Policy: >=48h full refund (-₹150 fee), 24-48h 75% refund, 12-24h 50% refund.',
        },
        include: {
          ritual: true,
          package: true,
          pandit: {
            include: { user: { select: { name: true, phone: true } } },
          },
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: 'DRAFT',
          toStatus: initialStatus,
          reason: 'Booking requested by customer',
          changedByUserId: session.userId,
        },
      });

      return booking;
    });

    // Notify customer
    await notificationService.send({
      userId: session.userId,
      type: 'BOOKING_UPDATE',
      title: 'Booking Request Received',
      message: `Your booking #${bookingNumber} for ${ritual.name} on ${scheduledDate} at ${startTime} has been received.`,
    });

    // If pandit assigned, notify pandit
    if (newBooking.pandit?.userId) {
      await notificationService.send({
        userId: newBooking.pandit.userId,
        type: 'BOOKING_UPDATE',
        title: 'New Ceremony Booking Request',
        message: `New booking request #${bookingNumber} for ${ritual.name} on ${scheduledDate} at ${startTime} in ${locality}.`,
      });
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: newBooking,
      priceBreakdown,
    });
  } catch (err: any) {
    console.error('Booking creation error:', err);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let bookings;
    if (session.role === 'ADMIN' || session.role === 'SUPPORT') {
      bookings = await prisma.booking.findMany({
        include: {
          ritual: true,
          package: true,
          customer: { select: { name: true, email: true, phone: true } },
          pandit: { include: { user: { select: { name: true, phone: true } } } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (session.role === 'PANDIT') {
      const panditProfile = await prisma.panditProfile.findUnique({
        where: { userId: session.userId },
      });
      if (!panditProfile) {
        return NextResponse.json({ bookings: [] });
      }

      bookings = await prisma.booking.findMany({
        where: { panditId: panditProfile.id },
        include: {
          ritual: true,
          package: true,
          customer: { select: { name: true, phone: true } },
          payments: true,
        },
        orderBy: { scheduledDate: 'asc' },
      });
    } else {
      // Customer
      bookings = await prisma.booking.findMany({
        where: { customerId: session.userId },
        include: {
          ritual: true,
          package: true,
          pandit: { include: { user: { select: { name: true, phone: true } } } },
          payments: true,
          review: true,
        },
        orderBy: { scheduledDate: 'desc' },
      });
    }

    return NextResponse.json({ bookings });
  } catch (err: any) {
    console.error('Fetch bookings error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
