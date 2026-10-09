'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function PartnerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [meRes, bookRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/bookings'),
      ]);

      const meData = await meRes.json();
      const bookData = await bookRes.json();

      if (meData?.profile) setProfile(meData.profile);
      if (bookData?.bookings) setBookings(bookData.bookings);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, targetStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update status');
      }
    } catch (e: any) {
      alert(e.message || 'Error updating status');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-brand-stone">Loading partner portal...</p>
      </div>
    );
  }

  const isApproved = profile?.verificationStatus === 'APPROVED';
  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.panditPayoutAmount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="gold">Pandit Operations Portal</Badge>
            {isApproved ? (
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Partner</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Verification: {profile?.verificationStatus?.replace('_', ' ')}</span>
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Priest Portal & Schedule
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/partner/verification">
            <Button variant="outline" size="sm">
              Documents & Verification
            </Button>
          </Link>
          <Link href="/partner/availability">
            <Button variant="primary" size="sm">
              Manage Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Verification warning if not approved */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-sm">Account Verification Under Review</h4>
              <p>
                Your profile is not yet visible to public customers. Please submit your identity and Veda Pathashala reference documents to enable instant bookings.
              </p>
            </div>
          </div>
          <Link href="/partner/verification" className="flex-shrink-0">
            <Button variant="maroon" size="sm">
              Submit Documents
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border border-stone-200">
          <span className="text-xs font-semibold text-brand-muted block uppercase tracking-wider">
            Upcoming Ceremonies
          </span>
          <div className="text-2xl font-bold text-brand-maroon mt-1">
            {upcomingBookings.length}
          </div>
          <p className="text-[11px] text-brand-stone mt-1">Confirmed assignments</p>
        </Card>

        <Card className="p-5 border border-stone-200">
          <span className="text-xs font-semibold text-brand-muted block uppercase tracking-wider">
            Completed Pujas
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {completedBookings.length}
          </div>
          <p className="text-[11px] text-brand-stone mt-1">Conducted successfully</p>
        </Card>

        <Card className="p-5 border border-stone-200">
          <span className="text-xs font-semibold text-brand-muted block uppercase tracking-wider">
            Total Payout Balance
          </span>
          <div className="text-2xl font-bold text-brand-charcoal mt-1">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-brand-stone mt-1">Net payable to bank</p>
        </Card>
      </div>

      {/* Assigned Upcoming Ceremonies */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-brand-maroon">
          Assigned Ceremony Requests ({upcomingBookings.length})
        </h3>

        {upcomingBookings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-stone-200 text-center">
            <p className="text-xs text-brand-muted">
              No upcoming ceremonies currently scheduled. Make sure your calendar availability is up to date.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((b) => (
              <Card key={b.id} className="p-5 border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-muted">#{b.bookingNumber}</span>
                      <Badge variant={b.status === 'IN_PROGRESS' ? 'warning' : 'success'}>
                        {b.status}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-brand-maroon mt-0.5">
                      {b.ritual.name} ({b.package.name})
                    </h4>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-brand-muted block">Your Payout</span>
                    <span className="text-base font-bold text-emerald-700">
                      ₹{b.panditPayoutAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-brand-stone">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-saffron flex-shrink-0" />
                    <span>{b.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-saffron flex-shrink-0" />
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-maroon flex-shrink-0" />
                    <span className="truncate">{b.locality}, {b.ceremonyAddress}</span>
                  </div>
                </div>

                {b.customer && (
                  <div className="p-3 rounded-lg bg-stone-50 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-brand-muted font-medium">Customer: </span>
                      <span className="font-semibold text-brand-charcoal">{b.customer.name}</span>
                      {b.customer.phone && (
                        <span className="text-brand-stone ml-2">({b.customer.phone})</span>
                      )}
                    </div>
                    <span className="text-brand-muted text-[11px]">Samagri: {b.samagriOption}</span>
                  </div>
                )}

                {/* State Transition Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  {b.status === 'CONFIRMED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(b.id, 'IN_PROGRESS')}
                    >
                      Mark Arrived / In Progress
                    </Button>
                  )}
                  {(b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS') && (
                    <Button
                      variant="maroon"
                      size="sm"
                      onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                    >
                      Mark Ceremony Completed & Blessed
                    </Button>
                  )}
                  <Link href={`/bookings/${b.id}`}>
                    <Button variant="ghost" size="sm">
                      Full Details
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
