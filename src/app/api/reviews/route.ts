import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { reviewSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { bookingId, rating, ritualQualityRating, punctualityRating, comment } = parsed.data;

    // Verify booking eligibility
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.customerId !== session.userId) {
      return NextResponse.json({ error: 'You can only review your own bookings' }, { status: 403 });
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Reviews can only be submitted for completed ceremonies' }, { status: 400 });
    }

    if (booking.review) {
      return NextResponse.json({ error: 'A review has already been submitted for this booking' }, { status: 409 });
    }

    if (!booking.panditId) {
      return NextResponse.json({ error: 'No pandit assigned to this booking' }, { status: 400 });
    }

    // Create review and recalculate pandit aggregate rating in transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          bookingId,
          customerId: session.userId,
          panditId: booking.panditId!,
          rating,
          ritualQualityRating,
          punctualityRating,
          comment,
          isVerifiedCompletedBooking: true,
        },
      });

      // Recalculate average rating
      const allPanditReviews = await tx.review.findMany({
        where: { panditId: booking.panditId! },
        select: { rating: true },
      });

      const totalRating = allPanditReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = Number((totalRating / allPanditReviews.length).toFixed(1));

      await tx.panditProfile.update({
        where: { id: booking.panditId! },
        data: {
          rating: avgRating,
          reviewCount: allPanditReviews.length,
        },
      });

      return newReview;
    });

    return NextResponse.json({ message: 'Review submitted successfully', review });
  } catch (err: any) {
    console.error('Review submission error:', err);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const panditId = searchParams.get('panditId');

    const reviews = await prisma.review.findMany({
      where: {
        ...(panditId ? { panditId } : {}),
      },
      include: {
        customer: { select: { name: true, avatarUrl: true } },
        booking: {
          include: { ritual: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ reviews });
  } catch (err: any) {
    console.error('Fetch reviews error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
