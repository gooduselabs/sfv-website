import { getTranslations, setRequestLocale } from 'next-intl/server';
import { fmtDate, items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Demo';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('records'); return { title: t('title') }; }
export default async function Records({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const [t, tm] = [await getTranslations('records'), await getTranslations('common')];
  const recs = await items('national_records', { fields: ['*', 'athlete.full_name', 'athlete.slug', 'discipline.slug', 'discipline.translations.*'], sort: ['discipline', 'event_name'], limit: -1 });
  const groups = recs.reduce<Record<string, typeof recs>>((a, r) => { const k = tr(r.discipline, locale).name; (a[k] ||= []).push(r); return a; }, {});
  return (
    <>
      <PageHeader kicker="NR" title={t('title')} sub={t('sub')} />
      <section className="section container-x space-y-12">
        <p className="text-sm text-amber-700">⚠ {tm('demoNote')}</p>
        {Object.entries(groups).map(([g, list]) => (
          <div key={g}>
            <h2 className="font-display mb-4 text-2xl font-bold">{g}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r) => (
                <div key={r.id} className="relative overflow-hidden rounded-3xl bg-navy-950 p-6 text-white">
                  <div className="scratch absolute inset-0" />
                  <div className="relative">
                    <div className="flex items-center gap-2"><span className="tag bg-white/10">{r.event_name}</span><span className="tag bg-white/10">{r.age_group}</span><span className="tag bg-white/10">{r.gender === 'M' ? tm('men') : tm('women')}</span><DemoBadge show={r.demo} /></div>
                    <p className="font-display mt-5 text-5xl font-bold tabular-nums text-gradient-ice">{r.mark}</p>
                    <p className="mt-4 text-sm text-white/60">{t('holder')}</p>
                    <Link href={`/athletes/${r.athlete?.slug}`} className="font-semibold hover:underline">{r.athlete?.full_name}</Link>
                    <p className="mt-2 text-xs text-white/50">{fmtDate(r.record_date, locale)} · {r.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
