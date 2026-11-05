import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  Copy,
  Download,
  Flame,
  Lightbulb,
  Pencil,
  PieChart,
  PiggyBank,
  Plus,
  Receipt,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  type Category,
  type FinanceData,
  type SavingsGoal,
  type Transaction,
  type TxFilter,
  type TxType,
  budgetAlerts,
  budgetStatus,
  categoryName,
  cumulativeDaily,
  downloadFile,
  filterTransactions,
  fmt,
  fmtPKR,
  forecastMonth,
  goalProgress,
  isValidISODate,
  monthLabel,
  monthSummary,
  monthlyTrend,
  savedTowardsGoals,
  shiftMonth,
  suggestBudgets,
  toCSV,
  todayISO,
} from './finance';
import { BudgetVsActual, Bar, DonutChart, PaceChart, ProgressRing, TrendChart, colorFor } from './charts';
import { Card, EmptyState, Kpi, Modal } from './ui';

type Update = (fn: (d: FinanceData) => void) => void;
export type Screen = 'dashboard' | 'add' | 'budget' | 'analytics' | 'history' | 'goals' | 'admin';

interface ScreenProps {
  data: FinanceData;
  update: Update;
  month: string;
  go: (s: Screen) => void;
  toast: (msg: string, tone?: 'good' | 'warn' | 'bad') => void;
}

const amountClass = (t: TxType) => (t === 'expense' ? 'text-rose-300' : 'text-emerald-300');
const signed = (t: Transaction) => `${t.type === 'expense' ? '−' : '+'}${fmt(t.amount)}`;
const dateLabel = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

// ====================================================================== DASHBOARD
export function Dashboard({ data, month, go }: ScreenProps) {
  const summary = monthSummary(data, month);
  const statuses = budgetStatus(data, month);
  const alerts = budgetAlerts(statuses);
  const fc = forecastMonth(data, month);
  const goals = goalProgress(data, month);
  const topGoal = goals.find((g) => !g.isAchieved) ?? goals[0];
  const recent = filterTransactions(data.transactions, { keyword: '', categoryId: 'ALL', type: 'ALL', from: '', to: '' }, data.categories).slice(0, 6);
  const sugg = useMemo(() => suggestBudgets(data, month), [data, month]);
  const tips = sugg.suggestions.filter((s) => s.tone !== 'good').slice(0, 2);

  const savingsLabel = fc.mode === 'past' ? 'Saved this month' : 'Predicted savings';
  const savingsHint =
    fc.mode === 'past'
      ? `Income ${fmt(fc.income)} − spent ${fmt(summary.spent)}`
      : fc.mode === 'future'
        ? 'If you spend exactly your budget'
        : `${fmtPKR(fc.projectedExpenses)} projected spend · ${fmtPKR(fc.budgetSavings)} if you keep to your budget`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi icon={<Receipt className="w-4 h-4" />} label="Total spent" value={fmt(summary.spent)} unit="PKR" hint={`Income ${fmt(summary.income)} PKR recorded`} tone="rose" />
        <Kpi
          icon={<Wallet className="w-4 h-4" />}
          label="Remaining budget"
          value={summary.totalBudget ? fmt(summary.remainingBudget) : '—'}
          unit={summary.totalBudget ? 'PKR' : undefined}
          valueClass={summary.remainingBudget < 0 ? 'text-rose-300' : ''}
          hint={summary.totalBudget ? `of ${fmt(summary.totalBudget)} PKR budget` : <button className="text-sky-300 hover:underline" onClick={() => go('budget')}>Set a budget →</button>}
          tone="sky"
        />
        <Kpi
          icon={<Flame className="w-4 h-4" />}
          label={savingsLabel}
          value={fmt(fc.projectedSavings)}
          unit="PKR"
          valueClass={fc.projectedSavings < 0 ? 'text-rose-300' : 'text-emerald-300'}
          hint={savingsHint}
          tone="emerald"
        />
        <Kpi
          icon={<Target className="w-4 h-4" />}
          label="Savings goal"
          value={topGoal ? `${topGoal.pct.toFixed(0)}%` : '—'}
          hint={topGoal ? `${topGoal.goal.name} · ${fmt(topGoal.remaining)} PKR to go` : <button className="text-sky-300 hover:underline" onClick={() => go('goals')}>Add a goal →</button>}
          tone="violet"
        />
      </div>

      {alerts.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {alerts.map((a) => (
            <div
              key={a.categoryId}
              className={`flex gap-3 rounded-2xl border p-3.5 animate-rise ${a.level === 'DANGER' ? 'border-rose-400/30 bg-rose-500/[0.07]' : 'border-amber-400/30 bg-amber-500/[0.07]'}`}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${a.level === 'DANGER' ? 'text-rose-300' : 'text-amber-300'}`} />
              <div className="text-sm">
                <div className="font-semibold">
                  {a.category}: {a.level === 'DANGER' ? 'over budget' : '80% of budget used'}
                </div>
                <div className="text-[var(--text-2)] text-xs mt-0.5">{a.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-5">
        <Card
          className="lg:col-span-3"
          title="Budget by category"
          icon={<Coins className="w-4 h-4 text-sky-300" />}
          subtitle="Spent against each limit, with what's left."
          action={<button className="btn-ghost text-xs" onClick={() => go('budget')}>Edit limits</button>}
        >
          <div className="space-y-3">
            {statuses.map((b) => (
              <div key={b.id}>
                <div className="flex justify-between text-xs mb-1.5 gap-2">
                  <span className="font-medium text-[var(--text-2)]">{b.name}</span>
                  <span className="tabular-nums text-[var(--muted)]">
                    {fmt(b.spent)} / {b.allocated ? fmt(b.allocated) : '—'}
                    {b.allocated > 0 && (
                      <span className={`ml-2 ${b.remaining < 0 ? 'text-rose-300' : 'text-[var(--faint)]'}`}>
                        {b.remaining < 0 ? `${fmt(-b.remaining)} over` : `${fmt(b.remaining)} left`}
                      </span>
                    )}
                  </span>
                </div>
                <Bar pct={b.allocated ? b.percentage : b.spent > 0 ? 100 : 0} />
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="lg:col-span-2"
          title="Recent transactions"
          icon={<Receipt className="w-4 h-4 text-sky-300" />}
          action={<button className="btn-ghost text-xs" onClick={() => go('history')}>View all</button>}
        >
          {recent.length === 0 ? (
            <EmptyState icon={<Receipt className="w-5 h-5" />} title="Nothing recorded yet" text="Add your first income or expense." action={<button className="btn-primary" onClick={() => go('add')}><Plus className="w-4 h-4" />Add transaction</button>} />
          ) : (
            <ul className="divide-y divide-[var(--border)] -my-2">
              {recent.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-8 h-8 shrink-0 rounded-xl grid place-items-center ${t.type === 'expense' ? 'bg-rose-400/10 text-rose-300' : 'bg-emerald-400/10 text-emerald-300'}`}>
                      {t.type === 'expense' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm truncate">{t.description}</div>
                      <div className="text-[11px] text-[var(--muted)]">
                        {dateLabel(t.date)} · {categoryName(data, t.categoryId)}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums shrink-0 ${amountClass(t.type)}`}>{signed(t)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3" title="Spending pace" icon={<TrendingUp className="w-4 h-4 text-sky-300" />} subtitle="Cumulative spending this month. The dotted line projects month-end at your current rate.">
          <PaceChart cumulative={cumulativeDaily(data, month)} budget={summary.totalBudget} today={fc.mode === 'current' ? fc.dayOfMonth : fc.mode === 'past' ? null : 0} projectedEnd={fc.mode === 'current' ? fc.projectedExpenses : undefined} />
        </Card>
        <Card className="lg:col-span-2" title="Suggestions for your goal" icon={<Lightbulb className="w-4 h-4 text-amber-300" />} action={<button className="btn-ghost text-xs" onClick={() => go('budget')}>All suggestions</button>}>
          <p className="text-xs text-[var(--muted)] mb-3">{sugg.message}</p>
          {tips.length ? (
            <ul className="space-y-2.5">
              {tips.map((t) => (
                <li key={t.categoryId} className="text-sm rounded-xl bg-white/[0.03] border border-[var(--border)] p-3">
                  <div className="flex justify-between gap-2 font-medium">
                    {t.name}
                    <span className="text-xs tabular-nums text-[var(--muted)]">aim ≤ {fmt(t.suggested)}</span>
                  </div>
                  <div className="text-xs text-[var(--text-2)] mt-1">{t.tip}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm rounded-xl bg-emerald-500/[0.07] border border-emerald-400/20 p-3 text-emerald-200 flex gap-2">
              <Check className="w-4 h-4 mt-0.5 shrink-0" /> Every category is on track for your savings goal.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ====================================================================== TRANSACTION FORM
export function TransactionForm({
  data,
  initial,
  onSubmit,
  onNewCategory,
  submitLabel,
}: {
  data: FinanceData;
  initial?: Transaction;
  onSubmit: (t: Omit<Transaction, 'id'>) => void;
  onNewCategory: (type: TxType) => void;
  submitLabel: string;
}) {
  const [type, setType] = useState<TxType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const firstOf = (t: TxType) => data.categories.find((c) => c.type === t)?.id ?? 0;
  const [categoryId, setCategoryId] = useState<number>(initial?.categoryId ?? firstOf('expense'));
  const [description, setDescription] = useState(initial?.description ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cats = data.categories.filter((c) => c.type === type);
  const validCat = cats.some((c) => c.id === categoryId) ? categoryId : (cats[0]?.id ?? 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const amt = Number(amount);
    if (!amount.trim() || !Number.isFinite(amt) || amt <= 0) errs.amount = 'Enter an amount greater than 0.';
    else if (amt > 10_000_000) errs.amount = 'That amount looks too large. Check for extra zeros.';
    else if (Math.round(amt * 100) !== amt * 100) errs.amount = 'Use at most 2 decimal places.';
    if (!isValidISODate(date)) errs.date = 'Pick a valid date.';
    if (!description.trim()) errs.description = 'Add a short description.';
    else if (description.trim().length > 120) errs.description = 'Keep it under 120 characters.';
    if (!cats.some((c) => c.id === validCat)) errs.category = 'Choose a category.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSubmit({ type, amount: amt, date, categoryId: validCat, description: description.trim() });
    if (!initial) {
      setAmount('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              setCategoryId(firstOf(t));
            }}
            className={`py-1.5 rounded-lg font-medium transition ${
              type === t ? (t === 'expense' ? 'bg-rose-400/15 text-rose-200' : 'bg-emerald-400/15 text-emerald-200') : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block col-span-2 sm:col-span-1">
          <span className="label">Amount (PKR)</span>
          <input className="input tabular-nums" inputMode="decimal" type="number" min="0" step="0.01" placeholder="1,450" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={!!errors.amount} autoFocus={!initial} />
          {errors.amount && <span className="text-xs text-rose-300 mt-1 block">{errors.amount}</span>}
        </label>
        <label className="block col-span-2 sm:col-span-1">
          <span className="label">Date</span>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!!errors.date} />
          {errors.date && <span className="text-xs text-rose-300 mt-1 block">{errors.date}</span>}
        </label>
      </div>

      <label className="block">
        <span className="label flex justify-between">
          Category
          <button type="button" onClick={() => onNewCategory(type)} className="text-sky-300 hover:underline font-normal flex items-center gap-1">
            <Plus className="w-3 h-3" /> New category
          </button>
        </span>
        <select className="input" value={validCat} onChange={(e) => setCategoryId(Number(e.target.value))} aria-invalid={!!errors.category}>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.isPredefined ? '' : ' (custom)'}
            </option>
          ))}
        </select>
        {errors.category && <span className="text-xs text-rose-300 mt-1 block">{errors.category}</span>}
      </label>

      <label className="block">
        <span className="label">Description</span>
        <input className="input" maxLength={120} placeholder={type === 'expense' ? 'e.g. Pharmacology reference book' : 'e.g. Monthly stipend'} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} />
        {errors.description && <span className="text-xs text-rose-300 mt-1 block">{errors.description}</span>}
      </label>

      <button type="submit" className="btn-primary w-full !py-2.5">
        <Check className="w-4 h-4" /> {submitLabel}
      </button>
    </form>
  );
}

// ====================================================================== ADD TRANSACTION
export function AddTransaction({ data, update, month, toast, onNewCategory, onEdit }: ScreenProps & { onNewCategory: (t: TxType) => void; onEdit: (t: Transaction) => void }) {
  const monthTx = filterTransactions(data.transactions, { keyword: '', categoryId: 'ALL', type: 'ALL', from: `${month}-01`, to: `${month}-31` }, data.categories);
  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <Card className="lg:col-span-2 h-fit" title="Record a transaction" icon={<Plus className="w-4 h-4 text-sky-300" />} subtitle="Amount, date, category and a description.">
        <TransactionForm
          data={data}
          submitLabel="Save transaction"
          onNewCategory={onNewCategory}
          onSubmit={(t) => {
            update((d) => {
              d.transactions.unshift({ ...t, id: Date.now() });
            });
            toast(`${t.type === 'expense' ? 'Expense' : 'Income'} of ${fmtPKR(t.amount)} saved`);
          }}
        />
      </Card>
      <Card className="lg:col-span-3" title={`${monthLabel(month)} records`} subtitle={`${monthTx.length} transactions this month`}>
        <TxList data={data} txs={monthTx} update={update} onEdit={onEdit} toast={toast} />
      </Card>
    </div>
  );
}

function TxList({ data, txs, update, onEdit, toast }: { data: FinanceData; txs: Transaction[]; update: Update; onEdit: (t: Transaction) => void; toast: ScreenProps['toast'] }) {
  if (!txs.length) return <EmptyState icon={<Receipt className="w-5 h-5" />} title="No transactions" text="Nothing matches here yet." />;
  const del = (t: Transaction) => {
    if (!window.confirm(`Delete "${t.description}" (${fmtPKR(t.amount)})?`)) return;
    update((d) => {
      d.transactions = d.transactions.filter((x) => x.id !== t.id);
    });
    toast('Transaction deleted', 'warn');
  };
  return (
    <>
      {/* mobile list */}
      <ul className="sm:hidden divide-y divide-[var(--border)] -my-2">
        {txs.map((t) => (
          <li key={t.id} className="py-2.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm truncate">{t.description}</div>
              <div className="text-[11px] text-[var(--muted)]">
                {dateLabel(t.date)} · {categoryName(data, t.categoryId)}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-sm font-semibold tabular-nums mr-1 ${amountClass(t.type)}`}>{signed(t)}</span>
              <button className="btn-ghost !p-1.5" onClick={() => onEdit(t)} aria-label="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button className="btn-ghost !p-1.5 hover:!text-rose-300" onClick={() => del(t)} aria-label="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[11px] uppercase tracking-wider text-[var(--faint)]">
            <tr className="border-b border-[var(--border)] text-left">
              <th className="py-2 px-2 font-medium">Date</th>
              <th className="py-2 px-2 font-medium">Description</th>
              <th className="py-2 px-2 font-medium">Category</th>
              <th className="py-2 px-2 font-medium text-right">Amount</th>
              <th className="py-2 px-2 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {txs.map((t) => (
              <tr key={t.id} className="group hover:bg-white/[0.02]">
                <td className="py-2.5 px-2 text-[var(--muted)] whitespace-nowrap tabular-nums">{t.date}</td>
                <td className="py-2.5 px-2">{t.description}</td>
                <td className="py-2.5 px-2">
                  <span className="pill pill-neutral">{categoryName(data, t.categoryId)}</span>
                </td>
                <td className={`py-2.5 px-2 text-right font-semibold tabular-nums whitespace-nowrap ${amountClass(t.type)}`}>{signed(t)}</td>
                <td className="py-2.5 px-2 text-right whitespace-nowrap">
                  <button className="btn-ghost !p-1.5 opacity-60 group-hover:opacity-100" onClick={() => onEdit(t)} aria-label="Edit">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="btn-ghost !p-1.5 opacity-60 group-hover:opacity-100 hover:!text-rose-300" onClick={() => del(t)} aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ====================================================================== BUDGETS + SUGGESTIONS
export function Budgets({ data, update, month, toast, onNewCategory }: ScreenProps & { onNewCategory: (t: TxType) => void }) {
  const statuses = budgetStatus(data, month);
  const summary = monthSummary(data, month);
  const prev = shiftMonth(month, -1);
  const prevBudgets = data.budgets[prev];
  const [customSaving, setCustomSaving] = useState('');
  const savingsOverride = customSaving.trim() === '' ? undefined : Number(customSaving);
  const sugg = useMemo(
    () => suggestBudgets(data, month, { savingsTarget: savingsOverride !== undefined && Number.isFinite(savingsOverride) ? savingsOverride : undefined }),
    [data, month, savingsOverride],
  );

  const setLimit = (catId: number, value: number) =>
    update((d) => {
      d.budgets[month] = { ...(d.budgets[month] ?? {}), [catId]: Math.max(0, value) };
    });

  const unallocated = summary.expectedIncome - summary.totalBudget;

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <Card
        className="lg:col-span-3"
        title={`Budget for ${monthLabel(month)}`}
        icon={<Coins className="w-4 h-4 text-sky-300" />}
        subtitle="Set a spending limit for each category. Remaining budget updates automatically as you record spending."
        action={
          prevBudgets && (
            <button
              className="btn-secondary text-xs"
              onClick={() => {
                update((d) => {
                  d.budgets[month] = { ...prevBudgets };
                });
                toast(`Copied limits from ${monthLabel(prev)}`);
              }}
            >
              <Copy className="w-3.5 h-3.5" /> Copy last month
            </button>
          )
        }
      >
        <div className="grid grid-cols-3 gap-3 mb-5 text-center">
          <div className="rounded-xl bg-white/[0.03] border border-[var(--border)] p-3">
            <div className="text-[11px] text-[var(--muted)]">Income</div>
            <div className="font-semibold tabular-nums mt-0.5">{fmt(summary.expectedIncome)}</div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-[var(--border)] p-3">
            <div className="text-[11px] text-[var(--muted)]">Budgeted</div>
            <div className="font-semibold tabular-nums mt-0.5">{fmt(summary.totalBudget)}</div>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-[var(--border)] p-3">
            <div className="text-[11px] text-[var(--muted)]">{unallocated >= 0 ? 'Left to save' : 'Over income'}</div>
            <div className={`font-semibold tabular-nums mt-0.5 ${unallocated >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(Math.abs(unallocated))}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {statuses.map((b) => (
            <div key={b.id} className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{b.name}</div>
                  <div className="text-[11px] text-[var(--muted)] tabular-nums">
                    Spent {fmt(b.spent)} · {b.allocated ? (b.remaining >= 0 ? `${fmt(b.remaining)} remaining` : `${fmt(-b.remaining)} over`) : 'no limit set'}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    inputMode="numeric"
                    aria-label={`${b.name} limit`}
                    value={b.allocated || ''}
                    placeholder="0"
                    onChange={(e) => setLimit(b.id, Number(e.target.value) || 0)}
                    className="input !w-28 text-right tabular-nums !py-1.5"
                  />
                  <span className="text-xs text-[var(--faint)]">PKR</span>
                </div>
              </div>
              {b.allocated > 0 && <Bar pct={b.percentage} className="mt-2.5" />}
            </div>
          ))}
        </div>
        <button className="btn-ghost text-xs mt-3" onClick={() => onNewCategory('expense')}>
          <Plus className="w-3.5 h-3.5" /> Add custom category
        </button>
        <CategoryManager data={data} update={update} toast={toast} />
      </Card>

      <Card
        className="lg:col-span-2 h-fit"
        title="Suggested limits"
        icon={<Sparkles className="w-4 h-4 text-amber-300" />}
        subtitle="Based on your savings goals and your own spending over the last 3 months."
      >
        <label className="block mb-3">
          <span className="label">Monthly saving target (PKR)</span>
          <input
            className="input tabular-nums"
            type="number"
            min="0"
            placeholder={`${fmt(sugg.goalDriven ? sugg.savingsTarget : 0)} (from your goals)`}
            value={customSaving}
            onChange={(e) => setCustomSaving(e.target.value)}
          />
          <span className="text-[11px] text-[var(--faint)] mt-1 block">Leave empty to use what your goals need.</span>
        </label>
        <p className={`text-xs rounded-lg px-3 py-2 mb-3 ${sugg.feasible ? 'bg-sky-500/[0.07] text-sky-100 border border-sky-400/20' : 'bg-rose-500/10 text-rose-200 border border-rose-400/30'}`}>{sugg.message}</p>
        {sugg.feasible && (
          <>
            <ul className="space-y-2">
              {sugg.suggestions.map((s) => (
                <li key={s.categoryId} className="rounded-xl border border-[var(--border)] p-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">{s.name}</span>
                    <span className="tabular-nums font-semibold">{fmt(s.suggested)}</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] tabular-nums mt-0.5">
                    Current limit {s.currentLimit ? fmt(s.currentLimit) : '—'} · usual {s.historicalAvg ? fmt(s.historicalAvg) : '—'}
                  </div>
                  <div className={`text-xs mt-1.5 ${s.tone === 'bad' ? 'text-rose-300' : s.tone === 'warn' ? 'text-amber-200' : 'text-emerald-300'}`}>{s.tip}</div>
                </li>
              ))}
            </ul>
            <button
              className="btn-primary w-full mt-4"
              onClick={() => {
                update((d) => {
                  d.budgets[month] = Object.fromEntries(sugg.suggestions.map((s) => [s.categoryId, s.suggested]));
                });
                toast(`Applied suggested limits for ${monthLabel(month)}`);
              }}
            >
              <Check className="w-4 h-4" /> Apply these limits
            </button>
          </>
        )}
      </Card>
    </div>
  );
}

function CategoryManager({ data, update, toast }: { data: FinanceData; update: Update; toast: ScreenProps['toast'] }) {
  const custom = data.categories.filter((c) => !c.isPredefined);
  if (!custom.length) return null;
  const remove = (c: Category) => {
    const used = data.transactions.filter((t) => t.categoryId === c.id).length;
    const fallback = data.categories.find((x) => x.isPredefined && x.type === c.type && /misc|other/i.test(x.name));
    const msg = used
      ? `"${c.name}" is used by ${used} transaction(s). They will move to "${fallback?.name}". Delete it?`
      : `Delete category "${c.name}"?`;
    if (!window.confirm(msg)) return;
    update((d) => {
      d.categories = d.categories.filter((x) => x.id !== c.id);
      if (fallback) d.transactions.forEach((t) => t.categoryId === c.id && (t.categoryId = fallback.id));
      for (const m of Object.keys(d.budgets)) delete d.budgets[m][c.id];
    });
    toast(`Deleted "${c.name}"`, 'warn');
  };
  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)]">
      <div className="text-xs text-[var(--muted)] mb-2">Your custom categories</div>
      <div className="flex flex-wrap gap-2">
        {custom.map((c) => (
          <span key={c.id} className="pill pill-neutral !py-1 !pl-2.5">
            {c.name} <span className="text-[var(--faint)] font-normal">({c.type})</span>
            <button onClick={() => remove(c)} className="ml-0.5 hover:text-rose-300" aria-label={`Delete ${c.name}`}>
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ====================================================================== ANALYTICS
export function Analytics({ data, month }: ScreenProps) {
  const statuses = budgetStatus(data, month);
  const summary = monthSummary(data, month);
  const fc = forecastMonth(data, month);
  const items = statuses
    .filter((s) => s.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .map((s) => ({ label: s.name, value: s.spent, color: colorFor(data.categories.findIndex((c) => c.id === s.id)) }));
  const biggest = data.transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(month))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-5">
        <Card title="Where your money went" icon={<PieChart className="w-4 h-4 text-sky-300" />} subtitle={`Expense share by category · ${monthLabel(month)}`}>
          {items.length ? <DonutChart items={items} total={summary.spent} centerLabel="PKR spent" /> : <EmptyState icon={<PieChart className="w-5 h-5" />} title="No spending this month" text="Charts appear once you record expenses." />}
        </Card>
        <Card title="Budget vs actual" icon={<Coins className="w-4 h-4 text-sky-300" />} subtitle="Each category's limit against what you've spent.">
          <BudgetVsActual rows={statuses.filter((s) => s.allocated > 0 || s.spent > 0)} />
        </Card>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3" title="Spending pace" icon={<TrendingUp className="w-4 h-4 text-sky-300" />} subtitle="Grey dashed line: an even spend of your budget across the month.">
          <PaceChart cumulative={cumulativeDaily(data, month)} budget={summary.totalBudget} today={fc.mode === 'current' ? fc.dayOfMonth : fc.mode === 'past' ? null : 0} projectedEnd={fc.mode === 'current' ? fc.projectedExpenses : undefined} />
        </Card>
        <Card className="lg:col-span-2" title="Last 6 months" icon={<CalendarClock className="w-4 h-4 text-sky-300" />}>
          <TrendChart data={monthlyTrend(data, month)} />
        </Card>
      </div>
      <Card title="Largest expenses" subtitle={monthLabel(month)}>
        {biggest.length ? (
          <ul className="space-y-2">
            {biggest.map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-xs text-[var(--muted)]">{categoryName(data, t.categoryId)}</span>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{t.description}</div>
                  <Bar pct={(t.amount / biggest[0].amount) * 60} className="mt-1 !h-1.5" />
                </div>
                <span className="tabular-nums font-semibold text-rose-300">{fmt(t.amount)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted)]">No expenses yet.</p>
        )}
      </Card>
    </div>
  );
}

// ====================================================================== HISTORY / SEARCH
export function History({ data, update, month, toast, onEdit }: ScreenProps & { onEdit: (t: Transaction) => void }) {
  const [f, setF] = useState<TxFilter>({ keyword: '', categoryId: 'ALL', type: 'ALL', from: '', to: '' });
  const results = useMemo(() => filterTransactions(data.transactions, f, data.categories), [data, f]);
  const income = results.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = results.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const set = (p: Partial<TxFilter>) => setF((x) => ({ ...x, ...p }));
  const ranges: [string, () => void][] = [
    ['This month', () => set({ from: `${month}-01`, to: `${month}-31` })],
    ['Last month', () => set({ from: `${shiftMonth(month, -1)}-01`, to: `${shiftMonth(month, -1)}-31` })],
    ['Last 3 months', () => set({ from: `${shiftMonth(month, -2)}-01`, to: `${month}-31` })],
    ['All time', () => set({ from: '', to: '' })],
  ];

  return (
    <div className="space-y-5">
      <Card title="Search & filter" icon={<Search className="w-4 h-4 text-sky-300" />} subtitle="Find any past transaction by keyword, category, type or date.">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <label className="col-span-2 lg:col-span-1">
            <span className="label">Keyword</span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
              <input className="input pl-9" placeholder="e.g. petrol" value={f.keyword} onChange={(e) => set({ keyword: e.target.value })} />
            </div>
          </label>
          <label>
            <span className="label">Category</span>
            <select className="input" value={f.categoryId} onChange={(e) => set({ categoryId: e.target.value })}>
              <option value="ALL">All categories</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Type</span>
            <select className="input" value={f.type} onChange={(e) => set({ type: e.target.value as TxFilter['type'] })}>
              <option value="ALL">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            <span className="label">From</span>
            <input className="input" type="date" value={f.from} onChange={(e) => set({ from: e.target.value })} />
          </label>
          <label>
            <span className="label">To</span>
            <input className="input" type="date" value={f.to} onChange={(e) => set({ to: e.target.value })} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {ranges.map(([label, fn]) => (
            <button key={label} className="pill pill-neutral hover:!border-[var(--border-strong)] !py-1 !px-2.5" onClick={fn}>
              {label}
            </button>
          ))}
          <button className="btn-ghost text-xs ml-auto" onClick={() => setF({ keyword: '', categoryId: 'ALL', type: 'ALL', from: '', to: '' })}>
            Reset
          </button>
        </div>
      </Card>

      <Card
        title={`${results.length} result${results.length === 1 ? '' : 's'}`}
        subtitle={
          <span className="tabular-nums">
            In <span className="text-emerald-300">{fmt(income)}</span> · Out <span className="text-rose-300">{fmt(expense)}</span> · Net {fmtPKR(income - expense)}
          </span>
        }
        action={
          <button
            className="btn-secondary text-xs"
            disabled={!results.length}
            onClick={() =>
              downloadFile(
                `transactions_${todayISO()}.csv`,
                toCSV([['Date', 'Type', 'Category', 'Description', 'Amount (PKR)'], ...results.map((t) => [t.date, t.type, categoryName(data, t.categoryId), t.description, t.amount])]),
              )
            }
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        }
      >
        <TxList data={data} txs={results} update={update} onEdit={onEdit} toast={toast} />
      </Card>
    </div>
  );
}

// ====================================================================== GOALS
export function Goals({ data, update, month, toast }: ScreenProps) {
  const progress = goalProgress(data, month);
  const [editing, setEditing] = useState<SavingsGoal | 'new' | null>(null);
  const trend = monthlyTrend(data, month).map((m) => ({ ...m, net: m.income - m.expense }));
  const maxNet = Math.max(1, ...trend.map((t) => Math.abs(t.net)));

  const move = (i: number, dir: -1 | 1) =>
    update((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.goals.length) return;
      [d.goals[i], d.goals[j]] = [d.goals[j], d.goals[i]];
    });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)] max-w-xl">
          Saved so far: <span className="text-[var(--text)] font-medium tabular-nums">{fmtPKR(Math.max(0, savedTowardsGoals(data)))}</span>. That's what you kept from past months plus what this month is on track to leave over. Savings fill goals from the top down, so reorder them to change priority.
        </p>
        <button className="btn-primary shrink-0" onClick={() => setEditing('new')}>
          <Plus className="w-4 h-4" /> New goal
        </button>
      </div>

      {progress.length === 0 && (
        <Card>
          <EmptyState icon={<PiggyBank className="w-5 h-5" />} title="No savings goal yet" text="Set a target, like a stethoscope or an emergency fund, and track your progress here." action={<button className="btn-primary" onClick={() => setEditing('new')}><Plus className="w-4 h-4" />Create goal</button>} />
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {progress.map((p, i) => {
          const late = p.projectedDate && p.projectedDate > p.goal.targetDate.slice(0, 7);
          return (
            <Card key={p.goal.id}>
              <div className="flex gap-5 items-center">
                <ProgressRing pct={p.pct} color={p.isAchieved ? '#34d399' : '#38bdf8'}>
                  <span className="text-2xl font-semibold tabular-nums">{p.pct.toFixed(0)}%</span>
                  <span className="text-[10px] text-[var(--muted)]">saved</span>
                </ProgressRing>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-[var(--faint)] uppercase tracking-wider">Priority {i + 1}</div>
                      <h3 className="font-semibold truncate">{p.goal.name}</h3>
                    </div>
                    <div className="flex shrink-0">
                      <button className="btn-ghost !p-1" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost !p-1" disabled={i === progress.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost !p-1" onClick={() => setEditing(p.goal)} aria-label="Edit goal">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm tabular-nums mt-1">
                    {fmt(p.saved)} <span className="text-[var(--muted)]">/ {fmt(p.goal.targetAmount)} PKR</span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-2 space-y-0.5">
                    {p.isAchieved ? (
                      <div className="text-emerald-300 font-medium">Goal reached!</div>
                    ) : (
                      <>
                        <div>
                          Save <span className="text-[var(--text)] tabular-nums">{fmtPKR(p.requiredPerMonth)}</span>/month for {p.monthsLeft} month{p.monthsLeft > 1 ? 's' : ''} to hit {new Date(`${p.goal.targetDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className={late ? 'text-amber-200' : ''}>
                          {p.projectedDate ? `At your current rate: ${monthLabel(p.projectedDate, 'short')}${late ? ' (behind schedule)' : ' (on schedule)'}` : 'Not enough saving history to project a date yet.'}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card title="Monthly net savings" icon={<PiggyBank className="w-4 h-4 text-emerald-300" />} subtitle="Income minus expenses for each month. The current month shows the amount so far.">
        <div className="flex items-end gap-3 h-36">
          {trend.map((t) => (
            <div key={t.month} className="flex-1 h-full flex flex-col items-center justify-end gap-1.5">
              <span className={`text-[10px] tabular-nums ${t.net < 0 ? 'text-rose-300' : 'text-[var(--muted)]'}`}>{t.net ? fmt(t.net) : ''}</span>
              <div className={`w-full max-w-10 rounded-t-md ${t.net < 0 ? 'bg-rose-400/70' : 'bg-emerald-400/70'}`} style={{ height: `${(Math.abs(t.net) / maxNet) * 75}%`, minHeight: t.net ? 3 : 0 }} />
              <span className="text-[10px] text-[var(--faint)]">{monthLabel(t.month, 'short').split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </Card>

      {editing && (
        <GoalModal
          goal={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onDelete={(id) => {
            update((d) => {
              d.goals = d.goals.filter((g) => g.id !== id);
            });
            setEditing(null);
            toast('Goal deleted', 'warn');
          }}
          onSave={(g) => {
            update((d) => {
              const idx = d.goals.findIndex((x) => x.id === g.id);
              if (idx >= 0) d.goals[idx] = g;
              else d.goals.push(g);
            });
            setEditing(null);
            toast('Goal saved');
          }}
        />
      )}
    </div>
  );
}

function GoalModal({ goal, onClose, onSave, onDelete }: { goal: SavingsGoal | null; onClose: () => void; onSave: (g: SavingsGoal) => void; onDelete: (id: number) => void }) {
  const [name, setName] = useState(goal?.name ?? '');
  const [target, setTarget] = useState(goal ? String(goal.targetAmount) : '');
  const [date, setDate] = useState(goal?.targetDate ?? `${shiftMonth(todayISO().slice(0, 7), 3)}-28`);
  const [err, setErr] = useState('');
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(target);
    if (!name.trim()) return setErr('Give the goal a name.');
    if (!Number.isFinite(amt) || amt <= 0) return setErr('Target amount must be greater than 0.');
    if (!isValidISODate(date)) return setErr('Pick a valid target date.');
    if (date < todayISO() && !goal) return setErr('The target date should be in the future.');
    onSave({ id: goal?.id ?? Date.now(), name: name.trim(), targetAmount: amt, targetDate: date, createdAt: goal?.createdAt ?? todayISO() });
  };
  return (
    <Modal title={goal ? 'Edit savings goal' : 'New savings goal'} onClose={onClose}>
      <form onSubmit={save} className="space-y-3.5" noValidate>
        <label className="block">
          <span className="label">What are you saving for?</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Littmann stethoscope" autoFocus />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="label">Target (PKR)</span>
            <input className="input tabular-nums" type="number" min="0" value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
          <label className="block">
            <span className="label">By</span>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>
        {err && <p className="text-xs text-rose-300">{err}</p>}
        <div className="flex gap-2 pt-1">
          {goal && (
            <button type="button" className="btn-secondary hover:!text-rose-300" onClick={() => window.confirm('Delete this goal?') && onDelete(goal.id)}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button type="button" className="btn-secondary flex-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1">
            Save goal
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ====================================================================== CATEGORY MODAL
export function CategoryModal({ data, type: initialType, onClose, onCreate }: { data: FinanceData; type: TxType; onClose: () => void; onCreate: (c: Category) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<TxType>(initialType);
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return setErr('Enter a name.');
    if (n.length > 30) return setErr('Keep it under 30 characters.');
    if (data.categories.some((c) => c.name.toLowerCase() === n.toLowerCase())) return setErr(`"${n}" already exists.`);
    onCreate({ id: Date.now(), name: n, type, isPredefined: false });
  };
  return (
    <Modal title="New category" onClose={onClose} width="max-w-sm">
      <form onSubmit={submit} className="space-y-3.5" noValidate>
        <label className="block">
          <span className="label">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gym, Clinical equipment" autoFocus />
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm">
          {(['expense', 'income'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} className={`py-1.5 rounded-lg font-medium ${type === t ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--muted)]'}`}>
              {t === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>
        {err && <p className="text-xs text-rose-300">{err}</p>}
        <button className="btn-primary w-full" type="submit">
          Create category
        </button>
      </form>
    </Modal>
  );
}
