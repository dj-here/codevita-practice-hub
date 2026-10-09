'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, CreditCard, Banknote } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    bookingNumber: string;
    totalAmount: number;
    ritual: { name: string };
    package: { name: string };
  };
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || 'Failed to initiate payment');
      }

      const { order } = await orderRes.json();

      // 2. Complete payment verification
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          transactionNumber: order.transactionNumber,
          provider: order.provider,
          providerOrderId: order.orderId,
          providerPaymentId: `pay_sim_${Date.now()}`,
          simulatedSuccess: !simulateFailure,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Payment Gateway" maxWidth="md">
      <div className="space-y-4">
        {/* Sandbox Notice Banner */}
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>SANDBOX TEST MODE - REALISTIC PAYMENT SIMULATOR</span>
          </div>
          <p className="text-[11px] text-amber-800">
            This checkout simulates Razorpay payment flows with server signature verification, database transactions, and idempotent webhook handlers. No real funds are deducted.
          </p>
        </div>

        {/* Order Summary */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex justify-between text-xs text-brand-muted">
            <span>Booking Reference:</span>
            <span className="font-mono font-semibold text-brand-charcoal">{booking.bookingNumber}</span>
          </div>
          <div className="flex justify-between text-xs text-brand-muted">
            <span>Ceremony:</span>
            <span className="font-medium text-brand-charcoal">{booking.ritual.name}</span>
          </div>
          <div className="flex justify-between text-xs text-brand-muted">
            <span>Service Package:</span>
            <span className="font-medium text-brand-charcoal">{booking.package.name}</span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
            <span className="text-sm font-bold text-brand-charcoal">Amount Payable:</span>
            <span className="text-xl font-bold text-brand-maroon">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
            Payment Options
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg border-2 border-brand-saffron bg-brand-cream/40 flex items-center gap-2 cursor-pointer">
              <CreditCard className="w-4 h-4 text-brand-saffron" />
              <div className="text-xs font-semibold text-brand-charcoal">UPI / Cards / NetBanking</div>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-white opacity-60 flex items-center gap-2 cursor-not-allowed">
              <Banknote className="w-4 h-4 text-stone-400" />
              <div className="text-xs text-stone-500">Pay After Ceremony (Disabled)</div>
            </div>
          </div>
        </div>

        {/* Developer simulation controls */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
              className="rounded text-brand-saffron focus:ring-brand-saffron"
            />
            <span>Test simulated payment failure</span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isProcessing} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="maroon"
            size="md"
            isLoading={isProcessing}
            onClick={handleSimulatePayment}
            className="flex-1 font-semibold"
          >
            Authorize ₹{booking.totalAmount.toLocaleString('en-IN')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
