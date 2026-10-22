import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { asset, fmtDate, items, newsFilter, one, tr } from '@/lib/directus';
import { NewsCard } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P) { const { slug, locale } = await params; const n = await one('news', { fields: ['cover', 'translations.*'], filter: { _and: [{ slug: { _eq: slug } }, newsFilter()] } }); const t = tr(n, locale); return { title: t.title ?? slug, description: t.excerpt, openGraph: { images: n?.cover ? [asset(n.cover, { w: 1200 })!] : [] } }; }
export default async function Article({ params }: P) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const n = await one('news', { fields: ['*', 'translations.*', 'category.translations.*', 'discipline.slug', 'discipline.translations.*'], filter: { _and: [{ slug: { _eq: slug } }, newsFilter()] } });
  if (!n) notFound();
  const t = await getTranslations('news');
  const tn = tr(n, locale);
  const related = await items('news', { fields: ['*', 'translations.*', 'category.translations.*'], filter: { _and: [newsFilter(), { id: { _neq: n.id } }] }, sort: ['-publish_date'], limit: 3 });
  return (
    <article>
      <header className="relative overflow-hidden bg-navy-950 pb-10 pt-32 text-white sm:pt-40">
        {n.cover && <img src={asset(n.cover, { w: 1800 })!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-navy-950/30" />
        <div className="container-x relative max-w-4xl">
          <div className="flex flex-wrap items-center gap-2"><span className="tag bg-white/15">{tr(n.category, locale).name}</span>{n.discipline && <Link href={`/disciplines/${n.discipline.slug}`} className="tag bg-ice-500">{tr(n.discipline, locale).name}</Link>}<DemoBadge show={n.demo} /></div>
          <h1 className="font-display mt-4 text-3xl font-bold leading-tight sm:text-5xl">{tn.title}</h1>
          <p className="mt-4 text-sm text-white/60">{fmtDate(n.publish_date, locale, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </header>
      <div className="container-x max-w-3xl py-12">
        <p className="text-lg font-medium text-navy-800/80">{tn.excerpt}</p>
        <div className="prose-sfv mt-6" dangerouslySetInnerHTML={{ __html: tn.body ?? '' }} />
      </div>
      <section className="container-x"><h2 className="font-display mb-6 text-2xl font-bold">{t('related')}</h2><div className="grid gap-5 md:grid-cols-3">{related.map((r) => <NewsCard key={r.id} n={r} locale={locale} />)}</div></section>
    </article>
  );
}
