import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { balanceRef } from './user'
import { InsufficientBalanceError } from './errors'
import type { Balance, BalanceType, TransactionMode } from '../types'

export interface AddTransactionInput {
  mode: TransactionMode
  amount: number
  title: string
  description?: string
  type: BalanceType
  /** ms since epoch */
  date: number
}

/**
 * Atomically apply a transaction to the user's balance and record it.
 * - increase: add amount to the chosen balance type (+ total)
 * - expense:  subtract amount from the chosen balance type (+ total),
 *             rejecting if the chosen type has insufficient funds (PRD §7).
 */
export async function addTransaction(uid: string, input: AddTransactionInput): Promise<void> {
  const bRef = balanceRef(uid)
  const txRef = doc(collection(db, 'users', uid, 'transactions'))

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(bRef)
    const balance = (snap.data() as Balance | undefined) ?? {
      cashBalance: 0,
      onlineBalance: 0,
      totalBalance: 0,
      updatedAt: null,
    }

    const key = input.type === 'cash' ? 'cashBalance' : 'onlineBalance'
    const current = balance[key]
    const delta = input.mode === 'increase' ? input.amount : -input.amount

    if (input.mode === 'expense' && input.amount > current) {
      throw new InsufficientBalanceError(input.type)
    }

    const nextTypeValue = current + delta
    tx.set(
      bRef,
      {
        [key]: nextTypeValue,
        totalBalance: balance.totalBalance + delta,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    tx.set(txRef, {
      mode: input.mode,
      amount: input.amount,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      type: input.type,
      date: input.date,
      createdAt: serverTimestamp(),
    })
  })
}
