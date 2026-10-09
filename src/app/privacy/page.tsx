import React from 'react';
import Badge from '@/components/ui/Badge';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <Badge variant="gold" className="mb-2">Data Protection</Badge>
        <h1 className="text-3xl font-serif font-black text-brand-maroon">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-1">
          Effective Date: October 2026 • Compliant with Indian Digital Personal Data Protection (DPDP) Act.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-subtle">
        <h2 className="text-base font-serif font-bold text-brand-maroon">
          1. Information We Collect
        </h2>
        <p>
          We collect user contact information (name, email, phone number), ceremony location address, and ritual preferences necessary to coordinate ceremony bookings. For pandits, we additionally collect identity and credential verification records.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          2. Privacy Safeguards
        </h2>
        <p>
          Customer ceremony addresses and phone numbers are never made public or displayed to unassigned priests. Personal details are shared only with the specific verified priest assigned to your confirmed ceremony.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          3. Partner Verification Documents
        </h2>
        <p>
          Government IDs (Aadhaar/PAN) and Pathashala certificates submitted by priests are stored in encrypted private storage, accessible solely by authorized administrative personnel for background verification.
        </p>

        <h2 className="text-base font-serif font-bold text-brand-maroon">
          4. Payment Security
        </h2>
        <p>
          We never store full card numbers, CVVs, or bank net banking credentials. All payment processing is handled through PCI-DSS compliant Indian payment gateways (Razorpay).
        </p>
      </div>
    </div>
  );
}
