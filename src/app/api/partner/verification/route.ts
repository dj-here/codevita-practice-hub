import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'PANDIT') {
      return NextResponse.json({ error: 'Unauthorized: Pandit account required' }, { status: 401 });
    }

    const body = await req.json();
    const { documentType, documentNumber, fileUrl } = body;

    if (!documentType || !fileUrl) {
      return NextResponse.json({ error: 'Document type and file are required' }, { status: 400 });
    }

    const pandit = await prisma.panditProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!pandit) {
      return NextResponse.json({ error: 'Pandit profile not found' }, { status: 404 });
    }

    // Create document record and set verification status to PENDING_REVIEW
    const document = await prisma.$transaction(async (tx) => {
      const doc = await tx.verificationDocument.create({
        data: {
          panditProfileId: pandit.id,
          documentType,
          documentNumber: documentNumber || null,
          fileUrl,
          status: 'PENDING',
        },
      });

      await tx.panditProfile.update({
        where: { id: pandit.id },
        data: {
          verificationStatus: 'PENDING_REVIEW',
        },
      });

      return doc;
    });

    return NextResponse.json({ message: 'Document submitted for verification review', document });
  } catch (err: any) {
    console.error('Document submission error:', err);
    return NextResponse.json({ error: 'Failed to submit document' }, { status: 500 });
  }
}
