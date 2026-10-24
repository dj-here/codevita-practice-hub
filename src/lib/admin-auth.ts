import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== 'ADMIN') {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { error: 'Forbidden: Admin privileges required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true as const,
    user: session.user,
  };
}
