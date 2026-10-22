import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { AthleteCard, Chips } from '@/components/Cards';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('athletes'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function Athletes({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tm] = [await getTranslations('athletes'), await getTranslations('common')];
  const discs = await items('disciplines', { fields: ['slug', 'translations.*'], sort: ['sort'] });
  const filter: object[] = [];
  if (sp.discipline) filter.push({ discipline: { slug: { _eq: sp.discipline } } });
  if (sp.gender) filter.push({ gender: { _eq: sp.gender } });
  const list = await items('athletes', { fields: ['*', 'club.name', 'discipline.area', 'discipline.translations.*'], filter: filter.length ? { _and: filter } : undefined, search: sp.q, sort: ['full_name'], limit: 120 });
  const extra = { discipline: sp.discipline, gender: sp.gender, q: sp.q };
  return (
    <>
      <PageHeader kicker="Athletes" title={t('title')} sub={t('sub')} />
      <section className="container-x relative z-10 -mt-6">
        <div className="frost space-y-3 rounded-3xl p-4 sm:p-6">
          <form className="flex gap-2" action="">
            {sp.discipline && <input type="hidden" name="discipline" value={sp.discipline} />}
            <input name="q" defaultValue={sp.q} placeholder={t('search')} className="w-full rounded-full bg-white px-5 py-2.5 text-sm ring-1 ring-navy-900/10 outline-none focus:ring-ice-400" />
            <button className="rounded-full bg-navy-900 px-5 text-sm font-semibold text-white">{tm('filter')}</button>
          </form>
          <Chips base="/athletes" param="discipline" active={sp.discipline} extra={extra} items={[{ value: '', label: tm('all') }, ...discs.map((d) => ({ value: d.slug, label: tr(d, locale).name }))]} />
          <Chips base="/athletes" param="gender" active={sp.gender} extra={extra} items={[{ value: '', label: tm('gender') }, { value: 'M', label: tm('men') }, { value: 'F', label: tm('women') }]} />
        </div>
      </section>
      <section className="section container-x">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((a) => <AthleteCard key={a.id} a={a} locale={locale} />)}</div>
        {!list.length && <p className="text-navy-800/50">{tm('noData')}</p>}
      </section>
    </>
  );
}
