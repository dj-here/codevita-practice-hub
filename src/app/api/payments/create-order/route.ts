import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { paymentGateway } from '@/lib/payments';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId } = body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.customerId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
      return NextResponse.json({ error: 'This booking is already paid and confirmed' }, { status: 400 });
    }

    const orderData = await paymentGateway.createPaymentOrder({
      bookingId: booking.id,
      amountInRupees: booking.totalAmount,
      customerName: booking.customer.name,
      customerEmail: booking.customer.email,
      customerPhone: booking.customer.phone || undefined,
    });

    return NextResponse.json({ order: orderData });
  } catch (err: any) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
