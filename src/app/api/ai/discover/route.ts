import { NextRequest, NextResponse } from 'next/server';
import { aiDiscovery } from '@/lib/ai-service';
import { aiDiscoverySchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = aiDiscoverySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { query, city } = parsed.data;
    const result = await aiDiscovery.discoverServices(query, city);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('AI Discovery error:', err);
    return NextResponse.json({ error: 'Failed to process discovery query' }, { status: 500 });
  }
}
