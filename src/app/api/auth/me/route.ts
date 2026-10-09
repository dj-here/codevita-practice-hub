import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        customerProfile: true,
        panditProfile: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      profile: user.role === 'PANDIT' ? user.panditProfile : user.customerProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
