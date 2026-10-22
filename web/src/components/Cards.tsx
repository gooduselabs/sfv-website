import type React from 'react';
import { Link } from '@/i18n/navigation';
import { asset, fmtDate, tr, type Item } from '@/lib/directus';
import { DemoBadge } from './Demo';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';

export const isRoller = (d?: Item | null) => d?.area === 'roller';

export function NewsCard({ n, locale, big = false }: { n: Item; locale: string; big?: boolean }) {
  const t = tr(n, locale);
  const ct = tr(n.category, locale);
  return (
    <Link href={`/news/${n.slug}`} className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-ice-500/15 ${big ? 'md:row-span-2' : ''}`}>
      <div className={`relative overflow-hidden ${big ? 'aspect-[4/3] md:aspect-auto md:flex-1' : 'aspect-[16/10]'}`}>
        {n.cover && <img src={asset(n.cover, { w: big ? 1000 : 640 })!} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className={`tag ${n.is_announcement ? 'bg-neon-orange text-white' : 'bg-white/90 text-navy-900'}`}>{ct.name}</span>
          <DemoBadge show={n.demo} />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <time className="text-xs font-medium text-navy-700/60">{fmtDate(n.publish_date, locale)}</time>
        <h3 className={`font-display font-semibold leading-snug text-navy-950 group-hover:text-ice-600 ${big ? 'text-2xl' : 'text-lg'}`}>{t.title}</h3>
        {big && <p className="text-sm text-navy-800/70">{t.excerpt}</p>}
      </div>
    </Link>
  );
}

export const STATUS_STYLE: Record<string, string> = { upcoming: 'bg-ice-100 text-ice-600', registration_open: 'bg-gradient-to-r from-neon-orange to-neon-pink text-white', ongoing: 'bg-emerald-500 text-white', finished: 'bg-slate-400/25 text-slate-500' };

export function CompetitionCard({ c, locale, label, dark = false }: { c: Item; locale: string; label: string; dark?: boolean }) {
  const t = tr(c, locale);
  const accent = isRoller(c.discipline);
  const roller = dark || accent;
  const d = new Date(c.start_date);
  return (
    <Link href={`/competitions/${c.slug}`} className={`group relative grid grid-cols-[84px_1fr] gap-4 overflow-hidden rounded-3xl p-4 ring-1 transition hover:-translate-y-0.5 sm:grid-cols-[100px_1fr_auto] sm:items-center ${roller ? 'bg-navy-950 text-white ring-white/10 hover:shadow-xl hover:shadow-neon-pink/20' : 'bg-white ring-navy-900/5 hover:shadow-xl hover:shadow-ice-500/15'}`}>
      <div className={`flex aspect-square flex-col items-center justify-center rounded-2xl ${accent ? 'bg-gradient-to-br from-neon-orange to-neon-pink' : 'bg-gradient-to-br from-ice-400 to-ice-600'} text-white`}>
        <span className="font-display text-3xl font-bold leading-none">{String(d.getDate()).padStart(2, '0')}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider">{fmtDate(c.start_date, locale, { month: 'short', year: 'numeric' })}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`tag ${STATUS_STYLE[c.status] ?? ''}`}>{label}</span>
          <span className={`tag ${roller ? 'bg-white/10 text-white/80' : 'bg-navy-900/5 text-navy-800'}`}>{tr(c.discipline, locale).name}</span>
          <DemoBadge show={c.demo} />
        </div>
        <h3 className="font-display mt-2 text-lg font-semibold leading-snug">{t.name}</h3>
        <p className={`mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm ${roller ? 'text-white/60' : 'text-navy-800/60'}`}>
          <span className="inline-flex items-center gap-1"><Calendar size={14} />{fmtDate(c.start_date, locale)} – {fmtDate(c.end_date, locale)}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={14} />{c.venue}, {c.city}</span>
        </p>
      </div>
      <ArrowUpRight className="hidden opacity-40 transition group-hover:opacity-100 sm:block" />
    </Link>
  );
}

export function initials(name: string) { const p = name.split(' '); return (p[0][0] + (p.at(-1)?.[0] ?? '')).toUpperCase(); }

export function AthleteCard({ a, locale }: { a: Item; locale: string }) {
  const roller = isRoller(a.discipline);
  return (
    <Link href={`/athletes/${a.slug}`} className={`group relative block overflow-hidden rounded-3xl p-5 ring-1 transition hover:-translate-y-1 ${roller ? 'bg-roller text-white ring-white/10' : 'bg-ice-grad ring-navy-900/5'}`}>
      <div className={`relative grid aspect-square place-items-center overflow-hidden rounded-2xl ${roller ? 'bg-white/5' : 'bg-white'}`}>
        {a.photo ? <img src={asset(a.photo, { w: 400, h: 400, fit: 'cover' })!} alt={a.full_name} className="h-full w-full object-cover" /> : (
          <>
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true"><path d="M-10 150 C 60 90, 120 200, 210 110" fill="none" stroke={roller ? '#ff2f8e' : '#6aaee6'} strokeWidth="2" /><path d="M-10 165 C 60 105, 120 215, 210 125" fill="none" stroke={roller ? '#ff6a2b' : '#a6cdee'} strokeWidth="1" /></svg>
            <span className={`font-display relative text-5xl font-bold ${roller ? 'text-gradient-roller' : 'text-ice-500'}`}>{initials(a.full_name)}</span>
          </>
        )}
        <DemoBadge show={a.demo} className="absolute left-2 top-2" />
      </div>
      <h3 className="font-display mt-4 text-lg font-semibold leading-tight">{a.full_name}</h3>
      <p className={`mt-1 text-sm ${roller ? 'text-white/60' : 'text-navy-800/60'}`}>{tr(a.discipline, locale).name} · {a.birth_year}</p>
      <p className={`text-xs ${roller ? 'text-white/45' : 'text-navy-800/45'}`}>{a.club?.name}</p>
    </Link>
  );
}

export function SectionTitle({ kicker, title, href, more, dark = false }: { kicker?: React.ReactNode; title: string; href?: string; more?: string; dark?: boolean }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
      <div>
        {kicker && <div className={`mb-2 text-xs font-semibold uppercase tracking-[0.25em] ${dark ? 'text-neon-orange' : 'text-ice-600'}`}>{kicker}</div>}
        <h2 className={`font-display text-3xl font-bold leading-tight sm:text-5xl ${dark ? 'text-white' : 'text-navy-950'}`}>{title}</h2>
      </div>
      {href && <Link href={href} className={`group hidden shrink-0 items-center gap-1 text-sm font-semibold sm:inline-flex ${dark ? 'text-white/80 hover:text-white' : 'text-navy-800 hover:text-ice-600'}`}>{more}<ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>}
    </div>
  );
}

export function Chips({ items, active, base, param, extra = {} }: { items: { value: string; label: string }[]; active?: string; base: string; param: string; extra?: Record<string, string | undefined> }) {
  const mk = (v?: string) => { const p = new URLSearchParams(); for (const [k, x] of Object.entries({ ...extra, [param]: v })) if (x) p.set(k, x); const s = p.toString(); return s ? `${base}?${s}` : base; };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <Link key={i.value || 'all'} href={mk(i.value || undefined)} scroll={false} className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition ${(active ?? '') === i.value ? 'bg-navy-900 text-white ring-navy-900' : 'bg-white text-navy-800 ring-navy-900/10 hover:ring-navy-900/30'}`}>{i.label}</Link>
      ))}
    </div>
  );
}
