'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  ShieldCheck, 
  LayoutDashboard,
  Flame
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/auth/login';
    if (currentUser.role === 'ADMIN' || currentUser.role === 'SUPPORT') return '/admin/dashboard';
    if (currentUser.role === 'PANDIT') return '/partner/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner */}
      <div className="bg-brand-cream border-b border-brand-sand text-[11px] text-brand-stone py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-saffron" />
            <span>Hyderabad, Telangana</span>
            <span className="text-stone-300">|</span>
            <span className="text-brand-muted hidden sm:inline">Madhapur, Gachibowli, Kukatpally, Banjara Hills & Secunderabad</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Background-Verified Vedic Priests
            </span>
            <Link href="/partner/register" className="text-brand-saffron hover:underline font-semibold">
              Become a Pandit Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-saffron flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-tight text-brand-maroon">
                Puja<span className="text-brand-saffron">Connect</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-brand-muted font-bold -mt-1">
                Sacred Vedic Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-slate">
            <Link href="/rituals" className="hover:text-brand-saffron transition-colors">
              Ceremonies & Pujas
            </Link>
            <Link href="/pandits" className="hover:text-brand-saffron transition-colors">
              Verified Pandits
            </Link>
            <Link href="/how-it-works" className="hover:text-brand-saffron transition-colors">
              How It Works
            </Link>
            <Link href="/faq" className="hover:text-brand-stone transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-brand-saffron/40 bg-brand-cream/50 transition-colors text-sm font-medium"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-maroon text-white flex items-center justify-center text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser.name}</span>
                  <Badge variant={currentUser.role === 'ADMIN' ? 'danger' : currentUser.role === 'PANDIT' ? 'warning' : 'info'}>
                    {currentUser.role}
                  </Badge>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-elevated border border-stone-200 py-1.5 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-brand-muted">Signed in as</p>
                      <p className="text-sm font-semibold truncate text-brand-charcoal">{currentUser.email}</p>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-slate hover:bg-stone-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-saffron" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-brand-slate hover:bg-stone-50"
                    >
                      <Calendar className="w-4 h-4 text-brand-saffron" />
                      <span>My Bookings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left border-t border-stone-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/rituals">
                  <Button variant="primary" size="sm">
                    Book a Puja
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-brand-charcoal hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/rituals"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-charcoal border-b border-stone-100"
          >
            Ceremonies & Pujas
          </Link>
          <Link
            href="/pandits"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-charcoal border-b border-stone-100"
          >
            Verified Pandits
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-charcoal border-b border-stone-100"
          >
            How It Works
          </Link>
          <Link
            href="/faq"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-charcoal border-b border-stone-100"
          >
            FAQ & Support
          </Link>
          <Link
            href="/partner/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-brand-saffron border-b border-stone-100"
          >
            Join as Pandit Partner
          </Link>

          <div className="pt-2">
            {currentUser ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2 text-center rounded-lg bg-brand-cream border border-brand-sand text-brand-charcoal font-semibold text-sm"
                >
                  Go to Dashboard ({currentUser.role})
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-2 text-center rounded-lg text-red-600 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/rituals" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    Book Puja
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
