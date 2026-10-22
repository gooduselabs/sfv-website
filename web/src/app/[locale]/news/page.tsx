import { getTranslations, setRequestLocale } from 'next-intl/server';
import { items, newsFilter, paged, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { NEWS_FIELDS, NewsRow, Sidebar } from '@/components/Portal';
import { Link } from '@/i18n/navigation';

export const revalidate = 60;
const PER = 10;
export async function generateMetadata() { const t = await getTranslations('news'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function News({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tp, tm] = [await getTranslations('news'), await getTranslations('portal'), await getTranslations('common')];
  const page = Math.max(1, Number(sp.page) || 1);
  const cats = await items('news_categories', { fields: ['slug', 'translations.*'] });
  const cat = cats.find((c) => c.slug === sp.category);
  const f: object[] = [newsFilter()]; if (sp.category) f.push({ category: { slug: { _eq: sp.category } } });
  const { data, total } = await paged('news', { fields: NEWS_FIELDS, filter: { _and: f }, sort: ['-publish_date'], limit: PER, page });
  const pages = Math.max(1, Math.ceil(total / PER));
  const href = (p: number) => `/news?${new URLSearchParams({ ...(sp.category ? { category: sp.category } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;
  const title = cat ? tr(cat, locale).name : t('title');
  return (
    <>
      <PageHeader title={title} sub={t('sub')} crumbs={cat ? [{ label: t('title'), href: '/news' }] : []} />
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2 border-b border-navy-900/10 pb-3">
            {[{ slug: '', name: tm('all') }, ...cats.map((c) => ({ slug: c.slug, name: tr(c, locale).name }))].map((c) => (
              <Link key={c.slug} href={c.slug ? `/news?category=${c.slug}` : '/news'} className={`rounded-sm px-3 py-1.5 text-[13px] font-semibold ${(sp.category ?? '') === c.slug ? 'bg-navy-800 text-white' : 'bg-ice-50 text-navy-800 hover:bg-ice-100'}`}>{c.name}</Link>
            ))}
          </div>
          {data.map((n) => <NewsRow key={n.id} n={n} locale={locale} />)}
          {!data.length && <p className="py-10 text-navy-800/50">{tm('noData')}</p>}
          {pages > 1 && (
            <nav className="mt-6 flex flex-wrap items-center gap-1.5" aria-label="Pagination">
              {page > 1 && <Link href={href(page - 1)} className="rounded-sm border border-navy-900/15 px-3 py-1.5 text-sm hover:bg-ice-50">‹ {tp('prev')}</Link>}
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => <Link key={p} href={href(p)} aria-current={p === page ? 'page' : undefined} className={`min-w-9 rounded-sm border px-3 py-1.5 text-center text-sm ${p === page ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-900/15 hover:bg-ice-50'}`}>{p}</Link>)}
              {page < pages && <Link href={href(page + 1)} className="rounded-sm border border-navy-900/15 px-3 py-1.5 text-sm hover:bg-ice-50">{tp('next')} ›</Link>}
            </nav>
          )}
        </div>
        <Sidebar show={['mostRead', 'announcements', 'fixtures']} />
      </div>
    </>
  );
}
