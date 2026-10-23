import { Link } from '@/i18n/navigation';
export function Ticker({ label, items }: { label: string; items: { href: string; title: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="border-b border-navy-900/10 bg-white">
      <div className="container-x flex h-10 items-center gap-3 overflow-hidden">
        <span className="shrink-0 rounded-sm bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{label}</span>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_3%,black_97%,transparent)]">
          <div className="ticker flex w-max gap-10 whitespace-nowrap text-[14px] font-medium">
            {[...items, ...items].map((i, k) => <Link key={k} href={i.href} className="hover:text-brand"><span className="mr-2 text-neon-orange">■</span>{i.title}</Link>)}
          </div>
        </div>
      </div>
    </div>
  );
}
