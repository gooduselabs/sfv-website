import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Be_Vietnam_Pro, Unbounded } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BladeTrail } from '@/components/Motion';
import '../globals.css';

const body = Be_Vietnam_Pro({ subsets: ['latin', 'vietnamese'], weight: ['400', '500', '600', '700'], variable: '--font-body', display: 'swap' });
const display = Unbounded({ subsets: ['latin', 'vietnamese'], weight: ['500', '600', '700', '800'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'SFV – Liên đoàn Trượt băng và Roller Việt Nam', template: '%s · SFV' },
  description: 'Cổng thông tin Liên đoàn Trượt băng và Roller Việt Nam: giải đấu, kết quả, vận động viên, CLB.',
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { themeColor: '#071328', width: 'device-width', initialScale: 1 };
export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html lang={locale} className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans">
        <NextIntlClientProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip</a>
          <Header />
          <BladeTrail />
          <main id="main" className="relative z-10">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
