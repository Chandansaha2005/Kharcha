/** Month + year section divider: label at the left, 1px line running to the right edge. */
export function MonthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="shrink-0 text-body-sm text-on-surface-variant">{label}</span>
      <div className="h-px flex-1 bg-outline-variant" aria-hidden="true" />
    </div>
  )
}
