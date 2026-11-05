import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell,
  BellRing,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Coins,
  Database,
  FolderDown,
  HardDriveDownload,
  LayoutDashboard,
  Loader2,
  LogOut,
  PieChart,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Target,
  Upload,
  Wallet,
} from 'lucide-react';
import { useAuth, useFinanceStore, type AppUser } from './hooks';
import { isFirebaseConfigured } from './firebase';
import {
  type FinanceData,
  type Transaction,
  type TxType,
  budgetAlerts,
  budgetStatus,
  currentMonth,
  downloadFile,
  emptyFinanceData,
  monthLabel,
  needsSetup,
  PREDEFINED_CATEGORIES,
  fmt,
  sampleFinanceData,
  todayISO,
  shiftMonth,
} from './finance';
import { AuthScreen, EmailActionScreen, LoadingScreen, VerifyEmailScreen } from './AuthScreens';
import { UserCounter } from './UserCounter';
import { AdminPanel } from './AdminPanel';
import { AddTransaction, Analytics, Budgets, CategoryModal, Dashboard, Goals, History, TransactionForm, type Screen } from './Screens';
import { Modal } from './ui';
import { usePWAInstall } from './usePWAInstall';
import { useOnlineStatus } from './useOnlineStatus';

const actionParams = new URLSearchParams(window.location.search);
const verifyCode = actionParams.get('mode') === 'verifyEmail' ? actionParams.get('oobCode') : null;

export default function App() {
  const { user, loading, refresh, signOut, startDemo } = useAuth();
  if (verifyCode && isFirebaseConfigured) return <EmailActionScreen oobCode={verifyCode} />;
  if (loading) return <LoadingScreen />;
  if (!user) return <AuthScreen onDemo={startDemo} />;
  if (!user.emailVerified) return <VerifyEmailScreen user={user} onRefresh={refresh} onSignOut={signOut} />;
  return <Workspace key={user.uid} user={user} onSignOut={signOut} />;
}

// ---------------------------------------------------------------- navigation
const NAV: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'add', label: 'Add', icon: Plus },
  { id: 'budget', label: 'Budgets', icon: Coins },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'history', label: 'History', icon: Search },
  { id: 'goals', label: 'Goals', icon: Target },
];
const TITLES: Record<Screen, string> = {
  dashboard: 'Dashboard',
  add: 'Record transaction',
  budget: 'Monthly budget',
  analytics: 'Spending analysis',
  history: 'History & search',
  goals: 'Savings goals',
  admin: 'Admin',
};

interface ToastMsg {
  id: number;
  msg: string;
  tone: 'good' | 'warn' | 'bad';
}

function Workspace({ user, onSignOut }: { user: AppUser; onSignOut: () => void }) {
  const store = useFinanceStore(user);
  const { data, ready, update, replace, sync } = store;
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [month, setMonth] = useState(currentMonth());
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [showBell, setShowBell] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [catModal, setCatModal] = useState<TxType | null>(null);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const online = useOnlineStatus();

  const toast = useCallback((msg: string, tone: ToastMsg['tone'] = 'good') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  // Criterion 6: notify when a category reaches 80 % (and again at 100 %) of
  // this month's budget. Runs whenever data changes; alertLog makes sure each
  // alert fires once. Past months still show their alerts on the dashboard.
  useEffect(() => {
    if (!data) return;
    const fresh: { key: string; level: 'WARNING' | 'DANGER'; title: string; message: string }[] = [];
    const cleared: string[] = [];
    for (const m of [currentMonth()]) {
      const alerts = budgetAlerts(budgetStatus(data, m));
      const active = new Set<string>();
      for (const a of alerts) {
        const key = `${m}:${a.categoryId}`;
        active.add(key);
        const prev = data.alertLog[key];
        if (prev === a.level || (prev === 'DANGER' && a.level === 'WARNING')) continue;
        fresh.push({
          key,
          level: a.level,
          title: a.level === 'DANGER' ? `${a.category} is over budget` : `${a.category} reached 80% of its budget`,
          message: `${monthLabel(m)}: ${a.message}`,
        });
      }
      for (const key of Object.keys(data.alertLog)) if (key.startsWith(`${m}:`) && !active.has(key)) cleared.push(key);
    }
    if (!fresh.length && !cleared.length) return;
    update((d) => {
      for (const k of cleared) delete d.alertLog[k];
      for (const f of fresh) {
        d.alertLog[f.key] = f.level;
        d.notifications.unshift({ id: Date.now() + Math.random(), createdAt: new Date().toISOString(), level: f.level, title: f.title, message: f.message, read: false });
      }
      d.notifications = d.notifications.slice(0, 50);
    });
    for (const f of fresh) {
      toast(f.title, f.level === 'DANGER' ? 'bad' : 'warn');
      try {
        if ('Notification' in window && Notification.permission === 'granted') new Notification(f.title, { body: f.message, icon: import.meta.env.BASE_URL + 'pwa-192x192.png', tag: f.key });
      } catch {
        /* some mobile browsers only allow notifications from a service worker */
      }
    }
  }, [data, update, toast]);

  if (!ready && !data) return <LoadingScreen />;
  if (!data || needsSetup(data)) return <Onboarding user={user} onStart={(d) => replace(d)} />;

  const unread = data.notifications.filter((n) => !n.read).length;
  const go = (s: Screen) => {
    setScreen(s);
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  };
  const screenProps = { data, update, month, go, toast };
  const isCurrent = month === currentMonth();

  return (
    <div className="h-dvh w-full flex bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* ---------- sidebar (desktop) ---------- */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/60">
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 grid place-items-center shadow-lg shadow-sky-500/20">
            <Wallet className="w-5 h-5 text-slate-950" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Finance Manager</div>
            <div className="text-[11px] text-[var(--muted)]">Personal finance for students</div>
          </div>
        </div>
        <nav className="px-3 space-y-0.5 flex-1">
          {NAV.map((n) => (
            <NavButton key={n.id} active={screen === n.id} onClick={() => go(n.id)} icon={<n.icon className="w-4 h-4" />} label={n.id === 'add' ? 'Add transaction' : n.label} />
          ))}
          {user.isAdmin && (
            <>
              <div className="pt-4 pb-1.5 px-3 text-[10px] uppercase tracking-wider text-[var(--faint)]">Administration</div>
              <NavButton active={screen === 'admin'} onClick={() => go('admin')} icon={<ShieldCheck className="w-4 h-4" />} label="Admin portal" tone="violet" />
            </>
          )}
        </nav>
        <div className="p-3 border-t border-[var(--border)]">
          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04] text-left">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 grid place-items-center text-xs font-bold text-slate-950 shrink-0">
              {user.displayName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user.displayName}</div>
              <div className="text-[11px] text-[var(--muted)] truncate">{user.email}</div>
            </div>
            <Settings className="w-4 h-4 text-[var(--muted)]" />
          </button>
        </div>
      </aside>

      {/* ---------- main ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-3 gap-y-2.5">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">{TITLES[screen]}</h1>
            <SyncBadge state={user.isDemo ? 'local' : online ? sync : 'offline'} />
          </div>

          {screen !== 'admin' && screen !== 'history' && (
            <div className="order-last w-full sm:order-none sm:w-auto flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm">
              <button className="p-2 text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="flex-1 sm:flex-none px-2 sm:min-w-32 text-center font-medium tabular-nums" onClick={() => setMonth(currentMonth())} title="Back to this month">
                {monthLabel(month)}
                {!isCurrent && <span className="block text-[10px] text-sky-300 -mt-0.5">tap for this month</span>}
              </button>
              <button className="p-2 text-[var(--muted)] hover:text-[var(--text)]" onClick={() => setMonth(shiftMonth(month, 1))} aria-label="Next month">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative">
            <button onClick={() => setShowBell((v) => !v)} className="relative w-9 h-9 grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]" aria-label="Notifications">
              {unread ? <BellRing className="w-4 h-4 text-amber-300" /> : <Bell className="w-4 h-4 text-[var(--muted)]" />}
              {unread > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold grid place-items-center">{unread}</span>}
            </button>
            {showBell && <NotificationPanel data={data} update={update} onClose={() => setShowBell(false)} />}
          </div>

          <div className="hidden sm:block">
            <UserCounter />
          </div>
          <div className="sm:hidden">
            <UserCounter compact />
          </div>
          <button onClick={() => setShowSettings(true)} className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 grid place-items-center text-xs font-bold text-slate-950" aria-label="Account and settings">
            {user.displayName.slice(0, 1).toUpperCase()}
          </button>
        </header>

        <main id="main-scroll" className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 pb-28 lg:pb-8">
          <div className="max-w-6xl mx-auto animate-rise" key={screen}>
            {screen === 'dashboard' && <Dashboard {...screenProps} />}
            {screen === 'add' && <AddTransaction {...screenProps} onNewCategory={setCatModal} onEdit={setEditing} />}
            {screen === 'budget' && <Budgets {...screenProps} onNewCategory={setCatModal} />}
            {screen === 'analytics' && <Analytics {...screenProps} />}
            {screen === 'history' && <History {...screenProps} onEdit={setEditing} />}
            {screen === 'goals' && <Goals {...screenProps} />}
            {screen === 'admin' && user.isAdmin && <AdminPanel user={user} />}
          </div>
        </main>

        {/* ---------- bottom nav (mobile) ---------- */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
          <div className="flex">
            {NAV.map((n) =>
              n.id === 'add' ? (
                <button key={n.id} onClick={() => go('add')} className="flex-1 flex flex-col items-center -mt-4" aria-label="Add transaction">
                  <span className={`w-12 h-12 rounded-2xl grid place-items-center shadow-lg shadow-sky-500/30 ${screen === 'add' ? 'bg-sky-300' : 'bg-sky-400'} text-slate-950`}>
                    <Plus className="w-6 h-6" />
                  </span>
                </button>
              ) : (
                <button key={n.id} onClick={() => go(n.id)} className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${screen === n.id ? 'text-sky-300' : 'text-[var(--muted)]'}`}>
                  <n.icon className="w-5 h-5" />
                  {n.label}
                </button>
              ),
            )}
            {user.isAdmin && (
              <button onClick={() => go('admin')} className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${screen === 'admin' ? 'text-violet-300' : 'text-[var(--muted)]'}`}>
                <ShieldCheck className="w-5 h-5" />
                Admin
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* ---------- overlays ---------- */}
      <div className="fixed z-[60] bottom-24 lg:bottom-6 right-4 left-4 sm:left-auto flex flex-col gap-2 items-stretch sm:items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto animate-rise rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border backdrop-blur ${
              t.tone === 'bad' ? 'bg-rose-950/90 border-rose-400/40 text-rose-100' : t.tone === 'warn' ? 'bg-amber-950/90 border-amber-400/40 text-amber-100' : 'bg-emerald-950/90 border-emerald-400/40 text-emerald-100'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {catModal && (
        <CategoryModal
          data={data}
          type={catModal}
          onClose={() => setCatModal(null)}
          onCreate={(c) => {
            update((d) => {
              d.categories.push(c);
            });
            setCatModal(null);
            toast(`Category "${c.name}" added`);
          }}
        />
      )}

      {editing && (
        <Modal title="Edit transaction" onClose={() => setEditing(null)}>
          <TransactionForm
            data={data}
            initial={editing}
            submitLabel="Save changes"
            onNewCategory={setCatModal}
            onSubmit={(t) => {
              update((d) => {
                const i = d.transactions.findIndex((x) => x.id === editing.id);
                if (i >= 0) d.transactions[i] = { ...t, id: editing.id };
              });
              setEditing(null);
              toast('Transaction updated');
            }}
          />
        </Modal>
      )}

      {showSettings && <SettingsModal user={user} data={data} update={update} replace={replace} onClose={() => setShowSettings(false)} onSignOut={onSignOut} toast={toast} />}
    </div>
  );
}

function NavButton({ active, onClick, icon, label, tone = 'sky' }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; tone?: 'sky' | 'violet' }) {
  const activeCls = tone === 'violet' ? 'bg-violet-400/10 text-violet-200' : 'bg-sky-400/10 text-sky-200';
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? `${activeCls} font-medium` : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/[0.03]'}`}>
      {icon}
      {label}
    </button>
  );
}

function SyncBadge({ state }: { state: 'local' | 'saving' | 'synced' | 'offline' }) {
  const map = {
    local: { icon: <Database className="w-3 h-3" />, text: 'Saved on this device' },
    saving: { icon: <Loader2 className="w-3 h-3 animate-spin" />, text: 'Saving…' },
    synced: { icon: <Cloud className="w-3 h-3" />, text: 'Saved to your account' },
    offline: { icon: <CloudOff className="w-3 h-3" />, text: 'Offline, saved on device' },
  }[state];
  return (
    <div className="flex items-center gap-1 text-[11px] text-[var(--faint)]">
      {map.icon}
      {map.text}
    </div>
  );
}

// ---------------------------------------------------------------- notifications
function NotificationPanel({ data, update, onClose }: { data: FinanceData; update: (fn: (d: FinanceData) => void) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [perm, setPerm] = useState<string>('Notification' in window ? Notification.permission : 'unsupported');
  useEffect(() => {
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onClose();
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [onClose]);
  return (
    <div ref={ref} className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-16 sm:top-11 z-50 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-rise">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <span className="font-semibold text-sm">Budget alerts</span>
        {data.notifications.some((n) => !n.read) && (
          <button
            className="text-xs text-sky-300 hover:underline"
            onClick={() =>
              update((d) => {
                d.notifications.forEach((n) => (n.read = true));
              })
            }
          >
            Mark all read
          </button>
        )}
      </div>
      <ul className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
        {data.notifications.length === 0 && <li className="px-4 py-8 text-center text-sm text-[var(--muted)]">You'll be notified here when a category reaches 80% of its budget.</li>}
        {data.notifications.map((n) => (
          <li key={n.id} className={`px-4 py-3 flex gap-3 ${n.read ? 'opacity-60' : ''}`}>
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.level === 'DANGER' ? 'bg-rose-400' : n.level === 'WARNING' ? 'bg-amber-400' : 'bg-sky-400'}`} />
            <div className="min-w-0">
              <div className="text-sm font-medium">{n.title}</div>
              <div className="text-xs text-[var(--muted)]">{n.message}</div>
              <div className="text-[10px] text-[var(--faint)] mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          </li>
        ))}
      </ul>
      {perm === 'default' && (
        <div className="p-3 border-t border-[var(--border)]">
          <button className="btn-secondary w-full text-xs" onClick={() => Notification.requestPermission().then(setPerm)}>
            <BellRing className="w-3.5 h-3.5" /> Also notify me on this device
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- onboarding
// Three short steps: income -> monthly budget per category -> optional savings
// goal. Everything starts at 0, so the forecast only ever uses numbers the
// person typed in or transactions they record.
function Onboarding({ user, onStart }: { user: AppUser; onStart: (d: FinanceData) => void }) {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState('');
  const [limits, setLimits] = useState<Record<number, string>>({});
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState(`${shiftMonth(currentMonth(), 3)}-28`);
  const [err, setErr] = useState('');
  const cats = PREDEFINED_CATEGORIES.filter((c) => c.type === 'expense');
  const incomeN = Number(income) || 0;
  const budgetTotal = cats.reduce((s, c) => s + (Number(limits[c.id]) || 0), 0);
  const left = incomeN - budgetTotal;

  const finish = (withGoal: boolean) => {
    const d = emptyFinanceData();
    d.monthlyIncome = incomeN;
    const b: Record<number, number> = {};
    for (const c of cats) if (Number(limits[c.id]) > 0) b[c.id] = Number(limits[c.id]);
    if (Object.keys(b).length) d.budgets[currentMonth()] = b;
    if (withGoal) {
      const t = Number(goalTarget);
      if (!goalName.trim()) return setErr('Give the goal a name, or skip this step.');
      if (!Number.isFinite(t) || t <= 0) return setErr('Target amount must be greater than 0.');
      if (goalDate < todayISO()) return setErr('The target date should be in the future.');
      d.goals = [{ id: Date.now(), name: goalName.trim(), targetAmount: t, targetDate: goalDate, createdAt: todayISO() }];
    }
    onStart(d);
  };

  const next = () => {
    setErr('');
    if (step === 0 && (income.trim() === '' || !Number.isFinite(Number(income)) || Number(income) < 0)) return setErr('Enter your monthly income (use 0 if you have none yet).');
    setStep(step + 1);
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-[var(--bg)] text-[var(--text)] p-4">
      <div className="absolute top-5 right-5">
        <UserCounter />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 animate-rise">
        <div className="text-sm text-emerald-300 font-medium">Email verified ✓ · Step {step + 1} of 3</div>
        <h1 className="text-xl font-semibold tracking-tight mt-1">{step === 0 ? `Welcome, ${user.displayName}` : step === 1 ? 'Plan your monthly budget' : 'Set a savings goal'}</h1>

        {step === 0 && (
          <>
            <p className="text-sm text-[var(--muted)] mt-1.5">How much money do you receive each month? Your savings forecast starts from this. You can change it later in Settings.</p>
            <label className="block mt-5">
              <span className="label">Monthly income / stipend (PKR)</span>
              <input className="input tabular-nums" type="number" min="0" inputMode="numeric" placeholder="0" value={income} onChange={(e) => setIncome(e.target.value)} autoFocus />
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm text-[var(--muted)] mt-1.5">How much do you plan to spend on each category this month? Leave any blank to skip it. Predictions improve as you record real spending.</p>
            <div className="mt-4 space-y-2">
              {cats.map((c) => (
                <label key={c.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm">{c.name}</span>
                  <input
                    className="input !w-32 text-right tabular-nums !py-1.5"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    aria-label={`${c.name} budget`}
                    value={limits[c.id] ?? ''}
                    onChange={(e) => setLimits({ ...limits, [c.id]: e.target.value })}
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-white/[0.03] border border-[var(--border)] p-3 flex justify-between text-sm">
              <span className="text-[var(--muted)]">{left >= 0 ? 'Predicted savings' : 'Over your income by'}</span>
              <span className={`font-semibold tabular-nums ${left >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{fmt(Math.abs(left))} PKR</span>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-[var(--muted)] mt-1.5">Optional: what are you saving for? We'll show how close you are and when you'll get there.</p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="label">Goal name</span>
                <input className="input" placeholder="e.g. New laptop" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label">Target (PKR)</span>
                  <input className="input tabular-nums" type="number" min="0" inputMode="numeric" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
                </label>
                <label className="block">
                  <span className="label">By</span>
                  <input className="input" type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} />
                </label>
              </div>
            </div>
          </>
        )}

        {err && <p className="text-xs text-rose-300 mt-3">{err}</p>}

        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <button className="btn-secondary" onClick={() => { setErr(''); setStep(step - 1); }}>
              Back
            </button>
          )}
          {step < 2 ? (
            <button className="btn-primary flex-1 !py-2.5" onClick={next}>
              Continue
            </button>
          ) : (
            <>
              <button className="btn-secondary flex-1 !py-2.5" onClick={() => finish(false)}>
                Skip
              </button>
              <button className="btn-primary flex-1 !py-2.5" onClick={() => finish(true)}>
                Finish
              </button>
            </>
          )}
        </div>
        {step === 0 && (
          <button
            className="mt-4 w-full text-xs text-[var(--muted)] hover:text-[var(--text)]"
            onClick={() => {
              const d = sampleFinanceData();
              if (incomeN > 0) d.monthlyIncome = incomeN;
              onStart(d);
            }}
          >
            Just explore with sample data
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- settings
function SettingsModal({
  user,
  data,
  update,
  replace,
  onClose,
  onSignOut,
  toast,
}: {
  user: AppUser;
  data: FinanceData;
  update: (fn: (d: FinanceData) => void) => void;
  replace: (d: FinanceData) => void;
  onClose: () => void;
  onSignOut: () => void;
  toast: (m: string, t?: 'good' | 'warn' | 'bad') => void;
}) {
  const [income, setIncome] = useState(String(data.monthlyIncome));
  const [zipping, setZipping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const importBackup = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as FinanceData;
      if (parsed.version !== 2 || !Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) throw new Error('Not a backup from this app.');
      if (!window.confirm(`Replace your current data with this backup (${parsed.transactions.length} transactions)?`)) return;
      replace(parsed);
      toast('Backup restored');
      onClose();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not read that file', 'bad');
    }
  };

  return (
    <Modal title="Account & settings" onClose={onClose}>
      <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-[var(--border)] p-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 grid place-items-center font-bold text-slate-950">{user.displayName.slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0 flex-1">
          <div className="font-medium truncate">{user.displayName}</div>
          <div className="text-xs text-[var(--muted)] truncate">{user.email}</div>
        </div>
        {user.isAdmin && <span className="pill !bg-violet-400/10 !text-violet-200 !border-violet-400/30">Admin</span>}
      </div>

      <label className="block">
        <span className="label">Monthly income / stipend (PKR)</span>
        <div className="flex gap-2">
          <input className="input tabular-nums" type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} />
          <button
            className="btn-primary"
            onClick={() => {
              const n = Number(income);
              if (!Number.isFinite(n) || n < 0) return toast('Enter 0 or a positive amount', 'bad');
              update((d) => {
                d.monthlyIncome = n;
              });
              toast('Monthly income updated');
            }}
          >
            Save
          </button>
        </div>
        <span className="text-[11px] text-[var(--faint)] mt-1 block">Used for forecasts until you record this month's income.</span>
      </label>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          className="btn-secondary text-xs"
          onClick={() => downloadFile(`finance_backup_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json')}
        >
          <HardDriveDownload className="w-3.5 h-3.5" /> Export backup
        </button>
        <button className="btn-secondary text-xs" onClick={() => fileRef.current?.click()}>
          <Upload className="w-3.5 h-3.5" /> Restore backup
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])} />
        <button
          className="btn-secondary text-xs"
          disabled={zipping}
          onClick={async () => {
            setZipping(true);
            try {
              const { downloadOfflineDesktopPackage } = await import('./offlinePackage');
              await downloadOfflineDesktopPackage();
              toast('Offline desktop package downloaded');
            } catch (e) {
              toast(`Download failed: ${String(e)}`, 'bad');
            } finally {
              setZipping(false);
            }
          }}
        >
          <FolderDown className="w-3.5 h-3.5" /> {zipping ? 'Packaging…' : 'Desktop app (.zip)'}
        </button>
        <button
          className="btn-secondary text-xs"
          disabled={isInstalled}
          onClick={async () => {
            if (isInstallable) await install();
            else if (isIOS) toast('In Safari: tap Share → Add to Home Screen', 'warn');
            else toast("Use your browser menu → 'Install app' or 'Add to Home screen'", 'warn');
          }}
        >
          <Smartphone className="w-3.5 h-3.5" /> {isInstalled ? 'Installed' : 'Install on phone'}
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--border)] flex flex-wrap gap-2 justify-between">
        <button
          className="btn-ghost text-xs hover:!text-rose-300"
          onClick={() => {
            if (window.confirm('Erase all your transactions, budgets and goals? Export a backup first if you might need them.')) {
              replace(emptyFinanceData());
              toast('All data erased', 'warn');
              onClose();
            }
          }}
        >
          Erase my data
        </button>
        <button className="btn-secondary" onClick={onSignOut}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </Modal>
  );
}
