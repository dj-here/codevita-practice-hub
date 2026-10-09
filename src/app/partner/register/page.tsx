'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Award, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    experienceYears: 5,
    traditions: 'Vedic, Smartha',
    languages: 'Telugu, Sanskrit, Hindi',
    serviceLocalities: 'Madhapur, Gachibowli, Kukatpally, Kondapur',
    bio: '',
    samagriProvided: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Register User with role PANDIT
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.startsWith('Pt. ') ? formData.name : `Pt. ${formData.name}`,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: 'PANDIT',
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error || 'Registration failed');

      router.push('/partner/verification');
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-subtle space-y-8">
        <div className="text-center space-y-2 border-b border-stone-100 pb-6">
          <Badge variant="gold">Vedic Scholars & Priests</Badge>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Join PujaConnect as a Verified Priest Partner
          </h1>
          <p className="text-xs sm:text-sm text-brand-stone max-w-lg mx-auto leading-relaxed">
            Serve families across Hyderabad with dignity. Guaranteed transparent honorariums, respectful customer communication, and zero directory spam.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name (with Pt. or Shastri title)"
              placeholder="e.g. Rama Shastri"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Contact Phone (10 digits)"
              placeholder="9849012345"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="shastri@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Years of Vedic Experience *
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Languages You Conduct Pujas In *
              </label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder="Telugu, Sanskrit, Hindi"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-slate mb-1">
              Ritual Traditions / Veda Shakha *
            </label>
            <input
              type="text"
              value={formData.traditions}
              onChange={(e) => setFormData({ ...formData, traditions: e.target.value })}
              placeholder="e.g. Krishna Yajurveda, Smartha, Vastu Shastra"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-slate mb-1">
              Service Localities in Hyderabad *
            </label>
            <input
              type="text"
              value={formData.serviceLocalities}
              onChange={(e) => setFormData({ ...formData, serviceLocalities: e.target.value })}
              placeholder="e.g. Madhapur, Gachibowli, Kukatpally, Miyapur, Kondapur"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-brand-slate mb-1">
              Brief Bio & Pathashala Credentials (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Describe your training pathashala, major rituals performed, and background."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="maroon"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold"
            >
              Submit Partner Application & Continue to Verification &rarr;
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-brand-muted">
          Already registered as a pandit partner?{' '}
          <Link href="/auth/login" className="text-brand-saffron font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
