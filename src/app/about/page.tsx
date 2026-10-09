import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gold">Our Sacred Mission</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-maroon">
          About PujaConnect
        </h1>
        <p className="text-sm text-brand-stone leading-relaxed">
          Bridging timeless Vedic heritage with modern reliability, trust, and convenience.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed shadow-subtle">
        <h2 className="text-xl font-serif font-bold text-brand-maroon">
          Preserving Sanatana Dharma with Modern Transparency
        </h2>
        <p>
          Founded in Hyderabad, <strong>PujaConnect</strong> was created to solve a widespread problem faced by contemporary families: the difficulty of finding qualified, punctual, and background-verified Vedic priests for lifecycle pujas without dealing with unverified directories, uncertain pricing, or last-minute cancellations.
        </p>

        <p>
          We believe sacred rituals like <em>Griha Pravesh</em>, <em>Satyanarayan Katha</em>, and <em>Maha Rudrabhishek</em> are deeply personal spiritual milestones. Every ritual should be conducted with authentic devotion, Sanskrit precision, and clear spiritual explanations that involve the entire family.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          <div className="p-4 rounded-xl bg-brand-cream/60 border border-brand-sand space-y-1 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <h3 className="font-bold text-brand-maroon text-sm">Vetted Priests</h3>
            <p className="text-[11px] text-stone-600">Government ID and Veda Pathashala credentials verified.</p>
          </div>

          <div className="p-4 rounded-xl bg-brand-cream/60 border border-brand-sand space-y-1 text-center">
            <Award className="w-6 h-6 text-brand-saffron mx-auto mb-1" />
            <h3 className="font-bold text-brand-maroon text-sm">Clear Pricing</h3>
            <p className="text-[11px] text-stone-600">Guaranteed itemized packages with all taxes and dakshina included.</p>
          </div>

          <div className="p-4 rounded-xl bg-brand-cream/60 border border-brand-sand space-y-1 text-center">
            <Heart className="w-6 h-6 text-brand-maroon mx-auto mb-1" />
            <h3 className="font-bold text-brand-maroon text-sm">Dignity for Pandits</h3>
            <p className="text-[11px] text-stone-600">Honorable weekly payouts and respectful devotee connections.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 text-center">
          <Link href="/rituals">
            <Button variant="maroon" size="md" className="gap-2 font-bold">
              <span>View Available Ceremonies</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
