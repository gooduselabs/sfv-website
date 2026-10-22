'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from './Logo';
import { HREF } from '@/lib/nav';

const MAIN = ['about', 'disciplines', 'competitions', 'results', 'athletes', 'clubs', 'news'] as const;
const MORE = ['teams', 'records', 'documents', 'gallery', 'register', 'contact', 'search'] as const;

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [pathname]);
  const dark = !scrolled; // every page opens on a dark hero/page header
  const active = (k: string) => (HREF[k] === '/' ? pathname === '/' : pathname.startsWith(HREF[k]));
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${dark ? 'bg-transparent' : 'frost shadow-[0_8px_30px_-12px_rgba(7,19,40,.18)]'}`}>
      <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-[72px]">
        <Link href="/" aria-label="SFV – Trang chủ"><Logo dark={dark} /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {MAIN.map((k) => (
            <Link key={k} href={HREF[k]} className={`relative rounded-full px-3 py-2 text-[13.5px] font-medium transition ${dark ? 'text-white/85 hover:text-white' : 'text-navy-800/80 hover:text-navy-950'} ${active(k) ? (dark ? 'text-white' : 'text-navy-950') : ''}`}>
              {t(k)}
              {active(k) && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-ice-400 to-neon-pink" />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link href="/search" aria-label={t('search')} className={`hidden h-10 w-10 place-items-center rounded-full sm:grid ${dark ? 'text-white hover:bg-white/10' : 'text-navy-800 hover:bg-navy-900/5'}`}><Search size={18} /></Link>
          <div className={`flex rounded-full p-0.5 text-xs font-semibold ${dark ? 'bg-white/10 text-white' : 'bg-navy-900/5 text-navy-800'}`}>
            {(['vi', 'en'] as const).map((l) => (
              <Link key={l} href={pathname} locale={l} className={`rounded-full px-2.5 py-1.5 uppercase ${locale === l ? (dark ? 'bg-white text-navy-900' : 'bg-navy-900 text-white') : 'opacity-70 hover:opacity-100'}`}>{l}</Link>
            ))}
          </div>
          <Link href="/register" className="hidden rounded-full bg-gradient-to-r from-neon-orange to-neon-pink px-4 py-2 text-[13px] font-semibold text-white shadow-lg shadow-neon-pink/25 transition hover:brightness-110 md:inline-flex">{t('register')}</Link>
          <button onClick={() => setOpen(true)} aria-label={t('menu')} className={`grid h-10 w-10 place-items-center rounded-full xl:hidden ${dark ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-navy-900/5'}`}><Menu size={22} /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] overflow-y-auto bg-navy-950 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="scratch absolute inset-0" />
            <div className="container-x relative flex h-16 items-center justify-between">
              <Logo dark />
              <button onClick={() => setOpen(false)} aria-label={t('close')} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><X size={22} /></button>
            </div>
            <nav className="container-x relative grid gap-1 pb-10 pt-4" aria-label="Mobile">
              {(['home', ...MAIN, ...MORE] as string[]).map((k, i) => (
                <motion.div key={k} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link href={HREF[k]} className="font-display flex items-center justify-between border-b border-white/10 py-3.5 text-2xl font-semibold">
                    <span className={active(k) ? 'text-gradient-roller' : ''}>{t(k)}</span>
                    <span className="text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
