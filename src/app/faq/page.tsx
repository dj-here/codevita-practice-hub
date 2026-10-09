import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

export default function FaqPage() {
  const faqs = [
    {
      q: 'How does PujaConnect verify pandits?',
      a: 'We use a 4-step verification protocol: Government ID authentication (Aadhaar/PAN), verified graduation or study from accredited Veda Pathashalas (such as Tirumala TTD or registered Gurukuls), verification of ritual experience (minimum 5 years), and personal reference checks from elder priesthood scholars.',
    },
    {
      q: 'What is included in the "Full Samagri Included" package?',
      a: 'The pandit brings all 45+ sacred herbs, pure cow ghee, dry coconut halves for havan, havan samagri, Navadhanya (9 grains), red/yellow vastras, sacred threads (raksha), kumkum, turmeric, chandan, and camphor. The customer only needs to prepare fresh kitchen items like raw milk, curd, honey, and fresh fruits/flowers.',
    },
    {
      q: 'Can the pandit speak my preferred regional language?',
      a: 'Yes. Every ceremony allows you to specify your preferred language (Telugu, Hindi, Sanskrit, Kannada, or Tamil). Our matching engine pairs you with a priest who can chant in pristine Sanskrit and explain the sacred meaning in your mother tongue.',
    },
    {
      q: 'Is there any cash demand or extra payment on the day of the ceremony?',
      a: 'Absolutely not. PujaConnect operates on fixed, all-inclusive pricing. The priest dakshina, samagri cost, and travel allowance are all included in your confirmed booking quote. Tipping is purely optional at your family\'s discretion.',
    },
    {
      q: 'What happens if the assigned priest has an emergency?',
      a: 'Our operations team actively tracks all upcoming bookings. In the unlikely event of an emergency, our Hyderabad dispatch hub automatically assigns another top-rated verified priest in your locality, ensuring your auspicious muhurat is never compromised.',
    },
    {
      q: 'How do refunds work if I need to cancel?',
      a: 'Cancellations 48+ hours in advance receive a 100% refund (minus a flat ₹150 gateway fee). Cancellations between 24–48 hours receive a 75% refund, and between 12–24 hours receive a 50% refund. Cancellations under 12 hours are non-refundable due to reserved schedules and procured samagri.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gold">Answers & Support</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-maroon">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-brand-stone leading-relaxed">
          Everything you need to know about booking verified pandits, samagri preparation, and policies.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-stone-200 p-6 space-y-2 shadow-subtle">
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-brand-stone leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-brand-stone pt-4">
        Have a question not answered here?{' '}
        <Link href="/contact" className="text-brand-saffron font-bold hover:underline">
          Contact our Hyderabad Support Team
        </Link>
      </div>
    </div>
  );
}
