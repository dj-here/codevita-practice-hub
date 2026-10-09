'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'CUSTOMER',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/rituals');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-subtle space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-saffron flex items-center justify-center text-white mx-auto shadow-sm">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <h1 className="text-2xl font-serif font-black text-brand-maroon">
            Create Customer Account
          </h1>
          <p className="text-xs text-brand-stone">
            Book verified Vedic ceremonies across Hyderabad with complete peace of mind.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Ramesh Reddy"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Phone Number (10 digits)"
            placeholder="9849123456"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Password (min 6 characters)"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Button
            type="submit"
            variant="maroon"
            size="md"
            isLoading={isLoading}
            className="w-full font-bold"
          >
            Create Account & Explore Pujas &rarr;
          </Button>
        </form>

        <div className="text-center text-xs text-brand-muted pt-2 border-t border-stone-100">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-saffron font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
