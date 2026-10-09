import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { aiDiscovery } from '@/lib/ai-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const ritual = await prisma.ritual.findUnique({
      where: { slug },
      include: {
        category: true,
        packages: {
          orderBy: { totalAmount: 'asc' },
        },
      },
    });

    if (!ritual) {
      return NextResponse.json({ error: 'Ritual not found' }, { status: 404 });
    }

    // Include structured preparation guide
    const preparationGuide = aiDiscovery.getPreparationGuide(slug);

    return NextResponse.json({ ritual, preparationGuide });
  } catch (err: any) {
    console.error('Fetch ritual error:', err);
    return NextResponse.json({ error: 'Failed to fetch ritual' }, { status: 500 });
  }
}
