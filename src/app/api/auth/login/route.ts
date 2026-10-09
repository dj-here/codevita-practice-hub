import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        customerProfile: true,
        panditProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    };

    const res = NextResponse.json({
      message: 'Login successful',
      user: session,
      profile: user.role === 'PANDIT' ? user.panditProfile : user.customerProfile,
    });

    setSessionCookie(session, res);
    return res;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
