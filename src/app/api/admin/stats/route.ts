import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPPORT')) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const [
      totalCustomers,
      totalPandits,
      pendingVerifications,
      bookings,
      earnings,
      refunds,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.panditProfile.count(),
      prisma.panditProfile.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      prisma.booking.findMany({
        select: {
          id: true,
          status: true,
          totalAmount: true,
          platformCommissionAmount: true,
          panditPayoutAmount: true,
        },
      }),
      prisma.partnerEarnings.findMany({
        select: {
          netPayable: true,
          payoutStatus: true,
        },
      }),
      prisma.refundRecord.aggregate({
        _sum: { amount: true },
        where: { status: 'PROCESSED' },
      }),
    ]);

    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
    const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING_CONFIRMATION').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REFUNDED').length;

    const totalBookingValue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPlatformCommission = bookings
      .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.platformCommissionAmount, 0);

    const pendingPartnerPayouts = earnings
      .filter((e) => e.payoutStatus === 'PENDING')
      .reduce((sum, e) => sum + e.netPayable, 0);

    const completionRate = bookings.length > 0
      ? Math.round((completedBookings / bookings.length) * 100)
      : 100;

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalPandits,
        pendingVerifications,
        totalBookings: bookings.length,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        totalBookingValue,
        totalPlatformCommission,
        refundTotals: refunds._sum.amount || 0,
        pendingPartnerPayouts,
        completionRate,
      },
    });
  } catch (err: any) {
    console.error('Fetch admin stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
