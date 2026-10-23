import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Facebook } from '@/components/Social';
import { single } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('contact'); return { title: t('title') }; }
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('contact');
  const s = await single('site_settings', { fields: ['*'] });
  const rows = [[MapPin, t('address'), s?.address], [Mail, t('email'), s?.email], [Phone, t('phone'), s?.phone], [Globe, 'Website', s?.website], [Facebook, 'Facebook', s?.facebook]] as const;
  return (
    <>
      <PageHeader kicker="SFV" title={t('title')} sub={t('sub')} />
      <section className="section container-x grid gap-4 md:grid-cols-3">
        {rows.filter(([, , v]) => v).map(([I, k, v]) => { const href = I === Mail ? `mailto:${v}` : I === Phone ? `tel:${String(v).replace(/\s/g, '')}` : I === Globe || I === Facebook ? String(v) : null; return <div key={k} className="border-t-[3px] border-sky bg-white p-6 shadow-sm ring-1 ring-navy-900/5"><I className="text-brand" size={22} /><p className="mt-4 text-sm text-navy-800/50">{k}</p>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="mt-1 block break-words font-semibold text-sky-800 hover:text-brand">{String(v).replace(/^https?:\/\/(www\.)?/, '')}</a> : <p className="mt-1 font-semibold">{v}</p>}</div>; })}
      </section>
    </>
  );
}
