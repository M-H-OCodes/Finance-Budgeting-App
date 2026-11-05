# Personal Finance Manager for Students

IB Computer Science IA product: a budgeting app for a hostel medical student on a monthly stipend.

- **[SETUP.md](SETUP.md)**: connect Firebase (sign-up, email verification, live user counter, admin). Takes about 10 minutes.
- **[CRITERIA.md](CRITERIA.md)**: how each success criterion is met, with a test for each.

## Run locally

Prerequisite: Node.js 20+

```bash
npm install
cp .env.example .env.local   # then fill in the Firebase values (SETUP.md)
npm run dev                  # http://localhost:3000
```

## Code map

| File | Purpose |
|---|---|
| `src/finance.ts` | Data model and all algorithms (budget status, 80% alerts, forecast, goal progress, suggestions, search) |
| `src/App.tsx` | Layout, navigation, alerts, settings |
| `src/Screens.tsx` | Dashboard, Add, Budgets, Analytics, History, Goals |
| `src/charts.tsx` | SVG charts (no chart library, works offline) |
| `src/AuthScreens.tsx` | Sign in / sign up / verify email / password reset |
| `src/firebase.ts` | Firebase setup, sign-up + counter transaction, admin check |
| `src/hooks.ts` | Auth state, live user count, per-user data store (device + cloud) |
| `src/AdminPanel.tsx` | Admin-only user directory |
| `firestore.rules` | Server-side security rules |
| `python_project/` | Separate offline Python/Tkinter edition (unchanged) |
