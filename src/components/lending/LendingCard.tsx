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
