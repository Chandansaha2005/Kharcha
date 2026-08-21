import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ScreenHeaderProps {
  /** Centered title. When omitted, only the controls row is rendered. */
  title?: string
  showBack?: boolean
  onBack?: () => void
  trailing?: ReactNode
  className?: string
}

/** Compact top bar matching Neubrutalism specs: tactile back button, bold title, trailing slot. */
export function ScreenHeader({ title, showBack = true, onBack, trailing, className }: ScreenHeaderProps) {
  const navigate = useNavigate()
  return (
    <div className={cn('flex h-14 items-center justify-between py-2', className)}>
      <div className="flex w-10 items-center">
        {showBack && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
      {title && <h1 className="font-black text-lg text-black tracking-tight">{title}</h1>}
      <div className="flex w-10 items-center justify-end">{trailing}</div>
    </div>
  )
}
