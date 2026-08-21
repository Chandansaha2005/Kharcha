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
        <h1 className="text-2xl font-black text-black">Lending</h1>
        <p className="mt-1 text-sm font-bold text-gray-700">Track money you gave to others</p>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 rounded-xl border-2 border-black bg-[#FFD200] px-4 py-3 text-sm font-bold text-black shadow-[3px_3px_0px_#000000]"
        >
          {notice}
        </div>
      )}

      <div className="mt-6">
        <AddLendingForm uid={uid} onNotice={setNotice} />
      </div>

      <div className="mt-7">
        <h2 className="mb-3 text-xl font-black text-black">Current Lendings</h2>
        {lendings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 bg-white border-2 border-dashed border-black rounded-2xl py-10 px-4 text-center shadow-[3px_3px_0px_#000000]">
            <HandCoins className="h-8 w-8 text-black" strokeWidth={2.5} />
            <p className="text-xs font-bold text-gray-600">
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
