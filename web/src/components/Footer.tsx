import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { single, tr } from '@/lib/directus';
import { Logo } from './Logo';
import { HREF } from '@/lib/nav';

export async function Footer() {
  const [t, tf, locale] = [await getTranslations('nav'), await getTranslations('footer'), await getLocale()];
  const tc = await getTranslations('common');
  const s = await single('site_settings', { fields: ['*', 'translations.*'] });
  const st = tr(s, locale);
  const cols: [string, string[]][] = [
    [t('about'), ['about', 'teams', 'clubs', 'contact']],
    [t('competitions'), ['competitions', 'results', 'records', 'register']],
    [t('news'), ['news', 'documents', 'gallery', 'search']],
  ];
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-950 text-white">
      <div className="scratch absolute inset-0 opacity-60" />
      <div className="absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-ice-500/25 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-neon-pink/20 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo dark />
          <p className="font-display mt-6 max-w-xs text-2xl font-semibold leading-tight">{st.tagline}</p>
          <p className="mt-4 text-sm text-white/60">{s?.address}<br />{s?.email} · {s?.phone}</p>
          <p className="mt-4 text-xs text-amber-200/80">{st.footer_text}</p>
          <p className="mt-1 text-xs text-white/40">{tc('logoPlaceholder')}</p>
        </div>
        {cols.map(([h, ks]) => (
          <div key={h}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ice-300">{h}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">{ks.map((k) => <li key={k}><Link className="hover:text-white" href={HREF[k]}>{t(k)}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="container-x relative flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} {tf('rights')} (SFV)</span>
        <span>{tf('built')}</span>
      </div>
    </footer>
  );
}
