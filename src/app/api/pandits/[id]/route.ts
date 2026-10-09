import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getSession();
    const isAdmin = session?.role === 'ADMIN' || session?.role === 'SUPPORT';
    const isOwner = session?.userId === id;

    const pandit = await prisma.panditProfile.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: isAdmin || isOwner,
            phone: isAdmin || isOwner,
            avatarUrl: true,
          },
        },
        reviews: {
          include: {
            customer: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        // Only include verification documents if admin or owner pandit
        ...(isAdmin || isOwner
          ? {
              documents: true,
            }
          : {}),
      },
    });

    if (!pandit) {
      return NextResponse.json({ error: 'Pandit profile not found' }, { status: 404 });
    }

    return NextResponse.json({ pandit });
  } catch (err: any) {
    console.error('Fetch pandit detail error:', err);
    return NextResponse.json({ error: 'Failed to fetch pandit profile' }, { status: 500 });
  }
}
