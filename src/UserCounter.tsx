import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { useUserCount } from './hooks';

/** Live registered-user counter shown in the top-right corner. */
export function UserCounter({ compact = false }: { compact?: boolean }) {
  const { count, live } = useUserCount();
  const [bump, setBump] = useState(false);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (count !== null && prev.current !== null && count > prev.current) {
      setBump(true);
      const id = window.setTimeout(() => setBump(false), 900);
      return () => window.clearTimeout(id);
    }
    prev.current = count;
  }, [count]);
  useEffect(() => {
    prev.current = count;
  });

  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'} text-xs shadow-sm`}
      title={live ? 'Live count of registered users' : 'User count (reconnecting…)'}
      aria-live="polite"
    >
      <span className="relative flex w-2 h-2">
        {live && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />}
        <span className={`relative inline-flex w-2 h-2 rounded-full ${live ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      </span>
      <Users className="w-3.5 h-3.5 text-[var(--muted)]" />
      <span className={`font-semibold tabular-nums transition-transform duration-300 ${bump ? 'scale-125 text-emerald-300' : ''}`}>
        {count === null ? '—' : count.toLocaleString()}
      </span>
      {!compact && <span className="text-[var(--muted)]">users</span>}
    </div>
  );
}
