import { User } from 'lucide-react'
import { cn } from '../../utils/cn'

interface AvatarProps {
  name?: string | null
  photo?: string | null
  size?: number
  onClick?: () => void
  className?: string
}

/** Circular avatar: shows the user's photo, else their initial, else a fallback icon. */
export function Avatar({ name, photo, size = 40, onClick, className }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? ''
  const inner = photo ? (
    <img src={photo} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
  ) : initial ? (
    <span className="font-semibold text-on-surface" style={{ fontSize: size * 0.4 }}>
      {initial}
    </span>
  ) : (
    <User className="text-on-surface-variant" style={{ width: size * 0.5, height: size * 0.5 }} />
  )

  const classes = cn(
    'flex shrink-0 items-center justify-center overflow-hidden border-2 border-outline bg-surface-container-high',
    onClick && 'transition-opacity active:opacity-70',
    className,
  )

  if (onClick) {
    return (
      <button type="button" aria-label="Profile" onClick={onClick} className={classes} style={{ width: size, height: size }}>
        {inner}
      </button>
    )
  }
  return (
    <div className={classes} style={{ width: size, height: size }}>
      {inner}
    </div>
  )
}
