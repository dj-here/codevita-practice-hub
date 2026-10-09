import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import RitualCard from '@/components/shared/RitualCard';
import Badge from '@/components/ui/Badge';
import { Search, Flame } from 'lucide-react';

export const revalidate = 0;

export default async function RitualsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const categorySlug = searchParams.category;
  const searchTerm = searchParams.search;

  const [categories, rituals] = await Promise.all([
    prisma.ritualCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.ritual.findMany({
      where: {
        isPublished: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(searchTerm
          ? {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { languages: { contains: searchTerm } },
              ],
            }
          : {}),
      },
      include: {
        category: true,
        packages: { orderBy: { totalAmount: 'asc' } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <Badge variant="gold" className="mb-2">Catalogue & Packages</Badge>
        <h1 className="text-3xl font-serif font-black text-brand-maroon">
          Ceremonies, Pujas & Sacred Havans
        </h1>
        <p className="text-sm text-brand-stone mt-1 max-w-2xl">
          Browse our complete Vedic ritual catalogue in Hyderabad. Fixed package pricing, samagri inclusions, and vetted priests.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-6">
          <Link
            href="/rituals"
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !categorySlug
                ? 'bg-brand-maroon text-white shadow-sm'
                : 'bg-white border border-stone-200 text-brand-stone hover:bg-stone-50'
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/rituals?category=${cat.slug}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                categorySlug === cat.slug
                  ? 'bg-brand-maroon text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-brand-stone hover:bg-stone-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Rituals Grid */}
      {rituals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <Flame className="w-8 h-8 text-brand-muted mx-auto mb-2" />
          <h3 className="text-base font-semibold text-brand-charcoal mb-1">No ceremonies match your filter</h3>
          <p className="text-xs text-brand-muted mb-4">Try clearing your category or search term.</p>
          <Link href="/rituals" className="text-xs font-semibold text-brand-saffron hover:underline">
            View All Ceremonies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rituals.map((ritual) => (
            <RitualCard key={ritual.id} ritual={ritual} />
          ))}
        </div>
      )}
    </div>
  );
}
