'use client';
import { useState, type ReactNode } from 'react';
export function Tabs({ tabs }: { tabs: { key: string; label: string; accent: 'ice' | 'roller'; content: ReactNode }[] }) {
  const [a, setA] = useState(tabs[0]?.key);
  const cur = tabs.find((t) => t.key === a) ?? tabs[0];
  return (
    <div>
      <div className={`mb-4 flex border-b-2 ${cur?.accent === 'roller' ? 'border-neon-orange' : 'border-brand'}`} role="tablist">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={a === t.key} onClick={() => setA(t.key)} className={`-mb-0.5 px-4 py-2 text-[15px] font-bold uppercase tracking-wide transition ${a === t.key ? (t.accent === 'roller' ? 'bg-neon-orange text-white' : 'bg-brand text-white') : 'text-navy-800/60 hover:text-sky-700'}`}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel">{cur?.content}</div>
    </div>
  );
}
