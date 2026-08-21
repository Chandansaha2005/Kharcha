import type { Transaction } from '../types'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** "12450.5" -> "₹12,450.50" */
export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0
  return `₹${inrFormatter.format(safe)}`
}

/** Signed amount for transaction rows: increase -> "+₹500.00", expense -> "-₹120.00" */
export function formatSignedINR(amount: number, mode: 'increase' | 'expense'): string {
  const sign = mode === 'increase' ? '+' : '-'
  return `${sign}${formatINR(Math.abs(amount))}`
}

/** Masked placeholder used when balance visibility is off. */
export const MASKED_AMOUNT = '₹ ••••••'

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** ms-since-epoch -> "14 Nov 2025" */
export function formatDate(ms: number): string {
  return dateFormatter.format(new Date(ms))
}

/** ms-since-epoch -> "DD-MM-YYYY" for SMS / compact display */
export function formatDateDMY(ms: number): string {
  const d = new Date(ms)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}-${mm}-${d.getFullYear()}`
}

/** ms-since-epoch -> "yyyy-mm-dd" for <input type="date"> */
export function toDateInputValue(ms: number): string {
  const d = new Date(ms)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** "yyyy-mm-dd" (from a date input) -> ms-since-epoch at local midnight */
export function fromDateInputValue(value: string): number {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1).getTime()
}

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
