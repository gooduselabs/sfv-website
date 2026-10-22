import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, newsFilter, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Chips, NewsCard } from '@/components/Cards';
import { Reveal } from '@/components/Motion';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('news'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function News({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tm] = [await getTranslations('news'), await getTranslations('common')];
  const cats = await items('news_categories', { fields: ['slug', 'translations.*'] });
  const f: object[] = [newsFilter()]; if (sp.category) f.push({ category: { slug: { _eq: sp.category } } });
  const list = await items('news', { fields: ['*', 'translations.*', 'category.translations.*'], filter: { _and: f }, sort: ['-publish_date'], limit: 30 });
  return (
    <>
      <PageHeader kicker="SFV" title={t('title')} sub={t('sub')} />
      <section className="container-x relative z-10 -mt-6"><div className="frost rounded-3xl p-4 sm:p-6"><Chips base="/news" param="category" active={sp.category} items={[{ value: '', label: tm('all') }, ...cats.map((c) => ({ value: c.slug, label: tr(c, locale).name }))]} /></div></section>
      <section className="section container-x"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((n, i) => <Reveal key={n.id} delay={(i % 3) * 0.05}><NewsCard n={n} locale={locale} /></Reveal>)}</div>{!list.length && <p>{tm('noData')}</p>}</section>
    </>
  );
}
