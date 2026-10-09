import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { calculateCancellationRefund } from '@/lib/pricing';
import { notificationService } from '@/lib/notifications';
import { paymentGateway } from '@/lib/payments';

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
    const { reason } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: { where: { status: 'SUCCESS' } },
        pandit: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const isCustomer = session.userId === booking.customerId;
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPPORT';

    if (!isCustomer && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: You cannot cancel this booking' }, { status: 403 });
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
      return NextResponse.json({ error: `Cannot cancel booking with status ${booking.status}` }, { status: 400 });
    }

    // Determine refund amount
    const successfulPayment = booking.payments[0];
    let refundCalc: any = null;

    if (successfulPayment) {
      refundCalc = calculateCancellationRefund(
        successfulPayment.amount,
        booking.scheduledDate,
        booking.startTime,
        new Date()
      );
    }

    // Execute cancellation transaction
    const targetStatus = successfulPayment && refundCalc?.refundableAmount > 0 ? 'REFUNDED' : 'CANCELLED';

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: {
          status: targetStatus,
          cancellationReason: reason || 'Cancelled by user',
          cancelledAt: new Date(),
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: id,
          fromStatus: booking.status,
          toStatus: targetStatus,
          reason: `Cancelled by ${session.name}: ${reason || 'No specific reason provided'}. Refund tier: ${refundCalc?.tierDescription || 'No active payment'}`,
          changedByUserId: session.userId,
        },
      });

      // If refund is applicable, process refund record
      if (successfulPayment && refundCalc?.refundableAmount > 0) {
        await tx.refundRecord.create({
          data: {
            paymentTransactionId: successfulPayment.id,
            bookingId: id,
            amount: refundCalc.refundableAmount,
            reason: reason || 'Customer cancellation',
            status: 'PROCESSED',
            providerRefundId: `rfnd_sim_${Date.now()}`,
            processedAt: new Date(),
          },
        });

        await tx.paymentTransaction.update({
          where: { id: successfulPayment.id },
          data: { status: 'REFUNDED' },
        });

        // Cancel partner earnings
        await tx.partnerEarnings.updateMany({
          where: { bookingId: id },
          data: { payoutStatus: 'PAID', netPayable: 0 },
        });
      }
    });

    // Send notifications
    await notificationService.send({
      userId: booking.customerId,
      type: 'BOOKING_UPDATE',
      title: `Booking #${booking.bookingNumber} Cancelled`,
      message: `Your booking has been cancelled. ${refundCalc ? `Refund of ₹${refundCalc.refundableAmount} has been processed (${refundCalc.tierDescription}).` : ''}`,
    });

    if (booking.pandit?.userId) {
      await notificationService.send({
        userId: booking.pandit.userId,
        type: 'BOOKING_UPDATE',
        title: `Booking #${booking.bookingNumber} Cancelled`,
        message: `Booking scheduled for ${booking.scheduledDate} has been cancelled. Your schedule is now unblocked.`,
      });
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      status: targetStatus,
      refundDetails: refundCalc,
    });
  } catch (err: any) {
    console.error('Cancellation error:', err);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
