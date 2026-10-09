import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { validateStateTransition } from '@/lib/booking-engine';
import { BookingStatus } from '@/types';
import { notificationService } from '@/lib/notifications';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { targetStatus, reason } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        pandit: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isCustomer = session.userId === booking.customerId;
    const isPandit = session.userId === booking.pandit?.userId;
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPPORT';

    if (!isPandit && !isAdmin && !isCustomer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate transition
    const validation = validateStateTransition(
      booking.status as BookingStatus,
      targetStatus as BookingStatus,
      session.role
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: {
          status: targetStatus,
          ...(targetStatus === 'COMPLETED' ? { completedAt: new Date() } : {}),
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.status,
          toStatus: targetStatus,
          reason: reason || `Status updated to ${targetStatus} by ${session.name} (${session.role})`,
          changedByUserId: session.userId,
        },
      });

      return updatedBooking;
    });

    // Notify Customer
    await notificationService.send({
      userId: booking.customerId,
      type: 'BOOKING_UPDATE',
      title: `Booking #${booking.bookingNumber} is now ${targetStatus}`,
      message: `Your ceremony status has been updated to ${targetStatus}.`,
    });

    return NextResponse.json({ message: 'Booking status updated successfully', booking: updated });
  } catch (err: any) {
    console.error('Update status error:', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
