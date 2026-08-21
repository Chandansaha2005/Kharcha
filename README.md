# Kharcha — Personal Savings Tracker PWA

![Kharcha Banner](/icons/hero.png)

**Kharcha** is a modern, high-contrast, mobile-first **Personal Savings Tracker Progressive Web App (PWA)** built with a bold **Neubrutalism Design System**. It allows users to track total savings split between **Cash** and **Online/Bank** accounts, record income and expenses atomically, monitor money lent to others, view financial activity on an interactive calendar, and install the app to their home screen.

---

## ✨ Key Features

### 🎨 Neubrutalism Design System
- **High-Contrast Color Palette**: Soft Pastel Cream canvas (`#FDFBF7`), Electric Yellow (`#FFD200`), Royal Blue (`#2B52FF`), Mint Green (`#10B981`), and Coral Red (`#FF5A36`).
- **Tactile UI Elements**: 2.5px – 3px solid pitch-black borders, zero-blur hard offset drop shadows (`4px 4px 0px #000000`), and crisp Google Montserrat typography.
- **Micro-Interactions**: Active press translation effects on buttons, cards, and floating navigation components.

### 💳 Savings & Account Management
- **First-Time Setup**: Initial setup screen to configure starting Cash and Online/Bank balances.
- **Privacy Masking**: Instant privacy toggle (`Eye / EyeOff`) on the main dashboard to conceal sensitive balance values (`₹ ****`).
- **Account Splits**: Separate tracking for physical cash and online bank accounts.

### 📊 Dashboard & History (`/home`)
- **Real-Time Synchronization**: Live Firestore listeners automatically reflect balance mutations across devices.
- **Quick Action Bar**: Fast entry for Income, Expenses, and Lending.
- **Grouped Transaction Feed**: Itemized activity sorted chronologically and grouped by month with payment method tags (`CASH` / `ONLINE`).

### 📅 Interactive Calendar View (`/calendar`)
- **Monthly Overview**: Month switcher with monthly total saved (`+₹Amount` in Mint Green) and total spent (`-₹Amount` in Coral Red).
- **Daily Micro-Amounts**: Calendar grid displaying day numbers alongside mini daily saved/spent tallies.
- **Date Filtering**: Click any date cell to filter and inspect transactions recorded on that specific date.

### 💸 Lending Tracker (`/lending`)
- **Track Money Lent**: Record money lent to others with target due dates and account source.
- **Atomic Returns**: Mark lendings as returned to automatically credit funds back to the chosen account.
- **Status Badges**: Visual indicators for `Pending` and `Returned` items.

### 📱 Floating 5-Button Navigation Bar
- **Floating Bottom Nav**: Neubrutalist floating bar anchored near the bottom containing `Home`, `Calendar`, center oversized floating FAB `Add`, `Lending`, and `Profile`.
- **Progressive Web App (PWA)**: Full offline service worker shell and web manifest support for native installation.

---

## 🏗 Tech Stack

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Custom Neubrutalism Tokens
- **Typography**: Google Montserrat (`wght@600;700;800;900`)
- **Backend & Database**: Firebase Authentication + Cloud Firestore
- **PWA Tooling**: `vite-plugin-pwa` + Workbox Service Worker
- **Iconography**: Lucide React

---

## 📁 Project Structure

```text
Kharcha-Pani/
├── public/
│   ├── favicon.svg             # App favicon
│   ├── manifest.webmanifest    # PWA web app manifest
│   └── icons/                  # PWA app icons & hero illustration (hero.png)
├── src/
│   ├── components/
│   │   ├── auth/               # Route guards (ProtectedRoute, SetupGate, PublicOnlyRoute)
│   │   ├── dashboard/          # QuickActions, TransactionItem, MonthDivider
│   │   ├── layout/             # AppLayout, BottomNav (Floating 5-Button Navbar)
│   │   ├── lending/            # AddLendingForm, LendingCard
│   │   └── ui/                 # Neubrutal UI primitives (Button, Input, Logo, Avatar, etc.)
│   ├── context/                # AuthContext (Firebase auth state & profile snapshot)
│   ├── hooks/                  # Custom live Firestore hooks (useBalance, useTransactions, useLendings)
│   ├── lib/                    # Firebase SDK initialization (firebase.ts)
│   ├── pages/                  # WelcomePage, SignInPage, SignUpPage, SetupPage, DashboardPage, CalendarPage, AddTransactionPage, LendingPage, ProfilePage
│   ├── services/               # Atomic Firestore transactions & Auth operations
│   ├── utils/                  # Formatting helpers & CSS class merge utility (cn.ts)
│   ├── App.tsx                 # React Router routing configuration
│   ├── index.css               # Global Neubrutal styling & Montserrat font imports
│   └── main.tsx                # Application entry point
├── firestore.rules             # Firestore security rules (per-user data isolation)
├── firebase.json               # Firebase hosting & Firestore deployment configuration
├── tailwind.config.ts          # Tailwind CSS theme extension & design tokens
├── tsconfig.json               # TypeScript compiler options
├── vite.config.ts              # Vite + PWA build plugin setup
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Firebase Project** with Email/Password authentication and Firestore database enabled.

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Kharcha-Pani
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Fill in your Firebase Web App configuration credentials from the [Firebase Console](https://console.firebase.google.com/):

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Deploy Firestore Security Rules (Optional / Recommended)
Deploy the security rules so users can only access their own document scope:
```bash
firebase deploy --only firestore:rules
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛠 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **`npm run dev`** | `vite` | Start the local Vite development server |
| **`npm run build`** | `tsc -b && vite build` | Type-check TypeScript and build production PWA (`dist/`) |
| **`npm run preview`** | `vite preview` | Serve the compiled production build locally |
| **`npm run lint`** | `tsc --noEmit` | Perform TypeScript static type checking |

---

## 🔒 Security & Data Privacy

- **Data Isolation**: All user data is keyed under `users/{uid}/*` in Firestore. Security rules enforce that `request.auth.uid == userId`.
- **Atomic Operations**: All financial updates run inside Firestore `runTransaction` blocks to guarantee consistency between user balances and transaction records.

---

## 📄 License

This project is licensed under the MIT License.
