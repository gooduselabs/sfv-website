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
  const cls = ROLLER.includes(slug) ? 'text-neon-orange' : slug === 'thong-bao' ? 'text-red-600' : 'text-ice-600';
  return <Link href={`/news?category=${slug}`} className={`text-[11.5px] font-bold uppercase tracking-wide ${cls} hover:underline`}>{tr(n.category, locale).name}</Link>;
}
export function Meta({ n, locale }: { n: Item; locale: string }) {
  return <span className="text-xs text-navy-800/55">{fmtDate(n.publish_date, locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>;
}
function Thumb({ n, w, className }: { n: Item; w: number; className: string }) {
  return (
    <Link href={`/news/${n.slug}`} className={`relative block overflow-hidden bg-ice-100 ${className}`}>
      {n.cover && <img src={asset(n.cover, { w })!} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" />}
      {n.demo && <DemoBadge className="absolute left-2 top-2 !text-[9px]" />}
    </Link>
  );
}
export function NewsBig({ n, locale }: { n: Item; locale: string }) {
  const t = tr(n, locale);
  return (
    <article className="group">
      <Thumb n={n} w={1000} className="aspect-[16/9] rounded" />
      <div className="mt-3 flex items-center gap-3"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
      <h3 className="mt-1.5 text-xl font-bold leading-snug text-navy-950 group-hover:text-ice-600 md:text-2xl"><Link href={`/news/${n.slug}`}>{t.title}</Link></h3>
      <p className="mt-2 line-clamp-2 text-[15px] text-navy-800/75">{t.excerpt}</p>
    </article>
  );
}
export function NewsSide({ n, locale }: { n: Item; locale: string }) {
  return (
    <article className="group grid grid-cols-[120px_1fr] gap-3 sm:grid-cols-[140px_1fr]">
      <Thumb n={n} w={320} className="aspect-[4/3] rounded" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
        <h4 className="mt-1 line-clamp-3 text-[15px] font-semibold leading-snug text-navy-950 group-hover:text-ice-600"><Link href={`/news/${n.slug}`}>{tr(n, locale).title}</Link></h4>
      </div>
    </article>
  );
}
export function NewsCardV({ n, locale }: { n: Item; locale: string }) {
  return (
    <article className="group">
      <Thumb n={n} w={480} className="aspect-[16/10] rounded" />
      <div className="mt-2 flex items-center gap-2"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
      <h4 className="mt-1 line-clamp-3 text-[15px] font-semibold leading-snug group-hover:text-ice-600"><Link href={`/news/${n.slug}`}>{tr(n, locale).title}</Link></h4>
    </article>
  );
}
export function NewsRow({ n, locale }: { n: Item; locale: string }) {
  const t = tr(n, locale);
  return (
    <article className="group grid grid-cols-[110px_1fr] gap-4 border-b border-navy-900/10 py-4 sm:grid-cols-[240px_1fr]">
      <Thumb n={n} w={480} className="aspect-[16/10] rounded" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3"><CatTag n={n} locale={locale} /><Meta n={n} locale={locale} /></div>
        <h3 className="mt-1 text-base font-bold leading-snug group-hover:text-ice-600 sm:text-lg"><Link href={`/news/${n.slug}`}>{t.title}</Link></h3>
        <p className="mt-1.5 line-clamp-2 hidden text-sm text-navy-800/70 sm:block">{t.excerpt}</p>
      </div>
    </article>
  );
}
export function TitleLink({ n, locale, idx }: { n: Item; locale: string; idx?: number }) {
  return (
    <li className="flex gap-3 border-b border-dashed border-navy-900/15 py-2.5 last:border-0">
      {idx !== undefined && <span className="w-6 shrink-0 text-xl font-extrabold leading-none text-ice-300">{idx + 1}</span>}
      <div className="min-w-0">
        <Link href={`/news/${n.slug}`} className="line-clamp-2 text-[14px] font-medium leading-snug hover:text-ice-600">{tr(n, locale).title}</Link>
        <Meta n={n} locale={locale} />
      </div>
    </li>
  );
}
export function BlockTitle({ title, href, more, accent = 'ice' }: { title: string; href?: string; more?: string; accent?: 'ice' | 'roller' }) {
  return (
    <div className={`mb-4 flex items-end justify-between border-b-2 ${accent === 'roller' ? 'border-neon-orange' : 'border-navy-800'}`}>
      <h2 className={`-mb-0.5 inline-block px-4 py-2 text-[15px] font-bold uppercase tracking-wide text-white ${accent === 'roller' ? 'bg-neon-orange' : 'bg-navy-800'}`}>{title}</h2>
      {href && <Link href={href} className="mb-1.5 inline-flex items-center text-[13px] font-semibold text-ice-600 hover:underline">{more}<ChevronRight size={15} /></Link>}
    </div>
  );
}
export function Widget({ title, children, href, more }: { title: string; children: React.ReactNode; href?: string; more?: string }) {
  return (
    <section className="rounded border border-navy-900/10 bg-white">
      <h3 className="flex items-center justify-between border-b-2 border-ice-500 bg-ice-50 px-4 py-2.5 text-[14px] font-bold uppercase tracking-wide text-navy-900">{title}{href && <Link href={href} className="text-[12px] font-semibold normal-case text-ice-600 hover:underline">{more}</Link>}</h3>
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
                <div className={`flex w-14 shrink-0 flex-col items-center justify-center rounded py-1.5 text-white ${c.discipline?.area === 'roller' ? 'bg-neon-orange' : 'bg-navy-800'}`}>
                  <span className="text-lg font-extrabold leading-none">{c.start_date.slice(8, 10)}</span>
                  <span className="text-[10px] font-semibold uppercase">{fmtDate(c.start_date, locale, { month: 'short' })}</span>
                </div>
                <div className="min-w-0">
                  <Link href={`/competitions/${c.slug}`} className="line-clamp-2 text-[14px] font-semibold leading-snug hover:text-ice-600">{tr(c, locale).name}</Link>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-navy-800/55"><MapPin size={12} />{c.city} · {tc(c.status)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Widget>
      )}
      {show.includes('results') && comp && (
        <Widget title={t('latestResults')} href={`/competitions/${comp.slug}#results`} more={t('more')}>
          <p className="pt-1 text-[13px] font-semibold text-ice-600">{tr(comp, locale).name}</p>
          {(comp.events ?? []).filter((e: Item) => e.results?.length).map((e: Item) => (
            <div key={e.id} className="border-b border-navy-900/10 py-2 last:border-0">
              <p className="text-[13px] font-bold">{tr(e, locale).name}</p>
              <ol className="mt-1 space-y-0.5 text-[13px]">{e.results.map((r: Item) => <li key={r.rank} className="flex gap-2"><span className="w-4 font-bold text-navy-800/50">{r.rank}</span><span className="flex-1 truncate">{r.athlete?.full_name}</span><span className="font-mono text-xs">{r.result_text}</span></li>)}</ol>
            </div>
          ))}
          <p className="py-1 text-[11px] text-amber-700">* Demo</p>
        </Widget>
      )}
      {show.includes('announcements') && <Widget title={t('announcements')} href="/news?category=thong-bao" more={t('more')}><ul>{ann.map((n) => <TitleLink key={n.id} n={n} locale={locale} />)}</ul></Widget>}
      {show.includes('documents') && (
        <Widget title={t('documents')} href="/documents" more={t('more')}>
          <ul className="divide-y divide-navy-900/10">{docs.map((d, i) => <li key={i}><a href={fileUrl(d.file) ?? '#'} className="flex items-start gap-2 py-2.5 text-[14px] hover:text-ice-600"><FileText size={16} className="mt-0.5 shrink-0 text-red-600" /><span className="flex-1">{tr(d, locale).title}</span><Download size={14} className="mt-1 shrink-0 opacity-40" /></a></li>)}</ul>
        </Widget>
      )}
    </aside>
  );
}
export function Breadcrumb({ items: list }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-navy-800/60">
      {list.map((b, i) => <span key={i}>{i > 0 && <span className="mx-1.5">›</span>}{b.href ? <Link href={b.href} className="hover:text-ice-600">{b.label}</Link> : <span className="text-navy-900">{b.label}</span>}</span>)}
    </nav>
  );
}
export { CalendarDays };
