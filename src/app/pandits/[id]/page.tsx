import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  Languages, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Star 
} from 'lucide-react';
import prisma from '@/lib/prisma';
import StarRating from '@/components/shared/StarRating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export const revalidate = 0;

export default async function PanditDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const pandit = await prisma.panditProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: { select: { name: true, avatarUrl: true } },
      documents: {
        where: { status: 'VERIFIED' },
        select: { documentType: true, adminNotes: true },
      },
      reviews: {
        include: {
          customer: { select: { name: true } },
          booking: { include: { ritual: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!pandit) {
    notFound();
  }

  const isVerified = pandit.verificationStatus === 'APPROVED';

  // Fetch rituals to display for direct booking with this pandit
  const rituals = await prisma.ritual.findMany({
    where: { isPublished: true },
    include: { packages: true },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-brand-sand border-2 border-brand-gold flex items-center justify-center text-brand-maroon font-serif font-black text-2xl flex-shrink-0">
          {pandit.user.name.replace('Pt. ', '').charAt(0)}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
              {pandit.user.name}
            </h1>
            {isVerified && (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Partner</span>
              </Badge>
            )}
          </div>

          <p className="text-sm text-brand-muted">{pandit.traditions}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-stone pt-1">
            <StarRating rating={pandit.rating} totalReviews={pandit.reviewCount} />
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-brand-saffron" />
              <span>{pandit.experienceYears} Years Vedic Experience</span>
            </div>
            <div className="flex items-center gap-1">
              <Languages className="w-4 h-4 text-brand-saffron" />
              <span>{pandit.languages}</span>
            </div>
          </div>
        </div>

        <div>
          <Link href={`/rituals?panditId=${pandit.id}`}>
            <Button variant="maroon" size="md">
              Book Ceremony with Pt. {pandit.user.name.replace('Pt. ', '')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bio & Verifications */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="text-base font-serif font-bold text-brand-maroon">
              About & Vedic Background
            </h3>
            <p className="text-xs sm:text-sm text-brand-stone leading-relaxed whitespace-pre-line">
              {pandit.bio || 'Experienced Vedic priest certified in traditional ritual practices.'}
            </p>
          </div>

          {/* Service Localities */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-saffron" />
              <h3 className="text-base font-serif font-bold text-brand-maroon">
                Supported Localities in Hyderabad
              </h3>
            </div>
            <p className="text-xs text-brand-stone">
              Travel radius: up to {pandit.travelRadiusKm} km across:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {pandit.serviceLocalities.split(',').map((loc, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {loc.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-brand-maroon">
              Family Reviews ({pandit.reviews.length})
            </h3>

            {pandit.reviews.length === 0 ? (
              <p className="text-xs text-brand-muted">
                No public reviews submitted yet for this priest.
              </p>
            ) : (
              <div className="space-y-4">
                {pandit.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-brand-charcoal">
                        {rev.customer.name}
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-brand-stone italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <div className="text-[11px] text-brand-muted">
                      Ceremony: {rev.booking.ritual.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Verification & Instant Booking */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trust Checkbox */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Credentials</span>
            </div>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Government Photo ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Veda Pathashala Certification Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Community & Priesthood References Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Phone & Address Authenticated</span>
              </div>
            </div>
          </div>

          {/* Quick Select Ritual to Book */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h4 className="text-sm font-serif font-bold text-brand-maroon">
              Request Ceremony with Pt. {pandit.user.name.replace('Pt. ', '')}
            </h4>
            <div className="space-y-2">
              {rituals.map((r) => (
                <Link
                  key={r.id}
                  href={`/book/${r.slug}?panditId=${pandit.id}&packageId=${r.packages[0]?.id}`}
                  className="p-2.5 rounded-lg border border-stone-200 hover:border-brand-saffron flex items-center justify-between text-xs transition-colors block"
                >
                  <span className="font-medium text-brand-charcoal">{r.name}</span>
                  <span className="text-brand-saffron font-bold">Book &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
