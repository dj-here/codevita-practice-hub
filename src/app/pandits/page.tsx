import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import PanditCard from '@/components/shared/PanditCard';
import Badge from '@/components/ui/Badge';
import { ShieldCheck, MapPin, Search } from 'lucide-react';

export const revalidate = 0;

export default async function PanditsPage({
  searchParams,
}: {
  searchParams: { locality?: string; language?: string };
}) {
  const locality = searchParams.locality;
  const language = searchParams.language;

  const pandits = await prisma.panditProfile.findMany({
    where: {
      isAvailable: true,
      verificationStatus: 'APPROVED',
      ...(locality ? { serviceLocalities: { contains: locality } } : {}),
      ...(language ? { languages: { contains: language } } : {}),
    },
    include: {
      user: {
        select: { name: true, avatarUrl: true },
      },
      reviews: {
        take: 1,
        include: { customer: { select: { name: true } } },
      },
    },
    orderBy: [{ rating: 'desc' }, { experienceYears: 'desc' }],
  });

  const popularLocalities = ['Madhapur', 'Gachibowli', 'Kukatpally', 'Banjara Hills', 'Secunderabad', 'Kondapur'];
  const popularLanguages = ['Telugu', 'Hindi', 'Sanskrit', 'Kannada'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gold">Hyderabad Priest Network</Badge>
          <Badge variant="success">100% Background Verified</Badge>
        </div>
        <h1 className="text-3xl font-serif font-black text-brand-maroon">
          Verified Vedic Priests in Hyderabad
        </h1>
        <p className="text-sm text-brand-stone mt-1 max-w-2xl">
          Browse vetted scholars and priests. Each partner's Veda Pathashala credentials, government identity, and community references have been independently verified.
        </p>

        {/* Locality filters */}
        <div className="pt-6 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
            Filter by Locality:
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pandits"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !locality ? 'bg-brand-saffron text-white' : 'bg-white border border-stone-200 text-stone-700'
              }`}
            >
              All Hyderabad
            </Link>
            {popularLocalities.map((loc) => (
              <Link
                key={loc}
                href={`/pandits?locality=${loc}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  locality === loc ? 'bg-brand-saffron text-white' : 'bg-white border border-stone-200 text-stone-700'
                }`}
              >
                {loc}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {pandits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <ShieldCheck className="w-8 h-8 text-brand-muted mx-auto mb-2" />
          <h3 className="text-base font-semibold text-brand-charcoal mb-1">
            No verified pandits found for this filter
          </h3>
          <p className="text-xs text-brand-muted mb-4">
            Try selecting a different locality or view all verified priests.
          </p>
          <Link href="/pandits" className="text-xs font-semibold text-brand-saffron hover:underline">
            View All Pandits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pandits.map((pandit) => (
            <PanditCard key={pandit.id} pandit={pandit} />
          ))}
        </div>
      )}
    </div>
  );
}
