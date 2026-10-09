import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        ritual: true,
        package: true,
        customer: { select: { id: true, name: true, email: true, phone: true } },
        pandit: {
          include: {
            user: { select: { id: true, name: true, phone: true, avatarUrl: true } },
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        payments: true,
        earnings: true,
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Role-based access control
    const isCustomer = session.userId === booking.customerId;
    const isPandit = session.userId === booking.pandit?.userId;
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPPORT';

    if (!isCustomer && !isPandit && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this booking' }, { status: 403 });
    }

    // Privacy safeguard: If pandit is not yet assigned or confirmed, don't expose customer personal phone
    let safeBooking = { ...booking };
    if (!isCustomer && !isAdmin && !isPandit) {
      safeBooking.ceremonyAddress = 'Confidential until booking confirmed';
    }

    return NextResponse.json({ booking: safeBooking });
  } catch (err: any) {
    console.error('Fetch booking detail error:', err);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}
