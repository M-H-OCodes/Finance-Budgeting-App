import { X } from 'lucide-react';
import { useEffect } from 'react';

export function Card({
  title,
  subtitle,
  icon,
  action,
  children,
  className = '',
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                {icon}
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-[var(--muted)] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

const tones = {
  sky: 'text-sky-300 bg-sky-400/10',
  emerald: 'text-emerald-300 bg-emerald-400/10',
  rose: 'text-rose-300 bg-rose-400/10',
  amber: 'text-amber-300 bg-amber-400/10',
  violet: 'text-violet-300 bg-violet-400/10',
  slate: 'text-slate-300 bg-slate-400/10',
};

export function Kpi({
  icon,
  label,
  value,
  unit,
  hint,
  tone = 'sky',
  valueClass = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
  tone?: keyof typeof tones;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-rise">
      <div className="flex items-center gap-2 text-xs text-[var(--muted)] font-medium">
        <span className={`w-7 h-7 rounded-lg grid place-items-center ${tones[tone]}`}>{icon}</span>
        {label}
      </div>
      <div className={`mt-3 text-xl sm:text-2xl font-semibold tracking-tight tabular-nums ${valueClass}`}>
        {value}
        {unit && <span className="ml-1 text-xs font-medium text-[var(--faint)]">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-[11px] text-[var(--muted)] leading-snug">{hint}</div>}
    </div>
  );
}

export function Modal({ title, onClose, children, width = 'max-w-md' }: { title: string; onClose: () => void; children: React.ReactNode; width?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${width} rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl animate-rise max-h-[90dvh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="btn-ghost !p-1.5" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 grid place-items-center text-[var(--muted)] mb-3">{icon}</div>
      <div className="font-medium">{title}</div>
      <p className="text-sm text-[var(--muted)] mt-1 max-w-sm">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
