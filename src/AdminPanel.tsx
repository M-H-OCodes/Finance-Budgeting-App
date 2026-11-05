import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, type Timestamp } from 'firebase/firestore';
import { AlertTriangle, Download, Search, ShieldCheck, UserCheck, Users, Wallet } from 'lucide-react';
import { db } from './firebase';
import { downloadFile, fmt, toCSV } from './finance';
import { useUserCount, type AppUser } from './hooks';
import { Card, Kpi } from './ui';

interface UserRow {
  uid: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date | null;
  lastActive: Date | null;
  summary: {
    month: string;
    income: number;
    spent: number;
    budget: number;
    transactions: number;
    goalName: string | null;
    goalPct: number | null;
  } | null;
}

const tsToDate = (t: unknown) => (t && typeof (t as Timestamp).toDate === 'function' ? (t as Timestamp).toDate() : null);

function ago(d: Date | null) {
  if (!d) return '—';
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 90) return 'Just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)} d ago`;
  return d.toLocaleDateString();
}

export function AdminPanel({ user }: { user: AppUser }) {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'UNVERIFIED' | 'OVER'>('ALL');
  const { count } = useUserCount();

  useEffect(() => {
    if (!user.isAdmin) return;
    if (!db || user.isDemo) {
      setLoading(false);
      setError(user.isDemo ? 'Preview mode: connect Firebase to load real registered users.' : 'Firebase is not configured.');
      return;
    }
    return onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      (snap) => {
        setRows(
          snap.docs.map((d) => {
            const v = d.data();
            return {
              uid: d.id,
              name: v.name ?? '',
              email: v.email ?? '',
              emailVerified: !!v.emailVerified,
              createdAt: tsToDate(v.createdAt),
              lastActive: tsToDate(v.lastActive),
              summary: v.summary ?? null,
            };
          }),
        );
        setLoading(false);
      },
      (e) => {
        setError(e.code === 'permission-denied' ? 'Permission denied. Deploy firestore.rules from SETUP.md.' : e.message);
        setLoading(false);
      },
    );
  }, [user]);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (k && !r.name.toLowerCase().includes(k) && !r.email.includes(k)) return false;
      if (filter === 'VERIFIED' && !r.emailVerified) return false;
      if (filter === 'UNVERIFIED' && r.emailVerified) return false;
      if (filter === 'OVER' && !(r.summary && r.summary.budget > 0 && r.summary.spent > r.summary.budget)) return false;
      return true;
    });
  }, [rows, q, filter]);

  if (!user.isAdmin) return null; // defence in depth: the nav never shows it either

  const verified = rows.filter((r) => r.emailVerified).length;
  const active7 = rows.filter((r) => r.lastActive && Date.now() - r.lastActive.getTime() < 7 * 86400000).length;
  const over = rows.filter((r) => r.summary && r.summary.budget > 0 && r.summary.spent > r.summary.budget).length;

  const exportCsv = () => {
    downloadFile(
      `registered_users_${new Date().toISOString().slice(0, 10)}.csv`,
      toCSV([
        ['Name', 'Email', 'Verified', 'Joined', 'Last active', 'Month', 'Income', 'Spent', 'Budget', 'Transactions', 'Goal', 'Goal %'],
        ...filtered.map((r) => [
          r.name,
          r.email,
          r.emailVerified ? 'yes' : 'no',
          r.createdAt?.toISOString() ?? '',
          r.lastActive?.toISOString() ?? '',
          r.summary?.month ?? '',
          r.summary?.income ?? '',
          r.summary?.spent ?? '',
          r.summary?.budget ?? '',
          r.summary?.transactions ?? '',
          r.summary?.goalName ?? '',
          r.summary?.goalPct ?? '',
        ]),
      ]),
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Kpi icon={<Users className="w-4 h-4" />} label="User counter" value={count === null ? '—' : fmt(count)} hint={`${rows.length} accounts in database`} tone="violet" />
        <Kpi icon={<UserCheck className="w-4 h-4" />} label="Verified emails" value={fmt(verified)} hint={`${rows.length - verified} pending verification`} tone="emerald" />
        <Kpi icon={<Wallet className="w-4 h-4" />} label="Active (7 days)" value={fmt(active7)} hint="Opened the app this week" tone="sky" />
        <Kpi icon={<AlertTriangle className="w-4 h-4" />} label="Over budget" value={fmt(over)} hint="This month" tone="amber" />
      </div>

      <Card
        title="Registered users"
        icon={<ShieldCheck className="w-4 h-4 text-violet-300" />}
        subtitle="Live list. Only visible to the administrator account."
        action={
          <button onClick={exportCsv} disabled={!filtered.length} className="btn-secondary">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="input pl-9" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="input sm:w-48">
            <option value="ALL">All users</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Not verified</option>
            <option value="OVER">Over budget</option>
          </select>
        </div>

        {error && <p className="text-sm rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 px-3 py-2 mb-3">{error}</p>}

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left text-sm min-w-[720px]">
            <thead className="text-[11px] uppercase tracking-wider text-[var(--faint)]">
              <tr className="border-b border-[var(--border)]">
                <th className="py-2.5 px-2 font-medium">User</th>
                <th className="py-2.5 px-2 font-medium">Status</th>
                <th className="py-2.5 px-2 font-medium">Joined</th>
                <th className="py-2.5 px-2 font-medium">Last active</th>
                <th className="py-2.5 px-2 font-medium text-right">Spent / budget</th>
                <th className="py-2.5 px-2 font-medium">Savings goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((r) => {
                const pct = r.summary && r.summary.budget > 0 ? (r.summary.spent / r.summary.budget) * 100 : null;
                return (
                  <tr key={r.uid} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2">
                      <div className="font-medium">{r.name || '—'}</div>
                      <div className="text-xs text-[var(--muted)]">{r.email}</div>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className={`pill ${r.emailVerified ? 'pill-good' : 'pill-warn'}`}>{r.emailVerified ? 'Verified' : 'Unverified'}</span>
                    </td>
                    <td className="py-2.5 px-2 text-[var(--muted)]">{r.createdAt?.toLocaleDateString() ?? '—'}</td>
                    <td className="py-2.5 px-2 text-[var(--muted)]">{ago(r.lastActive)}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      {r.summary ? (
                        <>
                          {fmt(r.summary.spent)} / {fmt(r.summary.budget)}
                          {pct !== null && (
                            <span className={`ml-2 pill ${pct >= 100 ? 'pill-bad' : pct >= 80 ? 'pill-warn' : 'pill-good'}`}>{pct.toFixed(0)}%</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[var(--faint)]">No data yet</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-[var(--muted)]">
                      {r.summary?.goalName ? `${r.summary.goalName} (${r.summary.goalPct ?? 0}%)` : '—'}
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--faint)]">
                    No users match.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[var(--faint)]">
                    Loading…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
