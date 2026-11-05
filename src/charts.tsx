// Lightweight SVG charts (no chart library needed, works offline).
import { useState } from 'react';
import { fmt, monthLabel } from './finance';

export const PALETTE = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#2dd4bf', '#fb923c', '#f472b6', '#a3e635', '#818cf8'];
export const colorFor = (i: number) => PALETTE[i % PALETTE.length];

// ---------------------------------------------------------------- donut
export function DonutChart({ items, total, centerLabel }: { items: { label: string; value: number; color: string }[]; total: number; centerLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const active = hover !== null ? items[hover] : null;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-48 h-48 shrink-0 -rotate-90" role="img" aria-label="Spending distribution donut chart">
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--track)" strokeWidth="26" />
        {total > 0 &&
          items.map((it, i) => {
            const len = (it.value / total) * C;
            const gap = items.length > 1 ? Math.min(2, len / 3) : 0;
            const el = (
              <circle
                key={it.label}
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={it.color}
                strokeWidth={hover === i ? 32 : 26}
                strokeDasharray={`${Math.max(0, len - gap)} ${C}`}
                strokeDashoffset={-offset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
            offset += len;
            return el;
          })}
        <g className="rotate-90 origin-center">
          <text x="100" y="94" textAnchor="middle" className="fill-[var(--muted)] text-[10px] font-medium uppercase tracking-wider">
            {active ? active.label.slice(0, 16) : centerLabel}
          </text>
          <text x="100" y="116" textAnchor="middle" className="fill-[var(--text)] text-[19px] font-semibold tabular-nums">
            {active ? `${((active.value / total) * 100).toFixed(1)}%` : fmt(total)}
          </text>
        </g>
      </svg>
      <ul className="w-full space-y-1.5 text-xs">
        {items.map((it, i) => (
          <li
            key={it.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors ${hover === i ? 'bg-white/5' : ''}`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: it.color }} />
              <span className="truncate text-[var(--text-2)]">{it.label}</span>
            </span>
            <span className="tabular-nums text-[var(--muted)] shrink-0">
              {fmt(it.value)} <span className="text-[var(--faint)]">· {total > 0 ? ((it.value / total) * 100).toFixed(0) : 0}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------- budget vs actual
export function BudgetVsActual({ rows }: { rows: { name: string; allocated: number; spent: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.allocated, r.spent)));
  return (
    <div className="space-y-3.5">
      <div className="flex gap-4 text-[11px] text-[var(--muted)]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-[var(--track-strong)]" />Limit</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-sky-400" />Spent</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-amber-400" />≥ 80%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-full bg-rose-400" />Over</span>
      </div>
      {rows.map((r) => {
        const pct = r.allocated > 0 ? r.spent / r.allocated : 0;
        const color = r.allocated === 0 ? 'bg-slate-400' : pct >= 1 ? 'bg-rose-400' : pct >= 0.8 ? 'bg-amber-400' : 'bg-sky-400';
        return (
          <div key={r.name} className="text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-[var(--text-2)]">{r.name}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {fmt(r.spent)} / {r.allocated ? fmt(r.allocated) : 'no limit'}
              </span>
            </div>
            <div className="relative h-5">
              <div className="absolute inset-y-0 left-0 rounded-md bg-[var(--track-strong)]" style={{ width: `${(r.allocated / max) * 100}%` }} />
              <div className={`absolute top-1 bottom-1 left-0 rounded ${color} transition-all duration-500`} style={{ width: `${(r.spent / max) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- cumulative pace line
export function PaceChart({ cumulative, budget, today, projectedEnd }: { cumulative: number[]; budget: number; today: number | null; projectedEnd?: number }) {
  const W = 560;
  const H = 200;
  const P = { l: 44, r: 12, t: 12, b: 24 };
  const days = cumulative.length;
  const shown = today === null ? cumulative : cumulative.slice(0, today);
  const max = Math.max(1, budget, projectedEnd ?? 0, ...cumulative) * 1.08;
  const x = (d: number) => P.l + (d / Math.max(1, days - 1)) * (W - P.l - P.r);
  const y = (v: number) => H - P.b - (v / max) * (H - P.t - P.b);
  const path = shown.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = shown.length ? `${path} L${x(shown.length - 1)},${y(0)} L${x(0)},${y(0)} Z` : '';
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  // projection from today to month end at the current daily rate
  const last = shown.length ? shown[shown.length - 1] : 0;
  const projEnd = projectedEnd ?? (today ? (last / today) * days : 0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Cumulative spending this month compared with budget">
      <defs>
        <linearGradient id="paceFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
          <text x={P.l - 6} y={y(t) + 3} textAnchor="end" className="fill-[var(--faint)] text-[9px] tabular-nums">
            {t >= 1000 ? `${Math.round(t / 1000)}k` : Math.round(t)}
          </text>
        </g>
      ))}
      {[1, 8, 15, 22, days].map((d) => (
        <text key={d} x={x(d - 1)} y={H - 6} textAnchor="middle" className="fill-[var(--faint)] text-[9px]">
          {d}
        </text>
      ))}
      {budget > 0 && (
        <>
          <line x1={x(0)} y1={y(0)} x2={x(days - 1)} y2={y(budget)} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.2" />
          <line x1={P.l} x2={W - P.r} y1={y(budget)} y2={y(budget)} stroke="#fb7185" strokeOpacity="0.6" strokeWidth="1" />
          <text x={W - P.r} y={y(budget) - 4} textAnchor="end" className="fill-rose-300 text-[9px]">
            Budget {fmt(budget)}
          </text>
        </>
      )}
      {today !== null && today < days && shown.length > 0 && (
        <line x1={x(shown.length - 1)} y1={y(last)} x2={x(days - 1)} y2={y(projEnd)} stroke="#38bdf8" strokeDasharray="2 4" strokeWidth="1.5" />
      )}
      {area && <path d={area} fill="url(#paceFill)" />}
      {path && <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" />}
      {shown.length > 0 && <circle cx={x(shown.length - 1)} cy={y(last)} r="3.5" fill="#38bdf8" stroke="var(--surface)" strokeWidth="2" />}
    </svg>
  );
}

// ---------------------------------------------------------------- monthly trend
export function TrendChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-4 h-40">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full">
            <div className="flex-1 w-full flex items-end justify-center gap-1">
              <div
                className="w-1/3 max-w-4 rounded-t bg-emerald-400/80 transition-all duration-500"
                style={{ height: `${(d.income / max) * 100}%` }}
                title={`Income ${fmt(d.income)}`}
              />
              <div
                className="w-1/3 max-w-4 rounded-t bg-rose-400/80 transition-all duration-500"
                style={{ height: `${(d.expense / max) * 100}%` }}
                title={`Expenses ${fmt(d.expense)}`}
              />
            </div>
            <span className="text-[10px] text-[var(--faint)]">{monthLabel(d.month, 'short').split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-[11px] text-[var(--muted)] mt-3">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400/80" />Income</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-400/80" />Expenses</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- progress ring
export function ProgressRing({ pct, size = 132, stroke = 12, color = '#34d399', children }: { pct: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * c} ${c}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function Bar({ pct, className = '' }: { pct: number; className?: string }) {
  const color = pct >= 100 ? 'bg-rose-400' : pct >= 80 ? 'bg-amber-400' : 'bg-sky-400';
  return (
    <div className={`h-2 w-full rounded-full bg-[var(--track)] overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}
