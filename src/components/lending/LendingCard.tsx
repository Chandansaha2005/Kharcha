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
    <div className={cn('bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex flex-col gap-4', returned && 'opacity-70')}>
      <div className="flex items-center gap-3">
        <Avatar name={lending.personName} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-extrabold text-black">{lending.personName}</p>
          <p className="text-xs font-semibold text-gray-600">
            Due {formatDate(lending.dueDate)} · {typeLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-base font-black text-[#FF5A36]">{formatINR(lending.amount)}</span>
          <span
            className={cn(
              'border-2 border-black rounded-full px-3 py-1 text-xs font-bold',
              returned
                ? 'bg-[#10B981] text-black'
                : 'bg-[#FFD200] text-black shadow-[2px_2px_0px_#000000]',
            )}
          >
            {returned ? 'Returned' : 'Pending'}
          </span>
        </div>
      </div>

      {returned ? (
        <div className="flex items-center gap-2 text-sm font-bold text-[#10B981]">
          <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
          Repaid
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={working}
          className="flex h-11 w-full items-center justify-center gap-2 bg-[#2B52FF] text-white border-2 border-black rounded-full px-4 py-2 font-bold shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
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
