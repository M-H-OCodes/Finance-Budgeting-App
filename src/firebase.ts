// Firebase connection: authentication (with email verification), the shared
// live user counter, per-user cloud backup and the admin user directory.
//
// Paste your project's web config into .env.local (see SETUP.md). The web
// config is not a secret: access is controlled by firestore.rules.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  type User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
  doc,
  runTransaction,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

/** The only account that can see the Admin portal. */
export const ADMIN_EMAIL = 'muhammadhadi.officialwork@gmail.com';
/** The user counter starts here; each new account adds 1. */
export const BASE_USER_COUNT = 50;

const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  try {
    // Offline-capable cache: data written offline syncs when the device reconnects.
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    db = initializeFirestore(app, {});
  }
}

export { auth, db };

export function isAdminUser(user: Pick<User, 'email' | 'emailVerified'> | null | undefined): boolean {
  return !!user && user.emailVerified && (user.email ?? '').trim().toLowerCase() === ADMIN_EMAIL;
}

export const verificationSettings = () => ({ url: window.location.origin + import.meta.env.BASE_URL, handleCodeInApp: false });

/**
 * Creates the account, sends the one-time verification link and counts the
 * new user. Firebase Auth rejects an email that is already registered, so the
 * counter only goes up for genuinely new emails.
 */
// While sign-up is running, onAuthStateChanged would otherwise register the
// user before their display name is saved (leaving a blank name in the admin
// list). signUp() registers them itself, so ensureRegistered() steps aside.
let signUpInFlight = false;

/** Sends the one-time verification link. Falls back to Firebase's default
 *  landing page if this site's domain is not in Authorized domains yet, so the
 *  email is still sent. */
export async function sendVerificationLink(user: User) {
  try {
    await sendEmailVerification(user, verificationSettings());
  } catch (e) {
    if ((e as { code?: string })?.code === 'auth/unauthorized-continue-uri') await sendEmailVerification(user);
    else throw e;
  }
}

export async function signUp(name: string, email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  signUpInFlight = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(cred.user, { displayName: name.trim() });
    try {
      await sendVerificationLink(cred.user);
    } catch (e) {
      // The account exists; the Verify screen has a Resend button.
      console.warn('Verification email could not be sent yet', e);
    }
    try {
      await registerUser(cred.user, name.trim());
    } catch (e) {
      // e.g. offline: ensureRegistered() retries on the next sign-in
      console.warn('User registration will retry later', e);
    }
    return cred.user;
  } finally {
    signUpInFlight = false;
  }
}

/**
 * Atomically creates users/{uid} and increments stats/public.userCount.
 * The security rules only allow the increment in the same transaction that
 * creates the user's profile document, so each account counts exactly once.
 */
export async function registerUser(user: User, name?: string) {
  if (!db) return;
  const userRef = doc(db, 'users', user.uid);
  const statsRef = doc(db, 'stats', 'public');
  await runTransaction(db, async (tx) => {
    const existing = await tx.get(userRef);
    if (existing.exists()) return;
    const stats = await tx.get(statsRef);
    tx.set(userRef, {
      uid: user.uid,
      name: name || user.displayName || '',
      email: (user.email ?? '').toLowerCase(),
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      emailVerified: user.emailVerified,
      summary: null,
    });
    if (stats.exists()) tx.update(statsRef, { userCount: (stats.data().userCount ?? BASE_USER_COUNT) + 1 });
    else tx.set(statsRef, { userCount: BASE_USER_COUNT + 1 });
  });
}

/**
 * Runs on every sign-in. Creates the profile if it is missing and keeps the
 * stored `emailVerified` flag in step with Firebase Auth. The rules compare the
 * two on every profile update, so a stale `false` (user clicked the email link
 * while the app was closed) would silently block activity and summary updates
 * and leave the admin portal showing them as unverified.
 */
export async function ensureRegistered(user: User) {
  if (!db || signUpInFlight) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await registerUser(user);
    return;
  }
  if (user.emailVerified && snap.data().emailVerified !== true) {
    await user.getIdToken(true); // token must say email_verified=true to satisfy the rules
    await updateDoc(ref, { emailVerified: true });
  }
}

export function friendlyAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
    'auth/invalid-email': 'That email address does not look right.',
    'auth/weak-password': 'Use at least 8 characters for your password.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
    'auth/network-request-failed': 'No internet connection. You need to be online to sign in for the first time.',
    'auth/missing-password': 'Enter your password.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled in the Firebase console yet.',
    'auth/unauthorized-continue-uri': 'This website is not in Firebase → Authentication → Settings → Authorized domains yet.',
  };
  return map[code] ?? (e instanceof Error ? e.message.replace(/^Firebase: /, '') : 'Something went wrong.');
}
