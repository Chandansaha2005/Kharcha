import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { balanceRef } from './user'
import { InsufficientBalanceError } from './errors'
import type { Balance, BalanceType } from '../types'

export interface AddLendingInput {
  personName: string
  amount: number
  type: BalanceType
  /** ms since epoch */
  dueDate: number
  phoneNumber?: string
}

/**
 * Atomically record money lent out and deduct it from the chosen balance type.
 * Rejects if the chosen type has insufficient funds (PRD §22).
 */
export async function addLending(uid: string, input: AddLendingInput): Promise<void> {
  const bRef = balanceRef(uid)
  const lendingRef = doc(collection(db, 'users', uid, 'lendings'))

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(bRef)
    const balance = (snap.data() as Balance | undefined) ?? {
      cashBalance: 0,
      onlineBalance: 0,
      totalBalance: 0,
      updatedAt: null,
    }

    const key = input.type === 'cash' ? 'cashBalance' : 'onlineBalance'
    if (input.amount > balance[key]) {
      throw new InsufficientBalanceError(input.type)
    }

    tx.set(
      bRef,
      {
        [key]: balance[key] - input.amount,
        totalBalance: balance.totalBalance - input.amount,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    tx.set(lendingRef, {
      personName: input.personName.trim(),
      amount: input.amount,
      type: input.type,
      dueDate: input.dueDate,
      phoneNumber: input.phoneNumber?.trim() || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      returnedAt: null,
    })
  })
}

/**
 * Mark a pending lending as returned and add the amount back to the chosen
 * balance type. No-op if it is already returned (prevents double-return, PRD §22).
 */
export async function markLendingReturned(uid: string, lendingId: string): Promise<void> {
  const bRef = balanceRef(uid)
  const lRef = doc(db, 'users', uid, 'lendings', lendingId)

  await runTransaction(db, async (tx) => {
    const lendingSnap = await tx.get(lRef)
    if (!lendingSnap.exists()) return
    const lending = lendingSnap.data() as { amount: number; type: BalanceType; status: string }
    if (lending.status === 'returned') return

    const balanceSnap = await tx.get(bRef)
    const balance = (balanceSnap.data() as Balance | undefined) ?? {
      cashBalance: 0,
      onlineBalance: 0,
      totalBalance: 0,
      updatedAt: null,
    }

    const key = lending.type === 'cash' ? 'cashBalance' : 'onlineBalance'
    tx.set(
      bRef,
      {
        [key]: balance[key] + lending.amount,
        totalBalance: balance.totalBalance + lending.amount,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    tx.set(lRef, { status: 'returned', returnedAt: serverTimestamp() }, { merge: true })
  })
}
