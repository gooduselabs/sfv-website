import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { asset, items, newsFilter, one, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { AthleteCard, CompetitionCard, NewsCard, SectionTitle } from '@/components/Cards';

export const revalidate = 60;
type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P) { const { slug, locale } = await params; const d = await one('disciplines', { fields: ['translations.*'], filter: { slug: { _eq: slug } } }); return { title: tr(d, locale).name ?? slug }; }
export default async function Discipline({ params }: P) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const d = await one('disciplines', { fields: ['*', 'translations.*'], filter: { slug: { _eq: slug } } });
  if (!d) notFound();
  const [t, tc, tm, tn] = [await getTranslations('disc'), await getTranslations('comp'), await getTranslations('common'), await getTranslations('nav')];
  const f = { discipline: { _eq: d.id } };
  const [comps, news, ath] = await Promise.all([
    items('competitions', { fields: ['*', 'translations.*', 'discipline.area', 'discipline.translations.*'], filter: f, sort: ['-start_date'], limit: 4 }),
    items('news', { fields: ['*', 'translations.*', 'category.translations.*'], filter: { _and: [f, newsFilter()] }, sort: ['-publish_date'], limit: 3 }),
    items('athletes', { fields: ['*', 'club.name', 'discipline.area', 'discipline.translations.*'], filter: f, limit: 4 }),
  ]);
  const dt = tr(d, locale);
  const area = d.area === 'roller' ? 'roller' : 'ice';
  return (
    <>
      <PageHeader area={area} kicker={`${tn(area)} · ${d.governing_body}`} title={dt.name} sub={dt.summary} image={asset(d.cover, { w: 1800 })}>
        {!d.confirmed && <p className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-1.5 text-sm font-semibold text-amber-950">⚠ {d.status_note}</p>}
      </PageHeader>
      <section className="section container-x grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div><h2 className="font-display text-3xl font-bold">{t('rules')}</h2><p className="mt-3 text-navy-800/60">{t('governing')}: <b>{d.governing_body}</b></p><p className="mt-2 text-navy-800/60">{dt.events_desc}</p></div>
        <div className="prose-sfv rounded-3xl bg-white p-6 ring-1 ring-navy-900/5 sm:p-8" dangerouslySetInnerHTML={{ __html: dt.rules ?? '' }} />
      </section>
      {comps.length > 0 && <section className="container-x pb-16"><SectionTitle title={tc('title')} href="/competitions" more={tm('viewAll')} /><div className="grid gap-3">{comps.map((c) => <CompetitionCard key={c.id} c={c} locale={locale} label={tc(c.status)} />)}</div></section>}
      {news.length > 0 && <section className="container-x pb-16"><SectionTitle title={tn('news')} href="/news" more={tm('viewAll')} /><div className="grid gap-5 md:grid-cols-3">{news.map((n) => <NewsCard key={n.id} n={n} locale={locale} />)}</div></section>}
      {ath.length > 0 && <section className="container-x"><SectionTitle title={tn('athletes')} href={`/athletes?discipline=${slug}`} more={tm('viewAll')} /><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{ath.map((a) => <AthleteCard key={a.id} a={a} locale={locale} />)}</div></section>}
    </>
  );
}
