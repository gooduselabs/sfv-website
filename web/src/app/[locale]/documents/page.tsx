import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Download, FileText } from 'lucide-react';
import { fileUrl, fmtDate, items, tr } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';
import { Chips } from '@/components/Cards';
import { DemoBadge } from '@/components/Demo';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('docs'); return { title: t('title') }; }
type SP = Promise<Record<string, string | undefined>>;
export default async function Documents({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: SP }) {
  const { locale } = await params; setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tm] = [await getTranslations('docs'), await getTranslations('common')];
  const docs = await items('documents', { fields: ['*', 'translations.*', 'discipline.translations.*', 'file.id', 'file.filesize', 'file.type'], filter: sp.category ? { category: { _eq: sp.category } } : undefined, sort: ['-published_date'], limit: -1 });
  return (
    <>
      <PageHeader kicker="Docs" title={t('title')} sub={t('sub')} />
      <section className="container-x relative z-10 -mt-6"><div className="frost rounded-3xl p-4 sm:p-6"><Chips base="/documents" param="category" active={sp.category} items={[{ value: '', label: tm('all') }, ...['regulation', 'form', 'decision', 'rulebook'].map((c) => ({ value: c, label: t(c) }))]} /></div></section>
      <section className="section container-x">
        <div className="divide-y divide-navy-900/5 overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/5">
          {docs.map((d) => (
            <a key={d.id} href={fileUrl(d.file?.id ?? d.file) ?? '#'} className="group flex items-center gap-4 p-5 hover:bg-ice-50">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ice-100 text-ice-600"><FileText /></span>
              <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-semibold">{tr(d, locale).title}<DemoBadge show={d.demo} /></span><span className="block text-xs text-navy-800/50">{t(d.category)} · {tr(d.discipline, locale).name} · {fmtDate(d.published_date, locale)}</span></span>
              <span className="hidden items-center gap-1 text-sm font-semibold text-ice-600 sm:flex"><Download size={16} />{tm('download')}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
