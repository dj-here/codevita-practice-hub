'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, Clock, Flame } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="gold">Hyderabad Operations Hub</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-brand-maroon">
          Contact Devotee Support
        </h1>
        <p className="text-sm text-brand-stone leading-relaxed">
          Need special custom ceremony coordination, multiple priests, or booking assistance? Our temple coordination team is here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-subtle">
            <h3 className="font-serif font-bold text-lg text-brand-maroon">
              Operational Headquarters
            </h3>

            <div className="space-y-3 text-xs text-brand-stone">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-brand-charcoal block">Hyderabad City Center:</span>
                  <span>Plot 42, Hitec City Main Road, Madhapur, Hyderabad, Telangana 500081</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-brand-charcoal block">Helpline & WhatsApp Support:</span>
                  <span>+91 98490 12345 (Toll Free / Mon-Sun 6 AM - 9 PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-brand-charcoal block">Email Inquiries:</span>
                  <span>support@pujaconnect.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-brand-charcoal block">Operations Hours:</span>
                  <span>Monday – Sunday, 06:00 AM – 09:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-subtle">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-brand-maroon">
                Message Received with Reverence
              </h3>
              <p className="text-xs text-brand-stone max-w-sm mx-auto">
                Thank you, {formData.name}. Our Hyderabad ritual coordinator will contact you via phone or email within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-maroon mb-2">
                Send a Message or Custom Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name *"
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Contact Phone *"
                  placeholder="9849012345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Email Address *"
                type="email"
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Ceremony / Subject *"
                placeholder="e.g. Multiple priests required for Chandi Homa in Banjara Hills"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-brand-slate mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your ritual requirements, auspicious dates, and family preferences..."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-brand-saffron focus:outline-none"
                  required
                />
              </div>

              <Button type="submit" variant="maroon" size="md" className="w-full font-bold">
                Send Message to Support Hub &rarr;
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
