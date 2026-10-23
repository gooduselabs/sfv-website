import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Clock, Eye, Link2, Mail, User } from 'lucide-react';
import { Facebook } from '@/components/Social';
import { asset, fmtDate, items, newsFilter, one, tr, type Item } from '@/lib/directus';
import { Breadcrumb, CatTag, NEWS_FIELDS, NewsCardV, Sidebar } from '@/components/Portal';
import { DemoBadge } from '@/components/Demo';

export const revalidate = 60;
type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P) { const { slug, locale } = await params; const n = await one('news', { fields: ['cover', 'translations.*'], filter: { _and: [{ slug: { _eq: slug } }, newsFilter()] } }); const t = tr(n, locale); return { title: t.title ?? slug, description: t.excerpt, openGraph: { images: n?.cover ? [asset(n.cover, { w: 1200 })!] : [] } }; }
export default async function Article({ params }: P) {
  const { locale, slug } = await params; setRequestLocale(locale);
  const n = await one('news', { fields: ['*', 'translations.*', 'category.id', 'category.slug', 'category.translations.*', 'discipline.slug', 'discipline.translations.*'], filter: { _and: [{ slug: { _eq: slug } }, newsFilter()] } });
  const album = n && !n.demo ? await one('galleries', { fields: ['images.directus_files_id', 'images.sort'], filter: { slug: { _eq: `album-${slug}`.slice(0, 90) } } }) : null;
  if (!n) notFound();
  const [t, tp, tm] = [await getTranslations('news'), await getTranslations('portal'), await getTranslations('menu')];
  const tn = tr(n, locale);
  const related = await items('news', { fields: NEWS_FIELDS, filter: { _and: [newsFilter(), { id: { _neq: n.id } }, { category: { _eq: n.category?.id } }] }, sort: ['-publish_date'], limit: 6 });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${locale === 'en' ? '/en' : ''}/news/${n.slug}`;
  const share = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, I: Facebook, cls: 'bg-[#1877f2]' },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tn.title ?? '')}`, I: Link2, cls: 'bg-navy-950' },
    { label: 'Zalo', href: `https://sp.zalo.me/share_inline?url=${encodeURIComponent(url)}`, I: Link2, cls: 'bg-[#0068ff]' },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(tn.title ?? '')}&body=${encodeURIComponent(url)}`, I: Mail, cls: 'bg-brand' },
  ];
  return (
    <>
      <div className="border-b border-navy-900/10 bg-slate-50"><div className="container-x py-2.5"><Breadcrumb items={[{ label: tm('home'), href: '/' }, { label: tm('news'), href: '/news' }, { label: tr(n.category, locale).name, href: `/news?category=${n.category?.slug}` }, { label: tn.title }]} /></div></div>
      <div className="container-x mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <article className="min-w-0">
          <div className="flex items-center gap-3"><CatTag n={n} locale={locale} /><DemoBadge show={n.demo} /></div>
          <h1 className="mt-2 text-[26px] font-extrabold leading-tight text-navy-950 sm:text-[34px]">{tn.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-navy-900/10 pb-3 text-[13px] text-navy-800/60">
            <span className="inline-flex items-center gap-1.5"><Clock size={14} />{fmtDate(n.publish_date, locale, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            {n.author && <span className="inline-flex items-center gap-1.5"><User size={14} />{n.author}</span>}
            {n.views > 0 && <span className="inline-flex items-center gap-1.5"><Eye size={14} />{n.views} {tp('views')}</span>}
            <span className="ml-auto flex items-center gap-1.5">{tp('share')}:{share.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} className={`grid h-7 w-7 place-items-center rounded-full text-white ${s.cls}`}>{s.label === 'X' ? <span className="text-[11px] font-bold">X</span> : s.label === 'Zalo' ? <span className="text-[9px] font-bold">Zalo</span> : <s.I size={14} />}</a>)}</span>
          </div>
          <p className="mt-5 text-[18px] font-semibold leading-relaxed text-navy-900">{tn.excerpt}</p>
          {n.cover && <figure className="mt-5"><img src={asset(n.cover, { w: 1200 })!} alt="" className="w-full rounded" /><figcaption className="mt-1.5 text-center text-[13px] italic text-navy-800/55">{n.demo ? 'Ảnh minh họa (AI, demo)' : 'Ảnh: Facebook SFV'}</figcaption></figure>}
          <div className="prose-sfv mt-4" dangerouslySetInnerHTML={{ __html: tn.body ?? '' }} />
          {album && album.images?.length > 1 && (
            <div className="mt-8">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold uppercase text-sky-800"><span className="h-5 w-1.5 bg-sky" />{tm('gallery')}</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{album.images.map((im: Item) => <a key={im.directus_files_id} href={asset(im.directus_files_id, { w: 1600 })!} target="_blank" rel="noopener noreferrer" className="group block aspect-[4/3] overflow-hidden bg-slate-100"><img src={asset(im.directus_files_id, { w: 600 })!} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></a>)}</div>
            </div>
          )}
          <p className="mt-6 text-right text-sm font-bold">{n.author}</p>
          <section className="mt-10">
            <h2 className="mb-4 border-b-2 border-navy-800 pb-1 text-[15px] font-bold uppercase tracking-wide">{t('related')}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{related.map((r) => <NewsCardV key={r.id} n={r} locale={locale} />)}</div>
          </section>
        </article>
        <Sidebar show={['mostRead', 'announcements', 'fixtures', 'documents']} />
      </div>
    </>
  );
}
