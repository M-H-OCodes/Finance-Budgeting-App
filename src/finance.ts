// Core data model + pure algorithms for the Personal Finance Manager.
// Every function here is side-effect free so it can be unit-tested and
// explained step by step in the IA write-up (Criterion C).

export type TxType = 'expense' | 'income';

export interface Category {
  id: number;
  name: string;
  type: TxType;
  isPredefined: boolean;
}

export interface Transaction {
  id: number;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  categoryId: number;
  type: TxType;
}

export interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  targetDate: string; // YYYY-MM-DD
  createdAt: string; // YYYY-MM-DD
}

export interface AppNotification {
  id: number;
  createdAt: string; // ISO timestamp
  level: 'WARNING' | 'DANGER' | 'INFO';
  title: string;
  message: string;
  read: boolean;
}

export interface FinanceData {
  version: 2;
  updatedAt: number;
  monthlyIncome: number; // expected monthly stipend / allowance
  categories: Category[];
  // budgets[month][categoryId] = spending limit in PKR
  budgets: Record<string, Record<string, number>>;
  transactions: Transaction[];
  goals: SavingsGoal[];
  notifications: AppNotification[];
  // remembers which threshold alert was already sent: key `${month}:${categoryId}`
  alertLog: Record<string, 'WARNING' | 'DANGER'>;
}

export const CURRENCY = 'PKR';

export const PREDEFINED_CATEGORIES: Category[] = [
  { id: 1, name: 'Food', type: 'expense', isPredefined: true },
  { id: 2, name: 'Transport', type: 'expense', isPredefined: true },
  { id: 3, name: 'Education', type: 'expense', isPredefined: true },
  { id: 4, name: 'Personal Care', type: 'expense', isPredefined: true },
  { id: 5, name: 'Entertainment', type: 'expense', isPredefined: true },
  { id: 6, name: 'Miscellaneous', type: 'expense', isPredefined: true },
  { id: 7, name: 'Monthly Stipend', type: 'income', isPredefined: true },
  { id: 8, name: 'Other Income', type: 'income', isPredefined: true },
];

// Default share of the spending pool used when there is no spending history yet.
export const DEFAULT_WEIGHTS: Record<string, number> = {
  Food: 0.38,
  Transport: 0.15,
  Education: 0.14,
  'Personal Care': 0.12,
  Entertainment: 0.08,
  Miscellaneous: 0.13,
};

// ---------- date helpers ----------
export const pad = (n: number) => String(n).padStart(2, '0');
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toMonthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
export const todayISO = () => toISODate(new Date());
export const currentMonth = () => toMonthKey(new Date());

export function daysInMonth(month: string): number {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split('-').map(Number);
  return toMonthKey(new Date(y, m - 1 + delta, 1));
}

export function monthLabel(month: string, style: 'long' | 'short' = 'long'): string {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: style, year: 'numeric' });
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** Whole months from `fromMonth` up to and including `toDate`'s month (min 1). */
export function monthsUntil(fromMonth: string, toDate: string): number {
  const [fy, fm] = fromMonth.split('-').map(Number);
  const [ty, tm] = toDate.split('-').map(Number);
  return Math.max(1, (ty - fy) * 12 + (tm - fm) + 1);
}

export const fmt = (n: number) => Math.round(n).toLocaleString();
export const fmtPKR = (n: number) => `${n < 0 ? '−' : ''}${fmt(Math.abs(n))} ${CURRENCY}`;

// ---------- factory ----------
export function emptyFinanceData(): FinanceData {
  return {
    version: 2,
    updatedAt: Date.now(),
    monthlyIncome: 40000,
    categories: PREDEFINED_CATEGORIES.map((c) => ({ ...c })),
    budgets: {},
    transactions: [],
    goals: [],
    notifications: [],
    alertLog: {},
  };
}

/** Sample month of hostel-student data so the client can explore every screen. */
export function sampleFinanceData(): FinanceData {
  const data = emptyFinanceData();
  const now = new Date();
  const month = currentMonth();
  const prev = shiftMonth(month, -1);
  const prev2 = shiftMonth(month, -2);
  const day = Math.max(1, now.getDate());
  const d = (m: string, dd: number) => `${m}-${pad(Math.min(dd, daysInMonth(m)))}`;
  let id = Date.now();
  const tx = (m: string, dd: number, amount: number, description: string, categoryId: number, type: TxType = 'expense') => ({
    id: id++,
    amount,
    date: d(m, dd),
    description,
    categoryId,
    type,
  });

  const history: Transaction[] = [];
  for (const m of [prev2, prev]) {
    history.push(
      tx(m, 1, 40000, 'Monthly stipend', 7, 'income'),
      tx(m, 2, 6000, 'Hostel mess advance', 1),
      tx(m, 9, 3400, 'Groceries & snacks', 1),
      tx(m, 21, 4100, 'Cafeteria meals', 1),
      tx(m, 5, 2200, 'Motorcycle petrol', 2),
      tx(m, 18, 2300, 'Motorcycle petrol', 2),
      tx(m, 7, 2600, 'Pathology review book', 3),
      tx(m, 4, 1200, 'Laundry bundle', 4),
      tx(m, 14, 700, 'Toiletries', 4),
      tx(m, 12, 1500, 'Movie night', 5),
      tx(m, 15, 1100, 'Room electricity share', 6),
      tx(m, 25, 1500, 'Gym membership', 6),
    );
  }
  const current: Transaction[] = [
    tx(month, 1, 40000, 'Monthly stipend', 7, 'income'),
    tx(month, 2, 6000, 'Hostel mess advance', 1),
    tx(month, 4, 1200, 'Laundry bundle', 4),
    tx(month, 5, 2200, 'Motorcycle petrol', 2),
    tx(month, 7, 1800, 'Anatomy lab gloves & notebook', 3),
    tx(month, 10, 3200, 'Weekly groceries & snacks', 1),
    tx(month, 12, 600, 'Toiletries & soap', 4),
    tx(month, 14, 1700, 'Dinner out with study group', 5),
  ].filter((t) => Number(t.date.slice(8)) <= day);

  data.transactions = [...current, ...history].sort((a, b) => (a.date < b.date ? 1 : -1));
  const limits = { 1: 13000, 2: 5000, 3: 4500, 4: 3000, 5: 2000, 6: 3500 };
  for (const m of [prev2, prev, month]) {
    data.budgets[m] = Object.fromEntries(Object.entries(limits).map(([k, v]) => [k, v]));
  }
  data.goals = [
    {
      id: id++,
      name: 'Littmann Classic III Stethoscope',
      targetAmount: 40000,
      targetDate: `${shiftMonth(month, 3)}-28`,
      createdAt: d(prev2, 1),
    },
  ];
  return data;
}

// ---------- Algorithm 1: budget status / remaining budget ----------
export interface CategoryStatus {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

export function monthTransactions(txs: Transaction[], month: string) {
  return txs.filter((t) => t.date.startsWith(month));
}

export function budgetStatus(data: FinanceData, month: string): CategoryStatus[] {
  const limits = data.budgets[month] ?? {};
  const txs = monthTransactions(data.transactions, month);
  return data.categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const allocated = limits[cat.id] ?? 0;
      const spent = txs.filter((t) => t.type === 'expense' && t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0);
      return {
        id: cat.id,
        name: cat.name,
        allocated,
        spent,
        remaining: allocated - spent,
        percentage: allocated > 0 ? (spent / allocated) * 100 : 0,
      };
    });
}

export interface MonthSummary {
  income: number;
  expectedIncome: number;
  spent: number;
  totalBudget: number;
  remainingBudget: number;
}

export function monthSummary(data: FinanceData, month: string): MonthSummary {
  const txs = monthTransactions(data.transactions, month);
  const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const spent = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalBudget = Object.values(data.budgets[month] ?? {}).reduce((s, v) => s + v, 0);
  return {
    income,
    expectedIncome: Math.max(income, data.monthlyIncome),
    spent,
    totalBudget,
    remainingBudget: totalBudget - spent,
  };
}

// ---------- Algorithm 2: 80 % threshold alerts ----------
export interface BudgetAlert {
  categoryId: number;
  category: string;
  level: 'WARNING' | 'DANGER';
  message: string;
  pct: number;
}

export const ALERT_THRESHOLD = 0.8;

export function budgetAlerts(statuses: CategoryStatus[]): BudgetAlert[] {
  const out: BudgetAlert[] = [];
  for (const b of statuses) {
    if (b.allocated <= 0) continue;
    const ratio = b.spent / b.allocated;
    if (ratio >= 1) {
      out.push({
        categoryId: b.id,
        category: b.name,
        level: 'DANGER',
        message: `Over budget by ${fmtPKR(b.spent - b.allocated)} (${b.percentage.toFixed(0)}% used).`,
        pct: b.percentage,
      });
    } else if (ratio >= ALERT_THRESHOLD) {
      out.push({
        categoryId: b.id,
        category: b.name,
        level: 'WARNING',
        message: `${b.percentage.toFixed(0)}% of the limit used. Only ${fmtPKR(b.remaining)} left this month.`,
        pct: b.percentage,
      });
    }
  }
  return out.sort((a, b) => b.pct - a.pct);
}

// ---------- Algorithm 3: end-of-month savings forecast ----------
/** Average spend per month (total and per category) over up to 3 previous months with expenses. */
export function usualMonthlySpend(data: FinanceData, month: string): { total: number | null; byCategory: Record<number, number> } {
  const byCategory: Record<number, number> = {};
  let total = 0;
  let months = 0;
  for (let i = 1; i <= 3; i++) {
    const exp = monthTransactions(data.transactions, shiftMonth(month, -i)).filter((t) => t.type === 'expense');
    if (!exp.length) continue;
    months++;
    for (const t of exp) {
      byCategory[t.categoryId] = (byCategory[t.categoryId] ?? 0) + t.amount;
      total += t.amount;
    }
  }
  if (!months) return { total: null, byCategory };
  for (const k of Object.keys(byCategory)) byCategory[Number(k)] /= months;
  return { total: total / months, byCategory };
}

/**
 * Expected spending for the rest of the month. Two estimates are blended:
 *  - pace:  current daily burn rate × days left
 *  - usual: what normally remains to be spent (usual month − spent so far)
 * Early in the month one big payment (e.g. a mess advance) inflates the burn
 * rate, so the pace estimate is trusted more as the month goes on (weight = day / days in month).
 */
export function projectRemaining(spent: number, burnRate: number, daysLeft: number, usualMonth: number, weight: number): number {
  const pace = burnRate * daysLeft;
  const usual = Math.max(0, usualMonth - spent);
  return weight * pace + (1 - weight) * usual;
}

export interface Forecast {
  mode: 'past' | 'current' | 'future';
  dayOfMonth: number;
  totalDays: number;
  daysLeft: number;
  burnRate: number; // PKR per day so far
  dailyRate: number; // blended rate used for the rest of the month
  projectedExpenses: number; // based on current spending pattern
  projectedSavings: number; // income - projectedExpenses
  budgetSavings: number; // savings if the rest of the budget is used exactly
  income: number;
}

export function forecastMonth(data: FinanceData, month: string, today = new Date()): Forecast {
  const s = monthSummary(data, month);
  const totalDays = daysInMonth(month);
  const nowMonth = toMonthKey(today);
  const mode: Forecast['mode'] = month < nowMonth ? 'past' : month > nowMonth ? 'future' : 'current';
  const dayOfMonth = mode === 'past' ? totalDays : mode === 'future' ? 0 : today.getDate();
  const income = mode === 'past' ? s.income : s.expectedIncome;

  const burnRate = dayOfMonth > 0 ? s.spent / dayOfMonth : 0;

  // The client's usual monthly spending: average of up to 3 previous months,
  // otherwise this month's budget, otherwise the current pace.
  const usual = usualMonthlySpend(data, month);
  const usualTotal = usual.total ?? (s.totalBudget > 0 ? s.totalBudget : burnRate * totalDays);
  const weight = totalDays > 0 ? dayOfMonth / totalDays : 1;
  const remaining = projectRemaining(s.spent, burnRate, totalDays - dayOfMonth, usualTotal, weight);
  const dailyRate = totalDays - dayOfMonth > 0 ? remaining / (totalDays - dayOfMonth) : 0;

  let projectedExpenses: number;
  if (mode === 'past') projectedExpenses = s.spent;
  else if (mode === 'future') projectedExpenses = s.totalBudget || usualTotal;
  else projectedExpenses = s.spent + remaining;

  // If the client keeps to the budget, they spend whichever is larger:
  // what is already spent, or the full budget.
  const budgetExpenses = Math.max(s.spent, s.totalBudget);

  return {
    mode,
    dayOfMonth,
    totalDays,
    daysLeft: totalDays - dayOfMonth,
    burnRate,
    dailyRate,
    projectedExpenses,
    projectedSavings: income - projectedExpenses,
    budgetSavings: income - budgetExpenses,
    income,
  };
}

// ---------- Algorithm 4: savings-goal progress (waterfall) ----------
export interface GoalProgress {
  goal: SavingsGoal;
  saved: number;
  remaining: number;
  pct: number;
  monthsLeft: number;
  requiredPerMonth: number;
  isAchieved: boolean;
  projectedDate: string | null; // month the goal will be reached at the current savings rate
}

/** Net savings = all income − all expenses up to the end of `month`. */
export function netSavings(data: FinanceData, uptoMonth?: string): number {
  return data.transactions
    .filter((t) => !uptoMonth || t.date.slice(0, 7) <= uptoMonth)
    .reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
}

/** Average net saving per month over the last `n` completed months that have data. */
export function averageMonthlySaving(data: FinanceData, month: string, n = 3): number {
  const vals: number[] = [];
  for (let i = 1; i <= n; i++) {
    const m = shiftMonth(month, -i);
    const txs = monthTransactions(data.transactions, m);
    if (txs.length === 0) continue;
    vals.push(txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0));
  }
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

/**
 * Money counted towards goals: every completed month's (income − expenses),
 * plus what this month is projected to leave over (never more than what is
 * actually left right now). A stipend received on the 1st is not yet "saved".
 */
export function savedTowardsGoals(data: FinanceData, today = new Date()): number {
  const cm = toMonthKey(today);
  const realised = netSavings(data, shiftMonth(cm, -1));
  const txs = monthTransactions(data.transactions, cm);
  const currentNet = txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
  const fc = forecastMonth(data, cm, today);
  const current = txs.length ? Math.min(currentNet, fc.projectedSavings) : 0;
  return realised + current;
}

export function goalProgress(data: FinanceData, month = currentMonth()): GoalProgress[] {
  // Savings fill goals in order (first goal is the top priority).
  let pool = Math.max(0, savedTowardsGoals(data));
  const avg = averageMonthlySaving(data, month);
  return data.goals.map((goal) => {
    const saved = Math.min(pool, goal.targetAmount);
    pool -= saved;
    const remaining = Math.max(0, goal.targetAmount - saved);
    const monthsLeft = monthsUntil(month, goal.targetDate);
    let projectedDate: string | null = null;
    if (remaining === 0) projectedDate = month;
    else if (avg > 0) projectedDate = shiftMonth(month, Math.ceil(remaining / avg) - 1);
    return {
      goal,
      saved,
      remaining,
      pct: goal.targetAmount > 0 ? (saved / goal.targetAmount) * 100 : 0,
      monthsLeft,
      requiredPerMonth: remaining / monthsLeft,
      isAchieved: remaining === 0,
      projectedDate,
    };
  });
}

// ---------- Algorithm 5: goal-based spending suggestions ----------
export interface CategorySuggestion {
  categoryId: number;
  name: string;
  suggested: number;
  currentLimit: number;
  spentSoFar: number;
  projected: number; // projected month-end spend at current pace
  historicalAvg: number;
  tip: string;
  tone: 'good' | 'warn' | 'bad';
}

export interface SuggestionResult {
  income: number;
  savingsTarget: number;
  spendingPool: number;
  goalDriven: boolean;
  suggestions: CategorySuggestion[];
  feasible: boolean;
  message: string;
}

/**
 * Splits (income − required savings) across expense categories.
 * Weights come from the client's own average spending over the last three
 * months, so suggestions are individualised. Categories with no history use
 * DEFAULT_WEIGHTS (custom categories get a small equal share).
 */
export function suggestBudgets(
  data: FinanceData,
  month: string,
  opts: { income?: number; savingsTarget?: number } = {},
  today = new Date(),
): SuggestionResult {
  const income = opts.income ?? data.monthlyIncome;
  const progress = goalProgress(data, month);
  const goalNeed = progress.filter((p) => !p.isAchieved).reduce((s, p) => s + p.requiredPerMonth, 0);
  const goalDriven = opts.savingsTarget === undefined;
  const savingsTarget = Math.round(opts.savingsTarget ?? goalNeed);
  const pool = income - savingsTarget;
  const expenseCats = data.categories.filter((c) => c.type === 'expense');

  if (income <= 0 || pool <= 0) {
    return {
      income,
      savingsTarget,
      spendingPool: pool,
      goalDriven,
      suggestions: [],
      feasible: false,
      message:
        income <= 0
          ? 'Enter a monthly income greater than 0.'
          : `Saving ${fmtPKR(savingsTarget)} a month is more than your income. Push the goal deadline back or lower the target.`,
    };
  }

  // historical average spend per category over the last 3 months that have expenses
  const hist = usualMonthlySpend(data, month).byCategory;

  const histTotal = Object.values(hist).reduce((a, b) => a + b, 0);
  const customShare = 0.05;
  const rawWeights = expenseCats.map((c) => {
    const def = DEFAULT_WEIGHTS[c.name] ?? customShare;
    if (histTotal > 0) {
      // blend: 70 % personal history, 30 % sensible default
      return 0.7 * ((hist[c.id] ?? 0) / histTotal) + 0.3 * def;
    }
    return def;
  });
  const wSum = rawWeights.reduce((a, b) => a + b, 0) || 1;

  const statuses = budgetStatus(data, month);
  const fc = forecastMonth(data, month, today);
  const weight = fc.totalDays > 0 ? fc.dayOfMonth / fc.totalDays : 1;
  // same blended projection as forecastMonth, per category
  const projectFor = (spent: number, catId: number) => {
    if (fc.mode !== 'current' || fc.dayOfMonth === 0) return spent;
    const burn = spent / fc.dayOfMonth;
    const usualMonth = hist[catId] ?? burn * fc.totalDays;
    return spent + projectRemaining(spent, burn, fc.daysLeft, usualMonth, weight);
  };

  // 1) share of the pool, rounded to 50 PKR
  const amounts = expenseCats.map((c, i) => Math.round((pool * rawWeights[i]) / wSum / 50) * 50);
  const rounded = amounts.reduce((a, b) => a + b, 0);
  if (rounded !== pool && amounts.length) {
    const li = amounts.indexOf(Math.max(...amounts));
    amounts[li] += pool - rounded; // keep the total exact
  }
  // 2) never suggest spending more than the client usually spends (or has
  //    budgeted) in a category: the difference becomes extra savings.
  let extraSavings = 0;
  expenseCats.forEach((c, i) => {
    const st = statuses.find((s) => s.id === c.id)!;
    const ceiling = Math.max(hist[c.id] ?? 0, st.allocated);
    if (ceiling > 0 && amounts[i] > ceiling) {
      const capped = Math.ceil(ceiling / 50) * 50;
      extraSavings += amounts[i] - capped;
      amounts[i] = capped;
    }
  });

  const suggestions = expenseCats.map((c, i) => {
    const suggested = amounts[i];
    const st = statuses.find((s) => s.id === c.id)!;
    const projected = projectFor(st.spent, c.id);
    let tip: string;
    let tone: CategorySuggestion['tone'] = 'good';
    if (st.spent > suggested) {
      tone = 'bad';
      tip = `Already ${fmtPKR(st.spent - suggested)} over the suggested amount. Pause spending here for the rest of the month.`;
    } else if (projected > suggested * 1.05) {
      tone = 'warn';
      const daily = fc.daysLeft > 0 ? (suggested - st.spent) / fc.daysLeft : 0;
      tip = `At this pace you'll spend about ${fmtPKR(projected)}. Keep it under ${fmtPKR(daily)} a day to stay on track.`;
    } else if ((hist[c.id] ?? 0) > suggested * 1.1) {
      tone = 'warn';
      tip = `You usually spend about ${fmtPKR(hist[c.id])}. Cutting ${fmtPKR(hist[c.id] - suggested)} here funds your goal.`;
    } else {
      tip = `On track. ${fmtPKR(Math.max(0, suggested - st.spent))} still available.`;
    }
    return {
      categoryId: c.id,
      name: c.name,
      suggested,
      currentLimit: st.allocated,
      spentSoFar: st.spent,
      projected,
      historicalAvg: hist[c.id] ?? 0,
      tip,
      tone,
    };
  });
  const base = goalDriven
    ? savingsTarget > 0
      ? `Your goals need ${fmtPKR(savingsTarget)} saved a month to finish on time.`
      : 'You have no active savings goal.'
    : `Target: save ${fmtPKR(savingsTarget)} a month.`;
  const extra = extraSavings > 0 ? ` These limits stay at or below what you normally spend, so you could save ${fmtPKR(savingsTarget + extraSavings)} in total.` : ` That leaves ${fmtPKR(pool)} to spend.`;

  return {
    income,
    savingsTarget,
    spendingPool: pool - extraSavings,
    goalDriven,
    suggestions,
    feasible: true,
    message: base + extra,
  };
}

// ---------- search (Criterion 9) ----------
export interface TxFilter {
  keyword: string;
  categoryId: string; // 'ALL' or id
  type: 'ALL' | TxType;
  from: string;
  to: string;
}

export function filterTransactions(txs: Transaction[], f: TxFilter, categories: Category[]): Transaction[] {
  const kw = f.keyword.trim().toLowerCase();
  return txs
    .filter((t) => {
      if (kw) {
        const catName = categories.find((c) => c.id === t.categoryId)?.name.toLowerCase() ?? '';
        if (!t.description.toLowerCase().includes(kw) && !catName.includes(kw) && !String(t.amount).includes(kw)) return false;
      }
      if (f.categoryId !== 'ALL' && t.categoryId !== Number(f.categoryId)) return false;
      if (f.type !== 'ALL' && t.type !== f.type) return false;
      if (f.from && t.date < f.from) return false;
      if (f.to && t.date > f.to) return false;
      return true;
    })
    .sort((a, b) => (a.date === b.date ? b.id - a.id : a.date < b.date ? 1 : -1));
}

// ---------- trends for charts ----------
export function monthlyTrend(data: FinanceData, endMonth: string, n = 6) {
  const out: { month: string; income: number; expense: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const m = shiftMonth(endMonth, -i);
    const txs = monthTransactions(data.transactions, m);
    out.push({
      month: m,
      income: txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      expense: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    });
  }
  return out;
}

/** Cumulative spending per day of the month. */
export function cumulativeDaily(data: FinanceData, month: string): number[] {
  const days = daysInMonth(month);
  const perDay = new Array(days).fill(0);
  for (const t of monthTransactions(data.transactions, month)) {
    if (t.type !== 'expense') continue;
    const d = Number(t.date.slice(8)) - 1;
    if (d >= 0 && d < days) perDay[d] += t.amount;
  }
  let run = 0;
  return perDay.map((v) => (run += v));
}

export function categoryName(data: FinanceData, id: number) {
  return data.categories.find((c) => c.id === id)?.name ?? 'Deleted category';
}

export function toCSV(rows: (string | number)[][]): string {
  return rows
    .map((r) =>
      r
        .map((v) => {
          const s = String(v);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(','),
    )
    .join('\n');
}

export function downloadFile(name: string, content: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Migrates v1 localStorage data (from the earlier prototype) into the v2 model. */
export function migrateLegacy(): FinanceData | null {
  try {
    const txRaw = localStorage.getItem('pfm_transactions');
    if (!txRaw) return null;
    const data = emptyFinanceData();
    const cats = JSON.parse(localStorage.getItem('pfm_categories') || 'null');
    if (Array.isArray(cats)) data.categories = cats.map((c: Category) => ({ id: c.id, name: c.name, type: c.type, isPredefined: !!c.isPredefined }));
    const txs = JSON.parse(txRaw);
    if (Array.isArray(txs))
      data.transactions = txs.map((t: Transaction) => ({
        id: t.id,
        amount: Number(t.amount),
        date: t.date,
        description: t.description,
        categoryId: t.categoryId,
        type: t.type,
      }));
    const budgets = JSON.parse(localStorage.getItem('pfm_budgets') || 'null');
    if (Array.isArray(budgets)) {
      const m = currentMonth();
      data.budgets[m] = Object.fromEntries(budgets.map((b: { categoryId: number; allocated: number }) => [b.categoryId, b.allocated]));
    }
    const goal = JSON.parse(localStorage.getItem('pfm_goal') || 'null');
    if (goal?.name) data.goals = [{ id: 1, name: goal.name, targetAmount: goal.targetAmount, targetDate: goal.targetDate, createdAt: todayISO() }];
    return data;
  } catch {
    return null;
  }
}
