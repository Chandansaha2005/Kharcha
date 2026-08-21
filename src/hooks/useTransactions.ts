import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query, limit as fbLimit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useUid } from '../context/AuthContext'
import type { Transaction } from '../types'

export function useTransactions(max?: number): { transactions: Transaction[]; loading: boolean } {
  const uid = useUid()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = collection(db, 'users', uid, 'transactions')
    const q = max
      ? query(base, orderBy('date', 'desc'), fbLimit(max))
      : query(base, orderBy('date', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTransactions(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Transaction, 'id'>) })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [uid, max])

  return { transactions, loading }
}
