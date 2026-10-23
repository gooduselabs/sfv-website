import { Link } from '@/i18n/navigation';
export default function NotFound() {
  return <div className="container-x grid min-h-[70vh] place-items-center pt-24 text-center"><div><p className="font-display text-8xl font-bold text-gold">404</p><p className="mt-4">Không tìm thấy trang / Page not found</p><Link href="/" className="mt-6 inline-block rounded-full bg-navy-900 px-5 py-2.5 text-white">SFV</Link></div></div>;
}
