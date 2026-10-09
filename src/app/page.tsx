import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Flame, 
  Calendar, 
  Award, 
  HelpCircle,
  PackageCheck,
  Languages
} from 'lucide-react';
import prisma from '@/lib/prisma';
import RitualCard from '@/components/shared/RitualCard';
import PanditCard from '@/components/shared/PanditCard';
import StarRating from '@/components/shared/StarRating';
import AiDiscoveryWidget from '@/components/ai/AiDiscoveryWidget';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export const revalidate = 0; // Dynamic server component

export default async function HomePage() {
  const [categories, rituals, pandits, reviews] = await Promise.all([
    prisma.ritualCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.ritual.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        packages: { orderBy: { totalAmount: 'asc' } },
      },
      take: 6,
    }),
    prisma.panditProfile.findMany({
      where: { verificationStatus: 'APPROVED', isAvailable: true },
      include: {
        user: { select: { name: true, avatarUrl: true } },
      },
      take: 3,
    }),
    prisma.review.findMany({
      where: { isVerifiedCompletedBooking: true },
      include: {
        customer: { select: { name: true } },
        pandit: { include: { user: { select: { name: true } } } },
        booking: { include: { ritual: { select: { name: true } } } },
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-cream/60 via-brand-ivory to-brand-ivory pt-12 pb-16 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sand border border-brand-gold/40 text-xs font-semibold text-brand-maroon">
                <Flame className="w-3.5 h-3.5 text-brand-saffron fill-brand-saffron" />
                <span>Premier Vedic Marketplace in Hyderabad</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-brand-maroon leading-tight">
                Authentic Vedic Pujas Conducted by{' '}
                <span className="text-brand-saffron underline decoration-brand-gold/60 decoration-wavy">
                  Verified Priests
                </span>
              </h1>

              <p className="text-base sm:text-lg text-brand-stone max-w-2xl leading-relaxed">
                Connect with vetted pandits for Griha Pravesh, Satyanarayan Puja, Havans, and sacred life milestones. Fixed transparent pricing, authentic herbal samagri delivered, and 100% verified credentials.
              </p>

              {/* Badges / Value props */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-brand-slate">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Veda Pathashala Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-brand-saffron flex-shrink-0" />
                  <span>Complete Samagri Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-brand-maroon flex-shrink-0" />
                  <span>Telugu, Sanskrit & Hindi</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/rituals">
                  <Button variant="maroon" size="lg" className="gap-2">
                    <span>Browse All Ceremonies</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pandits">
                  <Button variant="secondary" size="lg">
                    Find Verified Pandits
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Assistant Card in Hero */}
            <div className="lg:col-span-5">
              <AiDiscoveryWidget />
            </div>

          </div>
        </div>
      </section>

      {/* 2. RITUAL CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="gold" className="mb-2">Ceremonies By Occasion</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
              Explore Popular Puja Categories
            </h2>
          </div>
          <Link href="/rituals" className="text-xs font-semibold text-brand-saffron hover:underline flex items-center gap-1">
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/rituals?category=${cat.slug}`}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-brand-saffron hover:shadow-card transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-sand flex items-center justify-center text-brand-maroon mb-3 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-brand-saffron" />
              </div>
              <h3 className="font-serif font-bold text-base text-brand-charcoal group-hover:text-brand-saffron transition-colors mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED CEREMONIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="gold" className="mb-2">Most Requested Pujas</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
              Featured Ceremonies & Transparent Packages
            </h2>
            <p className="text-xs text-brand-stone mt-1">
              Every package details inclusions, pandit honorarium, herbal samagri cost, and travel allowance.
            </p>
          </div>
          <Link href="/rituals">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>All 8+ Rituals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rituals.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="bg-brand-cream/50 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="gold" className="mb-2">Simplicity & Purity</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
              How PujaConnect Works
            </h2>
            <p className="text-xs text-brand-stone mt-2">
              A dignified, stress-free booking experience with no price haggling or directory call loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle text-center relative">
              <div className="w-10 h-10 rounded-full bg-brand-maroon text-white font-serif font-bold text-base flex items-center justify-center mx-auto mb-3 shadow-sm">
                1
              </div>
              <h3 className="font-serif font-bold text-sm text-brand-charcoal mb-1.5">Select Your Puja</h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Choose the ceremony, occasion, language preference, and samagri supply option.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle text-center relative">
              <div className="w-10 h-10 rounded-full bg-brand-saffron text-white font-serif font-bold text-base flex items-center justify-center mx-auto mb-3 shadow-sm">
                2
              </div>
              <h3 className="font-serif font-bold text-sm text-brand-charcoal mb-1.5">Pick Date & Priest</h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Select your auspicious muhurat date and time. Match with verified priests in your locality.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle text-center relative">
              <div className="w-10 h-10 rounded-full bg-brand-sand text-brand-maroon border border-brand-gold font-serif font-bold text-base flex items-center justify-center mx-auto mb-3 shadow-sm">
                3
              </div>
              <h3 className="font-serif font-bold text-sm text-brand-charcoal mb-1.5">Confirm & Secure</h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Transparent itemized quotation. Confirm slot with instant online reservation protection.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-subtle text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-serif font-bold text-base flex items-center justify-center mx-auto mb-3 shadow-sm">
                4
              </div>
              <h3 className="font-serif font-bold text-sm text-brand-charcoal mb-1.5">Sacred Ceremony</h3>
              <p className="text-xs text-brand-stone leading-relaxed">
                Pandit arrives punctually with required samagri. Sacred Vedic mantras conducted with devotion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED PANDIT PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="gold" className="mb-2">Strict Trust Standards</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
              Meet Verified Priests in Hyderabad
            </h2>
            <p className="text-xs text-brand-stone mt-1">
              Every partner is verified via Government ID, Veda Pathashala certifications, and community references.
            </p>
          </div>
          <Link href="/pandits">
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>View All Verified Priests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pandits.map((pandit) => (
            <PanditCard key={pandit.id} pandit={pandit} />
          ))}
        </div>
      </section>

      {/* 6. GENUINE COMPLETED REVIEWS */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <Badge variant="gold" className="mb-2">Authentic Experiences</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
              Verified Family Testimonials
            </h2>
            <p className="text-xs text-brand-stone mt-1">
              Genuine reviews submitted only after verified completed ceremonies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={rev.rating} size="sm" />
                    <Badge variant="success">Completed Ceremony</Badge>
                  </div>
                  <p className="text-xs text-brand-charcoal italic leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-stone-100 text-xs">
                  <div className="font-semibold text-brand-maroon">{rev.customer.name}</div>
                  <div className="text-[11px] text-brand-muted">
                    {rev.booking.ritual.name} • Conducted by {rev.pandit.user.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge variant="gold" className="mb-2">Have Questions?</Badge>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-maroon">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white border border-stone-200">
            <h3 className="font-serif font-bold text-sm text-brand-maroon mb-1.5">
              How are pandits verified on PujaConnect?
            </h3>
            <p className="text-xs text-brand-stone leading-relaxed">
              Every pandit undergoes a multi-step verification process: Government identity verification (Aadhaar/PAN), traditional Veda Pathashala credentials (e.g. Tirumala TTD or reputable Gurukuls), ritual capability checks, and residential locality references before being approved.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200">
            <h3 className="font-serif font-bold text-sm text-brand-maroon mb-1.5">
              Can I provide my own puja samagri?
            </h3>
            <p className="text-xs text-brand-stone leading-relaxed">
              Yes. When selecting a package, you can choose "Customer Arranged" if you prefer to purchase materials yourself from our provided checklist, or "Full Samagri Included" where the priest brings all authentic herbs, dry coconut, and havan materials.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200">
            <h3 className="font-serif font-bold text-sm text-brand-maroon mb-1.5">
              What is the cancellation and refund policy?
            </h3>
            <p className="text-xs text-brand-stone leading-relaxed">
              We respect unforeseen changes: Cancellations made 48 hours or more before the ceremony receive a 100% refund (minus a flat ₹150 gateway processing fee). Cancellations between 24–48 hours receive a 75% refund.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200">
            <h3 className="font-serif font-bold text-sm text-brand-maroon mb-1.5">
              Which areas in Hyderabad do you serve?
            </h3>
            <p className="text-xs text-brand-stone leading-relaxed">
              We actively serve all major localities including Madhapur, Hitec City, Gachibowli, Kukatpally, Banjara Hills, Jubilee Hills, Kondapur, Miyapur, Secunderabad, Begumpet, and Dilsukhnagar.
            </p>
          </div>
        </div>
      </section>

      {/* 8. PARTNER CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <Badge variant="gold">Vedic Priests & Scholars</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              Are you a qualified Hindu priest in Hyderabad?
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Join PujaConnect as a verified partner. Receive dignified ceremony requests, set your availability, access transparent weekly payouts, and serve devotee families with respect.
            </p>
            <div className="pt-2">
              <Link href="/partner/register">
                <Button variant="primary" size="md">
                  Register as Pandit Partner &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
