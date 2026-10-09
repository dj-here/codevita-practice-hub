import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, phone, role } = parsed.data;
    const lowerEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        passwordHash,
        phone: phone || null,
        role,
        ...(role === 'CUSTOMER'
          ? {
              customerProfile: {
                create: {
                  city: 'Hyderabad',
                  preferredLanguages: 'Telugu, English',
                },
              },
            }
          : {
              panditProfile: {
                create: {
                  city: 'Hyderabad',
                  serviceLocalities: 'Madhapur, Gachibowli, Kukatpally',
                  verificationStatus: 'NOT_SUBMITTED',
                  isAvailable: true,
                },
              },
            }),
      },
      include: {
        customerProfile: true,
        panditProfile: true,
      },
    });

    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    };

    const res = NextResponse.json({
      message: 'Registration successful',
      user: session,
    });

    setSessionCookie(session, res);
    return res;
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
