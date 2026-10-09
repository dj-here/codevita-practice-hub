import React from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, Languages, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface RitualCardProps {
  ritual: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    durationHours: number;
    languages: string;
    basePrice: number;
    category?: { name: string };
    packages?: Array<{
      id: string;
      name: string;
      totalAmount: number;
      tier: string;
    }>;
  };
}

export const RitualCard: React.FC<RitualCardProps> = ({ ritual }) => {
  const lowestPrice = ritual.packages?.length
    ? Math.min(...ritual.packages.map((p) => p.totalAmount))
    : ritual.basePrice;

  return (
    <Card hoverable className="flex flex-col h-full overflow-hidden border border-stone-200">
      {/* Decorative top header pattern */}
      <div className="h-3 bg-gradient-to-r from-brand-maroon via-brand-saffron to-brand-gold" />

      <div className="p-5 flex flex-col flex-1">
        {ritual.category && (
          <div className="mb-2">
            <Badge variant="gold">{ritual.category.name}</Badge>
          </div>
        )}

        <h3 className="text-lg font-serif font-bold text-brand-maroon mb-1.5 hover:text-brand-saffron transition-colors">
          <Link href={`/rituals/${ritual.slug}`}>{ritual.name}</Link>
        </h3>

        <p className="text-xs text-brand-stone line-clamp-2 mb-4 flex-1">
          {ritual.shortDescription}
        </p>

        {/* Ritual attributes */}
        <div className="space-y-1.5 py-3 border-y border-stone-100 text-xs text-brand-muted mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-brand-saffron" />
            <span>Duration: ~{ritual.durationHours} Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-brand-saffron" />
            <span className="truncate">{ritual.languages}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Verified Vedic Priests</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[11px] text-brand-muted block uppercase tracking-wider font-semibold">
              Packages From
            </span>
            <span className="text-lg font-bold text-brand-charcoal">
              ₹{lowestPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href={`/rituals/${ritual.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-saffron hover:text-brand-saffron-dark group"
          >
            <span>View Packages</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default RitualCard;
