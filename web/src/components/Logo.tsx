// Original placeholder mark for SFV — pending official client branding.
// Concept: two skate-blade trails forming an "S" (ice blue above, roller neon below) + a star.
export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  // Placeholder crest (red / navy / gold) — pending official SFV branding.
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 2l26 8v20c0 16-11 26-26 32C17 56 6 46 6 30V10z" fill="#0b1d3a" />
      <path d="M32 6.5l22 6.8V30c0 13.6-9.3 22.3-22 27.6C19.3 52.3 10 43.6 10 30V13.3z" fill="#c8102e" />
      <path d="M32 6.5l22 6.8V30c0 13.6-9.3 22.3-22 27.6C19.3 52.3 10 43.6 10 30V13.3z" fill="none" stroke="#f4b400" strokeWidth="1.4" />
      <path d="M32 12.5l1.6 3.4 3.7.4-2.8 2.5.8 3.6-3.3-1.9-3.3 1.9.8-3.6-2.8-2.5 3.7-.4z" fill="#f4b400" />
      <path d="M42 27c-6-3.4-17-2.6-19 2.4-1.7 4.6 5 6.4 9.4 7.6 4.6 1.3 10.4 3.2 8.4 7.8-2.3 5-13 5.4-19 2" fill="none" stroke="#fff" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M18 53.5h28" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}
export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <span className="flex items-center gap-3" title="Logo tạm – placeholder">
      <LogoMark className="h-10 w-10 shrink-0 drop-shadow-sm" />
      {!compact && (
        <span className={`leading-tight ${dark ? 'text-white' : 'text-navy-900'}`}>
          <span className="font-display block text-lg font-bold tracking-tight">SFV</span>
          <span className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-gold' : 'text-navy-700/70'}`}>Skating · Vietnam</span>
        </span>
      )}
    </span>
  );
}
