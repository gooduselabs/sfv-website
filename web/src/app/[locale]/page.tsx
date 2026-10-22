import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { asset, items, newsFilter, tr, type Item } from '@/lib/directus';
import { Ticker } from '@/components/Ticker';
import { Tabs } from '@/components/Tabs';
import { BlockTitle, NEWS_FIELDS, NewsBig, NewsCardV, NewsSide, Sidebar } from '@/components/Portal';

export const revalidate = 60;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tm] = [await getTranslations('portal'), await getTranslations('menu')];
  const [news, galleries, teams] = await Promise.all([
    items('news', { fields: [...NEWS_FIELDS, 'featured', 'breaking'], filter: newsFilter(), sort: ['-publish_date'], limit: 60 }),
    items('galleries', { fields: ['slug', 'type', 'cover', 'date', 'translations.*'], sort: ['-date'], limit: 12 }),
    items('national_teams', { fields: ['slug', 'season', 'category', 'translations.*', 'discipline.area', 'discipline.cover', 'discipline.translations.*', 'members.id'] }),
  ]);
  const featured = news.filter((n) => n.featured);
  const lead = featured[0] ?? news[0];
  const side = news.filter((n) => n.id !== lead?.id).slice(0, 4);
  const used = new Set([lead?.id, ...side.map((n) => n.id)]);
  const byCat = (slug: string) => news.filter((n) => n.category?.slug === slug);
  const latest = news.filter((n) => !used.has(n.id)).slice(0, 6);
  const photos = galleries.filter((g) => g.type === 'photo').slice(0, 6);
  const videos = galleries.filter((g) => g.type === 'video');
  const section = (slug: string, accent: 'ice' | 'roller' = 'ice') => {
    const l = byCat(slug); if (!l.length) return null;
    return (
      <section key={slug}>
        <BlockTitle title={tm(`cat_${slug}`)} href={`/news?category=${slug}`} more={t('more')} accent={accent} />
        <div className="grid gap-5 md:grid-cols-[1.25fr_1fr]">
          <NewsBig n={l[0]} locale={locale} />
          <div className="space-y-4">{l.slice(1, 5).map((n) => <NewsSide key={n.id} n={n} locale={locale} />)}</div>
        </div>
      </section>
    );
  };
  const grid4 = (l: Item[]) => <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{l.slice(0, 8).map((n) => <NewsCardV key={n.id} n={n} locale={locale} />)}</div>;
  return (
    <>
      <Ticker label={t('breaking')} items={news.filter((n) => n.breaking).map((n) => ({ href: `/news/${n.slug}`, title: tr(n, locale).title }))} />

      {/* hero: 1 big + 4 side */}
      {lead && (
        <section className="container-x pt-6">
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Link href={`/news/${lead.slug}`} className="group relative block overflow-hidden rounded bg-navy-900">
              <img src={asset(lead.cover, { w: 1400 })!} alt="" className="aspect-[16/10] h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] lg:aspect-auto lg:min-h-[460px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                <span className="rounded-sm bg-ice-600 px-2 py-0.5 text-[11.5px] font-bold uppercase">{tr(lead.category, locale).name}</span>
                {lead.demo && <span className="ml-2 rounded-sm bg-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-950">DEMO</span>}
                <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-[32px]">{tr(lead, locale).title}</h2>
                <p className="mt-2 line-clamp-2 max-w-2xl text-[15px] text-white/80">{tr(lead, locale).excerpt}</p>
                <span className="mt-3 inline-flex rounded-sm border border-white/50 px-3 py-1 text-[13px] font-semibold">{t('more')} ›</span>
              </div>
            </Link>
            <div className="grid content-between gap-4">{side.map((n) => <NewsSide key={n.id} n={n} locale={locale} />)}</div>
          </div>
        </section>
      )}

      <div className="container-x mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-10">
          <section>
            <BlockTitle title={t('latest')} href="/news" more={t('viewAllNews')} />
            <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">{latest.map((n) => <NewsSide key={n.id} n={n} locale={locale} />)}</div>
          </section>
          {section('hoat-dong')}
          {section('thong-bao')}
          <section>
            <Tabs tabs={[
              { key: 'ice', label: tm('cat_truot-bang'), accent: 'ice', content: grid4(byCat('truot-bang')) },
              { key: 'roller', label: tm('cat_roller'), accent: 'roller', content: grid4(byCat('roller')) },
            ]} />
          </section>
          {section('doi-tuyen')}
          <section>
            <BlockTitle title={t('teams')} href="/teams" more={t('more')} />
            <div className="grid gap-4 sm:grid-cols-3">
              {teams.map((tm2) => (
                <Link key={tm2.slug} href="/teams" className="group relative block overflow-hidden rounded">
                  <img src={asset(tm2.discipline?.cover, { w: 500 })!} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tm2.discipline?.area === 'roller' ? 'from-[#4a1430]' : 'from-navy-950'} to-transparent`} />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[11px] font-bold uppercase text-ice-200">{tr(tm2.discipline, locale).name} · {tm2.season}</p><p className="font-bold leading-snug">{tr(tm2, locale).name}</p><p className="text-xs text-white/70">{tm2.members?.length ?? 0} VĐV</p></div>
                </Link>
              ))}
            </div>
          </section>
          {section('quoc-te')}
          {section('dao-tao')}
        </div>
        <Sidebar show={['fixtures', 'results', 'announcements', 'mostRead', 'documents']} />
      </div>

      {/* video block */}
      <section className="mt-12 bg-navy-900 py-10 text-white">
        <div className="container-x">
          <div className="mb-5 flex items-end justify-between border-b border-white/15 pb-2"><h2 className="text-lg font-extrabold uppercase tracking-wide"><span className="text-neon-orange">▶</span> {t('video')}</h2><Link href="/gallery#videos" className="text-[13px] font-semibold text-ice-300 hover:underline">{t('more')} ›</Link></div>
          <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
            {[...videos, ...photos.slice(0, 2)].slice(0, 3).map((v, i) => (
              <Link key={v.slug} href="/gallery#videos" className={`group relative block overflow-hidden rounded ${i === 0 ? 'md:row-span-2' : ''}`}>
                <img src={asset(v.cover, { w: i === 0 ? 1100 : 600 })!} alt="" loading="lazy" className="aspect-video h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-neon-orange/90 transition group-hover:scale-110"><Play fill="white" size={22} /></span>
                <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 to-transparent p-4 pt-10 text-[15px] font-semibold">{tr(v, locale).title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* photo gallery strip */}
      <section className="container-x mt-10">
        <BlockTitle title={t('gallery')} href="/gallery" more={t('more')} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {photos.map((g) => (
            <Link key={g.slug} href="/gallery#photos" className="group relative block overflow-hidden rounded">
              <img src={asset(g.cover, { w: 400, h: 300, fit: 'cover' })!} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-110" />
              <p className="absolute inset-x-0 bottom-0 truncate bg-navy-950/70 px-2 py-1 text-[12px] text-white">{tr(g, locale).title}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
