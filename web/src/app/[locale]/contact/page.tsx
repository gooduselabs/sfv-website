import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Mail, MapPin, Phone } from 'lucide-react';
import { single } from '@/lib/directus';
import { PageHeader } from '@/components/PageHeader';

export const revalidate = 60;
export async function generateMetadata() { const t = await getTranslations('contact'); return { title: t('title') }; }
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; setRequestLocale(locale);
  const t = await getTranslations('contact');
  const s = await single('site_settings', { fields: ['*'] });
  const rows = [[MapPin, t('address'), s?.address], [Mail, t('email'), s?.email], [Phone, t('phone'), s?.phone]] as const;
  return (
    <>
      <PageHeader kicker="SFV" title={t('title')} sub={t('sub')} />
      <section className="section container-x grid gap-4 md:grid-cols-3">
        {rows.map(([I, k, v]) => <div key={k} className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5"><I className="text-brand" /><p className="mt-4 text-sm text-navy-800/50">{k}</p><p className="font-display mt-1 font-semibold">{v}</p></div>)}
        <p className="text-sm text-amber-700 md:col-span-3">⚠ Thông tin liên hệ mẫu – chờ SFV cung cấp / Sample contact info.</p>
      </section>
    </>
  );
}
