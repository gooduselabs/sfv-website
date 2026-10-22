import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { asset, fmtDate, items, one, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { initials } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P) { const { slug } = await params; const a = await one('athletes', { fields: ['full_name'], filter: { slug: { _eq: slug } } }); return { title: a?.full_name ?? slug }; }
export default async function Athlete({ params }: P) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const a = await one('athletes', { fields: ['*', 'translations.*', 'club.name', 'club.city', 'discipline.area', 'discipline.slug', 'discipline.translations.*'], filter: { slug: { _eq: slug } } });
  if (!a) notFound();
  const [t, tc, tm] = [await getTranslations('athletes'), await getTranslations('comp'), await getTranslations('common')];
  const res = await items('results', { fields: ['*', 'event.translations.*', 'event.competition.slug', 'event.competition.start_date', 'event.competition.translations.*'], filter: { athlete: { _eq: a.id } }, sort: ['-event.competition.start_date'], limit: -1 });
  const at = tr(a, locale);
  const area = a.discipline?.area === 'roller' ? 'roller' : 'ice';
  const best = res.length ? Math.min(...res.map((r) => r.rank ?? 99)) : null;
  return (
    <>
      <PageHeader area={area} kicker={tr(a.discipline, locale).name} title={a.full_name} sub={at.bio}>
        <div className="mt-6 flex flex-wrap gap-2"><DemoBadge show={a.demo} /></div>
      </PageHeader>
      <section className="container-x grid gap-10 py-12 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className={`grid aspect-square place-items-center overflow-hidden rounded-[2rem] ${area === 'roller' ? 'bg-roller' : 'bg-ice-grad'} ring-1 ring-navy-900/5`}>
            {a.photo ? <img src={asset(a.photo, { w: 600 })!} alt={a.full_name} className="h-full w-full object-cover" /> : <span className={`font-display text-8xl font-bold ${area === 'roller' ? 'text-gradient-roller' : 'text-ice-500'}`}>{initials(a.full_name)}</span>}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {[[tm('birthYear'), a.birth_year], [tm('gender'), a.gender === 'M' ? tm('men') : tm('women')], [tm('club'), a.club?.name], [tc('city'), a.club?.city], [tc('results'), res.length], [tc('rank'), best ? `#${best}` : '-']].map(([k, v]) => (
              <div key={String(k)} className="rounded-2xl bg-white p-4 ring-1 ring-navy-900/5"><dt className="text-xs text-navy-800/50">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>
            ))}
          </dl>
        </aside>
        <div className="min-w-0 space-y-10">
          <div><h2 className="font-display mb-3 text-2xl font-bold">{t('achievements')}</h2><div className="prose-sfv" dangerouslySetInnerHTML={{ __html: at.achievements ?? '' }} /></div>
          <div>
            <h2 className="font-display mb-3 text-2xl font-bold">{t('history')}</h2>
            <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-navy-900/5"><table className="w-full min-w-[520px] text-sm">
              <thead className="bg-navy-900 text-left text-xs uppercase tracking-wider text-white/80"><tr><th className="px-4 py-3">{tm('date')}</th><th className="px-4 py-3">{tc('title')}</th><th className="px-4 py-3">{tm('discipline')}</th><th className="px-4 py-3 text-right">{tc('rank')}</th><th className="px-4 py-3 text-right">{tc('mark')}</th></tr></thead>
              <tbody>{res.map((r) => (
                <tr key={r.id} className="border-t border-navy-900/5"><td className="px-4 py-3 text-navy-800/60">{fmtDate(r.event?.competition?.start_date, locale)}</td><td className="px-4 py-3"><Link href={`/competitions/${r.event?.competition?.slug}#results`} className="font-medium hover:text-ice-600">{tr(r.event?.competition, locale).name}</Link></td><td className="px-4 py-3">{tr(r.event, locale).name}</td><td className="px-4 py-3 text-right font-bold">{r.rank}</td><td className="px-4 py-3 text-right font-mono">{r.result_text}</td></tr>
              ))}</tbody>
            </table>{!res.length && <p className="p-6 text-navy-800/50">{tm('noData')}</p>}</div>
          </div>
        </div>
      </section>
    </>
  );
}
