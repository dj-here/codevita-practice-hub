import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PujaConnect | Verified Vedic Pandit Booking Marketplace',
  description:
    'Book verified Hindu pandits for Griha Pravesh, Satyanarayan Puja, Rudrabhishek, and sacred ceremonies in Hyderabad. Transparent pricing and complete samagri included.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal selection:bg-brand-saffron selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
