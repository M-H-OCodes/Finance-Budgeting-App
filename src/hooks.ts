import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut as fbSignOut, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, BASE_USER_COUNT, ensureRegistered, isAdminUser, isFirebaseConfigured } from './firebase';
import {
  type FinanceData,
  currentMonth,
  emptyFinanceData,
  goalProgress,
  migrateLegacy,
  monthSummary,
} from './finance';

// ---------------------------------------------------------------- auth
export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  isAdmin: boolean;
  isDemo?: boolean;
  firebaseUser?: User;
}

const toAppUser = (u: User): AppUser => ({
  uid: u.uid,
  email: u.email ?? '',
  displayName: u.displayName || (u.email ?? '').split('@')[0],
  emailVerified: u.emailVerified,
  isAdmin: isAdminUser(u),
  firebaseUser: u,
});

const demoUser = (asAdmin: boolean): AppUser => ({
  uid: asAdmin ? 'demo-admin' : 'demo-student',
  email: asAdmin ? 'muhammadhadi.officialwork@gmail.com' : 'student@example.com',
  displayName: asAdmin ? 'Muhammad Hadi' : 'Demo Student',
  emailVerified: true,
  isAdmin: asAdmin,
  isDemo: true,
});

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (!import.meta.env.DEV || isFirebaseConfigured) return null;
    const saved = sessionStorage.getItem('pfm-demo');
    return saved ? demoUser(saved === 'admin') : null;
  });
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u ? toAppUser(u) : null);
      setLoading(false);
      if (u) ensureRegistered(u).catch(() => undefined);
    });
  }, []);

  /** Re-reads the account from Firebase (used after the verification link is clicked). */
  const refresh = useCallback(async () => {
    const u = auth?.currentUser;
    if (!u) return false;
    await u.reload();
    if (u.emailVerified) {
      await u.getIdToken(true); // new token carries email_verified=true for the security rules
      if (db) updateDoc(doc(db, 'users', u.uid), { emailVerified: true }).catch(() => undefined);
    }
    setUser(toAppUser(u));
    return u.emailVerified;
  }, []);

  const signOut = useCallback(async () => {
    if (user?.isDemo) {
      sessionStorage.removeItem('pfm-demo');
      setUser(null);
    } else if (auth) await fbSignOut(auth);
  }, [user]);

  // Development-only preview so the UI can be checked before Firebase is set up.
  // `import.meta.env.DEV` is false in production builds, so this never ships.
  const startDemo = useCallback((asAdmin = false) => {
    if (!import.meta.env.DEV || isFirebaseConfigured) return;
    sessionStorage.setItem('pfm-demo', asAdmin ? 'admin' : 'student');
    setUser(demoUser(asAdmin));
  }, []);

  return { user, loading, refresh, signOut, startDemo };
}

// ---------------------------------------------------------------- live user counter
/** Live count of registered users, shared by every device (Firestore stats/public). */
export function useUserCount() {
  const [count, setCount] = useState<number | null>(isFirebaseConfigured ? null : BASE_USER_COUNT);
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      doc(db, 'stats', 'public'),
      (snap) => {
        setCount(snap.exists() ? Number(snap.data().userCount ?? BASE_USER_COUNT) : BASE_USER_COUNT);
        setLive(!snap.metadata.fromCache);
      },
      () => {
        setCount((c) => c ?? BASE_USER_COUNT);
        setLive(false);
      },
    );
  }, []);
  return { count, live };
}

// ---------------------------------------------------------------- finance data store
const storageKey = (uid: string) => `pfm:v2:${uid}`;

function readLocal(uid: string): FinanceData | null {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    return raw ? (JSON.parse(raw) as FinanceData) : null;
  } catch {
    return null;
  }
}

function writeLocal(uid: string, data: FinanceData) {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(data));
  } catch {
    /* storage full or blocked: the cloud copy still saves */
  }
}

export type SyncState = 'local' | 'saving' | 'synced' | 'offline';

/**
 * Keeps one user's finance data on the device (works offline) and backs it
 * up to Firestore so it follows the account to other devices.
 */
export function useFinanceStore(user: AppUser | null) {
  const uid = user?.uid ?? null;
  const [data, setData] = useState<FinanceData | null>(null);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncState>('local');
  const saveTimer = useRef<number | undefined>(undefined);
  const cloud = !!db && !!user && !user.isDemo && user.emailVerified;

  // load
  useEffect(() => {
    setReady(false);
    setData(null);
    if (!uid) return;
    let cancelled = false;
    let local = readLocal(uid);
    if (!local) {
      const legacy = migrateLegacy();
      if (legacy) {
        local = legacy;
        try {
          localStorage.removeItem('pfm_transactions');
        } catch {
          /* ignore */
        }
      }
    }
    if (local) setData(local);

    if (!cloud) {
      setReady(true);
      return;
    }
    getDoc(doc(db!, 'finance', uid))
      .then((snap) => {
        if (cancelled) return;
        if (snap.exists()) {
          const remote = JSON.parse(snap.data().json as string) as FinanceData;
          if (!local || remote.updatedAt > local.updatedAt) {
            setData(remote);
            writeLocal(uid, remote);
          }
        }
        setSync('synced');
      })
      .catch(() => !cancelled && setSync('offline'))
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, [uid, cloud]);

  const persist = useCallback(
    (next: FinanceData) => {
      if (!uid) return;
      writeLocal(uid, next);
      if (!cloud) return;
      setSync('saving');
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        try {
          const month = currentMonth();
          const s = monthSummary(next, month);
          const gp = goalProgress(next, month)[0];
          await Promise.all([
            setDoc(doc(db!, 'finance', uid), { json: JSON.stringify(next), updatedAt: next.updatedAt }),
            updateDoc(doc(db!, 'users', uid), {
              lastActive: serverTimestamp(),
              summary: {
                month,
                income: s.expectedIncome,
                spent: s.spent,
                budget: s.totalBudget,
                transactions: next.transactions.length,
                goalName: gp?.goal.name ?? null,
                goalPct: gp ? Math.round(gp.pct) : null,
              },
            }).catch(() => undefined),
          ]);
          setSync(navigator.onLine ? 'synced' : 'offline');
        } catch {
          setSync('offline');
        }
      }, 1200);
    },
    [uid, cloud],
  );

  /** Apply a change. `fn` receives a deep copy it may mutate. */
  const update = useCallback(
    (fn: (draft: FinanceData) => void) => {
      setData((prev) => {
        const draft: FinanceData = structuredClone(prev ?? emptyFinanceData());
        fn(draft);
        draft.updatedAt = Date.now();
        persist(draft);
        return draft;
      });
    },
    [persist],
  );

  const replace = useCallback(
    (next: FinanceData) => {
      next.updatedAt = Date.now();
      setData(next);
      persist(next);
    },
    [persist],
  );

  return { data, ready, sync, update, replace };
}
