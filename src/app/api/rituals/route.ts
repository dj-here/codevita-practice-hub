import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');

    const rituals = await prisma.ritual.findMany({
      where: {
        isPublished: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
                { languages: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        packages: {
          orderBy: { totalAmount: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const categories = await prisma.ritualCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ rituals, categories });
  } catch (err: any) {
    console.error('Fetch rituals error:', err);
    return NextResponse.json({ error: 'Failed to fetch rituals' }, { status: 500 });
  }
}
