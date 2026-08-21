import type { BalanceType } from '../types'

/** Thrown when an expense/lending exceeds the available balance of the chosen type. */
export class InsufficientBalanceError extends Error {
  constructor(type: BalanceType) {
    super(`You do not have enough balance in ${type === 'cash' ? 'Cash' : 'Online'}.`)
    this.name = 'InsufficientBalanceError'
  }
}
