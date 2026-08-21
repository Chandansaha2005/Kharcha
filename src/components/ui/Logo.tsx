import { Wallet } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Kharcha brand mark: Mint Green wallet glyph container with 3px black border & 6px shadow. */
export function Logo({ size = 80, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-[#10B981] border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000000]',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Wallet
        className="text-black"
        style={{ width: size * 0.5, height: size * 0.5 }}
        strokeWidth={2.5}
      />
    </div>
  )
}
