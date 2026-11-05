import { useEffect, useState } from 'react';
import { applyActionCode, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft, CheckCircle2, Loader2, LogOut, Mail, MailCheck, RefreshCw, Settings2, Wallet, XCircle } from 'lucide-react';
import { auth, friendlyAuthError, isFirebaseConfigured, sendVerificationLink, signUp } from './firebase';
import type { AppUser } from './hooks';
import { UserCounter } from './UserCounter';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <header className="relative flex items-center justify-between px-5 sm:px-8 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 grid place-items-center shadow-lg shadow-sky-500/20">
            <Wallet className="w-5 h-5 text-slate-950" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Finance Manager</div>
            <div className="text-[11px] text-[var(--muted)]">Personal finance for students</div>
          </div>
        </div>
        <UserCounter />
      </header>
      <main className="relative flex-1 grid place-items-center px-4 pb-10">{children}</main>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl bg-[var(--input)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--faint)] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition';

// ---------------------------------------------------------------- sign in / sign up
export function AuthScreen({ onDemo }: { onDemo: (admin?: boolean) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!isFirebaseConfigured) return <SetupRequired onDemo={onDemo} />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (mode === 'signup') {
      if (!name.trim()) return setError('Enter your name.');
      if (password.length < 8) return setError('Use at least 8 characters for your password.');
      if (password !== confirm) return setError('Passwords do not match.');
    }
    setBusy(true);
    try {
      if (mode === 'signup') await signUp(name, email, password);
      else if (mode === 'signin') await signInWithEmailAndPassword(auth!, email.trim(), password);
      else {
        await sendPasswordResetEmail(auth!, email.trim());
        setInfo('If an account exists for that email, a password reset link is on its way.');
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Welcome back';
  const subtitle =
    mode === 'signup'
      ? 'We will email you a one-time link to verify your address.'
      : mode === 'reset'
        ? 'Enter your email and we will send you a reset link.'
        : 'Sign in to see your budget, spending and savings goals.';

  return (
    <Shell>
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur p-6 sm:p-7 shadow-2xl shadow-black/30">
          {mode === 'reset' && (
            <button onClick={() => setMode('signin')} className="mb-4 flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </button>
          )}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-[var(--muted)] mt-1 mb-6">{subtitle}</p>

          {mode !== 'reset' && (
            <div className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-xl bg-[var(--input)] border border-[var(--border)] text-sm">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError('');
                  }}
                  className={`py-1.5 rounded-lg font-medium transition ${mode === m ? 'bg-[var(--surface-2)] text-[var(--text)] shadow' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                >
                  {m === 'signin' ? 'Sign in' : 'Sign up'}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3.5" noValidate>
            {mode === 'signup' && (
              <label className="block">
                <span className="text-xs font-medium text-[var(--text-2)]">Full name</span>
                <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ahmed Tariq" />
              </label>
            )}
            <label className="block">
              <span className="text-xs font-medium text-[var(--text-2)]">Email</span>
              <input className={`${inputCls} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
            </label>
            {mode !== 'reset' && (
              <label className="block">
                <span className="flex justify-between text-xs font-medium text-[var(--text-2)]">
                  Password
                  {mode === 'signin' && (
                    <button type="button" onClick={() => setMode('reset')} className="text-sky-400 hover:underline font-normal">
                      Forgot?
                    </button>
                  )}
                </span>
                <input
                  className={`${inputCls} mt-1`}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                />
              </label>
            )}
            {mode === 'signup' && (
              <label className="block">
                <span className="text-xs font-medium text-[var(--text-2)]">Confirm password</span>
                <input className={`${inputCls} mt-1`} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
              </label>
            )}

            {error && <p className="text-sm rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-2">{error}</p>}
            {info && <p className="text-sm rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full mt-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-[var(--faint)] mt-5">Your data is private to your account and also saved on this device.</p>
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------- verify email
export function VerifyEmailScreen({ user, onRefresh, onSignOut }: { user: AppUser; onRefresh: () => Promise<boolean>; onSignOut: () => void }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [cooldown, setCooldown] = useState(30);

  // Auto-detect when the link has been clicked (in any tab or device).
  useEffect(() => {
    const id = window.setInterval(() => onRefresh().catch(() => undefined), 4000);
    const onFocus = () => onRefresh().catch(() => undefined);
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('focus', onFocus);
    };
  }, [onRefresh]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const check = async () => {
    setBusy(true);
    setMsg('');
    try {
      const ok = await onRefresh();
      if (!ok) setMsg('Not verified yet. Open the link in the email, then press this button again.');
    } catch (e) {
      setMsg(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    if (!user.firebaseUser) return;
    setMsg('');
    try {
      await sendVerificationLink(user.firebaseUser);
      setMsg('A new verification link has been sent. Earlier links no longer work.');
      setCooldown(60);
    } catch (e) {
      setMsg(friendlyAuthError(e));
    }
  };

  return (
    <Shell>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur p-7 shadow-2xl shadow-black/30 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-400/30 grid place-items-center mb-4">
          <Mail className="w-7 h-7 text-sky-300" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">Verify your email</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          We sent a one-time verification link to <span className="text-[var(--text)] font-medium break-all">{user.email}</span>. Open it to activate your
          account. This page continues on its own once you've clicked it.
        </p>
        <p className="text-xs text-[var(--faint)] mt-2">Can't find it? Check your spam or promotions folder.</p>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={check}
            disabled={busy}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <MailCheck className="w-4 h-4" />}
            I've verified my email
          </button>
          <button
            onClick={resend}
            disabled={cooldown > 0}
            className="w-full py-2.5 rounded-xl border border-[var(--border)] hover:bg-white/5 disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            {cooldown > 0 ? `Resend link in ${cooldown}s` : 'Resend verification link'}
          </button>
          <button onClick={onSignOut} className="w-full py-2 text-xs text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" /> Use a different account
          </button>
        </div>
        {msg && <p className="mt-4 text-sm rounded-lg bg-white/5 border border-[var(--border)] px-3 py-2 text-[var(--text-2)]">{msg}</p>}
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------- not configured
function SetupRequired({ onDemo }: { onDemo: (admin?: boolean) => void }) {
  return (
    <Shell>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7">
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <Settings2 className="w-5 h-5" /> Firebase setup needed
        </div>
        <p className="text-sm text-[var(--muted)] mt-2">
          Sign-up, email verification and the live user counter run on Firebase. Add your project's web config to <code className="text-[var(--text)]">.env.local</code>{' '}
          as described in <code className="text-[var(--text)]">SETUP.md</code>, then restart the app.
        </p>
        {import.meta.env.DEV && (
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--faint)] mb-3">Development only: preview the app without an account. Data stays in this browser.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onDemo(false)} className="px-3.5 py-2 rounded-lg bg-sky-500 text-slate-950 text-sm font-semibold">
                Preview as student
              </button>
              <button onClick={() => onDemo(true)} className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-sm">
                Preview as admin
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-dvh grid place-items-center bg-[var(--bg)] text-[var(--muted)]">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}

// ---------------------------------------------------------------- verification link landing page
// Firebase sends people here (…/?mode=verifyEmail&oobCode=…) once the email
// template's action URL points at this site (see SETUP.md).
let verifyAttempt: Promise<void> | null = null;

export function EmailActionScreen({ oobCode }: { oobCode: string }) {
  const [state, setState] = useState<'working' | 'ok' | 'bad'>('working');
  useEffect(() => {
    if (!auth) return;
    // applyActionCode only works once per link, so never run it twice.
    verifyAttempt ??= applyActionCode(auth, oobCode);
    verifyAttempt.then(
      () => setState('ok'),
      () => setState('bad'),
    );
  }, [oobCode]);
  const openApp = () => window.location.replace(import.meta.env.BASE_URL);
  return (
    <Shell>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur p-7 shadow-2xl shadow-black/30 text-center">
        {state === 'working' && (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-sky-300" />
            <p className="text-sm text-[var(--muted)] mt-4">Verifying your email…</p>
          </>
        )}
        {state === 'ok' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 grid place-items-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Done! Email verified</h1>
            <p className="text-sm text-[var(--muted)] mt-2">Your account is active. Go back to the app to continue. If you signed up on another device or tab, it will carry on by itself.</p>
            <button onClick={openApp} className="mt-6 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition">
              Go back to the app
            </button>
          </>
        )}
        {state === 'bad' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-400/30 grid place-items-center mb-4">
              <XCircle className="w-7 h-7 text-rose-300" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">This link can't be used</h1>
            <p className="text-sm text-[var(--muted)] mt-2">It has expired or was already used. If you already verified, just open the app. Otherwise sign in and press "Resend verification link".</p>
            <button onClick={openApp} className="mt-6 w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm transition">
              Open the app
            </button>
          </>
        )}
      </div>
    </Shell>
  );
}
