import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { paymentGateway } from '@/lib/payments';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify webhook signature if secret configured
    if (webhookSecret && !webhookSecret.includes('placeholder')) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
      }
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment.captured
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const bookingId = paymentEntity?.notes?.bookingId;

      if (orderId) {
        const transaction = await prisma.paymentTransaction.findFirst({
          where: { providerOrderId: orderId },
        });

        if (transaction && transaction.status !== 'SUCCESS') {
          await paymentGateway.processPaymentConfirmation({
            bookingId: transaction.bookingId,
            transactionNumber: transaction.transactionNumber,
            provider: 'RAZORPAY',
            providerOrderId: orderId,
            providerPaymentId: paymentId,
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
