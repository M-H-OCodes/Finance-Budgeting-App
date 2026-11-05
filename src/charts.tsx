// Lightweight SVG charts (no chart library needed, works offline).
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fmt, monthLabel } from './finance';

export const PALETTE = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#2dd4bf', '#fb923c', '#f472b6', '#a3e635', '#818cf8'];
export const colorFor = (i: number) => PALETTE[i % PALETTE.length];

// ---------------------------------------------------------------- hover / tap popup
// Pointing at (or tapping, on a phone) any part of a chart explains what it is.
export interface TipContent {
  title: string;
  lines?: { label: string; value: string; color?: string }[];
  note?: string;
}
interface TipState extends TipContent {
  x: number;
  y: number;
}

export function useTip() {
  const [tip, setTip] = useState<TipState | null>(null);
  // a tap elsewhere closes a popup opened by touch
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.('[data-tip]')) setTip(null);
    };
    window.addEventListener('pointerdown', close);
    return () => window.removeEventListener('pointerdown', close);
  }, []);
  const at = (e: { clientX: number; clientY: number }, c: TipContent) => setTip({ ...c, x: e.clientX, y: e.clientY });
  /** Spread onto any element that should show `content` when pointed at. */
  const bind = (content: TipContent) => ({
    'data-tip': '',
    onPointerEnter: (e: React.PointerEvent) => at(e, content),
    onPointerMove: (e: React.PointerEvent) => at(e, content),
    onPointerDown: (e: React.PointerEvent) => at(e, content),
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType !== 'touch') setTip(null);
    },
  });
  const hide = () => setTip(null);
  return { bind, at, hide, node: tip ? <TipBox tip={tip} /> : null };
}

function TipBox({ tip }: { tip: TipState }) {
  const W = 260;
  const left = Math.max(8, Math.min(tip.x + 14, window.innerWidth - W - 8));
  const flip = tip.y > window.innerHeight - 190;
  const top = flip ? Math.max(8, tip.y - 14) : tip.y + 18;
  return createPortal(
    <div
      role="tooltip"
      className="pointer-events-none fixed z-[100] rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/40 px-3 py-2.5 text-xs"
      style={{ left, top, width: W, transform: flip ? 'translateY(-100%)' : undefined }}
    >
      <div className="font-semibold text-[var(--text)]">{tip.title}</div>
      {tip.lines?.map((l) => (
        <div key={l.label} className="flex items-center justify-between gap-3 mt-1 tabular-nums">
          <span className="flex items-center gap-1.5 text-[var(--muted)]">
            {l.color && <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color }} />}
            {l.label}
          </span>
          <span className="text-[var(--text-2)] font-medium">{l.value}</span>
        </div>
      ))}
      {tip.note && <div className="mt-1.5 pt-1.5 border-t border-[var(--border)] text-[var(--faint)] leading-snug">{tip.note}</div>}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------- donut
export function DonutChart({ items, total, centerLabel }: { items: { label: string; value: number; color: string }[]; total: number; centerLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const { bind, hide, node } = useTip();
  const tipFor = (it: { label: string; value: number }): TipContent => ({
    title: it.label,
    lines: [
      { label: 'Spent', value: `${fmt(it.value)} PKR` },
      { label: 'Share of all spending', value: `${total > 0 ? ((it.value / total) * 100).toFixed(1) : 0}%` },
    ],
    note: 'Each colour slice is one spending category. A bigger slice means more of your money went there.',
  });
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
                {...bind(tipFor(it))}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => { setHover(null); hide(); }}
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
            {...bind(tipFor(it))}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => { setHover(null); hide(); }}
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
      {node}
    </div>
  );
}

// ---------------------------------------------------------------- budget vs actual
export function BudgetVsActual({ rows }: { rows: { name: string; allocated: number; spent: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.allocated, r.spent)));
  const { bind, node } = useTip();
  const legend: { cls: string; label: string; tip: TipContent }[] = [
    { cls: 'bg-[var(--track-strong)]', label: 'Limit', tip: { title: 'Limit (grey bar)', note: 'The most you planned to spend in this category this month.' } },
    { cls: 'bg-sky-400', label: 'Spent', tip: { title: 'Spent (blue bar)', note: 'What you have spent so far, and you are still under 80% of the limit.' } },
    { cls: 'bg-amber-400', label: '≥ 80%', tip: { title: 'Warning (amber bar)', note: 'You have used 80% or more of this limit. Slow down to stay in budget.' } },
    { cls: 'bg-rose-400', label: 'Over', tip: { title: 'Over budget (red bar)', note: 'You have spent more than the limit for this category.' } },
  ];
  return (
    <div className="space-y-3.5">
      <div className="flex gap-4 text-[11px] text-[var(--muted)]">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 cursor-help" {...bind(l.tip)}>
            <span className={`w-3 h-1.5 rounded-full ${l.cls}`} />
            {l.label}
          </span>
        ))}
      </div>
      {rows.map((r) => {
        const pct = r.allocated > 0 ? r.spent / r.allocated : 0;
        const color = r.allocated === 0 ? 'bg-slate-400' : pct >= 1 ? 'bg-rose-400' : pct >= 0.8 ? 'bg-amber-400' : 'bg-sky-400';
        const left = r.allocated - r.spent;
        const tip: TipContent = {
          title: r.name,
          lines: [
            { label: 'Limit', value: r.allocated ? `${fmt(r.allocated)} PKR` : 'not set' },
            { label: 'Spent', value: `${fmt(r.spent)} PKR` },
            ...(r.allocated ? [{ label: left >= 0 ? 'Left to spend' : 'Over by', value: `${fmt(Math.abs(left))} PKR` }, { label: 'Limit used', value: `${(pct * 100).toFixed(0)}%` }] : []),
          ],
          note: 'Grey bar = your limit. Coloured bar = what you have spent.',
        };
        return (
          <div key={r.name} className="text-xs rounded-lg -mx-1.5 px-1.5 py-1 hover:bg-white/[0.03]" {...bind(tip)}>
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
      {node}
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
  const { at, hide, node } = useTip();
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.max(0, Math.min(days - 1, Math.round(((px - P.l) / (W - P.l - P.r)) * (days - 1))));
    setHoverDay(i);
    const isActual = i < shown.length;
    const lastIdx = shown.length - 1;
    const projected = last + ((projEnd - last) * (i - lastIdx)) / Math.max(1, days - 1 - lastIdx);
    const lines: { label: string; value: string; color?: string }[] = [];
    if (isActual) lines.push({ label: 'Spent so far', value: `${fmt(shown[i])} PKR`, color: '#38bdf8' });
    else if (shown.length > 0 && today !== null) lines.push({ label: 'Projected total', value: `${fmt(projected)} PKR`, color: '#38bdf8' });
    if (budget > 0) lines.push({ label: 'Even-spending pace', value: `${fmt((budget * i) / Math.max(1, days - 1))} PKR`, color: '#94a3b8' });
    if (budget > 0 && isActual) {
      const diff = (budget * i) / Math.max(1, days - 1) - shown[i];
      lines.push({ label: diff >= 0 ? 'Ahead of pace by' : 'Behind pace by', value: `${fmt(Math.abs(diff))} PKR` });
    }
    at(e, {
      title: `Day ${i + 1} of the month`,
      lines,
      note: 'The blue line adds up everything you spend day by day. The grey dashed line is where you would be if you spread your budget evenly.',
    });
  };
  const gx = hoverDay !== null ? x(hoverDay) : 0;
  return (
    <>
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto cursor-crosshair"
      role="img"
      aria-label="Cumulative spending this month compared with budget"
      data-tip=""
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'touch') {
          setHoverDay(null);
          hide();
        }
      }}
    >
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
      {hoverDay !== null && (
        <g pointerEvents="none">
          <line x1={gx} x2={gx} y1={P.t} y2={H - P.b} stroke="var(--muted)" strokeOpacity="0.5" strokeWidth="1" />
          {hoverDay < shown.length && <circle cx={gx} cy={y(shown[hoverDay])} r="4" fill="#38bdf8" stroke="var(--surface)" strokeWidth="2" />}
        </g>
      )}
    </svg>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--muted)] mt-2">
      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sky-400" />Spent so far</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-0 border-t border-dashed border-slate-400" />Even-spending pace</span>
      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-400/60" />Budget</span>
      <span className="text-[var(--faint)]">Point at the chart for details</span>
    </div>
    {node}
    </>
  );
}

// ---------------------------------------------------------------- monthly trend
export function TrendChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));
  const { bind, node } = useTip();
  return (
    <div>
      <div className="flex items-end gap-2 sm:gap-4 h-40">
        {data.map((d) => (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-1.5 h-full rounded-lg hover:bg-white/[0.03] cursor-help"
            {...bind({
              title: monthLabel(d.month),
              lines: [
                { label: 'Income', value: `${fmt(d.income)} PKR`, color: '#34d399' },
                { label: 'Expenses', value: `${fmt(d.expense)} PKR`, color: '#fb7185' },
                { label: d.income - d.expense >= 0 ? 'Saved' : 'Overspent by', value: `${fmt(Math.abs(d.income - d.expense))} PKR` },
              ],
              note: 'Green bar = money that came in. Red bar = money you spent. Taller means more.',
            })}
          >
            <div className="flex-1 w-full flex items-end justify-center gap-1">
              <div
                className="w-1/3 max-w-4 rounded-t bg-emerald-400/80 transition-all duration-500"
                style={{ height: `${(d.income / max) * 100}%` }}
              />
              <div
                className="w-1/3 max-w-4 rounded-t bg-rose-400/80 transition-all duration-500"
                style={{ height: `${(d.expense / max) * 100}%` }}
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
      {node}
    </div>
  );
}

// ---------------------------------------------------------------- progress ring
export function ProgressRing({ pct, size = 132, stroke = 12, color = '#34d399', tip, children }: { pct: number; size?: number; stroke?: number; color?: string; tip?: TipContent; children?: React.ReactNode }) {
  const t = useTip();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className={`relative shrink-0 ${tip ? 'cursor-help' : ''}`} style={{ width: size, height: size }} {...(tip ? t.bind(tip) : {})}>
      {t.node}
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
