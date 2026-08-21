import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate, formatSignedINR } from '../../utils/format'
import type { Transaction } from '../../types'

export function TransactionItem({ tx }: { tx: Transaction }) {
  const isIncrease = tx.mode === 'increase'
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-container p-3">
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
          isIncrease ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary',
        )}
      >
        {isIncrease ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-lg font-medium text-on-surface">{tx.title}</p>
        <p className="text-body-sm text-on-surface-variant">
          {formatDate(tx.date)} · {tx.type === 'cash' ? 'Cash' : 'Online'}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 text-body-lg font-semibold',
          isIncrease ? 'text-primary' : 'text-secondary',
        )}
      >
        {formatSignedINR(tx.amount, tx.mode)}
      </span>
    </div>
  )
}
