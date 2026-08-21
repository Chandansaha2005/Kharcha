import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatDate, formatSignedINR } from '../../utils/format'
import type { Transaction } from '../../types'

export function TransactionItem({ tx }: { tx: Transaction }) {
  const isIncrease = tx.mode === 'increase'
  const isCash = tx.type === 'cash'

  return (
    <div className="flex items-center gap-3 bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000000]">
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-black shadow-[2px_2px_0px_#000000]',
          isIncrease ? 'bg-[#10B981] text-black' : 'bg-[#FF5A36] text-white',
        )}
      >
        {isIncrease ? <ArrowDownLeft className="h-5 w-5" strokeWidth={2.5} /> : <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-extrabold text-black">{tx.title}</p>
          <span
            className={cn(
              'shrink-0 border-2 border-black rounded-full px-2 py-0.5 text-[10px] font-black shadow-[1.5px_1.5px_0px_#000000]',
              isCash ? 'bg-[#FFD200] text-black' : 'bg-[#2B52FF] text-white',
            )}
          >
            {isCash ? 'CASH' : 'ONLINE'}
          </span>
        </div>
        <p className="text-xs font-semibold text-gray-600">
          {formatDate(tx.date)}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 text-base font-black',
          isIncrease ? 'text-[#10B981]' : 'text-[#FF5A36]',
        )}
      >
        {formatSignedINR(tx.amount, tx.mode)}
      </span>
    </div>
  )
}
