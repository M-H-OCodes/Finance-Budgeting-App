// Run:  npm run check:firebase
// Checks your .env.local against the live Firebase project and tells you
// which console step is still missing. It creates nothing and signs nobody up.
import { readFileSync, existsSync } from 'node:fs';

const file = ['.env.local', '.env'].find(existsSync);
if (!file) fail('No .env.local found. Copy .env.example to .env.local and fill in the Firebase values (SETUP.md step 2).');

const env = Object.fromEntries(
  readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
);
const key = env.VITE_FIREBASE_API_KEY;
const project = env.VITE_FIREBASE_PROJECT_ID;
const missing = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'APP_ID'].filter((k) => !env[`VITE_FIREBASE_${k}`]);
if (missing.length) fail(`${file} is missing: ${missing.map((k) => `VITE_FIREBASE_${k}`).join(', ')}`);
console.log(`Using ${file} (project: ${project})\n`);

let problems = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  problems++;
  console.log(`  ✗ ${m}`);
};

async function call(url, init) {
  try {
    const r = await fetch(url, init);
    return { status: r.status, body: await r.json().catch(() => ({})) };
  } catch (e) {
    return { error: e.cause?.code || e.message };
  }
}

// 1. API key valid + Email/Password sign-in enabled (a deliberately fake login: nothing is created)
console.log('Authentication');
const a = await call(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(key)}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'config-check@invalid.example', password: 'not-a-real-password', returnSecureToken: false }),
});
if (a.error) bad(`Could not reach Firebase (${a.error}). Check your internet connection.`);
else {
  const msg = a.body?.error?.message ?? '';
  if (/API_KEY_INVALID|API key not valid/i.test(msg)) bad('API key is not valid. Re-copy VITE_FIREBASE_API_KEY from Project settings → Your apps.');
  else if (/OPERATION_NOT_ALLOWED|PASSWORD_LOGIN_DISABLED/.test(msg)) bad('Email/Password sign-in is OFF. Console → Authentication → Sign-in method → Email/Password → Enable.');
  else if (/EMAIL_NOT_FOUND|INVALID_LOGIN_CREDENTIALS|INVALID_PASSWORD/.test(msg)) ok('API key valid and Email/Password sign-in is enabled');
  else bad(`Unexpected response: ${msg || a.status}`);
}

// 2. Firestore exists and the published rules allow the public counter to be read
console.log('Firestore');
const f = await call(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/stats/public?key=${encodeURIComponent(key)}`);
if (f.error) bad(`Could not reach Firestore (${f.error}).`);
else if (f.status === 200) ok(`Rules published. Live counter currently reads ${f.body?.fields?.userCount?.integerValue ?? '?'}`);
else if (f.status === 404 && /database/i.test(f.body?.error?.message ?? '') && /not exist|not found/i.test(f.body?.error?.message ?? '')) bad('No Firestore database yet. Console → Firestore Database → Create database.');
else if (f.status === 404) ok('Rules published (counter document will be created by the first sign-up; the app shows 50 until then)');
else if (f.status === 403) bad('Firestore denied a public read of stats/public. Publish firestore.rules: npm run deploy:rules (or paste it in Console → Firestore → Rules).');
else bad(`Unexpected Firestore response ${f.status}: ${f.body?.error?.message ?? ''}`);

console.log(
  problems
    ? `\n${problems} thing(s) to fix above. Also confirm your site's domain is under Authentication → Settings → Authorized domains (cannot be checked from here).`
    : '\nAll checks passed. Also confirm your site\'s domain is under Authentication → Settings → Authorized domains (cannot be checked from here).',
);
process.exit(problems ? 1 : 0);

function fail(m) {
  console.error(m);
  process.exit(1);
}
