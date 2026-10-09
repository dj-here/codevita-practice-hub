'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Flame, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user?.role === 'ADMIN') router.push('/admin/dashboard');
      else if (data.user?.role === 'PANDIT') router.push('/partner/dashboard');
      else router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-subtle space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-saffron flex items-center justify-center text-white mx-auto shadow-sm">
            <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>
          <h1 className="text-2xl font-serif font-black text-brand-maroon">
            Sign In to PujaConnect
          </h1>
          <p className="text-xs text-brand-stone">
            Access your sacred ceremonies, booking details, and priest coordination.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="maroon"
            size="md"
            isLoading={isLoading}
            className="w-full font-bold"
          >
            Sign In &rarr;
          </Button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider block text-center">
            Quick Test Accounts (Click to Fill)
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => fillQuickLogin('customer@pujaconnect.com', 'Password@123')}
              className="p-2 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 text-center font-medium"
            >
              Devotee Customer
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('pandit.shastri@pujaconnect.com', 'Password@123')}
              className="p-2 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 text-center font-medium"
            >
              Verified Priest
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('admin@pujaconnect.com', 'Admin@1234')}
              className="p-2 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 text-center font-medium"
            >
              Administrator
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-brand-muted pt-2 border-t border-stone-100">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-brand-saffron font-bold hover:underline">
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto p-12 text-center text-xs text-stone-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
