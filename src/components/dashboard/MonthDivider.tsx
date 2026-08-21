/** Month + year section divider: label at the left, 2px solid line running to the right edge. */
export function MonthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="shrink-0 text-xs font-black uppercase tracking-wider text-black">{label}</span>
      <div className="h-[2px] flex-1 bg-black" aria-hidden="true" />
    </div>
  )
}
