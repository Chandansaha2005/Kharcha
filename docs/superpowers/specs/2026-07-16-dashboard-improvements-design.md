# Kharcha — Dashboard & Lending Improvements

**Date:** 2026-07-16
**Status:** Approved

## Overview

Four small, independent improvements to the Kharcha expense tracker:

1. Make the dashboard's "See all" button work — expand the transaction list in place from 10 items to the full history.
2. Group dashboard transactions by month, with a "Month Year" divider line above each group.
3. Remove the "Current Savings" amount card from the Profile page.
4. Add a confirmation dialog before marking a lending as returned.

No data model, Firestore schema, or routing changes. All changes are frontend-only.

## 1. "See all" / "Show less" on the dashboard

**File:** `src/pages/DashboardPage.tsx`

- Add `const [showAll, setShowAll] = useState(false)`.
- Change the hook call to `useTransactions(showAll ? undefined : 10)`. The hook (`src/hooks/useTransactions.ts`) already builds an unlimited query when `max` is undefined and re-subscribes when `max` changes — no hook changes needed.
- Replace the dead "See all" `<span>` with a `<button>` that toggles `showAll`. Label: **"See all"** when collapsed, **"Show less"** when expanded.
- Button visibility: render it when `transactions.length === 10` (the limit was likely hit, so there may be more) **or** `showAll` is true (so the user can always collapse back). Edge case: a user with exactly 10 total transactions sees "See all" but expanding reveals nothing new — acceptable.
- While the unlimited snapshot loads, the previously loaded 10 items remain rendered (the hook keeps prior state until the new snapshot arrives), so expansion does not flicker or blank the list.

## 2. Month dividers on the transaction list

**Files:** `src/utils/format.ts` (helper), `src/components/dashboard/MonthDivider.tsx` (new), `src/pages/DashboardPage.tsx` (rendering)

- **Helper** `groupTransactionsByMonth(transactions: Transaction[])` in `src/utils/format.ts`:
  - Input is already sorted date-descending (Firestore `orderBy('date', 'desc')`). Preserve order.
  - Returns `{ key: string; label: string; items: Transaction[] }[]`, e.g. `key: "2026-07"`, `label: "July 2026"`.
  - Label built with `Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' })` from `tx.date` (ms since epoch, local time).
- **`MonthDivider` component**: month + year label on the left in the small secondary text style (`text-body-sm text-on-surface-variant`), followed by a 1px horizontal line (`h-px flex-1 bg-outline-variant`) running to the right edge. Layout: `flex items-center gap-3`.
- **Rendering**: every month group is preceded by its divider, including the first (current) group. Grouping applies in both collapsed (10 items) and expanded (all items) states.
- Empty state is unchanged (no transactions → existing "No transactions yet" panel, no dividers).

## 3. Remove savings amount from Profile

**File:** `src/pages/ProfilePage.tsx`

- Delete the "Current savings" card block (the `PiggyBank` card showing `formatINR(balance.totalBalance)`).
- Remove the now-unused imports and hook call: `useBalance`, `formatINR`, `PiggyBank`.
- Everything else on the page (avatar, name editing, email, Account Settings, Logout) is unchanged.

## 4. Confirmation dialog for "Mark Returned"

**Files:** `src/components/ui/ConfirmDialog.tsx` (new), `src/components/lending/LendingCard.tsx`

### ConfirmDialog component (reusable)

- Props: `open: boolean`, `title: string`, `message: string`, `confirmLabel: string`, `busy?: boolean`, `onConfirm: () => void`, `onCancel: () => void`.
- Renders nothing when `open` is false.
- Layout: fixed full-screen backdrop (`fixed inset-0`, dimmed black ~60% opacity, `z-50`), centered card matching the retro-arcade theme: hard-edged (no rounding — the theme zeroes all radii), `border-2 border-outline bg-surface-container` with the existing `shadow-modal` token (`8px 8px 0 0 #000`). Contains title, message, and a two-button row: **Cancel** (neutral, `bg-surface-container-high`) and the confirm button (primary style, label from `confirmLabel`).
- `busy` disables both buttons while the Firestore write is in flight.
- Accessibility/behavior: `role="dialog"`, `aria-modal="true"`; tapping the backdrop or pressing Escape triggers `onCancel` (ignored while `busy`).

### LendingCard changes

- Add `const [confirming, setConfirming] = useState(false)`.
- "Mark Returned" button now sets `confirming = true` instead of writing immediately.
- Dialog copy:
  - Title: **"Mark as returned?"**
  - Message: `Mark ₹{amount} from {personName} as returned? The amount will be added back to your {Cash|Online} savings.` (amount via `formatINR`)
  - Confirm label: **"Mark Returned"**
- Confirm runs the existing `handleReturn` flow (`markLendingReturned` + existing success/error notices), with `busy` bound to the existing `working` state; the dialog closes on completion. Cancel closes the dialog with no write.

## Error handling

No new error paths. Existing behavior is kept: dashboard snapshot errors stop the loading state; lending write failures show the existing notice banner ("Could not update this lending. Please try again.").

## Verification

The project has no test framework (`npm run lint` is `tsc --noEmit`). Verification is:

1. `npm run lint` (typecheck) passes.
2. Manual checks in `npm run dev`:
   - Dashboard shows 10 transactions with month dividers; "See all" expands to full history; "Show less" collapses back.
   - Dividers show "Month Year" (e.g. "July 2026") above each month group, including the first.
   - Profile page no longer shows any savings amount.
   - "Mark Returned" opens the confirmation dialog; Cancel makes no change; Confirm marks returned and restores the balance exactly once.

## Out of scope

- Pagination / infinite scroll, transaction search or filters.
- A dedicated "All Transactions" page or route.
- Masking/eye-toggle on the profile amount (it is removed instead).
- Confirmation dialogs for any other actions.
