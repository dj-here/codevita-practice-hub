'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, ShieldCheck, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch('/api/auth/me'), fetch('/api/bookings')])
      .then(async ([meRes, bookRes]) => {
        const meData = await meRes.json();
        const bookData = await bookRes.json();
        if (meData?.user) setUser(meData.user);
        if (meData?.profile) setProfile(meData.profile);
        if (bookData?.bookings) setBookings(bookData.bookings);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-brand-stone">Loading customer dashboard...</p>
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING_CONFIRMATION');
  const pastBookings = bookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'REFUNDED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <Badge variant="gold" className="mb-1">Devotee Dashboard</Badge>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Namaste, {user?.name || 'Devotee'}
          </h1>
          <p className="text-xs text-brand-stone mt-0.5">
            Manage your sacred ceremony reservations and family gotra preferences.
          </p>
        </div>

        <Link href="/rituals">
          <Button variant="primary" size="sm">
            Book a New Puja
          </Button>
        </Link>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Registered Profile
          </span>
          <div className="text-sm font-bold text-brand-charcoal">{user?.email}</div>
          {user?.phone && <div className="text-xs text-brand-stone">Phone: {user.phone}</div>}
          <div className="text-xs text-brand-muted">City: {profile?.city || 'Hyderabad'}</div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/bookings">
            <Button variant="outline" size="sm">
              All Bookings History ({bookings.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Upcoming Ceremonies */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-brand-maroon">
          Upcoming Scheduled Ceremonies ({upcomingBookings.length})
        </h3>

        {upcomingBookings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center space-y-3">
            <p className="text-xs text-brand-muted">
              You do not have any upcoming ceremonies scheduled.
            </p>
            <Link href="/rituals">
              <Button variant="outline" size="sm">
                Browse Pujas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((b) => (
              <Card key={b.id} className="p-5 border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs text-brand-muted">#{b.bookingNumber}</span>
                    <h4 className="text-base font-serif font-bold text-brand-maroon mt-0.5">
                      {b.ritual.name} ({b.package.name})
                    </h4>
                  </div>
                  <Badge variant={b.status === 'CONFIRMED' ? 'success' : 'warning'}>
                    {b.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-stone">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-saffron" />
                    <span>{b.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-saffron" />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-maroon" />
                    <span>{b.locality}, {b.city}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link href={`/bookings/${b.id}`}>
                    <Button variant="maroon" size="sm" className="gap-1">
                      <span>View Booking Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
