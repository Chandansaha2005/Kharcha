import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HandCoins } from 'lucide-react'
import { useUid } from '../context/AuthContext'
import { useLendings } from '../hooks/useLendings'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { AddLendingForm } from '../components/lending/AddLendingForm'
import { LendingCard } from '../components/lending/LendingCard'

export default function LendingPage() {
  const uid = useUid()
  const navigate = useNavigate()
  const { lendings } = useLendings()
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(t)
  }, [notice])

  return (
    <div className="flex flex-col">
      <ScreenHeader onBack={() => navigate('/home')} />

      <div className="mt-2">
        <h1 className="text-headline-mobile text-primary">Lending</h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">Track money you gave to others</p>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-body-sm text-primary"
        >
          {notice}
        </div>
      )}

      <div className="mt-6">
        <AddLendingForm uid={uid} onNotice={setNotice} />
      </div>

      <div className="mt-7">
        <h2 className="mb-3 text-title-md font-semibold text-on-surface">Current Lendings</h2>
        {lendings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant py-10 text-center">
            <HandCoins className="h-8 w-8 text-on-surface-variant" />
            <p className="text-body-sm text-on-surface-variant">
              No lendings yet. Add one above to start tracking.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lendings.map((lending) => (
              <LendingCard key={lending.id} uid={uid} lending={lending} onNotice={setNotice} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
