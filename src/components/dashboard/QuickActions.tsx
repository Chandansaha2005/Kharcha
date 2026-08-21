import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, HandCoins } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface Action {
  label: string
  icon: LucideIcon
  to: string
  primary?: boolean
}

const ACTIONS: Action[] = [
  { label: 'Income', icon: ArrowDownLeft, to: '/add?mode=increase', primary: true },
  { label: 'Expense', icon: ArrowUpRight, to: '/add?mode=expense' },
  { label: 'Lend', icon: HandCoins, to: '/lending' },
]

export function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-3 gap-3">
      {ACTIONS.map(({ label, icon: Icon, to, primary }) => (
        <button
          key={label}
          type="button"
          onClick={() => navigate(to)}
          className={cn(
            'flex h-14 flex-col items-center justify-center gap-1 border-2 font-pixel text-[9px] uppercase tracking-wider transition-transform active:translate-x-[2px] active:translate-y-[2px]',
            primary
              ? 'border-black bg-primary text-on-primary'
              : 'border-outline bg-surface-container-high text-on-surface',
          )}
          style={{ boxShadow: primary ? '3px 3px 0 0 #cc5e10' : '3px 3px 0 0 #000' }}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  )
}
