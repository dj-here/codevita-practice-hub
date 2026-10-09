'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ArrowLeft, 
  CreditCard, 
  XCircle, 
  Star,
  FileText
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import StarRating from '@/components/shared/StarRating';
import PaymentModal from '@/components/booking/PaymentModal';

function BookingDetailContent({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewPaymentSuccess = searchParams.get('success') === 'true';

  const [booking, setBooking] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      if (!res.ok) {
        throw new Error('Failed to load booking');
      }
      const data = await res.json();
      setBooking(data.booking);
    } catch (err: any) {
      setError(err.message || 'Error loading booking');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      });

    fetchBooking();
  }, [params.id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel');

      setIsCancelModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim() || reviewComment.length < 10) {
      alert('Please write at least 10 characters for your review');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          rating: reviewRating,
          ritualQualityRating: reviewRating,
          punctualityRating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      setIsReviewModalOpen(false);
      fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-brand-stone">Loading booking information...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-brand-maroon">Booking Not Found</h2>
        <p className="text-xs text-brand-muted mt-1">{error}</p>
        <Link href="/bookings" className="text-xs text-brand-saffron underline mt-4 block">
          View All Bookings
        </Link>
      </div>
    );
  }

  const priceSnapshot = booking.priceSnapshot ? JSON.parse(booking.priceSnapshot) : {};
  const isPaid = booking.payments?.some((p: any) => p.status === 'SUCCESS');
  const isCustomer = currentUser?.userId === booking.customerId;
  const isPandit = currentUser?.userId === booking.pandit?.userId;
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPPORT';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed & Scheduled</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">Ceremony In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed with Blessings</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'REFUNDED':
        return <Badge variant="danger">Cancelled & Refunded</Badge>;
      default:
        return <Badge variant="warning">Pending Payment / Confirmation</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/bookings" className="inline-flex items-center gap-1 text-xs text-brand-stone hover:text-brand-saffron">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Bookings</span>
        </Link>
      </div>

      {/* Success banner if redirected from payment */}
      {isNewPaymentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Payment Verified & Booking Confirmed!</h4>
            <p className="text-xs text-emerald-800">
              Your ceremony reservation #{booking.bookingNumber} is locked. You will receive priest coordination updates.
            </p>
          </div>
        </div>
      )}

      {/* Booking Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-brand-muted">
              #{booking.bookingNumber}
            </span>
            {getStatusBadge(booking.status)}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            {booking.ritual.name}
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Package: {booking.package.name} • Language: {booking.language}
          </p>
        </div>

        {/* Primary action controls */}
        <div className="flex flex-wrap items-center gap-2">
          {booking.status === 'PENDING_CONFIRMATION' && !isPaid && isCustomer && (
            <Button
              variant="maroon"
              size="md"
              className="gap-2"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <CreditCard className="w-4 h-4" />
              <span>Complete Payment (₹{booking.totalAmount.toLocaleString('en-IN')})</span>
            </Button>
          )}

          {booking.status === 'CONFIRMED' && (isCustomer || isAdmin) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Ceremony
            </Button>
          )}

          {booking.status === 'COMPLETED' && isCustomer && !booking.review && (
            <Button
              variant="primary"
              size="md"
              className="gap-1.5"
              onClick={() => setIsReviewModalOpen(true)}
            >
              <Star className="w-4 h-4" />
              <span>Write Review</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ceremony Details & Status History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Schedule & Address Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              Schedule & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-brand-muted block font-medium">Ceremony Date:</span>
                  <span className="font-bold text-brand-charcoal text-sm">{booking.scheduledDate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-brand-muted block font-medium">Time Window:</span>
                  <span className="font-bold text-brand-charcoal text-sm">
                    {booking.startTime} - {booking.endTime} (IST)
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-brand-maroon mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-brand-muted block font-medium">Ceremony Address:</span>
                <span className="font-semibold text-brand-charcoal block">{booking.ceremonyAddress}</span>
                <span className="text-brand-stone block mt-0.5">
                  {booking.locality}, {booking.city} - {booking.pincode}
                </span>
              </div>
            </div>

            {booking.specialInstructions && (
              <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-sand text-xs">
                <span className="font-semibold text-brand-maroon block mb-0.5">Customer Instructions:</span>
                <p className="text-brand-stone">{booking.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Assigned Priest Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              Assigned Vedic Priest
            </h3>

            {booking.pandit ? (
              <div className="flex items-start gap-4 pt-1">
                <div className="w-12 h-12 rounded-full bg-brand-sand border border-brand-gold flex items-center justify-center text-brand-maroon font-serif font-bold text-lg flex-shrink-0">
                  {booking.pandit.user.name.replace('Pt. ', '').charAt(0)}
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-brand-charcoal">
                      {booking.pandit.user.name}
                    </span>
                    <Badge variant="success">Verified</Badge>
                  </div>
                  <p className="text-brand-muted mt-0.5">{booking.pandit.traditions}</p>
                  <div className="pt-2 flex items-center gap-4 text-brand-stone">
                    <span>{booking.pandit.experienceYears} Years Exp</span>
                    <span>•</span>
                    <span>{booking.pandit.languages}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-muted">
                Assigning closest available verified priest in {booking.locality}...
              </p>
            )}
          </div>

          {/* Status Audit History Timeline */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              Booking Activity & Audit Trail
            </h3>

            <div className="space-y-4 border-l-2 border-stone-200 pl-4 ml-2">
              {booking.statusHistory?.map((entry: any, i: number) => (
                <div key={entry.id || i} className="relative text-xs space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-saffron absolute -left-[21px] top-1" />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-charcoal">
                      Status changed to {entry.toStatus}
                    </span>
                    <span className="text-[10px] text-brand-muted">
                      {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-stone-500">{entry.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Price Snapshot & Payment Info */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-subtle space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-maroon pb-3 border-b border-stone-100">
              Payment & Invoice Snapshot
            </h3>

            <div className="text-xs space-y-2 text-brand-stone">
              <div className="flex justify-between">
                <span>Pandit Fee:</span>
                <span className="font-semibold text-brand-charcoal">
                  ₹{(priceSnapshot.panditFee || booking.package.panditFee).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Samagri Pack:</span>
                <span className="font-semibold text-brand-charcoal">
                  ₹{(priceSnapshot.samagriCost || booking.package.samagriCost || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Travel Allowance:</span>
                <span className="font-semibold text-brand-charcoal">
                  ₹{(priceSnapshot.travelCost || 300).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Facilitation:</span>
                <span className="font-semibold text-brand-charcoal">
                  ₹{(priceSnapshot.platformFee || 450).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST:</span>
                <span className="font-semibold text-brand-charcoal">
                  ₹{(priceSnapshot.taxes || 81).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-xs font-bold text-brand-charcoal">Total Amount Paid</span>
              <span className="text-xl font-black text-brand-maroon">
                ₹{booking.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Payment Transactions record */}
            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
              {booking.payments?.map((txn: any) => (
                <div key={txn.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex justify-between font-mono font-medium text-brand-charcoal">
                    <span>{txn.transactionNumber}</span>
                    <Badge variant={txn.status === 'SUCCESS' ? 'success' : 'neutral'}>
                      {txn.status}
                    </Badge>
                  </div>
                  <div className="text-[10px] text-brand-muted mt-1">
                    Gateway: {txn.provider} • ID: {txn.providerPaymentId || 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Ceremony Booking"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            Please let us know why you need to cancel. Refunds are calculated according to our policy (≥ 48h prior = 100% refund, 24–48h = 75%, 12–24h = 50%).
          </p>

          <div>
            <label className="block text-xs font-semibold text-brand-slate mb-1">
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Change in family travel schedule"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isCancelling}
              onClick={handleCancel}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Rate & Review Your Ceremony"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-600">
            Share your experience with Pt. {booking.pandit?.user?.name || 'the priest'} for {booking.ritual.name}.
          </p>

          <div>
            <label className="block text-xs font-semibold text-brand-slate mb-1">
              Overall Rating
            </label>
            <StarRating
              rating={reviewRating}
              interactive
              onChange={(r) => setReviewRating(r)}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-slate mb-1">
              Your Review & Comments *
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the priest's punctuality, recitation quality, and explanation of the mantras?"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="maroon"
              size="sm"
              isLoading={isSubmittingReview}
              onClick={handleSubmitReview}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          booking={{
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            totalAmount: booking.totalAmount,
            ritual: { name: booking.ritual.name },
            package: { name: booking.package.name },
          }}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-stone-500">Loading ceremony booking details...</div>}>
      <BookingDetailContent params={params} />
    </Suspense>
  );
}
