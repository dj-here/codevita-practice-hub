'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight, Flame } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.bookings) setBookings(data.bookings);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'UPCOMING') return b.status === 'CONFIRMED' || b.status === 'PENDING_CONFIRMATION';
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'CANCELLED') return b.status === 'CANCELLED' || b.status === 'REFUNDED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'REFUNDED':
        return <Badge variant="danger">Refunded</Badge>;
      default:
        return <Badge variant="warning">Pending Payment</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            My Ceremony Bookings
          </h1>
          <p className="text-xs text-brand-stone mt-1">
            Track upcoming pujas, view priest details, access tax invoices, and submit ceremony reviews.
          </p>
        </div>

        <Link href="/rituals">
          <Button variant="primary" size="sm">
            Book Another Ceremony
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-brand-maroon text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} ({
              tab === 'ALL'
                ? bookings.length
                : tab === 'UPCOMING'
                ? bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'PENDING_CONFIRMATION').length
                : tab === 'COMPLETED'
                ? bookings.filter((b) => b.status === 'COMPLETED').length
                : bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REFUNDED').length
            })
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-xs text-brand-stone">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <Flame className="w-8 h-8 text-brand-muted mx-auto" />
          <h3 className="text-base font-serif font-bold text-brand-charcoal">No bookings found</h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            You don't have any bookings matching this status. Explore our verified Vedic ceremonies to schedule a puja.
          </p>
          <div className="pt-2">
            <Link href="/rituals">
              <Button variant="primary" size="sm">
                Explore Ceremonies
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <Card key={b.id} className="p-5 border border-stone-200 hover:border-brand-saffron/60 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-brand-muted">
                      #{b.bookingNumber}
                    </span>
                    {getStatusBadge(b.status)}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-brand-maroon">
                    {b.ritual.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-stone pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-saffron" />
                      <span>{b.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-saffron" />
                      <span>{b.startTime} - {b.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-saffron" />
                      <span>{b.locality}, {b.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 gap-2">
                  <div className="text-right">
                    <span className="text-[11px] text-brand-muted block">Total Paid</span>
                    <span className="text-base font-bold text-brand-charcoal">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link href={`/bookings/${b.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
