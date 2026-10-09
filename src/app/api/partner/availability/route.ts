import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'PANDIT') {
      return NextResponse.json({ error: 'Unauthorized: Pandit account required' }, { status: 401 });
    }

    const pandit = await prisma.panditProfile.findUnique({
      where: { userId: session.userId },
    });
    if (!pandit) {
      return NextResponse.json({ error: 'Pandit profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { date, isBlocked } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const availability = await prisma.panditAvailability.upsert({
      where: {
        panditId_date: {
          panditId: pandit.id,
          date,
        },
      },
      create: {
        panditId: pandit.id,
        date,
        isBlocked: !!isBlocked,
      },
      update: {
        isBlocked: !!isBlocked,
      },
    });

    return NextResponse.json({ message: 'Availability schedule updated', availability });
  } catch (err: any) {
    console.error('Update availability error:', err);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}
