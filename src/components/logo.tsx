export function Logo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect width="32" height="32" rx="4" fill="#1c4bd6" />
        <circle cx="16" cy="16" r="8.5" fill="none" stroke="#fff" strokeWidth="1.6" />
        <ellipse cx="16" cy="16" rx="8.5" ry="3.6" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
        <circle cx="22.5" cy="11.5" r="2.4" fill="#5eead4" />
      </svg>
      {!compact && (
        <span className={`font-mono text-[15px] font-semibold tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
          ops<span className="text-brand-400">/</span>sphere
        </span>
      )}
    </span>
  )
}
