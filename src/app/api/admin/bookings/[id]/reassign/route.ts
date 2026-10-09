import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isPanditAvailable } from '@/lib/booking-engine';
import { notificationService } from '@/lib/notifications';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { newPanditId, reason } = body;

    if (!newPanditId) {
      return NextResponse.json({ error: 'New pandit ID is required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { ritual: true, pandit: { include: { user: true } } },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check availability of new pandit
    const check = await isPanditAvailable(
      newPanditId,
      booking.scheduledDate,
      booking.startTime,
      booking.ritual.durationHours,
      booking.id
    );

    if (!check.available) {
      return NextResponse.json({ error: `Cannot reassign: ${check.conflictReason}` }, { status: 409 });
    }

    const newPandit = await prisma.panditProfile.findUnique({
      where: { id: newPanditId },
      include: { user: true },
    });

    if (!newPandit) {
      return NextResponse.json({ error: 'Assigned pandit not found' }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: { panditId: newPanditId },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.status,
          toStatus: booking.status,
          reason: `Reassigned to Pt. ${newPandit.user.name} by ${session.name}. Reason: ${reason || 'Operational adjustment'}`,
          changedByUserId: session.userId,
        },
      });

      // Update partner earnings association
      await tx.partnerEarnings.updateMany({
        where: { bookingId: id },
        data: { panditId: newPanditId },
      });

      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: 'BOOKING_REASSIGNMENT',
          entityType: 'Booking',
          entityId: id,
          details: `Reassigned from ${booking.pandit?.user?.name || 'Unassigned'} to ${newPandit.user.name}. Reason: ${reason}`,
        },
      });
    });

    // Notify customer
    await notificationService.send({
      userId: booking.customerId,
      type: 'BOOKING_UPDATE',
      title: 'Pandit Reassigned for Ceremony',
      message: `Your ceremony #${booking.bookingNumber} has been reassigned to Pt. ${newPandit.user.name}.`,
    });

    // Notify new pandit
    await notificationService.send({
      userId: newPandit.userId,
      type: 'BOOKING_UPDATE',
      title: 'New Ceremony Assigned',
      message: `You have been assigned to ceremony #${booking.bookingNumber} on ${booking.scheduledDate} at ${booking.startTime}.`,
    });

    return NextResponse.json({ message: 'Booking reassigned successfully' });
  } catch (err: any) {
    console.error('Reassign booking error:', err);
    return NextResponse.json({ error: 'Failed to reassign booking' }, { status: 500 });
  }
}
