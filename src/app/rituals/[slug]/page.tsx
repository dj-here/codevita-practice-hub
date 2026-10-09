import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  ShieldCheck, 
  Languages, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Package, 
  Users 
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { aiDiscovery } from '@/lib/ai-service';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export const revalidate = 0;

export default async function RitualDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const ritual = await prisma.ritual.findUnique({
    where: { slug },
    include: {
      category: true,
      packages: {
        orderBy: { totalAmount: 'asc' },
      },
    },
  });

  if (!ritual) {
    notFound();
  }

  const prepGuide = aiDiscovery.getPreparationGuide(slug);
  const samagriList = JSON.parse(ritual.samagriChecklist || '[]');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-brand-cream to-brand-ivory p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-subtle">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">{ritual.category.name}</Badge>
            <Badge variant="success">Verified Vedic Priests</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-maroon">
            {ritual.name}
          </h1>

          <p className="text-sm sm:text-base text-brand-stone leading-relaxed">
            {ritual.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-stone-200/80 text-xs">
            <div>
              <span className="text-brand-muted block font-medium">Duration:</span>
              <span className="font-semibold text-brand-charcoal">~{ritual.durationHours} Hours</span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Priests:</span>
              <span className="font-semibold text-brand-charcoal">{ritual.priestCountRequired} Verified Priest(s)</span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Languages:</span>
              <span className="font-semibold text-brand-charcoal">{ritual.languages}</span>
            </div>
            <div>
              <span className="text-brand-muted block font-medium">Traditions:</span>
              <span className="font-semibold text-brand-charcoal">{ritual.traditions}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Packages Grid */}
      <div className="space-y-6">
        <div>
          <Badge variant="gold" className="mb-2">Choose Service Package</Badge>
          <h2 className="text-2xl font-serif font-bold text-brand-maroon">
            Transparent Ceremony Packages
          </h2>
          <p className="text-xs text-brand-stone mt-1">
            Prices are guaranteed and include pandit dakshina, platform fee, and GST. No hidden fees or extra demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ritual.packages.map((pkg) => {
            const inclusions = JSON.parse(pkg.inclusions || '[]');
            const exclusions = JSON.parse(pkg.exclusions || '[]');
            const isStandard = pkg.tier === 'STANDARD';

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl bg-white border p-6 flex flex-col justify-between transition-all ${
                  isStandard
                    ? 'border-2 border-brand-saffron shadow-card relative ring-1 ring-brand-saffron/20'
                    : 'border-stone-200 shadow-subtle'
                }`}
              >
                {isStandard && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-brand-saffron text-white text-[11px] font-bold shadow-sm uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-bold text-lg text-brand-charcoal">
                      {pkg.name}
                    </h3>
                  </div>

                  <p className="text-xs text-brand-muted mb-4">{pkg.description}</p>

                  <div className="p-3.5 rounded-xl bg-brand-cream/60 border border-brand-sand mb-5">
                    <div className="text-2xl font-black text-brand-maroon">
                      ₹{pkg.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-brand-stone space-y-0.5 mt-1 pt-1 border-t border-brand-sand/60">
                      <div>Pandit Fee: ₹{pkg.panditFee.toLocaleString('en-IN')}</div>
                      {pkg.samagriCost > 0 && <div>Samagri Kit: ₹{pkg.samagriCost.toLocaleString('en-IN')}</div>}
                      <div>Travel Allowance: ₹{pkg.travelCost.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block">
                      Inclusions:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {inclusions.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exclusions */}
                  {exclusions.length > 0 && (
                    <div className="space-y-2 mb-6 pt-3 border-t border-stone-100">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block">
                        Exclusions:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-500">
                        {exclusions.map((exc: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <Link href={`/book/${ritual.slug}?packageId=${pkg.id}`}>
                    <Button
                      variant={isStandard ? 'primary' : 'outline'}
                      size="md"
                      className="w-full gap-2 font-semibold"
                    >
                      <span>Book this Package</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Preparation & Samagri Checklist Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Preparation Guide */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-saffron" />
            <h3 className="font-serif font-bold text-lg text-brand-maroon">
              {prepGuide.title}
            </h3>
          </div>

          <p className="text-xs text-brand-stone leading-relaxed bg-brand-cream/60 p-3.5 rounded-xl border border-brand-sand">
            <span className="font-semibold text-brand-maroon block mb-1">Spiritual Significance:</span>
            {prepGuide.spiritualSignificance}
          </p>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
              Family & Household Prerequisites:
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {prepGuide.householdPrerequisites.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-saffron mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
              Do's and Don'ts:
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {prepGuide.dosAndDonts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-500 italic">
            * Note: {prepGuide.notes}
          </div>
        </div>

        {/* Samagri Checklist Preview */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-maroon" />
            <h3 className="font-serif font-bold text-lg text-brand-maroon">
              Authentic Samagri Checklist
            </h3>
          </div>

          <p className="text-xs text-brand-stone">
            When choosing "Full Samagri Included", our verified priest supplies all high-grade Vedic herbs and havan items:
          </p>

          <div className="space-y-2 pt-2 max-h-96 overflow-y-auto pr-2">
            {samagriList.map((item: string, idx: number) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 text-xs text-brand-charcoal flex items-center gap-2"
              >
                <div className="w-5 h-5 rounded-full bg-brand-sand text-brand-maroon text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
