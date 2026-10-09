import React from 'react';
import Badge from '@/components/ui/Badge';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <Badge variant="gold" className="mb-2">Platform Agreement</Badge>
        <h1 className="text-3xl font-serif font-black text-brand-maroon">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-1">
          Effective Date: October 2026 • Governed under the laws of Telangana & India.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-subtle">
        <h2 className="text-base font-serif font-bold text-brand-maroon">
          1. Platform Role & Facilitation
        </h2>
        <p>
          PujaConnect is a managed online marketplace connecting devotees with independent, verified Hindu priests (pandits) for home religious services, havans, and lifecycle ceremonies. PujaConnect ensures rigorous credential checks, transparent pricing, and managed scheduling.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          2. Bookings, Quotations & Dakshina
        </h2>
        <p>
          All service package prices displayed are complete and include the priest dakshina, samagri allowance, travel allowance, and platform facilitation charges. Customers agree not to solicit offline cash discounts or bypass the platform.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          3. Sanctity of Sacred Ceremonies
        </h2>
        <p>
          Devotees agree to treat priests with respect and provide a clean, orderly environment suitable for Vedic rituals. Alcoholic beverages and non-vegetarian food must not be present in the ceremony area.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          4. Cancellation, Refunds & Rescheduling
        </h2>
        <p>
          Cancellations are governed strictly by the published Cancellation & Refund Policy. Refunds are processed back to the original payment method within 5–7 business days.
        </p>
      </div>
    </div>
  );
}
