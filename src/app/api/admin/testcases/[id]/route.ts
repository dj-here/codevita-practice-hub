import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    await prisma.testCase.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Test case deleted' });
  } catch (error: any) {
    console.error('Delete test case error:', error);
    return NextResponse.json(
      { error: 'Failed to delete testcase' },
      { status: 500 }
    );
  }
}
