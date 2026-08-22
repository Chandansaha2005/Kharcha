# Kharcha Pani

Kharcha Pani is a mobile-first personal finance Progressive Web App for tracking savings, spending, cash balance, online balance, and money lent to other people. It is built with React, TypeScript, Vite, Tailwind CSS, Firebase Authentication, Cloud Firestore, and PWA support.

The project focuses on quick daily entry, clear balance separation, real-time synced data, and an installable app-like experience for mobile users.

## Table of Contents

- [Features](#features)
- [APK Download](#apk-download)
- [Tech Stack](#tech-stack)
- [Application Flow](#application-flow)
- [Code Structure](#code-structure)
- [Firestore Data Model](#firestore-data-model)
- [Setup Guide](#setup-guide)
- [Firebase Setup](#firebase-setup)
- [Available Scripts](#available-scripts)
- [Build and Preview](#build-and-preview)
- [Deployment](#deployment)
- [Security Rules](#security-rules)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- User sign up and sign in with Firebase Authentication.
- Google authentication support through Firebase Auth.
- First-time profile setup with starting cash and online balances.
- Separate balance tracking for cash and online or bank money.
- Total balance calculation from both account types.
- Add income entries.
- Add expense entries.
- Prevent expenses when the selected balance type has insufficient funds.
- Real-time Firestore listeners for balance, transactions, profile, and lending data.
- Transaction history grouped for dashboard reading.
- Calendar view for inspecting transactions by date.
- Lending tracker for money given to another person.
- Mark lent money as returned and automatically add it back to the selected balance type.
- Profile page with display name update support.
- Protected routes for authenticated pages.
- Setup gate to make sure a user completes first-time balance setup.
- PWA manifest, app icons, service worker, and installable mobile experience.
- Firebase Hosting configuration with SPA rewrites and production cache headers.

## APK Download

An Android APK is included in the public assets:

```text
public/Kharcha.apk
```

When the app is deployed, the APK can be linked directly from the site as:

```text
/Kharcha.apk
```

For example, if the app is hosted at `https://your-domain.com`, the APK download URL will be:

```text
https://your-domain.com/Kharcha.apk
```

Because the APK is inside `public`, Vite copies it into the production build root during `npm run build`.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 18, TypeScript |
| Build Tool | Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Analytics | Firebase Analytics, loaded only when supported |
| PWA | vite-plugin-pwa, Workbox |
| Image generation utility | Sharp for icon generation scripts |
| Deployment | Firebase Hosting |

## Application Flow

1. Public users land on the welcome, sign in, or sign up screens.
2. After authentication, the app listens to the user's Firestore profile document.
3. If the profile is missing or incomplete, the app backfills identity data from Firebase Auth.
4. If setup is not complete, the user is sent to the setup screen.
5. Setup writes the user's starting cash and online balances and marks setup as complete.
6. Authenticated and configured users can access the dashboard, add transaction page, calendar, lending page, and profile page.
7. Balance-changing actions run through Firestore transactions or batches so balance totals stay consistent with activity records.

## Code Structure

```text
Kharcha-Pani/
+-- public/
|   +-- Kharcha.apk
|   +-- favicon.svg
|   +-- maskable.svg
|   +-- icons/
|       +-- apple-touch-icon.png
|       +-- hero.png
|       +-- icon-192.png
|       +-- icon-512.png
|       +-- maskable-512.png
+-- scripts/
|   +-- generate-icons.mjs
+-- src/
|   +-- components/
|   |   +-- auth/
|   |   |   +-- Guards.tsx
|   |   +-- dashboard/
|   |   |   +-- MonthDivider.tsx
|   |   |   +-- QuickActions.tsx
|   |   |   +-- TransactionItem.tsx
|   |   +-- layout/
|   |   |   +-- AppLayout.tsx
|   |   |   +-- BottomNav.tsx
|   |   +-- lending/
|   |   |   +-- AddLendingForm.tsx
|   |   |   +-- LendingCard.tsx
|   |   +-- ui/
|   |       +-- Avatar.tsx
|   |       +-- Button.tsx
|   |       +-- ConfirmDialog.tsx
|   |       +-- GoogleIcon.tsx
|   |       +-- Input.tsx
|   |       +-- Logo.tsx
|   |       +-- Navbar.tsx
|   |       +-- ScreenHeader.tsx
|   |       +-- SegmentedControl.tsx
|   |       +-- Spinner.tsx
|   +-- context/
|   |   +-- AuthContext.tsx
|   +-- hooks/
|   |   +-- useBalance.ts
|   |   +-- useLendings.ts
|   |   +-- useTransactions.ts
|   +-- lib/
|   |   +-- firebase.ts
|   +-- pages/
|   |   +-- AddTransactionPage.tsx
|   |   +-- Calendar.tsx
|   |   +-- CalendarPage.tsx
|   |   +-- DashboardPage.tsx
|   |   +-- LendingPage.tsx
|   |   +-- ProfilePage.tsx
|   |   +-- SetupPage.tsx
|   |   +-- SignInPage.tsx
|   |   +-- SignUpPage.tsx
|   |   +-- WelcomePage.tsx
|   +-- services/
|   |   +-- auth.ts
|   |   +-- errors.ts
|   |   +-- lendings.ts
|   |   +-- transactions.ts
|   |   +-- user.ts
|   +-- types/
|   |   +-- index.ts
|   +-- utils/
|   |   +-- cn.ts
|   |   +-- format.ts
|   |   +-- sms.ts
|   +-- App.tsx
|   +-- index.css
|   +-- main.tsx
|   +-- vite-env.d.ts
+-- .env.example
+-- .firebaserc
+-- firebase.json
+-- firestore.rules
+-- index.html
+-- package.json
+-- tailwind.config.ts
+-- tsconfig.json
+-- tsconfig.node.json
+-- vite.config.ts
```

### Important Files

| File | Purpose |
| --- | --- |
| `src/main.tsx` | React entry point. Mounts the app and global providers. |
| `src/App.tsx` | Defines all application routes and route guards. |
| `src/lib/firebase.ts` | Initializes Firebase App, Auth, Firestore, Google provider, and optional Analytics. |
| `src/context/AuthContext.tsx` | Tracks Firebase auth state and the current user's profile document. |
| `src/components/auth/Guards.tsx` | Controls public-only, protected, and setup-required routes. |
| `src/services/auth.ts` | Handles email auth, Google auth, logout, profile creation, and auth error messages. |
| `src/services/user.ts` | Handles user profile references, setup completion, profile backfill, and display name updates. |
| `src/services/transactions.ts` | Adds income or expense records and updates balances atomically. |
| `src/services/lendings.ts` | Adds lending records, deducts balances, and restores balances when returned. |
| `src/hooks/useBalance.ts` | Subscribes to the current user's balance document. |
| `src/hooks/useTransactions.ts` | Subscribes to transaction history. |
| `src/hooks/useLendings.ts` | Subscribes to lending records. |
| `firestore.rules` | Restricts users to their own Firestore document tree. |
| `firebase.json` | Firebase Hosting, cache headers, SPA rewrites, and Firestore rules config. |
| `vite.config.ts` | Vite React config and PWA manifest/service worker setup. |
| `public/Kharcha.apk` | Android APK available as a static downloadable asset. |

## Firestore Data Model

The app stores each user's data under their own `users/{uid}` namespace.

```text
users/{uid}
+-- id: string
+-- name: string
+-- email: string
+-- photoURL: string | null
+-- setupCompleted: boolean
+-- createdAt: Timestamp
+-- updatedAt: Timestamp
```

Balance is stored in a private document:

```text
users/{uid}/private/balance
+-- cashBalance: number
+-- onlineBalance: number
+-- totalBalance: number
+-- updatedAt: Timestamp
```

Transactions are stored as user-scoped documents:

```text
users/{uid}/transactions/{transactionId}
+-- mode: "increase" | "expense"
+-- amount: number
+-- title: string
+-- description: string
+-- type: "cash" | "online"
+-- date: number
+-- createdAt: Timestamp
```

Lending records are also user-scoped:

```text
users/{uid}/lendings/{lendingId}
+-- personName: string
+-- amount: number
+-- type: "cash" | "online"
+-- dueDate: number
+-- phoneNumber: string
+-- status: "pending" | "returned"
+-- createdAt: Timestamp
+-- returnedAt: Timestamp | null
```

## Setup Guide

### 1. Prerequisites

Install the following before running the project:

- Node.js 18 or newer.
- npm.
- A Firebase project.
- Firebase CLI if you want to deploy hosting or Firestore rules.

Check your local versions:

```bash
node --version
npm --version
```

Install Firebase CLI globally if needed:

```bash
npm install -g firebase-tools
```

### 2. Clone the Repository

```bash
git clone <repository-url>
cd Kharcha-Pani
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Fill in the Firebase web app values:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

The `.env` file is required because Vite only exposes variables that start with `VITE_`.

### 5. Start Development Server

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Firebase Setup

### 1. Create a Firebase Project

1. Open the Firebase Console.
2. Create a new project or use an existing one.
3. Register a Web App inside Project Settings.
4. Copy the Firebase SDK configuration values into `.env`.

### 2. Enable Authentication

In Firebase Console:

1. Go to Authentication.
2. Open the Sign-in method tab.
3. Enable Email/Password.
4. Enable Google if you want Google sign-in to work.
5. Add your deployed domain to the authorized domains list after deployment.

### 3. Enable Firestore

In Firebase Console:

1. Go to Firestore Database.
2. Create a database.
3. Choose the production or test mode based on your workflow.
4. Deploy this repository's `firestore.rules` before using production data.

### 4. Connect Firebase CLI

Login:

```bash
firebase login
```

Select or confirm the project:

```bash
firebase use kharcha-98d46
```

The repository already contains `.firebaserc` with this default project:

```text
kharcha-98d46
```

If you are using another Firebase project, update `.firebaserc` or run:

```bash
firebase use --add
```

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `vite` | Starts the local development server. |
| `npm run build` | `tsc -b && vite build` | Type-checks the project and creates a production build in `dist`. |
| `npm run preview` | `vite preview` | Serves the production build locally. |
| `npm run lint` | `tsc --noEmit` | Runs TypeScript validation without emitting files. |

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The compiled app is generated in:

```text
dist/
```

Static files from `public`, including `Kharcha.apk`, are copied into `dist` during the build.

## Deployment

The project is configured for Firebase Hosting.

Build the project:

```bash
npm run build
```

Deploy hosting:

```bash
firebase deploy --only hosting
```

Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Deploy both hosting and Firestore rules:

```bash
firebase deploy
```

Firebase Hosting serves `dist` as the public directory. The rewrite rule sends all routes to `index.html`, which allows React Router to handle client-side pages such as `/home`, `/calendar`, `/lending`, and `/profile`.

## Security Rules

The Firestore rules restrict all reads and writes to the signed-in user's own path:

```text
users/{userId}/{document=**}
```

Access is allowed only when:

```text
request.auth != null && request.auth.uid == userId
```

This means one user cannot read or write another user's profile, balance, transactions, or lending records.

## PWA Notes

The PWA configuration lives in `vite.config.ts`.

Key behavior:

- App name: `Kharcha`.
- Display mode: `standalone`.
- Orientation: `portrait`.
- Service worker registration: `autoUpdate`.
- Offline shell support through Workbox.
- App icons are stored in `public/icons`.
- Firebase network calls are excluded from navigation fallback behavior.

## Troubleshooting

### Firebase configuration is missing

Confirm `.env` exists and every required `VITE_FIREBASE_*` value is filled in.

### Google sign-in popup closes or fails

Check that Google sign-in is enabled in Firebase Authentication and that your current domain is listed under authorized domains.

### Firestore permission denied

Deploy the rules:

```bash
firebase deploy --only firestore:rules
```

Also confirm the user is signed in and data is stored under `users/{uid}`.

### Production route refresh shows a 404

Confirm Firebase Hosting is using the rewrite in `firebase.json`:

```json
{ "source": "**", "destination": "/index.html" }
```

### APK does not download after deployment

Confirm the file exists at:

```text
public/Kharcha.apk
```

Then rebuild and redeploy:

```bash
npm run build
firebase deploy --only hosting
```

The deployed URL should be:

```text
https://your-domain.com/Kharcha.apk
```

## License

This project is licensed under the MIT License. See `LICENSE` for details.

![Kharcha Pani preview](public/icons/hero.png)
