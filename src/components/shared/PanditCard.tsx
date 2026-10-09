import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Award, Languages } from 'lucide-react';
import Card from '../ui/Card';
import StarRating from './StarRating';
import Badge from '../ui/Badge';

interface PanditCardProps {
  pandit: {
    id: string;
    bio?: string | null;
    experienceYears: number;
    traditions: string;
    languages: string;
    serviceLocalities: string;
    verificationStatus: string;
    rating: number;
    reviewCount: number;
    user: {
      name: string;
      avatarUrl?: string | null;
    };
  };
}

export const PanditCard: React.FC<PanditCardProps> = ({ pandit }) => {
  const isVerified = pandit.verificationStatus === 'APPROVED';

  return (
    <Card hoverable className="p-5 flex flex-col h-full border border-stone-200">
      <div className="flex items-start gap-3.5 mb-3">
        {/* Avatar placeholder with traditional initials styling */}
        <div className="w-12 h-12 rounded-full bg-brand-sand border border-brand-gold/50 flex items-center justify-center text-brand-maroon font-serif font-bold text-lg flex-shrink-0">
          {pandit.user.name.replace('Pt. ', '').charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-base font-serif font-bold text-brand-charcoal truncate">
              <Link href={`/pandits/${pandit.id}`} className="hover:text-brand-saffron transition-colors">
                {pandit.user.name}
              </Link>
            </h4>
            {isVerified && (
              <span className="inline-flex items-center text-emerald-600 title-verified" title="Verified Vedic Priest">
                <ShieldCheck className="w-4 h-4 fill-emerald-100" />
              </span>
            )}
          </div>

          <p className="text-xs text-brand-muted truncate">{pandit.traditions}</p>

          <div className="mt-1">
            <StarRating rating={pandit.rating} totalReviews={pandit.reviewCount} size="sm" />
          </div>
        </div>
      </div>

      {pandit.bio && (
        <p className="text-xs text-brand-stone line-clamp-2 mb-3.5 flex-1 italic">
          "{pandit.bio}"
        </p>
      )}

      <div className="space-y-1.5 py-2.5 border-t border-stone-100 text-xs text-brand-stone mb-3.5">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-brand-saffron flex-shrink-0" />
          <span>{pandit.experienceYears} Years Vedic Experience</span>
        </div>
        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-brand-saffron flex-shrink-0" />
          <span className="truncate">{pandit.languages}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-brand-muted flex-shrink-0" />
          <span className="truncate text-brand-muted">{pandit.serviceLocalities}</span>
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between">
        {isVerified ? (
          <Badge variant="success">Verified Partner</Badge>
        ) : (
          <Badge variant="warning">Verification Pending</Badge>
        )}

        <Link
          href={`/pandits/${pandit.id}`}
          className="text-xs font-semibold text-brand-saffron hover:text-brand-saffron-dark"
        >
          View Profile &rarr;
        </Link>
      </div>
    </Card>
  );
};

export default PanditCard;
