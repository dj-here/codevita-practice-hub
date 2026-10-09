import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { panditVerificationReviewSchema } from '@/lib/validations';
import { notificationService } from '@/lib/notifications';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const parsed = panditVerificationReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { status, rejectionReason, adminNotes } = parsed.data;

    const pandit = await prisma.panditProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!pandit) {
      return NextResponse.json({ error: 'Pandit profile not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.panditProfile.update({
        where: { id },
        data: {
          verificationStatus: status,
          rejectionReason: status === 'REJECTED' || status === 'MORE_INFO_REQUIRED' ? rejectionReason : null,
        },
      });

      // Update documents status
      await tx.verificationDocument.updateMany({
        where: { panditProfileId: id },
        data: {
          status: status === 'APPROVED' ? 'VERIFIED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING',
          adminNotes: adminNotes || null,
          reviewedAt: new Date(),
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.userId,
          action: 'PARTNER_VERIFICATION_REVIEW',
          entityType: 'PanditProfile',
          entityId: id,
          details: `Partner verification set to ${status}. Notes: ${adminNotes || 'None'}. Reason: ${rejectionReason || 'None'}`,
        },
      });

      return updatedProfile;
    });

    // Notify the Pandit
    await notificationService.send({
      userId: pandit.userId,
      type: 'SYSTEM',
      title: `Verification Status Updated: ${status}`,
      message: status === 'APPROVED'
        ? 'Congratulations! Your profile has been verified. You can now accept ceremony bookings.'
        : `Your verification status has been updated to ${status}. ${rejectionReason ? `Reason: ${rejectionReason}` : ''}`,
    });

    return NextResponse.json({ message: 'Partner verification status updated successfully', pandit: updated });
  } catch (err: any) {
    console.error('Partner verification error:', err);
    return NextResponse.json({ error: 'Failed to update partner verification' }, { status: 500 });
  }
}
