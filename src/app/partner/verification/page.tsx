'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

export default function PartnerVerificationPage() {
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [documentType, setDocumentType] = useState('AADHAAR');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data?.profile) {
        setProfile(data.profile);
        if (data.profile.documents) setDocuments(data.profile.documents);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmitDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/partner/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          documentNumber: documentNumber || undefined,
          fileUrl: fileUrl || `/uploads/verification/${documentType.toLowerCase()}_${Date.now()}.pdf`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit document');

      setMessage('Document submitted successfully for administrator verification!');
      setDocumentNumber('');
      setFileUrl('');
      fetchProfile();
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-saffron border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-xs text-brand-stone">Loading verification status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link href="/partner/dashboard" className="inline-flex items-center gap-1 text-xs text-brand-stone hover:text-brand-saffron">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Partner Dashboard</span>
        </Link>
      </div>

      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="gold">Partner Trust Center</Badge>
          <Badge variant={profile?.verificationStatus === 'APPROVED' ? 'success' : 'warning'}>
            Status: {profile?.verificationStatus?.replace('_', ' ')}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand-maroon">
          Priest Verification & Document Submission
        </h1>
        <p className="text-xs sm:text-sm text-brand-stone mt-1">
          To maintain devotee trust in Hyderabad, all pandits must verify identity and priesthood credentials. Documents are stored in secure private storage.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
          <h3 className="font-serif font-bold text-base text-brand-maroon">
            Submit New Verification Document
          </h3>

          <form onSubmit={handleSubmitDoc} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Document Category *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
              >
                <option value="AADHAAR">Government Aadhaar Card (Identity & Address)</option>
                <option value="PAN">PAN Card (Tax / Payout Identity)</option>
                <option value="PRIESTHOOD_CERTIFICATE">Veda Pathashala / Gurukul Certificate</option>
                <option value="REFERENCE_LETTER">Senior Vedic Priest Reference Letter</option>
              </select>
            </div>

            <Input
              label="Document Identification Number (Optional)"
              placeholder="e.g. XXXX-XXXX-4921 or Certificate Ref ID"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-brand-slate mb-1">
                Document File / Scan Path
              </label>
              <div className="p-4 border-2 border-dashed border-stone-300 rounded-xl text-center hover:border-brand-saffron/60 transition-colors bg-stone-50/50">
                <Upload className="w-6 h-6 text-brand-muted mx-auto mb-1" />
                <span className="text-xs font-semibold text-brand-charcoal block">
                  Click or drag scan file (PDF, JPG, PNG)
                </span>
                <span className="text-[10px] text-brand-muted">
                  Max file size: 10MB. Document will be encrypted in private storage.
                </span>
                <input
                  type="text"
                  placeholder="Or provide stored file path e.g. /docs/aadhaar_scan.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="mt-3 w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="maroon"
              size="md"
              isLoading={isSubmitting}
              className="w-full font-bold"
            >
              Submit for Admin Review
            </Button>
          </form>
        </div>

        {/* Existing Submitted Documents */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3">
            <h3 className="font-serif font-bold text-base text-brand-maroon">
              Submitted Documents ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <p className="text-xs text-brand-muted">
                No documents uploaded yet. Please submit your Government ID and Pathashala credentials above.
              </p>
            ) : (
              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-charcoal">
                        {doc.documentType.replace('_', ' ')}
                      </span>
                      <Badge variant={doc.status === 'VERIFIED' ? 'success' : doc.status === 'REJECTED' ? 'danger' : 'warning'}>
                        {doc.status}
                      </Badge>
                    </div>

                    {doc.documentNumber && (
                      <div className="text-[11px] text-brand-muted font-mono">
                        Number: {doc.documentNumber}
                      </div>
                    )}

                    {doc.adminNotes && (
                      <div className="text-[11px] text-brand-stone bg-white p-2 rounded border border-stone-100 mt-1">
                        Reviewer Note: {doc.adminNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
