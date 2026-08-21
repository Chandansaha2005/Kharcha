import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { balanceRef } from '../services/user'
import { useUid } from '../context/AuthContext'
import type { Balance } from '../types'

const EMPTY: Balance = { cashBalance: 0, onlineBalance: 0, totalBalance: 0, updatedAt: null }

export function useBalance(): { balance: Balance; loading: boolean } {
  const uid = useUid()
  const [balance, setBalance] = useState<Balance>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      balanceRef(uid),
      (snap) => {
        setBalance(snap.exists() ? (snap.data() as Balance) : EMPTY)
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [uid])

  return { balance, loading }
}
