'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Code2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });

      if (!res?.ok) {
        setError(res?.error || 'Invalid email or password');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome back to CodeVita Hub
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to continue practicing algorithmic challenges and mock interviews
          </p>
        </div>

        {/* Success Alert if just registered */}
        {registered && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Account created successfully! Please log in with your credentials.</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Logins for Testing */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 text-center">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('student@codevita.hub', 'Student@2026')}
              className="px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@codevita.hub', 'Admin@CodeVita2026')}
              className="px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium transition flex items-center justify-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Sign up prompt */}
        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
