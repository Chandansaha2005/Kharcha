import { Wallet } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Kharcha brand mark: chunky orange wallet glyph inside a bordered pixel box. */
export function Logo({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center border-[3px] border-primary bg-surface-container',
        className,
      )}
      style={{ width: size, height: size, boxShadow: '6px 6px 0 0 #000' }}
    >
      <Wallet
        className="text-primary"
        style={{ width: size * 0.5, height: size * 0.5 }}
        strokeWidth={2.5}
      />
    </div>
  )
}
