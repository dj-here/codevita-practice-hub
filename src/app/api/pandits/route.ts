import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locality = searchParams.get('locality');
    const language = searchParams.get('language');
    const tradition = searchParams.get('tradition');
    const verifiedOnly = searchParams.get('verified') !== 'false';

    const pandits = await prisma.panditProfile.findMany({
      where: {
        isAvailable: true,
        ...(verifiedOnly ? { verificationStatus: 'APPROVED' } : {}),
        ...(locality ? { serviceLocalities: { contains: locality } } : {}),
        ...(language ? { languages: { contains: language } } : {}),
        ...(tradition ? { traditions: { contains: tradition } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: { select: { name: true } },
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
    });

    return NextResponse.json({ pandits });
  } catch (err: any) {
    console.error('Fetch pandits error:', err);
    return NextResponse.json({ error: 'Failed to fetch pandits' }, { status: 500 });
  }
}
