import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CalendarDays, Download, FileText, MapPin, Users } from 'lucide-react';
import { asset, fileUrl, fmtDate, items, one, tr, type Item } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { STATUS_STYLE } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P) { const { slug, locale } = await params; const c = await one('competitions', { fields: ['translations.*'], filter: { slug: { _eq: slug } } }); return { title: tr(c, locale).name ?? slug }; }

export default async function Competition({ params }: P) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const c = await one('competitions', { fields: ['*', 'translations.*', 'discipline.area', 'discipline.slug', 'discipline.translations.*', 'events.*', 'events.translations.*', 'events.results.*', 'events.results.athlete.full_name', 'events.results.athlete.slug', 'events.results.athlete.birth_year', 'events.results.athlete.club.name'], filter: { slug: { _eq: slug } }, deep: { events: { _sort: ['sort'], _limit: -1, results: { _sort: ['rank'], _limit: -1 } } } });
  if (!c) notFound();
  const [t, tm] = [await getTranslations('comp'), await getTranslations('common')];
  const starts = await items('registrations', { fields: ['athlete_name', 'birth_year', 'club_name', 'event'], filter: { competition: { _eq: c.id } }, limit: -1 });
  const ct = tr(c, locale);
  const area = c.discipline?.area === 'roller' ? 'roller' : 'ice';
  const events: Item[] = c.events ?? [];
  const withResults = events.filter((e) => e.results?.length);
  const byDay = events.reduce<Record<string, Item[]>>((a, e) => { const k = (e.scheduled_at ?? '').slice(0, 10); (a[k] ||= []).push(e); return a; }, {});
  return (
    <>
      <PageHeader area={area} kicker={tr(c.discipline, locale).name} title={ct.name} image={asset(c.cover, { w: 1800 })}>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className={`tag ${STATUS_STYLE[c.status]}`}>{t(c.status)}</span><DemoBadge show={c.demo} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><CalendarDays size={14} />{fmtDate(c.start_date, locale)} – {fmtDate(c.end_date, locale)}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><MapPin size={14} />{c.venue}, {c.city}</span>
        </div>
      </PageHeader>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-14">
          <div className="prose-sfv" dangerouslySetInnerHTML={{ __html: ct.description ?? '' }} />
          <section id="schedule">
            <h2 className="font-display mb-4 text-2xl font-bold">{t('schedule')}</h2>
            <div className="space-y-6">
              {Object.entries(byDay).map(([day, evs]) => (
                <div key={day}>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand">{fmtDate(day, locale, { weekday: 'long', day: '2-digit', month: '2-digit' })}</p>
                  <div className="divide-y divide-navy-900/5 overflow-hidden rounded-2xl bg-white ring-1 ring-navy-900/5">
                    {evs.map((e) => <div key={e.id} className="flex items-center gap-4 px-4 py-3 text-sm"><span className="w-14 font-mono text-navy-800/60">{fmtDate(e.scheduled_at, locale, { hour: '2-digit', minute: '2-digit' })}</span><span className="flex-1 font-medium">{tr(e, locale).name}</span><span className="tag bg-slate-100 text-brand">{e.age_group}</span></div>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section id="startlist">
            <h2 className="font-display mb-4 flex items-center gap-2 text-2xl font-bold"><Users size={22} />{t('startList')}</h2>
            {starts.length ? (
              <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-navy-900/5"><table className="w-full text-sm"><thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-navy-800/70"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">{t('athlete')}</th><th className="px-4 py-3">{tm('birthYear')}</th><th className="px-4 py-3">{tm('club')}</th><th className="px-4 py-3">{tm('discipline')}</th></tr></thead>
                <tbody>{starts.map((s, i) => <tr key={i} className="border-t border-navy-900/5"><td className="px-4 py-2.5 text-navy-800/50">{i + 1}</td><td className="px-4 py-2.5 font-medium">{s.athlete_name}</td><td className="px-4 py-2.5">{s.birth_year}</td><td className="px-4 py-2.5">{s.club_name}</td><td className="px-4 py-2.5">{tr(events.find((e) => e.id === s.event), locale).name}</td></tr>)}</tbody></table></div>
            ) : <p className="text-navy-800/50">{tm('noData')}</p>}
          </section>
          <section id="results">
            <h2 className="font-display mb-4 text-2xl font-bold">{t('results')}</h2>
            {withResults.length ? <div className="space-y-8">{withResults.map((e) => (
              <div key={e.id}>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">{tr(e, locale).name}<DemoBadge show={c.demo} /></h3>
                <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-navy-900/5"><table className="w-full min-w-[520px] text-sm">
                  <thead className={`text-left text-xs uppercase tracking-wider ${area === 'roller' ? 'bg-navy-950 text-white/80' : 'bg-navy-900 text-white/80'}`}><tr><th className="px-4 py-3">{t('rank')}</th><th className="px-4 py-3">{t('athlete')}</th><th className="px-4 py-3">{tm('club')}</th><th className="px-4 py-3 text-right">{t('mark')}</th><th className="px-4 py-3 text-right">{t('points')}</th></tr></thead>
                  <tbody>{e.results.map((r: Item) => (
                    <tr key={r.id} className="border-t border-navy-900/5 hover:bg-brand-50">
                      <td className="px-4 py-2.5"><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${r.rank === 1 ? 'bg-amber-300' : r.rank === 2 ? 'bg-slate-200' : r.rank === 3 ? 'bg-orange-200' : 'bg-slate-100'}`}>{r.rank}</span></td>
                      <td className="px-4 py-2.5 font-medium">{r.athlete ? <Link className="hover:text-brand" href={`/athletes/${r.athlete.slug}`}>{r.athlete.full_name}</Link> : '-'}</td>
                      <td className="px-4 py-2.5 text-navy-800/60">{r.athlete?.club?.name}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums">{r.result_text}</td>
                      <td className="px-4 py-2.5 text-right">{r.points}</td>
                    </tr>
                  ))}</tbody>
                </table></div>
              </div>
            ))}</div> : <p className="text-navy-800/50">{tm('noData')}</p>}
          </section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {c.regulations_file && <a href={fileUrl(c.regulations_file)!} className="flex items-center gap-3 rounded-3xl bg-white p-5 ring-1 ring-navy-900/5 hover:ring-brand"><FileText className="text-brand" /><span className="flex-1 font-semibold">{t('regulations')}</span><Download size={18} /></a>}
          {c.status === 'registration_open' && (
            <div className="rounded-3xl bg-gradient-to-br from-neon-orange to-neon-pink p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">{t('regWindow')}</p>
              <p className="mt-1 font-semibold">{fmtDate(c.registration_open, locale)} – {fmtDate(c.registration_close, locale)}</p>
              <Link href={`/register?competition=${c.slug}`} className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy-950">{t('register')}</Link>
            </div>
          )}
          <div className="rounded-3xl bg-white p-5 text-sm ring-1 ring-navy-900/5"><p className="font-semibold">{tm('ageGroup')}</p><div className="mt-2 flex flex-wrap gap-1.5">{(c.age_groups ?? []).map((g: string) => <span key={g} className="tag bg-slate-100 text-brand">{g}</span>)}</div><p className="mt-4 text-navy-800/60">{events.length} {t('events')}</p></div>
        </aside>
      </div>
    </>
  );
}
