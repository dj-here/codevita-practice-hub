import React from 'react';
import Link from 'next/link';
import { Flame, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-saffron flex items-center justify-center text-white">
                <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <span className="text-xl font-serif font-black tracking-tight text-white">
                Puja<span className="text-brand-saffron">Connect</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              India's premier managed marketplace connecting families with authentic, background-verified Vedic priests for home ceremonies, life milestones, and temple rituals.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Identity & Veda Pathashala Credentials</span>
            </div>
            <div className="space-y-1.5 pt-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-saffron" />
                <span>Hyderabad Operations: Hitec City & Madhapur, Telangana 500081</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-saffron" />
                <span>+91 98490 12345 (Mon - Sun, 06:00 AM - 09:00 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-saffron" />
                <span>support@pujaconnect.com</span>
              </div>
            </div>
          </div>

          {/* Popular Rituals */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Popular Pujas</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/rituals/griha-pravesh" className="hover:text-white transition-colors">
                  Griha Pravesh Puja
                </Link>
              </li>
              <li>
                <Link href="/rituals/satyanarayan-puja" className="hover:text-white transition-colors">
                  Satyanarayan Katha
                </Link>
              </li>
              <li>
                <Link href="/rituals/ganesh-puja" className="hover:text-white transition-colors">
                  Ganapati Puja & Homa
                </Link>
              </li>
              <li>
                <Link href="/rituals/rudrabhishek" className="hover:text-white transition-colors">
                  Maha Rudrabhishek
                </Link>
              </li>
              <li>
                <Link href="/rituals" className="text-brand-saffron hover:underline font-semibold">
                  Browse All Pujas &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Hyderabad Localities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Service Areas</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Madhapur & Hitec City</li>
              <li>Gachibowli & Financial District</li>
              <li>Kukatpally & KPHB Colony</li>
              <li>Banjara Hills & Jubilee Hills</li>
              <li>Kondapur & Miyapur</li>
              <li>Secunderabad & Begumpet</li>
              <li>Dilsukhnagar & LB Nagar</li>
            </ul>
          </div>

          {/* Trust, Policies & Partners */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Platform & Policies</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How Booking Works
                </Link>
              </li>
              <li>
                <Link href="/partner/register" className="text-brand-saffron hover:underline font-semibold">
                  Pandit Partner Onboarding
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} PujaConnect India Pvt. Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for sacred Vedic ceremonies with modern reliability in Hyderabad, India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
