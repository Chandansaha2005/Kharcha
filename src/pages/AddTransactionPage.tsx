import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, CalendarDays, CheckCircle2, TrendingUp, Wallet } from 'lucide-react'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Avatar } from '../components/ui/Avatar'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { cn } from '../utils/cn'
import { formatINR, fromDateInputValue, toDateInputValue } from '../utils/format'
import { useAuth, useUid } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { addTransaction } from '../services/transactions'
import { InsufficientBalanceError } from '../services/errors'
import type { BalanceType, TransactionMode } from '../types'

export default function AddTransactionPage() {
  const uid = useUid()
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { balance } = useBalance()
  const [searchParams] = useSearchParams()

  const initialMode: TransactionMode = searchParams.get('mode') === 'increase' ? 'increase' : 'expense'

  const [mode, setMode] = useState<TransactionMode>(initialMode)
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<BalanceType>('online')
  const [dateValue, setDateValue] = useState(() => toDateInputValue(Date.now()))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const amountNum = Number(amount) || 0

  const projectedTotal = useMemo(() => {
    const delta = mode === 'increase' ? amountNum : -amountNum
    return balance.totalBalance + delta
  }, [balance.totalBalance, mode, amountNum])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (amountNum <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }
    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    setLoading(true)
    try {
      await addTransaction(uid, {
        mode,
        amount: amountNum,
        title,
        description,
        type,
        date: fromDateInputValue(dateValue),
      })
      navigate('/home')
    } catch (err) {
      if (err instanceof InsufficientBalanceError) {
        setError(err.message)
      } else {
        setError('Could not save the transaction. Please try again.')
      }
      setLoading(false)
    }
  }

  return (
    <div className="app-shell min-h-screen px-margin pb-4 pt-4">
      <ScreenHeader
        onBack={() => navigate('/home')}
        trailing={<Avatar name={profile?.name} photo={profile?.photoURL ?? user?.photoURL} size={36} />}
      />

      <div className="mt-4">
        <h1 className="text-headline-mobile text-on-surface">Add Transaction</h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">Record a new movement of funds.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
        <SegmentedControl<TransactionMode>
          segments={[
            { value: 'expense', label: 'Expense' },
            { value: 'increase', label: 'Increase' },
          ]}
          value={mode}
          onChange={setMode}
        />

        {/* Amount display */}
        <div className="card mt-6 flex flex-col items-center gap-2 p-6">
          <span className="text-label-caps uppercase text-on-surface-variant">Amount</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-on-surface-variant">₹</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-44 bg-transparent text-center text-5xl font-bold text-on-surface outline-none placeholder:text-on-surface-variant/50"
              autoFocus
            />
          </div>
        </div>

        {/* Details */}
        <div className="card mt-6 flex flex-col gap-5 p-5">
          <Input
            label="Title"
            name="title"
            placeholder="e.g. Groceries, Salary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            required
          />
          <Input
            label="Description (Optional)"
            name="description"
            placeholder="Add some context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={140}
          />

          <div>
            <span className="field-label">Payment Method</span>
            <div className="grid grid-cols-2 gap-3">
              <TypeButton active={type === 'online'} onClick={() => setType('online')}>
                <Building2 className="h-5 w-5" /> Online
              </TypeButton>
              <TypeButton active={type === 'cash'} onClick={() => setType('cash')}>
                <Wallet className="h-5 w-5" /> Cash
              </TypeButton>
            </div>
          </div>

          <Input
            label="Date"
            name="date"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            trailing={<CalendarDays className="h-5 w-5 text-on-surface-variant" />}
            required
          />
        </div>

        {/* Projected total */}
        <div className="card mt-6 flex items-center justify-between p-4">
          <div>
            <p className="text-label-caps uppercase text-on-surface-variant">Estimated Total Savings</p>
            <p className="mt-1 text-title-md font-bold text-on-surface">{formatINR(projectedTotal)}</p>
          </div>
          <TrendingUp className={cn('h-6 w-6', mode === 'increase' ? 'text-primary' : 'text-secondary')} />
        </div>

        {error && <p className="mt-4 text-body-sm text-error">{error}</p>}

        {/* Sticky confirm button */}
        <div className="sticky bottom-0 mt-6 bg-background pb-2 pt-3">
          <Button type="submit" loading={loading}>
            <CheckCircle2 className="h-5 w-5" />
            Confirm Transaction
          </Button>
        </div>
      </form>
    </div>
  )
}

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-12 items-center justify-center gap-2 rounded-lg border text-base font-semibold transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-transparent bg-surface-container-high text-on-surface-variant hover:text-on-surface',
      )}
    >
      {children}
    </button>
  )
}
