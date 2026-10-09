import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <Badge variant="gold" className="mb-2">Fair & Transparent</Badge>
        <h1 className="text-3xl font-serif font-black text-brand-maroon">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-1">
          Last updated: October 2026 • Applicable to all ceremony bookings on PujaConnect across Hyderabad.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-subtle">
        <p>
          At <strong>PujaConnect</strong>, we recognize that religious ceremonies and family celebrations involve complex schedules. We offer a transparent, policy-enforced refund timeline designed to balance customer flexibility with our partner priests' reserved schedules and pre-purchased perishable samagri.
        </p>

        <div className="space-y-4 pt-2">
          <h2 className="text-base font-serif font-bold text-brand-maroon">
            Cancellation Tiers & Refund Percentages
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-800 text-sm block">≥ 48 Hours Prior</span>
              <div className="text-2xl font-black text-emerald-900">100% Refund</div>
              <p className="text-[11px] text-emerald-800">
                Full refund of ceremony booking value, minus a flat ₹150 payment gateway & facilitation charge.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <span className="font-bold text-amber-800 text-sm block">24 – 48 Hours Prior</span>
              <div className="text-2xl font-black text-amber-900">75% Refund</div>
              <p className="text-[11px] text-amber-800">
                75% refund of total booking fee. A 25% compensation is reserved for the priest who reserved the schedule.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-2">
              <span className="font-bold text-orange-800 text-sm block">12 – 24 Hours Prior</span>
              <div className="text-2xl font-black text-orange-900">50% Refund</div>
              <p className="text-[11px] text-orange-800">
                50% refund. 50% retained for priest slot reservation and samagri sourcing.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
            <span className="font-bold block">&lt; 12 Hours Prior or No-Show:</span>
            <p>
              Cancellations made less than 12 hours before the ceremony start time are non-refundable. At this stage, the assigned priest has procured all custom perishable samagri, made travel arrangements, and blocked their entire day.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h2 className="text-base font-serif font-bold text-brand-maroon">
            Rescheduling Policy
          </h2>
          <p>
            Customers may reschedule an upcoming confirmed booking free of charge if requested at least 24 hours prior to the original start time, subject to priest calendar availability. If the original priest is unavailable for the new date, an alternative verified priest in your locality will be assigned.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h2 className="text-base font-serif font-bold text-brand-maroon">
            Platform Guarantee
          </h2>
          <p>
            In the rare event that an assigned priest fails to arrive due to an emergency and PujaConnect cannot arrange an immediate verified substitute, the customer is entitled to an immediate <strong>100% full refund</strong> plus an additional ₹1,000 credit toward their next ceremony.
          </p>
        </div>
      </div>
    </div>
  );
}
