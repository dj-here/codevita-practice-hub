'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ArrowRight,
  RefreshCw,
  Award
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingPandits, setPendingPandits] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [allPandits, setAllPandits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verification modal
  const [selectedPandit, setSelectedPandit] = useState<any>(null);
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reassignment modal
  const [selectedBookingForReassign, setSelectedBookingForReassign] = useState<any>(null);
  const [newPanditId, setNewPanditId] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [isSubmittingReassign, setIsSubmittingReassign] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, bookRes, panditsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/bookings'),
        fetch('/api/pandits?verified=false'),
      ]);

      const statsData = await statsRes.json();
      const bookData = await bookRes.json();
      const panditsData = await panditsRes.json();

      if (statsData?.metrics) setMetrics(statsData.metrics);
      if (bookData?.bookings) setRecentBookings(bookData.bookings);
      if (panditsData?.pandits) {
        setAllPandits(panditsData.pandits);
        setPendingPandits(panditsData.pandits.filter((p: any) => p.verificationStatus !== 'APPROVED'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleReviewVerification = async () => {
    if (!selectedPandit) return;
    setIsSubmittingReview(true);

    try {
      const res = await fetch(`/api/admin/partners/${selectedPandit.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewStatus,
          rejectionReason: rejectionReason || undefined,
          adminNotes: adminNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification update failed');

      setSelectedPandit(null);
      setRejectionReason('');
      setAdminNotes('');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating partner');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedBookingForReassign || !newPanditId) return;
    setIsSubmittingReassign(true);

    try {
      const res = await fetch(`/api/admin/bookings/${selectedBookingForReassign.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newPanditId,
          reason: reassignReason || 'Administrative operational reassignment',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reassignment failed');

      setSelectedBookingForReassign(null);
      setNewPanditId('');
      setReassignReason('');
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Reassignment error');
    } finally {
      setIsSubmittingReassign(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-brand-stone">Loading operational dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="danger">Administrator Control Center</Badge>
            <span className="text-xs text-brand-muted">PujaConnect Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
            Marketplace Operations & Integrity
          </h1>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAdminData} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">Registered Devotees</span>
            <div className="text-xl font-bold text-brand-charcoal mt-1">{metrics.totalCustomers}</div>
          </Card>

          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">Total Priests</span>
            <div className="text-xl font-bold text-brand-charcoal mt-1">{metrics.totalPandits}</div>
          </Card>

          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">Pending Verifications</span>
            <div className="text-xl font-bold text-amber-600 mt-1">{metrics.pendingVerifications}</div>
          </Card>

          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">GMV (Booking Value)</span>
            <div className="text-xl font-bold text-brand-maroon mt-1">₹{metrics.totalBookingValue?.toLocaleString('en-IN')}</div>
          </Card>

          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">Commission Earned</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">₹{metrics.totalPlatformCommission?.toLocaleString('en-IN')}</div>
          </Card>

          <Card className="p-4 border border-stone-200">
            <span className="text-[11px] font-bold text-brand-muted block uppercase">Refunds Processed</span>
            <div className="text-xl font-bold text-rose-700 mt-1">₹{metrics.refundTotals?.toLocaleString('en-IN')}</div>
          </Card>
        </div>
      )}

      {/* Partner Verification Review Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-saffron" />
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              Partner Verification Submissions ({pendingPandits.length})
            </h3>
          </div>
          <span className="text-xs text-brand-muted">Requires administrative review</span>
        </div>

        {pendingPandits.length === 0 ? (
          <p className="text-xs text-brand-muted py-2">
            All registered priests have been reviewed and approved. Zero pending verification backlog.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-brand-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Priest Name</th>
                  <th className="py-2.5 px-3">Experience</th>
                  <th className="py-2.5 px-3">Tradition</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {pendingPandits.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-3 font-semibold text-brand-charcoal">{p.user?.name}</td>
                    <td className="py-3 px-3">{p.experienceYears} Years</td>
                    <td className="py-3 px-3 truncate max-w-[150px]">{p.traditions}</td>
                    <td className="py-3 px-3">
                      <Badge variant={p.verificationStatus === 'APPROVED' ? 'success' : 'warning'}>
                        {p.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="maroon"
                        size="sm"
                        onClick={() => {
                          setSelectedPandit(p);
                          setReviewStatus('APPROVED');
                        }}
                      >
                        Review Credentials
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Marketplace Bookings Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-maroon" />
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              All Marketplace Bookings ({recentBookings.length})
            </h3>
          </div>
          <span className="text-xs text-brand-muted">Operational dispatch & reassignment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-brand-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Booking ID</th>
                <th className="py-2.5 px-3">Ceremony</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Assigned Priest</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-brand-charcoal">#{b.bookingNumber}</td>
                  <td className="py-3 px-3 font-medium">{b.ritual.name}</td>
                  <td className="py-3 px-3">{b.scheduledDate} ({b.startTime})</td>
                  <td className="py-3 px-3">{b.customer?.name}</td>
                  <td className="py-3 px-3">{b.pandit?.user?.name || 'Unassigned'}</td>
                  <td className="py-3 px-3">
                    <Badge variant={b.status === 'CONFIRMED' || b.status === 'COMPLETED' ? 'success' : 'neutral'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-bold text-brand-maroon">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBookingForReassign(b);
                      }}
                    >
                      Reassign
                    </Button>
                    <Link href={`/bookings/${b.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {selectedPandit && (
        <Modal
          isOpen={!!selectedPandit}
          onClose={() => setSelectedPandit(null)}
          title={`Review Priest Verification: ${selectedPandit.user?.name}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
              <div><span className="font-semibold text-brand-charcoal">Experience:</span> {selectedPandit.experienceYears} Years</div>
              <div><span className="font-semibold text-brand-charcoal">Traditions:</span> {selectedPandit.traditions}</div>
              <div><span className="font-semibold text-brand-charcoal">Languages:</span> {selectedPandit.languages}</div>
              <div><span className="font-semibold text-brand-charcoal">Localities:</span> {selectedPandit.serviceLocalities}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Verification Decision *
              </label>
              <select
                value={reviewStatus}
                onChange={(e: any) => setReviewStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              >
                <option value="APPROVED">Approve (Allow public booking)</option>
                <option value="REJECTED">Reject (Ineligible / Invalid credentials)</option>
                <option value="MORE_INFO_REQUIRED">Request More Information</option>
              </select>
            </div>

            {reviewStatus !== 'APPROVED' && (
              <div>
                <label className="block text-xs font-semibold text-brand-slate mb-1">
                  Reason for Rejection or Additional Info *
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please upload clear scan of Tirumala Pathashala certificate"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Internal Administrative Audit Notes
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Audit notes for record keeping..."
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPandit(null)}>
                Cancel
              </Button>
              <Button
                variant="maroon"
                size="sm"
                isLoading={isSubmittingReview}
                onClick={handleReviewVerification}
              >
                Commit Verification Decision
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reassignment Modal */}
      {selectedBookingForReassign && (
        <Modal
          isOpen={!!selectedBookingForReassign}
          onClose={() => setSelectedBookingForReassign(null)}
          title={`Reassign Priest for #${selectedBookingForReassign.bookingNumber}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-stone-600">
              Select an alternative verified priest for {selectedBookingForReassign.ritual.name} on {selectedBookingForReassign.scheduledDate} at {selectedBookingForReassign.startTime}.
            </p>

            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Select Alternative Verified Priest *
              </label>
              <select
                value={newPanditId}
                onChange={(e) => setNewPanditId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              >
                <option value="">-- Choose Priest --</option>
                {allPandits
                  .filter((p) => p.verificationStatus === 'APPROVED' && p.id !== selectedBookingForReassign.panditId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.user?.name} ({p.experienceYears}y exp, {p.serviceLocalities})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-slate mb-1">
                Reason for Reassignment *
              </label>
              <input
                type="text"
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                placeholder="e.g. Original priest reported unavoidable family emergency"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <Button variant="ghost" size="sm" onClick={() => setSelectedBookingForReassign(null)}>
                Cancel
              </Button>
              <Button
                variant="maroon"
                size="sm"
                isLoading={isSubmittingReassign}
                onClick={handleReassign}
              >
                Confirm Reassignment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
