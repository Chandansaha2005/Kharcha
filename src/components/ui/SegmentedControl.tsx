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
    <div
      className={cn(
        'flex gap-2 bg-white border-[2.5px] border-black rounded-2xl p-1.5 shadow-[4px_4px_0px_#000000]',
        className,
      )}
    >
      {segments.map((seg) => {
        const active = seg.value === value

        let activeColorClass = 'bg-[#FFD200] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
        if (seg.value === 'expense') {
          activeColorClass = 'bg-[#FF5A36] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
        } else if (seg.value === 'increase') {
          activeColorClass = 'bg-[#10B981] text-black border-2 border-black shadow-[2px_2px_0px_#000000]'
        }

        return (
          <button
            key={seg.value}
            type="button"
            onClick={() => onChange(seg.value)}
            className={cn(
              'flex h-12 flex-1 items-center justify-center gap-2 font-black text-sm uppercase tracking-wide transition-all rounded-xl',
              active
                ? activeColorClass
                : 'text-black font-bold hover:bg-gray-100 border-2 border-transparent',
            )}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
