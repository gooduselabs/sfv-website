import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Chips, CompetitionCard } from '@/components/Cards';
import { Reveal } from '@/components/Motion';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('comp'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function Competitions({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tm] = [await getTranslations('comp'), await getTranslations('common')];
  const [all, discs] = await Promise.all([
    items('competitions', { fields: ['*', 'translations.*', 'discipline.slug', 'discipline.area', 'discipline.translations.*'], filter: { status: { _neq: 'draft' } }, sort: ['start_date'], limit: -1 }),
    items('disciplines', { fields: ['slug', 'translations.*'], sort: ['sort'] }),
  ]);
  const cities = [...new Set(all.map((c) => c.city))].sort();
  const list = all.filter((c) => (!sp.discipline || c.discipline?.slug === sp.discipline) && (!sp.status || c.status === sp.status) && (!sp.city || c.city === sp.city) && (!sp.age || (c.age_groups ?? []).includes(sp.age)));
  const upcoming = list.filter((c) => c.status !== 'finished');
  const past = list.filter((c) => c.status === 'finished').reverse();
  const extra = { discipline: sp.discipline, status: sp.status, city: sp.city, age: sp.age };
  return (
    <>
      <PageHeader kicker="Calendar" title={t('title')} sub={t('sub')} />
      <section className="container-x -mt-6 relative z-10">
        <div className="frost space-y-3 rounded-3xl p-4 shadow-lg shadow-navy-900/5 sm:p-6">
          <Chips base="/competitions" param="discipline" active={sp.discipline} extra={extra} items={[{ value: '', label: tm('all') }, ...discs.map((d) => ({ value: d.slug, label: tr(d, locale).name }))]} />
          <Chips base="/competitions" param="status" active={sp.status} extra={extra} items={[{ value: '', label: tm('status') + ': ' + tm('all') }, ...['upcoming', 'registration_open', 'finished'].map((s) => ({ value: s, label: t(s) }))]} />
          <div className="flex flex-wrap gap-6">
            <Chips base="/competitions" param="age" active={sp.age} extra={extra} items={[{ value: '', label: tm('ageGroup') }, ...['U9', 'U11', 'U13', 'U15', 'U17', 'Open'].map((s) => ({ value: s, label: s }))]} />
            <Chips base="/competitions" param="city" active={sp.city} extra={extra} items={[{ value: '', label: t('city') }, ...cities.map((s) => ({ value: s, label: s }))]} />
          </div>
        </div>
      </section>
      <section className="section container-x space-y-14">
        {[[t('upcoming'), upcoming], [t('finished'), past]].map(([h, l]) => (
          <div key={h as string}>
            <h2 className="font-display mb-5 text-2xl font-bold">{h as string} <span className="text-navy-800/40">({(l as unknown[]).length})</span></h2>
            <div className="grid gap-3">{(l as typeof all).map((c, i) => <Reveal key={c.id} delay={i * 0.04}><CompetitionCard c={c} locale={locale} label={t(c.status)} /></Reveal>)}</div>
            {!(l as unknown[]).length && <p className="text-navy-800/50">{tm('noData')}</p>}
          </div>
        ))}
      </section>
    </>
  );
}
