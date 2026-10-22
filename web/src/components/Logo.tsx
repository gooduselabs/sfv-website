// Original placeholder mark for SFV — pending official client branding.
// Concept: two skate-blade trails forming an "S" (ice blue above, roller neon below) + a star.
export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#6aaee6" /></linearGradient>
        <linearGradient id="lg-roller" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff6a2b" /><stop offset="1" stopColor="#ff2f8e" /></linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#071328" />
      <path d="M47 15c-9-4-24-3-28 5-3 7 6 10 13 12" fill="none" stroke="url(#lg-ice)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M32 32c7 2 16 5 13 12-4 8-19 9-28 5" fill="none" stroke="url(#lg-roller)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M12 53h40" stroke="#a6cdee" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      <path d="M50 22l1.4 2.9 3.2.4-2.3 2.2.6 3.2-2.9-1.5-2.9 1.5.6-3.2-2.3-2.2 3.2-.4z" fill="#ffd34d" />
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
          <span className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? 'text-ice-200/80' : 'text-navy-700/70'}`}>Skating · Vietnam</span>
        </span>
      )}
    </span>
  );
}
