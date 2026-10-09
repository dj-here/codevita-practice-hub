import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  PackageCheck, 
  Calendar, 
  Flame, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gold">Simple & Transparent</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-maroon">
          How PujaConnect Works
        </h1>
        <p className="text-sm text-brand-stone leading-relaxed">
          We bring transparency, punctuality, and traditional authenticity to Vedic ceremonies in Hyderabad. Here is the step-by-step experience from booking to blessings.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-sand flex items-center justify-center text-brand-maroon font-bold font-serif text-lg">
            1
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            Browse Catalogue & Compare Transparent Packages
          </h3>
          <p className="text-xs text-brand-stone leading-relaxed">
            Select your desired ceremony (Griha Pravesh, Satyanarayan Puja, Rudrabhishek, or Havans). Each ceremony clearly lays out duration, inclusions, exclusions, pandit fee, and samagri options. No hidden surcharges or post-booking negotiations.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-sand border border-brand-gold flex items-center justify-center text-brand-maroon font-bold font-serif text-lg">
            2
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            Choose Muhurat Date & Priest Preference
          </h3>
          <p className="text-xs text-brand-stone leading-relaxed">
            Pick your auspicious date and preferred time window (e.g. Brahma Muhurat or Morning puja). You can either request a specific verified scholar from our directory or let our smart system auto-assign the top-rated priest in your Hyderabad locality.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-sand flex items-center justify-center text-brand-saffron font-bold font-serif text-lg">
            3
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            Secure Slot with Protected Payment
          </h3>
          <p className="text-xs text-brand-stone leading-relaxed">
            Confirm your booking with instant online reservation protection. Your funds are held securely until the ceremony is conducted. If family plans change, enjoy 100% refund protection up to 48 hours prior.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3 shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold font-serif text-lg">
            4
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-charcoal">
            Punctual Ceremony with Authentic Samagri
          </h3>
          <p className="text-xs text-brand-stone leading-relaxed">
            Your verified priest arrives on time, fully prepared with required herbal samagri, sacred kalash items, and havan woods. Ritual mantras are recited with authentic Vedic pronunciations and detailed explanations in your preferred language.
          </p>
        </div>
      </div>

      {/* Trust Standards Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-cream to-white border border-brand-sand space-y-4">
        <h3 className="text-xl font-serif font-bold text-brand-maroon text-center">
          Our 4-Point Priest Verification Protocol
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
            <h4 className="font-bold text-brand-charcoal">Government ID Check</h4>
            <p className="text-brand-stone text-[11px]">Aadhaar and residential locality verified prior to onboarding.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <h4 className="font-bold text-brand-charcoal">Veda Pathashala Credentials</h4>
            <p className="text-brand-stone text-[11px]">Certification from recognized Gurukuls and Tirumala Pathashalas.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <h4 className="font-bold text-brand-charcoal">Ceremony Experience</h4>
            <p className="text-brand-stone text-[11px]">Minimum 5+ years conducting authentic lifecycle samskaras.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
            <h4 className="font-bold text-brand-charcoal">Verified Reviews</h4>
            <p className="text-brand-stone text-[11px]">Only customers with verified completed bookings can post reviews.</p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/rituals">
          <Button variant="maroon" size="lg" className="gap-2">
            <span>Explore Ceremonies Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
