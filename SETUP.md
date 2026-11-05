# Setup: accounts, email verification, live user counter

The app uses **Firebase** (free Spark plan) for:

- sign-up / sign-in with **email verification**: a one-time link is emailed on sign-up, and the app stays locked until it's clicked
- the **live user counter** (starts at 50, goes up by 1 for every new email that registers)
- the **admin portal**, only for `muhammadhadi.officialwork@gmail.com`
- backing up each student's data to their account, so it follows them to other devices

It takes about 10 minutes.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** (Google Analytics is optional).
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable** → Save.
3. **Build → Firestore Database → Create database** → choose a location close to Pakistan (e.g. `asia-south1`) → **Production mode**.
4. **Project settings (gear) → General → Your apps → Web (`</>`)** → register an app (no hosting needed) → copy the `firebaseConfig` values.

## 2. Add the config to the app

Copy `.env.example` to `.env.local` and fill in the six `VITE_FIREBASE_*` values:

```
VITE_FIREBASE_API_KEY="AIza..."
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project"
VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abc123"
```

These are safe to put in the app: the security rules below decide who can read and write what.

> **AI Studio:** add the same six names as environment variables/secrets, or create `.env.local` in the project files.

## 3. Publish the security rules

Either paste [`firestore.rules`](firestore.rules) into **Firestore Database → Rules** and **Publish**, or from the project folder:

```bash
cp .firebaserc.example .firebaserc      # then put your project ID in it
npm run deploy:rules                    # logs you in the first time
```

The rules enforce what the app shows:

| Data | Who can read | Who can write |
|---|---|---|
| `stats/public` (user counter) | everyone | +1 only, once per new account, in the same transaction that creates that user's profile |
| `users/{uid}` (profile + monthly summary) | the user, **and the admin email** | the user (limited fields) |
| `finance/{uid}` (transactions, budgets, goals) | the user only, after verifying their email | the user only |

The admin is checked by email **and** verified status, both in the app and in the rules, so changing the app code can't expose other users' data.

## 4. Allow your website's domain

**Authentication → Settings → Authorized domains → Add domain**, and add the domain where the app is hosted (e.g. your AI Studio / Cloud Run URL). `localhost` is already allowed.

## 4b. Check the connection

```bash
npm run check:firebase
```

It reads `.env.local` and tells you whether the API key is valid, Email/Password sign-in is enabled, the Firestore database exists and the rules are published. It signs nobody up and creates nothing. (The authorized-domain step above can't be checked from outside the console.)

## 5. (Optional) Make the verification email look nicer

**Authentication → Templates → Email address verification**: set the sender name (e.g. "Finance Manager") and edit the message. The link in the email works once and expires; the app's **Resend** button sends a fresh one.

## 6. Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build in dist/
npm run build:offline  # also refreshes the desktop (.zip) copy of the app
```

> **Run `npm run build:offline` after adding your Firebase values.** The Firebase config is baked into the build, and the desktop/offline copy shipped in `public/offline_dist` and `python_project/offline_ui` was built before any config existed, so it would only show the "Firebase setup needed" screen.

## How the pieces behave

- **Sign-up:** account created → verification link emailed → counter +1 → "Verify your email" screen. It checks every few seconds and opens the app as soon as the link is clicked (even if it was clicked on a phone).
- **Verified while the app was closed:** if the link is clicked on another device and the student later signs in fresh, the app marks their profile as verified on that first sign-in (so the admin portal shows the correct status and their activity keeps syncing).
- **Domain not authorized yet:** the verification email is still sent (with Firebase's default landing page), and the app tells you which console setting to change.
- **Counter and unverified sign-ups:** the counter goes up when an account is created, as requested, not when its email is verified. Anyone can create accounts with addresses they don't own, so treat the number as "accounts created". The admin portal shows how many of them are verified.
- **Same email twice:** Firebase rejects it ("An account with this email already exists"), so the counter can't be inflated by reusing an email.
- **Signing in before verifying:** goes back to the verify screen with a **Resend link** button.
- **Admin:** after signing in with `muhammadhadi.officialwork@gmail.com` and verifying it, an **Admin portal** item appears in the sidebar (and an **Admin** tab on phones). Every other account never sees it.
- **Offline:** once signed in, the app keeps working without internet. Changes are saved on the device and sync when back online. Creating an account or signing in for the first time on a device needs internet.

## Development preview without Firebase

While `.env.local` is missing, `npm run dev` shows a **Firebase setup needed** screen with **Preview as student / Preview as admin** buttons, so you can click through the UI. Those buttons only exist in development builds and are removed from `npm run build`.

## Verification-email landing page (optional but recommended)

By default Firebase shows its own "email verified" page. To show this app's page
("Done! Email verified – go back to the app") instead:

1. Firebase console → Authentication → Templates → **Email address verification** → pencil icon.
2. Click **Customize action URL** and enter your site address, e.g.
   `https://m-h-ocodes.github.io/Finance-Budgeting-App/`
3. Save.
