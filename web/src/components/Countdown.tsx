'use client';
import { useEffect, useState } from 'react';
export function Countdown({ to, labels }: { to: string; labels: [string, string, string, string] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, new Date(to).getTime() - (now ?? new Date(to).getTime()));
  const parts = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];
  return (
    <div className="grid grid-cols-4 gap-2" aria-live="off">
      {parts.map((v, i) => (
        <div key={i} className="rounded-2xl bg-white/10 px-2 py-3 text-center ring-1 ring-white/15">
          <div className="font-display text-2xl font-bold tabular-nums text-white sm:text-3xl" suppressHydrationWarning>{now === null ? '--' : String(v).padStart(2, '0')}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-widest text-ice-200/80">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}
