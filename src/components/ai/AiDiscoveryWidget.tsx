'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export const AiDiscoveryWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    'Telugu pandit for Griha Pravesh in Kukatpally with full samagri',
    'Satyanarayan puja in Madhapur next Sunday morning',
    'Rudrabhishek with Bilva leaves in Gachibowli',
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, city: 'Hyderabad' }),
      });

      if (!res.ok) {
        throw new Error('Could not analyze search query');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-brand-gold/30 shadow-card p-5 sm:p-7">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-brand-sand text-brand-maroon">
          <Sparkles className="w-4 h-4 text-brand-saffron" />
        </div>
        <h3 className="text-base sm:text-lg font-serif font-bold text-brand-maroon">
          AI Ritual & Pandit Assistant
        </h3>
        <Badge variant="gold" className="ml-auto hidden sm:inline-flex">Smart Match</Badge>
      </div>

      <p className="text-xs text-brand-stone mb-4">
        Describe your ceremony in plain English or Telugu transliteration (e.g., ritual type, preferred language, locality, and samagri needs).
      </p>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="flex flex-col sm:flex-row gap-2.5 mb-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Need a Telugu pandit for Griha Pravesh in Madhapur with samagri"
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-brand-ivory border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-saffron focus:border-brand-saffron transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="sm:w-auto w-full gap-2 text-xs sm:text-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Find Matches</span>
        </Button>
      </form>

      {/* Sample prompts */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-brand-muted">
        <span className="font-semibold text-brand-slate">Try:</span>
        {sampleQueries.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(sample);
              handleSearch(sample);
            }}
            className="px-2 py-0.5 rounded-md bg-brand-cream hover:bg-brand-sand/60 text-brand-stone border border-brand-sand text-[11px] transition-colors cursor-pointer text-left"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="mt-6 pt-5 border-t border-stone-200 animate-in fade-in space-y-4">
          {/* Interpreted filters summary */}
          <div className="p-3.5 rounded-xl bg-brand-cream/80 border border-brand-sand flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs">
              <span className="font-semibold text-brand-maroon block mb-0.5">Extracted Preferences:</span>
              <span className="text-brand-slate font-medium">{result.interpretedFilters?.summary}</span>
            </div>
            <Badge variant="success">Validated Against Live Database</Badge>
          </div>

          {/* Suggested Rituals */}
          {result.suggestedRituals?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2.5">
                Recommended Catalogue Services
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.suggestedRituals.map((ritual: any) => (
                  <div
                    key={ritual.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-white hover:border-brand-saffron transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif font-bold text-sm text-brand-maroon">
                          {ritual.name}
                        </span>
                        <span className="text-xs font-bold text-brand-charcoal">
                          From ₹{ritual.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-brand-stone line-clamp-2 mb-3">
                        {ritual.shortDescription}
                      </p>
                    </div>

                    <Link
                      href={`/rituals/${ritual.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-saffron hover:text-brand-saffron-dark mt-1"
                    >
                      <span>Select Packages</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Verified Pandits */}
          {result.matchingPandits?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2.5">
                Verified Priests Available in this Area
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.matchingPandits.map((pandit: any) => (
                  <div
                    key={pandit.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-brand-charcoal truncate">
                          {pandit.user.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-brand-muted truncate">
                        {pandit.languages} • {pandit.experienceYears}y exp
                      </p>
                    </div>

                    <Link
                      href={`/pandits/${pandit.id}`}
                      className="text-xs font-semibold text-brand-saffron hover:underline flex-shrink-0"
                    >
                      Profile &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiDiscoveryWidget;
