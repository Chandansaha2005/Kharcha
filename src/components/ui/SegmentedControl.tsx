import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface Segment<T extends string> {
  value: T
  label: ReactNode
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('flex gap-2 border-2 border-outline bg-surface-container-high p-1.5', className)}>
      {segments.map((seg) => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            onClick={() => onChange(seg.value)}
            className={cn(
              'flex h-12 flex-1 items-center justify-center gap-2 font-pixel text-[11px] uppercase tracking-wider transition-colors',
              active
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
