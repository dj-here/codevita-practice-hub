import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { paymentGateway } from '@/lib/payments';
import { paymentVerificationSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = paymentVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const {
      bookingId,
      transactionNumber,
      provider,
      providerOrderId,
      providerPaymentId,
      signature,
      simulatedSuccess,
    } = parsed.data;

    if (provider === 'SANDBOX_SIMULATOR' && simulatedSuccess === false) {
      return NextResponse.json({ error: 'Simulated payment was marked failed by user' }, { status: 400 });
    }

    const result = await paymentGateway.processPaymentConfirmation({
      bookingId,
      transactionNumber,
      provider,
      providerOrderId,
      providerPaymentId,
      signature,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Payment verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Payment verified and booking confirmed',
      alreadyProcessed: result.alreadyProcessed,
      transaction: result.transaction,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
