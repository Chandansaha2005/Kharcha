# Kharcha

A minimal, mobile-first **personal savings tracker PWA**. Track total savings split
between cash and online/bank, record income & expenses, lend money to others with SMS
reminders, and install it to your home screen.

Built with **React + TypeScript + Vite + Tailwind CSS + Firebase**, faithful to the
Stitch design system in `stitch_kharcha_savings_tracker/`.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS v3 (design tokens mapped from the Stitch `DESIGN.md`)
- Firebase Authentication (email/password + Google) and Cloud Firestore
- React Router v6
- lucide-react icons; retro pixel fonts (Press Start 2P + VT323, bundled via `@fontsource`)
- Retro arcade visual theme: black / white / arcade-orange, hard-edged "pixel box" UI with CRT scanlines
- `vite-plugin-pwa` (manifest + service worker, installable + offline shell)

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure Firebase.** Copy `.env.example` to `.env` and fill in your Firebase web
   app config (Firebase console → Project settings → Your apps → SDK setup and
   configuration):

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=        # optional; enables Analytics when present
   ```

   > The repo ships with a `.env` containing **placeholder** values so the UI renders
   > locally. Replace them with your real config before signing in.

3. **Enable auth providers** in the Firebase console → Authentication → Sign-in method:
   - Email/Password
   - Google

4. **Deploy Firestore security rules** (`firestore.rules`) so each user can only access
   their own data:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

## Scripts

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                     |
| `npm run build`         | Type-check and build for production (`dist/`) |
| `npm run preview`       | Preview the production build                  |
| `node scripts/generate-icons.mjs` | Regenerate PWA icons from `public/*.svg` |

## Data model (Firestore)

```
users/{uid}                    → profile { name, email, photoURL?, setupCompleted, ... }
users/{uid}/private/balance    → { cashBalance, onlineBalance, totalBalance, updatedAt }
users/{uid}/transactions/{id}  → { mode, amount, title, description?, type, date, createdAt }
users/{uid}/lendings/{id}      → { personName, amount, type, dueDate, phoneNumber?, status, ... }
```

All balance mutations (transactions, lending, mark-returned) run inside Firestore
`runTransaction` calls so the balance and the related record always commit atomically.

## Project structure

```
src/
  lib/firebase.ts        Firebase init (analytics behind isSupported)
  context/AuthContext     Auth state + profile subscription
  hooks/                  useBalance / useTransactions / useLendings (live snapshots)
  services/               auth, user, transactions, lendings (atomic writes)
  components/             ui primitives, layout (BottomNav), dashboard, lending, auth guards
  pages/                  Welcome, SignIn, SignUp, Setup, Dashboard, AddTransaction, Lending, Profile
  utils/                  format (INR/date), sms URI, cn
```
