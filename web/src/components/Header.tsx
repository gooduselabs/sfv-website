'use client';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, Home, Mail, Menu, Phone, Search, X } from 'lucide-react';
import { Facebook, Youtube } from './Social';
import { Link, usePathname } from '@/i18n/navigation';
import { MENU } from '@/lib/nav';
import { LogoMark } from './Logo';

export function Header({ email, phone, facebook, youtube }: { email?: string; phone?: string; facebook?: string; youtube?: string }) {
  const t = useTranslations('menu');
  const tp = useTranslations('portal');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState<string | null>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => { const f = () => setStuck(window.scrollY > 140); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  const today = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  const searchAction = locale === 'en' ? '/en/search' : '/search';
  const active = (href: string) => !href.includes('?') && (href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]));
  return (
    <>
      {/* top bar */}
      <div className="hidden bg-navy-950 text-[12.5px] text-white/75 md:block">
        <div className="container-x flex h-9 items-center justify-between gap-4">
          <span className="capitalize" suppressHydrationWarning>{today}</span>
          <div className="flex items-center gap-4">
            {phone && <span className="inline-flex items-center gap-1.5"><Phone size={13} />{tp('hotline')}: {phone}</span>}
            {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-white"><Mail size={13} />{email}</a>}
            <span className="h-4 w-px bg-white/20" />
            {facebook && <a href={facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Facebook size={14} /></a>}
            {youtube && <a href={youtube} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="hover:text-white"><Youtube size={15} /></a>}
            <span className="h-4 w-px bg-white/20" />
            {(['vi', 'en'] as const).map((l) => <Link key={l} href={pathname} locale={l} className={`font-semibold uppercase ${locale === l ? 'text-white' : 'text-white/50 hover:text-white'}`}>{l === 'vi' ? 'Tiếng Việt' : 'English'}</Link>)}
          </div>
        </div>
      </div>
      {/* brand banner */}
      <div className="border-b border-navy-900/10 bg-white">
        <div className="container-x flex items-center justify-between gap-4 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-3 md:gap-4" aria-label="SFV">
            <LogoMark className="h-12 w-12 shrink-0 md:h-[68px] md:w-[68px]" />
            <span className="leading-tight">
              <span className="block text-[13px] font-extrabold tracking-wide text-navy-900 sm:text-base md:text-[22px]">{tp('fullName')}</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-ice-600 md:text-[13px]">{tp('fullNameAlt')} · SFV</span>
            </span>
          </Link>
          <form action={searchAction} className="hidden items-center rounded-full border border-navy-900/15 pl-4 xl:flex">
            <input name="q" placeholder={locale === 'en' ? 'Search…' : 'Tìm kiếm…'} className="w-56 bg-transparent py-2 text-sm outline-none" />
            <button aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-white"><Search size={15} /></button>
          </form>
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-11 w-11 place-items-center rounded-lg bg-navy-900 text-white xl:hidden"><Menu size={22} /></button>
        </div>
      </div>
      {/* main menu (sticky) */}
      <nav className={`sticky top-0 z-50 hidden bg-navy-800 text-white xl:block ${stuck ? 'shadow-lg shadow-navy-950/30' : ''}`} aria-label="Main">
        <div className="container-x flex items-stretch justify-between">
          {stuck && <Link href="/" className="mr-2 flex items-center pr-2" aria-label="SFV"><LogoMark className="h-8 w-8" /></Link>}
          <Link href="/" aria-label={t('home')} className={`flex items-center px-3 ${pathname === '/' ? 'bg-ice-600' : 'hover:bg-white/10'}`}><Home size={17} /></Link>
          {MENU.map((m, i) => (
            <div key={m.key} className="group relative">
              <Link href={m.href} className={`flex h-12 items-center gap-1 whitespace-nowrap px-[7px] text-[11.5px] font-semibold uppercase xl:px-[9px] xl:text-[12.5px] ${active(m.href) ? 'bg-ice-600' : 'group-hover:bg-white/10'}`}>
                {t(m.key)}{m.children && <ChevronDown size={13} className="opacity-60" />}
              </Link>
              {m.children && (
                <div className={`absolute ${i >= MENU.length - 4 ? "right-0" : "left-0"} top-full z-50 hidden min-w-56 group-hover:block border-t-2 border-neon-orange bg-white py-2 text-navy-900 shadow-xl`}>
                  {m.children.map((c) => <Link key={c.key + c.href} href={c.href} className="block px-4 py-2 text-sm hover:bg-ice-50 hover:text-ice-600">{t(c.key)}</Link>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      {/* mobile sticky bar */}
      <div className={`sticky top-0 z-40 bg-navy-800 xl:hidden ${stuck ? 'shadow-lg' : ''}`}>
        <div className="container-x flex h-10 items-center gap-4 overflow-x-auto text-[13px] font-semibold uppercase text-white [scrollbar-width:none]">
          {MENU.slice(0, 6).map((m) => <Link key={m.key} href={m.href} className="whitespace-nowrap">{t(m.key)}</Link>)}
        </div>
      </div>
      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true">
          <button aria-label="Close" className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white"><span className="font-bold">SFV</span><button onClick={() => setOpen(false)} aria-label="Close"><X /></button></div>
            <form action={searchAction} className="flex gap-2 border-b p-3"><input name="q" placeholder="Tìm kiếm…" className="w-full rounded-lg bg-ice-50 px-3 py-2 text-sm outline-none" /><button className="rounded-lg bg-navy-900 px-3 text-white"><Search size={16} /></button></form>
            <Link href="/" className="border-b px-4 py-3 font-semibold">{t('home')}</Link>
            {MENU.map((m) => (
              <div key={m.key} className="border-b">
                <div className="flex items-center">
                  <Link href={m.href} className="flex-1 px-4 py-3 font-semibold">{t(m.key)}</Link>
                  {m.children && <button aria-label="Expand" onClick={() => setSub(sub === m.key ? null : m.key)} className="px-4 py-3"><ChevronDown size={18} className={`transition ${sub === m.key ? 'rotate-180' : ''}`} /></button>}
                </div>
                {m.children && sub === m.key && <div className="bg-ice-50 pb-2">{m.children.map((c) => <Link key={c.key + c.href} href={c.href} className="block px-7 py-2 text-sm">{t(c.key)}</Link>)}</div>}
              </div>
            ))}
            <div className="mt-auto flex gap-2 p-4">{(['vi', 'en'] as const).map((l) => <Link key={l} href={pathname} locale={l} className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold ${locale === l ? 'bg-navy-900 text-white' : 'bg-ice-50'}`}>{l.toUpperCase()}</Link>)}</div>
          </div>
        </div>
      )}
    </>
  );
}
