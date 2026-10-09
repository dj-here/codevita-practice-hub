'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PackageCheck, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import PaymentModal from '@/components/booking/PaymentModal';

function BookCeremonyContent({
  params,
}: {
  params: { ritualSlug: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPackageId = searchParams.get('packageId');
  const preselectedPanditId = searchParams.get('panditId');

  const [ritual, setRitual] = useState<any>(null);
  const [availablePandits, setAvailablePandits] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [step, setStep] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [samagriOption, setSamagriOption] = useState<string>('FULL_SAMAGRI_INCLUDED');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [locality, setLocality] = useState<string>('Madhapur');
  const [ceremonyAddress, setCeremonyAddress] = useState<string>('');
  const [pincode, setPincode] = useState<string>('500081');
  const [language, setLanguage] = useState<string>('Telugu');
  const [selectedPanditId, setSelectedPanditId] = useState<string>(preselectedPanditId || '');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Booking result & payment modal
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch user session
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.profile?.address) setCeremonyAddress(data.profile.address);
          if (data.profile?.locality) setLocality(data.profile.locality);
          if (data.profile?.pincode) setPincode(data.profile.pincode);
        }
      });

    // 2. Fetch ritual
    fetch(`/api/rituals/${params.ritualSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ritual) {
          setRitual(data.ritual);
          if (preselectedPackageId) {
            setSelectedPackageId(preselectedPackageId);
          } else if (data.ritual.packages?.length > 0) {
            setSelectedPackageId(data.ritual.packages[0].id);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Failed to load ritual details');
        setIsLoading(false);
      });

    // 3. Fetch available pandits
    fetch('/api/pandits')
      .then((r) => r.json())
      .then((data) => {
        if (data?.pandits) setAvailablePandits(data.pandits);
      });
  }, [params.ritualSlug, preselectedPackageId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs text-brand-stone">Loading ceremony configuration...</p>
      </div>
    );
  }

  if (!ritual) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-brand-maroon">Ceremony Not Found</h2>
        <Link href="/rituals" className="text-xs text-brand-saffron underline mt-2 block">
          Back to Rituals
        </Link>
      </div>
    );
  }

  const selectedPackage = ritual.packages?.find((p: any) => p.id === selectedPackageId);

  // Calculate live price preview
  const basePanditFee = selectedPackage?.panditFee || ritual.basePrice;
  let liveSamagri = 0;
  if (samagriOption === 'FULL_SAMAGRI_INCLUDED') liveSamagri = selectedPackage?.samagriCost || 1500;
  else if (samagriOption === 'PARTIAL_SAMAGRI') liveSamagri = Math.round((selectedPackage?.samagriCost || 1500) * 0.5);
  else liveSamagri = 0;

  const liveTravel = 300;
  const livePlatformFee = Math.max(150, Math.round(basePanditFee * 0.10));
  const liveTaxes = Math.round(livePlatformFee * 0.18);
  const liveTotal = basePanditFee + liveSamagri + liveTravel + livePlatformFee + liveTaxes;

  const handleCreateBooking = async () => {
    if (!currentUser) {
      router.push(`/auth/login?redirect=/book/${params.ritualSlug}`);
      return;
    }

    if (!scheduledDate) {
      setError('Please select an auspicious date for your ceremony');
      return;
    }

    if (!ceremonyAddress || ceremonyAddress.trim().length < 5) {
      setError('Please provide a complete ceremony address (Apartment/House No, Street)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ritualId: ritual.id,
          packageId: selectedPackage.id,
          panditId: selectedPanditId || undefined,
          scheduledDate,
          startTime,
          ceremonyAddress,
          city: 'Hyderabad',
          locality,
          pincode: pincode || '500081',
          language,
          samagriOption,
          specialInstructions: specialInstructions || undefined,
          bookingMode: 'INSTANT',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setCreatedBooking(data.booking);
      setIsPaymentModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during booking creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const localitiesInHyderabad = [
    'Madhapur',
    'Gachibowli',
    'Kukatpally',
    'Banjara Hills',
    'Jubilee Hills',
    'Secunderabad',
    'Kondapur',
    'Miyapur',
    'Begumpet',
    'Dilsukhnagar',
    'Hitec City',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Step Indicator */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="gold">Vedic Booking Engine</Badge>
          <span className="text-xs text-brand-muted">Guaranteed Muhurat Slot Reservation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
          Book {ritual.name}
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Step Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Package & Samagri */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
            <h3 className="text-base font-serif font-bold text-brand-maroon flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-sand text-brand-maroon text-xs flex items-center justify-center font-bold">1</span>
              <span>Select Service Package & Samagri Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ritual.packages?.map((pkg: any) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedPackageId === pkg.id
                      ? 'border-2 border-brand-saffron bg-brand-cream/30 shadow-subtle'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-serif font-bold text-xs text-brand-charcoal">{pkg.name}</span>
                    {selectedPackageId === pkg.id && (
                      <CheckCircle2 className="w-4 h-4 text-brand-saffron flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-sm font-bold text-brand-maroon mb-1">
                    ₹{pkg.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-brand-muted line-clamp-2">{pkg.description}</p>
                </div>
              ))}
            </div>

            {/* Samagri options */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-muted block">
                Samagri Materials Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'FULL_SAMAGRI_INCLUDED', label: 'Full Samagri Included', desc: 'Pandit brings 45+ sacred herbs, ghee & dry coconut' },
                  { id: 'PARTIAL_SAMAGRI', label: 'Partial Samagri (50%)', desc: 'Pandit supplies rare herbs; you arrange common grains' },
                  { id: 'CUSTOMER_ARRANGED', label: 'Customer Arranged', desc: 'You purchase all items using checklist' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSamagriOption(opt.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      samagriOption === opt.id
                        ? 'border-brand-saffron bg-brand-sand/40 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs text-brand-charcoal">{opt.label}</div>
                    <div className="text-[10px] text-brand-muted font-normal mt-0.5">{opt.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: Muhurat Date, Time & Location */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
            <h3 className="text-base font-serif font-bold text-brand-maroon flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-sand text-brand-maroon text-xs flex items-center justify-center font-bold">2</span>
              <span>Ceremony Date, Time & Hyderabad Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  Auspicious Date (Muhurat) *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  Ceremony Start Time *
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                >
                  <option value="06:00">06:00 AM (Pratah Muhurat)</option>
                  <option value="07:30">07:30 AM (Brahma Muhurat)</option>
                  <option value="09:00">09:00 AM (Morning Puja)</option>
                  <option value="10:30">10:30 AM (Mid-Morning)</option>
                  <option value="16:00">04:00 PM (Pradosha Puja)</option>
                  <option value="18:00">06:00 PM (Sandhya Puja)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  Locality in Hyderabad *
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                >
                  {localitiesInHyderabad.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="500081"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Ceremony Address (Flat / House No, Apartment / Society, Street) *
              </label>
              <textarea
                rows={2}
                value={ceremonyAddress}
                onChange={(e) => setCeremonyAddress(e.target.value)}
                placeholder="e.g. Flat 301, Aparna Sarovar, Nallagandla / Madhapur"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                required
              />
            </div>
          </div>

          {/* STEP 3: Language & Priest Preference */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
            <h3 className="text-base font-serif font-bold text-brand-maroon flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-sand text-brand-maroon text-xs flex items-center justify-center font-bold">3</span>
              <span>Language Preference & Priest Assignment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  Preferred Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                >
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Sanskrit">Sanskrit (संस्कृतम्)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-slate mb-1">
                  Pandit Assignment
                </label>
                <select
                  value={selectedPanditId}
                  onChange={(e) => setSelectedPanditId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                >
                  <option value="">Auto-assign best available verified priest in {locality}</option>
                  {availablePandits.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.user.name} ({p.experienceYears}y exp, {p.rating}★)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Special Instructions (Gotra, specific deity wishes, high-rise smoke restrictions)
              </label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Kaushika Gotram. Please ensure havan uses smokeless coconut shells for high-rise apartment."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Price Breakdown & Submission */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-base text-brand-maroon pb-3 border-b border-stone-100">
              Quotation Summary
            </h3>

            <div className="text-xs space-y-2 text-brand-stone">
              <div className="flex justify-between">
                <span>Ceremony:</span>
                <span className="font-medium text-brand-charcoal text-right">{ritual.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Package:</span>
                <span className="font-medium text-brand-charcoal text-right">{selectedPackage?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Pandit Dakshina / Fee:</span>
                <span className="font-medium text-brand-charcoal">₹{basePanditFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Samagri Pack:</span>
                <span className="font-medium text-brand-charcoal">
                  {liveSamagri > 0 ? `₹${liveSamagri.toLocaleString('en-IN')}` : '₹0 (Customer arranged)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Travel Allowance:</span>
                <span className="font-medium text-brand-charcoal">₹{liveTravel.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Facilitation:</span>
                <span className="font-medium text-brand-charcoal">₹{livePlatformFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% on platform fee):</span>
                <span className="font-medium text-brand-charcoal">₹{liveTaxes.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-brand-charcoal block">Total Amount</span>
                <span className="text-[10px] text-brand-muted">All taxes & dakshina included</span>
              </div>
              <span className="text-2xl font-black text-brand-maroon">
                ₹{liveTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Trust highlights */}
            <div className="pt-2 text-[11px] text-stone-500 space-y-1.5 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>100% Refundable if cancelled ≥ 48h prior</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-stone">
                <CheckCircle2 className="w-4 h-4 text-brand-saffron flex-shrink-0" />
                <span>No cash demands on ceremony day</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="maroon"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleCreateBooking}
                className="w-full font-bold gap-2 shadow-sm"
              >
                <span>Confirm & Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            router.push(`/bookings/${createdBooking.id}`);
          }}
          booking={{
            id: createdBooking.id,
            bookingNumber: createdBooking.bookingNumber,
            totalAmount: createdBooking.totalAmount,
            ritual: { name: ritual.name },
            package: { name: selectedPackage.name },
          }}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            router.push(`/bookings/${createdBooking.id}?success=true`);
          }}
        />
      )}
    </div>
  );
}

export default function BookCeremonyPage({ params }: { params: { ritualSlug: string } }) {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-12 text-center text-xs text-stone-500">Loading ceremony booking wizard...</div>}>
      <BookCeremonyContent params={params} />
    </Suspense>
  );
}
