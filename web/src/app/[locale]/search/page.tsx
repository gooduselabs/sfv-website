import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, newsFilter, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Link } from '@/i18n/navigation';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { const t = await getTranslations('search'); return { title: t('title') }; }
export default async function Search({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const { q = '' } = await searchParams;
  const [t, tn] = [await getTranslations('search'), await getTranslations('nav')];
  const term = q.trim();
  const groups = term.length >= 2 ? await Promise.all([
    items('news', { fields: ['slug', 'translations.title'], filter: { _and: [newsFilter(), { translations: { title: { _icontains: term } } }] }, limit: 10 }).then((r) => ({ k: 'news', list: r.map((x) => ({ href: `/news/${x.slug}`, label: tr(x, locale).title })) })),
    items('competitions', { fields: ['slug', 'translations.name'], filter: { translations: { name: { _icontains: term } } }, limit: 10 }).then((r) => ({ k: 'competitions', list: r.map((x) => ({ href: `/competitions/${x.slug}`, label: tr(x, locale).name })) })),
    items('athletes', { fields: ['slug', 'full_name'], filter: { full_name: { _icontains: term } }, limit: 10 }).then((r) => ({ k: 'athletes', list: r.map((x) => ({ href: `/athletes/${x.slug}`, label: x.full_name })) })),
    items('clubs', { fields: ['name', 'city'], filter: { _or: [{ name: { _icontains: term } }, { city: { _icontains: term } }] }, limit: 10 }).then((r) => ({ k: 'clubs', list: r.map((x) => ({ href: `/clubs`, label: `${x.name} – ${x.city}` })) })),
  ]) : [];
  const total = groups.reduce((a, g) => a + g.list.length, 0);
  return (
    <>
      <PageHeader kicker="Search" title={t('title')}>
        <form className="mt-6 flex max-w-2xl gap-2"><input name="q" defaultValue={q} placeholder={t('placeholder')} className="w-full rounded-full bg-white/95 px-5 py-3.5 text-navy-950 outline-none" autoFocus /><button className="rounded-full bg-gradient-to-r from-neon-orange to-neon-pink px-6 font-semibold">{tn('search')}</button></form>
      </PageHeader>
      <section className="section container-x">
        {term && <p className="mb-6 text-navy-800/60">{t('results')} “{term}”: {total}</p>}
        {term && !total && <p>{t('empty')}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {groups.filter((g) => g.list.length).map((g) => (
            <div key={g.k} className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5"><h2 className="font-display mb-3 font-bold">{tn(g.k)}</h2><ul className="space-y-1.5">{g.list.map((x, i) => <li key={i}><Link href={x.href} className="text-brand hover:underline">{x.label}</Link></li>)}</ul></div>
          ))}
        </div>
      </section>
    </>
  );
}
