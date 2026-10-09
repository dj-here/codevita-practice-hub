import { NextRequest, NextResponse } from 'next/server';
import { aiDiscovery } from '@/lib/ai-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || 'general';

    const guide = aiDiscovery.getPreparationGuide(slug);
    return NextResponse.json({ guide });
  } catch (err: any) {
    console.error('Preparation guide error:', err);
    return NextResponse.json({ error: 'Failed to retrieve preparation guide' }, { status: 500 });
  }
}
