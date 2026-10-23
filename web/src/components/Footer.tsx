import { getLocale, getTranslations } from 'next-intl/server';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Facebook, Youtube } from './Social';
import { Link } from '@/i18n/navigation';
import { items, single, tr } from '@/lib/directus';
import { MENU } from '@/lib/nav';
import { LogoMark } from './Logo';

export async function Footer() {
  const locale = await getLocale();
  const [t, tp, tf, tc] = [await getTranslations('menu'), await getTranslations('portal'), await getTranslations('footer'), await getTranslations('common')];
  const [s, sponsors] = await Promise.all([single('site_settings', { fields: ['*', 'translations.*'] }), items('sponsors', { fields: ['name', 'url', 'tier'], sort: ['sort'] })]);
  const st = tr(s, locale);
  return (
    <footer className="mt-14">
      <section className="border-y border-navy-900/10 bg-slate-50 py-6">
        <div className="container-x">
          <p className="mb-4 flex items-center justify-center gap-3 text-[13px] font-extrabold uppercase tracking-[0.2em] text-navy-900"><span className="h-0.5 w-10 bg-brand" />{tp('sponsors')}<span className="h-0.5 w-10 bg-brand" /></p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sponsors.map((x) => <a key={x.name} href={x.url} target="_blank" rel="noopener noreferrer" className="flex h-16 items-center justify-center rounded border border-navy-900/10 bg-white px-3 text-center text-[13px] font-bold text-navy-800/70 grayscale transition hover:text-navy-900 hover:grayscale-0">{x.name}</a>)}
          </div>
        </div>
      </section>
      <div className="relative border-t-4 border-brand bg-navy-900 text-white/80"><div aria-hidden className="pattern-lines pointer-events-none absolute inset-0" />
        <div className="container-x relative grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3"><LogoMark className="h-14 w-14" /><div className="leading-tight"><p className="font-extrabold text-white">{tp('fullName')}</p><p className="text-xs uppercase tracking-widest text-gold">{tp('fullNameAlt')}</p></div></div>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" />{s?.address}</li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-gold" />{s?.phone}</li>
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-gold" />{s?.email}</li>
            </ul>
            <div className="mt-4 flex gap-2">{[[Facebook, s?.facebook], [Youtube, s?.youtube]].map(([I, h], i) => { const Icon = I as typeof Facebook; return <a key={i} href={String(h)} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-brand"><Icon size={16} /></a>; })}</div>
            <p className="mt-4 text-xs text-amber-200/80">{tp('demoFooter')} {st.footer_text}</p>
          </div>
          {[MENU.slice(0, 4), MENU.slice(4, 8), MENU.slice(8)].map((col, i) => (
            <div key={i}><ul className="space-y-4 text-sm">{col.map((m) => (
              <li key={m.key}><Link href={m.href} className="border-l-2 border-brand pl-2 font-bold uppercase tracking-wide text-white hover:text-gold">{t(m.key)}</Link>
                {m.children && <ul className="mt-1.5 space-y-1">{m.children.slice(0, 4).map((c) => <li key={c.href}><Link href={c.href} className="text-white/60 hover:text-white">{t(c.key)}</Link></li>)}</ul>}
              </li>))}</ul></div>
          ))}
        </div>
        <div className="relative bg-navy-950"><div className="container-x flex flex-col gap-1 py-4 text-xs text-white/50 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} {tf('rights')} (SFV). {tc('logoPlaceholder')}.</span><span>{tf('built')}</span></div></div>
      </div>
    </footer>
  );
}
