'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function PartnerAvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/partner/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, isBlocked }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update schedule');

      setFeedback(
        isBlocked
          ? `Date ${selectedDate} has been BLOCKED. Customers cannot book ceremonies on this day.`
          : `Date ${selectedDate} is now UNBLOCKED and available for bookings.`
      );
    } catch (err: any) {
      alert(err.message || 'Error updating availability');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href="/partner/dashboard" className="inline-flex items-center gap-1 text-xs text-brand-stone hover:text-brand-saffron">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Partner Dashboard</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-5">
        <Badge variant="gold" className="mb-1.5">Schedule Management</Badge>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
          Manage Pandit Calendar & Blocked Dates
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-1">
          Block dates when you are traveling, engaged in temple duties, or unavailable for ceremony bookings.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-subtle">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-slate mb-1">
              Select Date *
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-slate mb-1">
              Status for Selected Date
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsBlocked(true)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  isBlocked
                    ? 'border-2 border-red-500 bg-red-50 text-red-700'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Mark as Blocked / Unavailable
              </button>
              <button
                type="button"
                onClick={() => setIsBlocked(false)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                  !isBlocked
                    ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Mark as Available
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="maroon"
              size="md"
              isLoading={isLoading}
              className="w-full font-bold"
            >
              Update Calendar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
