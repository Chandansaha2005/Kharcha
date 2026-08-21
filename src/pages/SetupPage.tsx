import { useState, type FormEvent, type ReactNode } from 'react'
import { Banknote, Building2, Info } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useUid } from '../context/AuthContext'
import { completeSetup } from '../services/user'

function MoneyField({
  id,
  label,
  icon,
  value,
  onChange,
}: {
  id: string
  label: string
  icon: ReactNode
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-3 flex items-center gap-2 text-title-md font-semibold text-on-surface">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg text-on-surface-variant">
          ₹
        </span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-9 text-lg"
        />
      </div>
    </div>
  )
}

export default function SetupPage() {
  const uid = useUid()
  const [cash, setCash] = useState('')
  const [online, setOnline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const cashVal = Number(cash) || 0
    const onlineVal = Number(online) || 0
    if (cashVal < 0 || onlineVal < 0) {
      setError('Balances cannot be negative.')
      return
    }
    setLoading(true)
    try {
      await completeSetup(uid, cashVal, onlineVal)
      // SetupGate redirects to /home once the profile flag updates.
    } catch (err) {
      console.error('completeSetup failed:', err)
      setError('Could not save your balance. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="app-shell min-h-screen px-margin pb-10 pt-12">
      <div className="text-center">
        <h1 className="text-headline-mobile text-primary">Let's set up your Kharcha</h1>
        <p className="mt-3 text-body-lg text-on-surface-variant">
          Add your current balance to start tracking accurately.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
        <div className="card flex flex-col gap-6 p-5">
          <MoneyField
            id="cash"
            label="Current Cash Savings"
            icon={<Banknote className="h-6 w-6" />}
            value={cash}
            onChange={setCash}
          />
          <MoneyField
            id="online"
            label="Current Online/Bank Savings"
            icon={<Building2 className="h-6 w-6" />}
            value={online}
            onChange={setOnline}
          />
          <div className="flex items-start gap-2 rounded-lg bg-surface-container-high p-3 text-body-sm text-on-surface-variant">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            This helps keep your totals accurate from day one.
          </div>
        </div>

        {error && <p className="mt-4 text-body-sm text-error">{error}</p>}

        <Button type="submit" loading={loading} className="mt-auto">
          Confirm
        </Button>
      </form>
    </div>
  )
}
