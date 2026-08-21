# Dashboard & Lending Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dashboard's "See all" button expand the transaction list in place, group transactions under "Month Year" dividers, remove the savings amount from the Profile page, and add a confirmation dialog before marking a lending as returned.

**Architecture:** Four independent frontend-only changes to an existing Vite + React 18 + TypeScript + Tailwind + Firebase (Firestore) PWA. A pure grouping helper and a `MonthDivider` component feed the dashboard list; a reusable `ConfirmDialog` component gates the lending "Mark Returned" write. No data model, Firestore schema, or routing changes.

**Tech Stack:** React 18, TypeScript 5.5, Tailwind CSS 3.4 (custom retro-arcade tokens), Firebase Firestore 10, lucide-react icons, Vite 5.

**Spec:** `docs/superpowers/specs/2026-07-16-dashboard-improvements-design.md`

## Global Constraints

- **No test framework exists.** `npm run lint` runs `tsc --noEmit` (typecheck only). Per the approved spec, verification = typecheck passes + manual checks in `npm run dev` (Task 7). Do NOT add a test framework.
- **Retro-arcade theme:** all border radii are zeroed in `tailwind.config.ts` — never rely on rounding for looks; use existing tokens only: `shadow-modal` (8px 8px 0 0 #000), `outline` / `outline-variant`, `surface-container` / `surface-container-high`, `primary`, `on-primary`, `on-surface`, `on-surface-variant`, text sizes `text-title-md` / `text-body-lg` / `text-body-sm`.
- **Copy strings verbatim:** button labels "See all" / "Show less" / "Cancel" / "Mark Returned"; dialog title "Mark as returned?"; dialog message `Mark {₹amount} from {personName} as returned? The amount will be added back to your {Cash|Online} savings.`
- **Month label format:** `Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' })` → e.g. "July 2026". Group key format `YYYY-MM` (e.g. "2026-07").
- **Frontend-only:** do not touch `src/services/`, `src/hooks/`, `src/types/`, Firestore rules, or routes.
- Working directory is the repo root `D:\Projects\Kharcha`. Windows machine; the commands below run in Git Bash or PowerShell alike.
- Every commit message ends with a second `-m` paragraph: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/utils/format.ts` | Modify | Add `groupTransactionsByMonth` pure helper + `TransactionMonthGroup` type (joins existing formatters) |
| `src/components/dashboard/MonthDivider.tsx` | Create | Presentational month divider: label left, 1px line to the right edge |
| `src/pages/DashboardPage.tsx` | Modify | `showAll` state, working "See all"/"Show less" button, month-grouped list rendering |
| `src/pages/ProfilePage.tsx` | Modify | Delete "Current Savings" card + dead imports |
| `src/components/ui/ConfirmDialog.tsx` | Create | Reusable modal confirm dialog (backdrop, title, message, Cancel/Confirm) |
| `src/components/lending/LendingCard.tsx` | Modify | Gate "Mark Returned" behind the ConfirmDialog |

---

### Task 1: Initialize git repository

The project is not yet a git repository (confirmed 2026-07-16). Later tasks commit per-task, so this must run first. The root `.gitignore` already covers `node_modules`, `.env`, `dist`, and logs; `.remember/.gitignore` contains `*` so that directory self-ignores. Nothing sensitive gets committed.

**Files:**
- Create: `.git/` (repository metadata only — no source changes)

**Interfaces:**
- Consumes: nothing
- Produces: a git repository at `D:\Projects\Kharcha` with a baseline commit; all later tasks run `git add`/`git commit`

- [ ] **Step 1: Initialize the repository**

Run:
```bash
git init
```
Expected: `Initialized empty Git repository in D:/Projects/Kharcha/.git/`

- [ ] **Step 2: Verify nothing sensitive is staged**

Run:
```bash
git add -A
git status --short | head -30
```
Expected: staged paths include `src/`, `docs/`, `PRD.md`, `package.json`, `stitch_kharcha_savings_tracker/`, `.env.example` — and do NOT include `node_modules/`, `.env` (without `.example`), or `.remember/` contents. If `.env` or `node_modules` appear, STOP and fix `.gitignore` before committing.

- [ ] **Step 3: Baseline commit**

Run:
```bash
git commit -m "chore: initialize repository with project baseline" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
Expected: commit succeeds; `git log --oneline` shows exactly one commit.

---

### Task 2: Month grouping helper + MonthDivider component

**Files:**
- Modify: `src/utils/format.ts` (append at end of file; add one import at top)
- Create: `src/components/dashboard/MonthDivider.tsx`

**Interfaces:**
- Consumes: `Transaction` type from `src/types/index.ts` (has `date: number` — ms since epoch, and `id: string`)
- Produces (Task 3 relies on these exact names):
  - `export interface TransactionMonthGroup { key: string; label: string; items: Transaction[] }` from `src/utils/format.ts`
  - `export function groupTransactionsByMonth(transactions: Transaction[]): TransactionMonthGroup[]` from `src/utils/format.ts`
  - `export function MonthDivider({ label }: { label: string }): JSX.Element` from `src/components/dashboard/MonthDivider.tsx`

- [ ] **Step 1: Add the grouping helper to `src/utils/format.ts`**

Add this import as the first line of the file (it currently has no imports):

```ts
import type { Transaction } from '../types'
```

Append at the end of the file:

```ts
const monthYearFormatter = new Intl.DateTimeFormat('en-IN', {
  month: 'long',
  year: 'numeric',
})

export interface TransactionMonthGroup {
  /** "YYYY-MM", e.g. "2026-07" — stable React key */
  key: string
  /** e.g. "July 2026" */
  label: string
  items: Transaction[]
}

/**
 * Group a date-descending transaction list into consecutive month buckets.
 * Input order is preserved (Firestore already sorts by date desc), so a
 * simple consecutive-run scan is enough — no re-sorting.
 */
export function groupTransactionsByMonth(transactions: Transaction[]): TransactionMonthGroup[] {
  const groups: TransactionMonthGroup[] = []
  for (const tx of transactions) {
    const d = new Date(tx.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const last = groups[groups.length - 1]
    if (last && last.key === key) {
      last.items.push(tx)
    } else {
      groups.push({ key, label: monthYearFormatter.format(d), items: [tx] })
    }
  }
  return groups
}
```

- [ ] **Step 2: Create `src/components/dashboard/MonthDivider.tsx`**

```tsx
/** Month + year section divider: label at the left, 1px line running to the right edge. */
export function MonthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="shrink-0 text-body-sm text-on-surface-variant">{label}</span>
      <div className="h-px flex-1 bg-outline-variant" aria-hidden="true" />
    </div>
  )
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run lint`
Expected: exits 0 with no output (both files compile; nothing imports them yet, which is fine).

- [ ] **Step 4: Commit**

```bash
git add src/utils/format.ts src/components/dashboard/MonthDivider.tsx
git commit -m "feat: add month grouping helper and MonthDivider component" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Dashboard — working "See all" toggle + month-grouped list

**Files:**
- Modify: `src/pages/DashboardPage.tsx`

**Interfaces:**
- Consumes:
  - `groupTransactionsByMonth`, `TransactionMonthGroup` from `../utils/format` (Task 2)
  - `MonthDivider` from `../components/dashboard/MonthDivider` (Task 2)
  - `useTransactions(max?: number)` from `../hooks/useTransactions` — already re-subscribes without a Firestore `limit` when `max` is `undefined`; do not modify the hook
- Produces: nothing consumed by later tasks

Behavior being implemented (spec §1–2):
- `showAll` state; hook call becomes `useTransactions(showAll ? undefined : 10)`.
- The dead "See all" `<span>` becomes a `<button>`; label flips to "Show less" when expanded.
- Button renders only when `transactions.length === 10 || showAll` (10 loaded ⇒ the limit was likely hit; `showAll` ⇒ user needs a way back). Known accepted edge: a user with exactly 10 total transactions sees "See all" that reveals nothing new.
- The list renders month groups, each preceded by a `MonthDivider` — including the first group.
- Empty state block is unchanged.

- [ ] **Step 1: Replace `src/pages/DashboardPage.tsx` with this complete content**

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Wallet, Building2, Inbox } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { useTransactions } from '../hooks/useTransactions'
import { formatINR, groupTransactionsByMonth, MASKED_AMOUNT } from '../utils/format'
import { Avatar } from '../components/ui/Avatar'
import { QuickActions } from '../components/dashboard/QuickActions'
import { TransactionItem } from '../components/dashboard/TransactionItem'
import { MonthDivider } from '../components/dashboard/MonthDivider'

function firstName(name?: string | null): string {
  if (!name) return 'there'
  return name.split(' ')[0]
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { balance } = useBalance()
  const [showAll, setShowAll] = useState(false)
  const { transactions } = useTransactions(showAll ? undefined : 10)
  const [visible, setVisible] = useState(false)

  const show = (value: number) => (visible ? formatINR(value) : MASKED_AMOUNT)

  return (
    <div className="flex flex-col">
      {/* Top bar: avatar on the right (→ profile) */}
      <div className="flex h-12 items-center justify-end">
        <Avatar
          name={profile?.name}
          photo={profile?.photoURL ?? user?.photoURL}
          onClick={() => navigate('/profile')}
        />
      </div>

      {/* Greeting */}
      <div className="mt-2">
        <h1 className="text-headline-mobile text-on-surface">Hello, {firstName(profile?.name)}</h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          Here's your current savings overview
        </p>
      </div>

      {/* Total balance card */}
      <div className="card mt-6 p-5">
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-on-surface-variant">Total Balance</span>
          <button
            type="button"
            aria-label={visible ? 'Hide balance' : 'Show balance'}
            onClick={() => setVisible((v) => !v)}
            className="text-on-surface-variant transition-opacity active:opacity-60"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-display-lg text-primary">₹</span>
          <span className="text-display-lg text-on-surface">
            {visible ? formatINR(balance.totalBalance).replace('₹', '') : '••••••'}
          </span>
        </div>
      </div>

      {/* Cash / Online split */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="card">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Wallet className="h-4 w-4" />
            <span className="text-body-sm">Cash</span>
          </div>
          <p className="mt-2 truncate text-title-md font-bold text-on-surface">
            {show(balance.cashBalance)}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Building2 className="h-4 w-4" />
            <span className="text-body-sm">Online</span>
          </div>
          <p className="mt-2 truncate text-title-md font-bold text-on-surface">
            {show(balance.onlineBalance)}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5">
        <QuickActions />
      </div>

      {/* Last transactions */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-title-md font-semibold text-on-surface">Last Transactions</h2>
          {(transactions.length === 10 || showAll) && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-body-sm font-medium text-primary transition-opacity active:opacity-60"
            >
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant py-10 text-center">
            <Inbox className="h-8 w-8 text-on-surface-variant" />
            <div>
              <p className="text-body-lg text-on-surface">No transactions yet.</p>
              <p className="text-body-sm text-on-surface-variant">
                Add your first transaction to start tracking.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groupTransactionsByMonth(transactions).map((group) => (
              <div key={group.key} className="flex flex-col gap-2">
                <MonthDivider label={group.label} />
                {group.items.map((tx) => (
                  <TransactionItem key={tx.id} tx={tx} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: exits 0 with no output.

- [ ] **Step 3: Commit**

```bash
git add src/pages/DashboardPage.tsx
git commit -m "feat: dashboard See all toggle with month-grouped transactions" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Profile — remove the savings amount

**Files:**
- Modify: `src/pages/ProfilePage.tsx`

**Interfaces:**
- Consumes: nothing from other tasks (independent)
- Produces: nothing consumed by later tasks

Three removals (spec §3). Everything else on the page — avatar, name editing, email, Account Settings, Logout — stays byte-identical.

- [ ] **Step 1: Remove the card and its dead code from `src/pages/ProfilePage.tsx`**

Replace the imports block at the top of the file (lucide loses `PiggyBank`; the `useBalance` and `formatINR` import lines are deleted entirely):

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, LogOut, Pencil, X } from 'lucide-react'
import { useAuth, useUid } from '../context/AuthContext'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Avatar } from '../components/ui/Avatar'
import { Input } from '../components/ui/Input'
import { logout } from '../services/auth'
import { updateDisplayName } from '../services/user'
```

Delete this line from the component body:

```tsx
  const { balance } = useBalance()
```

Delete this entire JSX block (between the identity section and "Account settings"):

```tsx
      {/* Current savings */}
      <div className="card mt-6 p-5">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <PiggyBank className="h-5 w-5 text-primary" />
          <span className="text-body-sm">Current Savings</span>
        </div>
        <p className="mt-2 text-headline-mobile text-primary">{formatINR(balance.totalBalance)}</p>
      </div>
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: exits 0. (If it reports unused imports, a removal was missed — `tsc` flags `useBalance`/`formatINR`/`PiggyBank` if they linger with `noUnusedLocals`.)

- [ ] **Step 3: Commit**

```bash
git add src/pages/ProfilePage.tsx
git commit -m "feat: remove savings amount from profile page" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Reusable ConfirmDialog component

**Files:**
- Create: `src/components/ui/ConfirmDialog.tsx`

**Interfaces:**
- Consumes: nothing from other tasks
- Produces (Task 6 relies on this exact signature):

```ts
export function ConfirmDialog(props: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  busy?: boolean          // default false; disables both buttons + backdrop/Escape dismissal
  onConfirm: () => void
  onCancel: () => void
}): JSX.Element | null    // renders null when open is false
```

Spec §4 requirements: fixed dimmed backdrop, hard-edged centered card (`border-2 border-outline bg-surface-container shadow-modal`), `role="dialog"` + `aria-modal`, backdrop tap and Escape both cancel (ignored while `busy`).

- [ ] **Step 1: Create `src/components/ui/ConfirmDialog.tsx`**

```tsx
import { useEffect } from 'react'

/**
 * Modal confirmation dialog in the retro-arcade style (hard edges, pixel shadow).
 * Backdrop tap and Escape both cancel; `busy` locks every way out while a
 * write is in flight so the action can't be dismissed or double-fired.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, busy, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={() => {
        if (!busy) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm border-2 border-outline bg-surface-container p-5 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-title-md font-semibold text-on-surface">{title}</h2>
        <p className="mt-2 text-body-sm text-on-surface-variant">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex h-11 flex-1 items-center justify-center bg-surface-container-high text-body-sm font-semibold text-on-surface transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex h-11 flex-1 items-center justify-center bg-primary text-body-sm font-semibold text-on-primary transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: exits 0 with no output (component compiles; nothing imports it yet).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ConfirmDialog.tsx
git commit -m "feat: add reusable ConfirmDialog component" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Lending — confirm before marking returned

**Files:**
- Modify: `src/components/lending/LendingCard.tsx`

**Interfaces:**
- Consumes: `ConfirmDialog` from `../ui/ConfirmDialog` (Task 5 — exact props listed there)
- Produces: nothing consumed by later tasks

Behavior (spec §4): "Mark Returned" now opens the dialog instead of writing. Confirm runs the existing `markLendingReturned` flow with the same notices; Cancel just closes. `busy` is bound to the existing `working` state; the dialog closes after the write settles (success or failure).

- [ ] **Step 1: Replace `src/components/lending/LendingCard.tsx` with this complete content**

```tsx
import { useState } from 'react'
import { Check, CheckCircle2 } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatINR, formatDate } from '../../utils/format'
import { Avatar } from '../ui/Avatar'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { markLendingReturned } from '../../services/lendings'
import type { Lending } from '../../types'

export function LendingCard({
  uid,
  lending,
  onNotice,
}: {
  uid: string
  lending: Lending
  onNotice: (message: string) => void
}) {
  const [working, setWorking] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const returned = lending.status === 'returned'
  const typeLabel = lending.type === 'cash' ? 'Cash' : 'Online'

  async function handleReturn() {
    setWorking(true)
    try {
      await markLendingReturned(uid, lending.id)
      onNotice(`Marked returned — ${formatINR(lending.amount)} added back to ${typeLabel} savings.`)
    } catch {
      onNotice('Could not update this lending. Please try again.')
    } finally {
      setWorking(false)
      setConfirming(false)
    }
  }

  return (
    <div className={cn('card flex flex-col gap-4', returned && 'opacity-60')}>
      <div className="flex items-center gap-3">
        <Avatar name={lending.personName} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-lg font-semibold text-on-surface">{lending.personName}</p>
          <p className="text-body-sm text-on-surface-variant">
            Due {formatDate(lending.dueDate)} · {typeLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-body-lg font-bold text-secondary">{formatINR(lending.amount)}</span>
          <span
            className={cn(
              'chip',
              returned
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-secondary bg-secondary/15 text-secondary',
            )}
          >
            {returned ? 'Returned' : 'Pending'}
          </span>
        </div>
      </div>

      {returned ? (
        <div className="flex items-center gap-2 text-body-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          Repaid
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={working}
          className="flex h-11 w-full items-center justify-center gap-2 bg-primary text-body-sm font-semibold text-on-primary transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Mark Returned
        </button>
      )}

      <ConfirmDialog
        open={confirming}
        title="Mark as returned?"
        message={`Mark ${formatINR(lending.amount)} from ${lending.personName} as returned? The amount will be added back to your ${typeLabel} savings.`}
        confirmLabel="Mark Returned"
        busy={working}
        onConfirm={handleReturn}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run lint`
Expected: exits 0 with no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/lending/LendingCard.tsx
git commit -m "feat: confirm before marking a lending returned" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: Final verification (build + manual checks)

**Files:** none modified.

**Interfaces:**
- Consumes: everything above
- Produces: verified feature set per spec §Verification

- [ ] **Step 1: Full typecheck + production build**

Run: `npm run build`
Expected: `tsc -b` passes and Vite build completes with no errors (PWA plugin output is normal).

- [ ] **Step 2: Start the dev server**

Run: `npm run dev` (in the background)
Expected: Vite serves on `http://localhost:5173`. Sign in with the developer's own account (real Firebase project; there is no emulator setup).

- [ ] **Step 3: Manual checklist — walk each flow in the browser**

Dashboard:
- With >10 transactions: exactly 10 show initially; "See all" is visible.
- Tap "See all" → list expands to the full history without flashing empty; label becomes "Show less".
- Tap "Show less" → back to 10.
- Every month group has a divider above it — including the first — reading e.g. "July 2026", label at left, thin line running to the right edge.
- With 0 transactions (optional check): empty state unchanged, no divider, no button.

Profile:
- No savings amount anywhere on the page; avatar, name edit, email, Account Settings, Logout all still work.

Lending:
- Tap "Mark Returned" on a pending lending → dialog appears with the person's name and ₹ amount, over a dimmed backdrop.
- Cancel / backdrop tap / Escape → dialog closes, lending stays Pending, balance unchanged.
- Confirm → status flips to Returned, success notice shows, balance restored exactly once.

- [ ] **Step 4: Report results**

Report any failed check with what was observed vs. expected. Do not mark the plan complete with failing checks.
