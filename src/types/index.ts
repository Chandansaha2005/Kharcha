import type { Timestamp } from 'firebase/firestore'

export type BalanceType = 'cash' | 'online'
export type TransactionMode = 'increase' | 'expense'
export type LendingStatus = 'pending' | 'returned'

/** users/{uid} */
export interface UserProfile {
  id: string
  name: string
  email: string
  photoURL?: string | null
  setupCompleted: boolean
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
}

/** users/{uid}/private/balance */
export interface Balance {
  cashBalance: number
  onlineBalance: number
  totalBalance: number
  updatedAt: Timestamp | null
}

/** users/{uid}/transactions/{id} */
export interface Transaction {
  id: string
  mode: TransactionMode
  amount: number
  title: string
  description?: string
  type: BalanceType
  /** ms since epoch for the user-chosen transaction date */
  date: number
  createdAt: Timestamp | null
}

/** users/{uid}/lendings/{id} */
export interface Lending {
  id: string
  personName: string
  amount: number
  type: BalanceType
  /** ms since epoch for the due date */
  dueDate: number
  phoneNumber?: string
  status: LendingStatus
  createdAt: Timestamp | null
  returnedAt?: Timestamp | null
}
