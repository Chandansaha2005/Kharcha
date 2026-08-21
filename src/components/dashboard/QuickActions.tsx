import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, HandCoins } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Action {
  label: string
  icon: LucideIcon
  to: string
  bgClass: string
}

const ACTIONS: Action[] = [
  { label: 'Income', icon: ArrowDownLeft, to: '/add?mode=increase', bgClass: 'bg-[#10B981] text-black' },
  { label: 'Expense', icon: ArrowUpRight, to: '/add?mode=expense', bgClass: 'bg-[#FF5A36] text-white' },
  { label: 'Lend', icon: HandCoins, to: '/lending', bgClass: 'bg-[#FFD200] text-black' },
]

export function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ label, icon: Icon, to, bgClass }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className={cn(
            'flex h-14 flex-col items-center justify-center gap-1 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wide shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all',
            bgClass,
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2.5} />
          {label}
        </button>
      ))}
    </div>
  )
}
