'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Code2,
  Terminal,
  Trophy,
  BrainCircuit,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
  Flame,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/problems', label: 'Problems', icon: Terminal },
    { href: '/contest', label: 'Mock Contests', icon: Trophy },
    { href: '/interview', label: 'Mock Interview', icon: BrainCircuit },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white hover:text-blue-400 transition"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">CodeVita Hub</span>
                <span className="text-[10px] font-normal tracking-wider uppercase text-blue-400">
                  TCS Practice Arena
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname.startsWith('/admin')
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                    : 'text-amber-300/80 hover:text-amber-300 hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {status === 'loading' ? (
              <div className="w-20 h-8 rounded bg-slate-800 animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-300 font-medium">Ready</span>
                </div>

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-blue-700/60 text-blue-200 border border-blue-500/40 flex items-center justify-center font-bold text-xs uppercase">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                      {session.user.name || session.user.email}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {session.user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-amber-300 bg-amber-950/20 border border-amber-600/30"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="pt-3 border-t border-slate-800">
            {session?.user ? (
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-md text-sm font-medium bg-slate-800 text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
