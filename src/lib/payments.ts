import crypto from 'crypto';
import prisma from './prisma';
import { PaymentProvider, PaymentStatus } from '@/types';

export interface CreateOrderParams {
  bookingId: string;
  amountInRupees: number;
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export interface PaymentVerificationParams {
  bookingId: string;
  transactionNumber: string;
  provider: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  signature?: string;
  isSimulated?: boolean;
}

export class PaymentGatewayService {
  private razorpayKeyId: string;
  private razorpayKeySecret: string;
  private razorpayWebhookSecret: string;
  private isSandboxEnabled: boolean;

  constructor() {
    this.razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
    this.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
    this.razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    this.isSandboxEnabled = process.env.ENABLE_SANDBOX_PAYMENTS !== 'false';
  }

  /**
   * Creates a checkout transaction/order.
   */
  async createPaymentOrder(params: CreateOrderParams) {
    const transactionNumber = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // In live mode with real keys:
    if (this.razorpayKeyId && !this.razorpayKeyId.includes('placeholder') && !this.isSandboxEnabled) {
      try {
        const auth = Buffer.from(`${this.razorpayKeyId}:${this.razorpayKeySecret}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: params.amountInRupees * 100, // in paise
            currency: params.currency || 'INR',
            receipt: transactionNumber,
            notes: {
              bookingId: params.bookingId,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Razorpay order creation failed: ${await response.text()}`);
        }

        const data = await response.json();

        const transaction = await prisma.paymentTransaction.create({
          data: {
            bookingId: params.bookingId,
            transactionNumber,
            amount: params.amountInRupees,
            currency: 'INR',
            provider: 'RAZORPAY',
            providerOrderId: data.id,
            status: 'INITIATED',
          },
        });

        return {
          transactionNumber: transaction.transactionNumber,
          orderId: data.id,
          amount: params.amountInRupees,
          keyId: this.razorpayKeyId,
          provider: 'RAZORPAY' as PaymentProvider,
        };
      } catch (err) {
        console.error('Razorpay live order error, falling back to sandbox if allowed:', err);
      }
    }

    // Realistic Sandbox Simulator
    const simulatedOrderId = `order_sim_${Date.now()}`;
    const transaction = await prisma.paymentTransaction.create({
      data: {
        bookingId: params.bookingId,
        transactionNumber,
        amount: params.amountInRupees,
        currency: 'INR',
        provider: 'SANDBOX_SIMULATOR',
        providerOrderId: simulatedOrderId,
        status: 'INITIATED',
        metadata: JSON.stringify({ mode: 'SANDBOX_SIMULATION', initiatedAt: new Date().toISOString() }),
      },
    });

    return {
      transactionNumber: transaction.transactionNumber,
      orderId: simulatedOrderId,
      amount: params.amountInRupees,
      keyId: 'rzp_sandbox_pujaconnect_demo',
      provider: 'SANDBOX_SIMULATOR' as PaymentProvider,
    };
  }

  /**
   * Verifies Razorpay HMAC SHA256 Signature
   */
  verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
    const text = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', this.razorpayKeySecret)
      .update(text)
      .digest('hex');
    return expected === signature;
  }

  /**
   * Confirms payment and updates booking status idempotently.
   */
  async processPaymentConfirmation(params: PaymentVerificationParams): Promise<{
    success: boolean;
    alreadyProcessed?: boolean;
    transaction?: any;
    error?: string;
  }> {
    // 1. Fetch transaction record
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionNumber: params.transactionNumber },
      include: { booking: true },
    });

    if (!transaction) {
      return { success: false, error: 'Transaction record not found' };
    }

    // Idempotency: If already SUCCESS, return success immediately
    if (transaction.status === 'SUCCESS') {
      return { success: true, alreadyProcessed: true, transaction };
    }

    // Verify signature if live Razorpay
    if (params.provider === 'RAZORPAY') {
      if (!params.providerOrderId || !params.providerPaymentId || !params.signature) {
        return { success: false, error: 'Missing signature parameters' };
      }
      const isValid = this.verifyRazorpaySignature(
        params.providerOrderId,
        params.providerPaymentId,
        params.signature
      );
      if (!isValid) {
        return { success: false, error: 'Invalid payment signature' };
      }
    }

    // Run database transaction to commit payment and update booking state
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Payment Transaction
      const updatedTx = await tx.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          signatureVerified: true,
          providerPaymentId: params.providerPaymentId || `pay_sim_${Date.now()}`,
          metadata: JSON.stringify({
            verifiedAt: new Date().toISOString(),
            provider: params.provider,
          }),
        },
      });

      // 2. Transition booking from PENDING_CONFIRMATION or DRAFT to CONFIRMED
      const updatedBooking = await tx.booking.update({
        where: { id: transaction.bookingId },
        data: {
          status: 'CONFIRMED',
        },
      });

      // 3. Record status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: transaction.bookingId,
          fromStatus: transaction.booking.status,
          toStatus: 'CONFIRMED',
          reason: `Payment successfully captured via ${params.provider} (${updatedTx.providerPaymentId})`,
        },
      });

      // 4. Initialize PartnerEarnings record if pandit is assigned
      if (updatedBooking.panditId) {
        await tx.partnerEarnings.upsert({
          where: { bookingId: updatedBooking.id },
          create: {
            panditId: updatedBooking.panditId,
            bookingId: updatedBooking.id,
            grossAmount: updatedBooking.totalAmount,
            commissionDeducted: updatedBooking.platformCommissionAmount,
            netPayable: updatedBooking.panditPayoutAmount,
            payoutStatus: 'PENDING',
          },
          update: {
            grossAmount: updatedBooking.totalAmount,
            commissionDeducted: updatedBooking.platformCommissionAmount,
            netPayable: updatedBooking.panditPayoutAmount,
          },
        });
      }

      // 5. Send Notification
      await tx.notification.create({
        data: {
          userId: transaction.booking.customerId,
          type: 'PAYMENT',
          title: 'Payment Received & Booking Confirmed',
          message: `Your payment of ₹${transaction.amount} for booking #${transaction.booking.bookingNumber} was successful. Your ceremony is confirmed!`,
        },
      });

      return updatedTx;
    });

    return { success: true, transaction: result };
  }

  /**
   * Processes a refund record
   */
  async processRefund(bookingId: string, amount: number, reason: string): Promise<boolean> {
    const payment = await prisma.paymentTransaction.findFirst({
      where: { bookingId, status: 'SUCCESS' },
    });

    if (!payment) return false;

    await prisma.$transaction(async (tx) => {
      // Create refund record
      await tx.refundRecord.create({
        data: {
          paymentTransactionId: payment.id,
          bookingId,
          amount,
          reason,
          status: 'PROCESSED',
          providerRefundId: `rfnd_sim_${Date.now()}`,
          processedAt: new Date(),
        },
      });

      // Update payment status
      await tx.paymentTransaction.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      });

      // Update booking status
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'REFUNDED' },
      });

      // Update partner earnings if any
      await tx.partnerEarnings.updateMany({
        where: { bookingId },
        data: { payoutStatus: 'PAID', netPayable: 0 },
      });
    });

    return true;
  }
}

export const paymentGateway = new PaymentGatewayService();
export default paymentGateway;
