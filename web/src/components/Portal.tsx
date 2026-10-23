import type React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { CalendarDays, ChevronRight, Download, FileText, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { asset, fileUrl, fmtDate, items, newsFilter, tr, type Item } from '@/lib/directus';
import { DemoBadge } from './Demo';

export const NEWS_FIELDS = ['id', 'slug', 'cover', 'publish_date', 'demo', 'views', 'author', 'is_announcement', 'translations.*', 'category.slug', 'category.translations.*'];
const ROLLER = ['roller'];
export function CatTag({ n, locale }: { n: Item; locale: string }) {
  const slug = n.category?.slug;
  const cls = ROLLER.includes(slug) ? 'text-neon-orange' : slug === 'truot-bang' ? 'text-ice-600' : 'text-brand';
  return <Link href={`/news?category=${slug}`} className={`text-[11px] font-extrabold uppercase tracking-wider ${cls} hover:underline`}>{tr(n.category, locale).name}</Link>;
}
/** Solid label for use on top of images. */
export function CatBadge({ n, locale }: { n: Item; locale: string }) {
  const slug = n.category?.slug;
  const cls = ROLLER.includes(slug) ? 'bg-neon-orange' : slug === 'truot-bang' ? 'bg-ice-600' : 'bg-brand';
  return <Link href={`/news?category=${slug}`} className={`inline-block px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white ${cls}`}>{tr(n.category, locale).name}</Link>;
}
export function Meta({ n, locale }: { n: Item; locale: string }) {
  return <span className="text-xs text-navy-800/55">{fmtDate(n.publish_date, locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>;
}
function Thumb({ n, w, className }: { n: Item; w: number; className: string }) {
  return (
    <Link href={`/news/${n.slug}`} className={`relative block overflow-hidden bg-slate-100 ${className}`}>
      {n.cover && <img src={asset(n.cover, { w })!} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />}
      <span className="pointer-events-none absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/10" />
      {n.demo && <DemoBadge className="absolute left-2 top-2 !text-[9px]" />}
    </Link>
  );
}
export function NewsBig({ n, locale, size = 'md' }: { n: Item; locale: string; size?: 'md' | 'lg' }) {
  const t = tr(n, locale);
  return (
    <article className={`group relative overflow-hidden bg-navy-950 ${size === 'lg' ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-[16/11]'}`}>
      {n.cover && <img src={asset(n.cover, { w: size === 'lg' ? 1400 : 900 })!} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-transparent" />
      {n.demo && <DemoBadge className="absolute left-3 top-3" />}
      <div className={`absolute inset-x-0 bottom-0 ${size === 'lg' ? 'p-5 sm:p-8' : 'p-4 sm:p-5'}`}>
        <div className="flex items-center gap-3"><CatBadge n={n} locale={locale} /><span className="text-xs text-white/75">{fmtDate(n.publish_date, locale)}</span></div>
        <h3 className={`mt-2.5 font-extrabold leading-tight text-white drop-shadow ${size === 'lg' ? 'text-2xl sm:text-[34px]' : 'text-lg sm:text-[22px]'}`}><Link href={`/news/${n.slug}`} className="bg-[length:0_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 [background-image:linear-gradient(#c8102e,#c8102e)] group-hover:bg-[length:100%_2px]">{t.title}</Link></h3>
        {size === 'lg' && <p className="mt-2 line-clamp-2 hidden max-w-2xl text-[15px] text-white/80 sm:block">{t.excerpt}</p>}
      </div>
    </article>
  );
}
export function NewsSide({ n, locale }: { n: Item; locale: string }) {
  return (
    <article className="group grid grid-cols-[120px_1fr] gap-3 sm:grid-cols-[140px_1fr]">
      <Thumb n={n} w={320} className="aspect-[16/10]" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
        <h4 className="mt-1 line-clamp-3 text-[15px] font-semibold leading-snug text-navy-950 group-hover:text-brand"><Link href={`/news/${n.slug}`}>{tr(n, locale).title}</Link></h4>
      </div>
    </article>
  );
}
export function NewsCardV({ n, locale }: { n: Item; locale: string }) {
  return (
    <article className="group">
      <Thumb n={n} w={480} className="aspect-[16/10]" />
      <div className="mt-2 flex items-center gap-2"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
      <h4 className="mt-1.5 line-clamp-3 text-[15px] font-bold leading-snug text-navy-950 transition group-hover:text-brand"><Link href={`/news/${n.slug}`}>{tr(n, locale).title}</Link></h4>
    </article>
  );
}
export function NewsRow({ n, locale }: { n: Item; locale: string }) {
  const t = tr(n, locale);
  return (
    <article className="group grid grid-cols-[110px_1fr] gap-4 border-b border-navy-900/10 py-4 sm:grid-cols-[240px_1fr]">
      <Thumb n={n} w={480} className="aspect-[16/10]" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
        <h3 className="mt-1 text-base font-bold leading-snug group-hover:text-brand sm:text-lg"><Link href={`/news/${n.slug}`}>{t.title}</Link></h3>
        <p className="mt-1.5 line-clamp-2 hidden text-sm text-navy-800/70 sm:block">{t.excerpt}</p>
      </div>
    </article>
  );
}
export function TitleLink({ n, locale, idx }: { n: Item; locale: string; idx?: number }) {
  return (
    <li className="flex gap-3 border-b border-dashed border-navy-900/15 py-2.5 last:border-0">
      {idx !== undefined && <span className="w-6 shrink-0 text-2xl font-black italic leading-none text-brand/80">{idx + 1}</span>}
      <div className="min-w-0">
        <Link href={`/news/${n.slug}`} className="line-clamp-2 text-[14px] font-medium leading-snug hover:text-brand">{tr(n, locale).title}</Link>
        <Meta n={n} locale={locale} />
      </div>
    </li>
  );
}
export function BlockTitle({ title, href, more, accent = 'ice' }: { title: string; href?: string; more?: string; accent?: 'ice' | 'roller' }) {
  const c = accent === 'roller' ? 'bg-neon-orange' : 'bg-brand';
  return (
    <div className="relative mb-5 flex items-end justify-between border-b-[3px] border-navy-900/10">
      <h2 className="relative -mb-[3px] flex items-center gap-2.5 pb-2 text-[17px] font-extrabold uppercase tracking-wide text-navy-950 sm:text-[19px]">
        <span className={`inline-block h-5 w-1.5 ${c}`} />{title}
        <span className={`absolute inset-x-0 bottom-0 h-[3px] ${c}`} />
      </h2>
      {href && <Link href={href} className="mb-2 inline-flex items-center gap-0.5 text-[13px] font-bold text-navy-800/70 transition hover:text-brand">{more}<ChevronRight size={15} /></Link>}
    </div>
  );
}
export function Widget({ title, children, href, more }: { title: string; children: React.ReactNode; href?: string; more?: string }) {
  return (
    <section className="overflow-hidden border border-navy-900/10 bg-white shadow-[0_1px_0_rgba(7,19,40,.04)]">
      <h3 className="flex items-center justify-between bg-brand px-4 py-2.5 text-[14px] font-extrabold uppercase tracking-wide text-white"><span className="flex items-center gap-2"><span className="h-3.5 w-1 bg-gold" />{title}</span>{href && <Link href={href} className="text-[12px] font-semibold normal-case text-white/85 hover:text-white">{more} ›</Link>}</h3>
      <div className="px-4 py-2">{children}</div>
    </section>
  );
}

/** Right sidebar used on home, news list and detail. */
export async function Sidebar({ show = ['fixtures', 'results', 'announcements', 'documents'] }: { show?: string[] }) {
  const locale = await getLocale();
  const [t, tc] = [await getTranslations('portal'), await getTranslations('comp')];
  const today = new Date().toISOString().slice(0, 10);
  const [fixtures, last, ann, docs, most] = await Promise.all([
    show.includes('fixtures') ? items('competitions', { fields: ['slug', 'start_date', 'city', 'status', 'translations.*', 'discipline.area', 'discipline.translations.*'], filter: { start_date: { _gte: today } }, sort: ['start_date'], limit: 5 }) : [],
    show.includes('results') ? items('competitions', { fields: ['slug', 'translations.*', 'events.id', 'events.sort', 'events.translations.*', 'events.results.rank', 'events.results.result_text', 'events.results.athlete.full_name'], filter: { status: { _eq: 'finished' } }, sort: ['-start_date'], limit: 1, deep: { events: { _sort: ['sort'], _limit: 4, results: { _filter: { rank: { _lte: 3 } }, _sort: ['rank'] } } } }) : [],
    show.includes('announcements') ? items('news', { fields: NEWS_FIELDS, filter: { _and: [newsFilter(), { is_announcement: { _eq: true } }] }, sort: ['-publish_date'], limit: 6 }) : [],
    show.includes('documents') ? items('documents', { fields: ['file', 'category', 'published_date', 'translations.*'], sort: ['-published_date'], limit: 5 }) : [],
    show.includes('mostRead') ? items('news', { fields: NEWS_FIELDS, filter: newsFilter(), sort: ['-views'], limit: 6 }) : [],
  ]);
  const comp = last[0];
  return (
    <aside className="space-y-6">
      {show.includes('mostRead') && <Widget title={t('mostRead')}><ul>{most.map((n, i) => <TitleLink key={n.id} n={n} locale={locale} idx={i} />)}</ul></Widget>}
      {show.includes('fixtures') && (
        <Widget title={t('fixtures')} href="/competitions" more={t('more')}>
          <ul className="divide-y divide-navy-900/10">
            {fixtures.map((c) => (
              <li key={c.slug} className="flex gap-3 py-3">
                <div className="flex w-14 shrink-0 flex-col items-center overflow-hidden border border-brand/20 text-center">
                  <span className="w-full bg-brand py-0.5 text-[10px] font-bold uppercase text-white">{fmtDate(c.start_date, locale, { month: 'short' })}</span>
                  <span className="py-1 text-xl font-black leading-none text-navy-950">{c.start_date.slice(8, 10)}</span>
                  <span className={`h-1 w-full ${c.discipline?.area === 'roller' ? 'bg-neon-orange' : 'bg-ice-500'}`} />
                </div>
                <div className="min-w-0">
                  <Link href={`/competitions/${c.slug}`} className="line-clamp-2 text-[14px] font-semibold leading-snug hover:text-brand">{tr(c, locale).name}</Link>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-navy-800/55"><MapPin size={12} />{c.city} · {tc(c.status)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Widget>
      )}
      {show.includes('results') && comp && (
        <Widget title={t('latestResults')} href={`/competitions/${comp.slug}#results`} more={t('more')}>
          <p className="pt-1 text-[13px] font-semibold text-brand">{tr(comp, locale).name}</p>
          {(comp.events ?? []).filter((e: Item) => e.results?.length).map((e: Item) => (
            <div key={e.id} className="border-b border-navy-900/10 py-2 last:border-0">
              <p className="text-[13px] font-bold">{tr(e, locale).name}</p>
              <ol className="mt-1 space-y-0.5 text-[13px]">{e.results.map((r: Item) => <li key={r.rank} className="flex items-center gap-2"><span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-black ${r.rank === 1 ? 'bg-gold text-navy-950' : r.rank === 2 ? 'bg-slate-300 text-navy-950' : 'bg-[#cd7f32] text-white'}`}>{r.rank}</span><span className="flex-1 truncate">{r.athlete?.full_name}</span><span className="font-mono text-xs">{r.result_text}</span></li>)}</ol>
            </div>
          ))}
          <p className="py-1 text-[11px] text-amber-700">* Demo</p>
        </Widget>
      )}
      {show.includes('announcements') && <Widget title={t('announcements')} href="/news?category=thong-bao" more={t('more')}><ul>{ann.map((n) => <TitleLink key={n.id} n={n} locale={locale} />)}</ul></Widget>}
      {show.includes('documents') && (
        <Widget title={t('documents')} href="/documents" more={t('more')}>
          <ul className="divide-y divide-navy-900/10">{docs.map((d, i) => <li key={i}><a href={fileUrl(d.file) ?? '#'} className="flex items-start gap-2 py-2.5 text-[14px] hover:text-brand"><FileText size={16} className="mt-0.5 shrink-0 text-brand" /><span className="flex-1">{tr(d, locale).title}</span><Download size={14} className="mt-1 shrink-0 opacity-40" /></a></li>)}</ul>
        </Widget>
      )}
    </aside>
  );
}
export function Breadcrumb({ items: list }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-navy-800/60">
      {list.map((b, i) => <span key={i}>{i > 0 && <span className="mx-1.5">›</span>}{b.href ? <Link href={b.href} className="hover:text-brand">{b.label}</Link> : <span className="text-navy-900">{b.label}</span>}</span>)}
    </nav>
  );
}
export { CalendarDays };
