import { getTranslations, setRequestLocale } from 'next-intl/server';
import { get, items, tr, type Item } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Chips } from '@/components/Cards';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('results'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function Results({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tc, tm, tn] = [await getTranslations('results'), await getTranslations('comp'), await getTranslations('common'), await getTranslations('nav')];
  const discs = await items('disciplines', { fields: ['slug', 'area', 'translations.*'], sort: ['sort'] });
  const discipline = sp.discipline ?? 'inline-speed';
  const q = new URLSearchParams({ discipline }); if (sp.age) q.set('age_group', sp.age); if (sp.gender) q.set('gender', sp.gender);
  const [ranking, finished] = await Promise.all([
    get<Item[]>(`/sfv/rankings?${q}`),
    items('competitions', { fields: ['slug', 'start_date', 'translations.*', 'discipline.translations.*'], filter: { status: { _eq: 'finished' } }, sort: ['-start_date'], limit: 6 }),
  ]);
  const extra = { discipline, age: sp.age, gender: sp.gender };
  return (
    <>
      <PageHeader kicker="Rankings" title={t('title')} sub={t('sub')}>
        <Link href="/records" className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">{tn('records')} →</Link>
      </PageHeader>
      <section className="container-x relative z-10 mt-6">
        <div className="frost space-y-3 rounded-3xl p-4 sm:p-6">
          <Chips base="/results" param="discipline" active={discipline} extra={extra} items={discs.map((d) => ({ value: d.slug, label: tr(d, locale).name }))} />
          <div className="flex flex-wrap gap-6">
            <Chips base="/results" param="age" active={sp.age} extra={extra} items={[{ value: '', label: tm('ageGroup') + ': ' + tm('all') }, ...['U11', 'U13', 'U15', 'Open'].map((s) => ({ value: s, label: s }))]} />
            <Chips base="/results" param="gender" active={sp.gender} extra={extra} items={[{ value: '', label: tm('all') }, { value: 'M', label: tm('men') }, { value: 'F', label: tm('women') }]} />
          </div>
        </div>
      </section>
      <section className="section container-x grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <h2 className="font-display mb-1 text-2xl font-bold">{t('ranking')} · {tr(discs.find((d) => d.slug === discipline), locale).name}</h2>
          <p className="mb-4 text-sm text-amber-700">⚠ {tm('demoNote')}</p>
          <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-navy-900/5">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-navy-900 text-left text-xs uppercase tracking-wider text-white/80"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">{tc('athlete')}</th><th className="px-4 py-3">{tm('club')}</th><th className="px-4 py-3">{tm('birthYear')}</th><th className="px-4 py-3 text-right">{t('starts')}</th><th className="px-4 py-3 text-right">{t('best')}</th><th className="px-4 py-3 text-right">{tc('points')}</th></tr></thead>
              <tbody>{(ranking ?? []).map((r) => (
                <tr key={r.athlete_id} className="border-t border-navy-900/5 hover:bg-sky-50">
                  <td className="px-4 py-3"><span className={`font-display font-bold ${r.position <= 3 ? 'text-gradient-roller text-lg' : 'text-navy-800/50'}`}>{r.position}</span></td>
                  <td className="px-4 py-3 font-medium"><Link href={`/athletes/${r.slug}`} className="hover:text-sky-700">{r.full_name}</Link></td>
                  <td className="px-4 py-3 text-navy-800/60">{r.club}</td><td className="px-4 py-3">{r.birth_year}</td>
                  <td className="px-4 py-3 text-right">{r.starts}</td><td className="px-4 py-3 text-right">{r.best_rank}</td>
                  <td className="px-4 py-3 text-right font-display font-bold text-sky-700">{r.points}</td>
                </tr>
              ))}</tbody>
            </table>
            {!ranking?.length && <p className="p-6 text-navy-800/50">{tm('noData')}</p>}
          </div>
        </div>
        <aside>
          <h3 className="font-display mb-4 text-lg font-bold">{t('recent')}</h3>
          <div className="space-y-2">{finished.map((c) => <Link key={c.slug} href={`/competitions/${c.slug}#results`} className="block rounded-2xl bg-white p-4 ring-1 ring-navy-900/5 hover:ring-brand"><p className="text-xs text-sky-700">{tr(c.discipline, locale).name}</p><p className="font-semibold leading-snug">{tr(c, locale).name}</p></Link>)}</div>
        </aside>
      </section>
    </>
  );
}
