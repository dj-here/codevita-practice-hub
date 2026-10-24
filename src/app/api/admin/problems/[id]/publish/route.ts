import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));

    const current = await prisma.problem.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!current) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const newStatus = typeof body.isPublished === 'boolean' ? body.isPublished : !current.isPublished;

    const updated = await prisma.problem.update({
      where: { id },
      data: { isPublished: newStatus },
    });

    return NextResponse.json({
      success: true,
      id: updated.id,
      isPublished: updated.isPublished,
    });
  } catch (error: any) {
    console.error('Toggle publish error:', error);
    return NextResponse.json(
      { error: 'Failed to update publication status' },
      { status: 500 }
    );
  }
}
