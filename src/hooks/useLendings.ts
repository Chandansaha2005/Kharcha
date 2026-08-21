import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useUid } from '../context/AuthContext'
import type { Lending } from '../types'

export function useLendings(): { lendings: Lending[]; loading: boolean } {
  const uid = useUid()
  const [lendings, setLendings] = useState<Lending[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'users', uid, 'lendings'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setLendings(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lending, 'id'>) })))
        setLoading(false)
      },
      () => setLoading(false),
    )
    return unsub
  }, [uid])

  return { lendings, loading }
}
