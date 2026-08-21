import { useEffect } from 'react'

/**
 * Modal confirmation dialog in the Neubrutalism style (white card, 3px solid black border, hard 6px shadow).
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, busy, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={() => {
        if (!busy) onCancel()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000000]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-black text-black">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-gray-800">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-black bg-gray-100 font-bold text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-black bg-[#FFD200] font-black text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
