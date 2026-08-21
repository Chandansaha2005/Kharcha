import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import { formatINR, fromDateInputValue, toDateInputValue } from '../../utils/format'
import { addLending } from '../../services/lendings'
import { InsufficientBalanceError } from '../../services/errors'
import type { BalanceType } from '../../types'

export function AddLendingForm({ uid, onNotice }: { uid: string; onNotice: (m: string) => void }) {
  const [personName, setPersonName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<BalanceType>('online')
  const [dueDate, setDueDate] = useState(() => toDateInputValue(Date.now()))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function reset() {
    setPersonName('')
    setAmount('')
    setType('online')
    setDueDate(toDateInputValue(Date.now()))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const amountNum = Number(amount) || 0
    if (!personName.trim()) {
      setError('Please enter the person’s name.')
      return
    }
    if (amountNum <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }
    setLoading(true)
    try {
      await addLending(uid, {
        personName,
        amount: amountNum,
        type,
        dueDate: fromDateInputValue(dueDate),
      })
      reset()
      onNotice(`Lending saved — ${formatINR(amountNum)} deducted from ${type === 'cash' ? 'Cash' : 'Online'} savings.`)
    } catch (err) {
      if (err instanceof InsufficientBalanceError) setError(err.message)
      else setError('Could not save the lending. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] flex flex-col gap-4">
      <h2 className="text-xl font-black text-black">New Lending</h2>

      <Input
        label="Person Name"
        name="personName"
        placeholder="e.g. Sarah"
        value={personName}
        onChange={(e) => setPersonName(e.target.value)}
        required
      />
      <Input
        label="Amount"
        name="amount"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <div>
        <span className="field-label">Type</span>
        <div className="grid grid-cols-2 gap-3">
          {(['online', 'cash'] as BalanceType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'flex h-12 items-center justify-center rounded-xl border-2 border-black text-base font-extrabold capitalize transition-all',
                type === t
                  ? 'bg-[#FFD200] text-black shadow-[2px_2px_0px_#000000]'
                  : 'bg-white text-black hover:bg-gray-50',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Due Date"
        name="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      {error && <p className="text-sm font-bold text-[#FF5A36]">{error}</p>}

      <Button type="submit" loading={loading}>
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        Save Lending
      </Button>
    </form>
  )
}
