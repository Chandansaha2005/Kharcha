import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Wallet, Building2, Inbox } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { useTransactions } from '../hooks/useTransactions'
import { formatINR, groupTransactionsByMonth, MASKED_AMOUNT } from '../utils/format'
import { Avatar } from '../components/ui/Avatar'
import { QuickActions } from '../components/dashboard/QuickActions'
import { TransactionItem } from '../components/dashboard/TransactionItem'
import { MonthDivider } from '../components/dashboard/MonthDivider'

function firstName(name?: string | null): string {
  if (!name) return 'there'
  return name.split(' ')[0]
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const { balance } = useBalance()
  const [showAll, setShowAll] = useState(false)
  const { transactions } = useTransactions(showAll ? undefined : 10)
  const [visible, setVisible] = useState(false)

  const show = (value: number) => (visible ? formatINR(value) : MASKED_AMOUNT)

  return (
    <div className="flex flex-col">
      {/* Top bar: avatar on the right (→ profile) */}
      <div className="flex h-12 items-center justify-end">
        <Avatar
          name={profile?.name}
          photo={profile?.photoURL ?? user?.photoURL}
          onClick={() => navigate('/profile')}
        />
      </div>

      {/* Greeting */}
      <div className="mt-2">
        <h1 className="text-headline-mobile text-on-surface">Hello, {firstName(profile?.name)}</h1>
        <p className="mt-1 text-body-lg text-on-surface-variant">
          Here's your current savings overview
        </p>
      </div>

      {/* Total balance card */}
      <div className="card mt-6 p-5">
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-on-surface-variant">Total Balance</span>
          <button
            type="button"
            aria-label={visible ? 'Hide balance' : 'Show balance'}
            onClick={() => setVisible((v) => !v)}
            className="text-on-surface-variant transition-opacity active:opacity-60"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-display-lg text-primary">₹</span>
          <span className="text-display-lg text-on-surface">
            {visible ? formatINR(balance.totalBalance).replace('₹', '') : '••••••'}
          </span>
        </div>
      </div>

      {/* Cash / Online split */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="card">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Wallet className="h-4 w-4" />
            <span className="text-body-sm">Cash</span>
          </div>
          <p className="mt-2 truncate text-title-md font-bold text-on-surface">
            {show(balance.cashBalance)}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Building2 className="h-4 w-4" />
            <span className="text-body-sm">Online</span>
          </div>
          <p className="mt-2 truncate text-title-md font-bold text-on-surface">
            {show(balance.onlineBalance)}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5">
        <QuickActions />
      </div>

      {/* Last transactions */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-title-md font-semibold text-on-surface">Last Transactions</h2>
          {(transactions.length === 10 || showAll) && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-body-sm font-medium text-primary transition-opacity active:opacity-60"
            >
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant py-10 text-center">
            <Inbox className="h-8 w-8 text-on-surface-variant" />
            <div>
              <p className="text-body-lg text-on-surface">No transactions yet.</p>
              <p className="text-body-sm text-on-surface-variant">
                Add your first transaction to start tracking.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groupTransactionsByMonth(transactions).map((group) => (
              <div key={group.key} className="flex flex-col gap-2">
                <MonthDivider label={group.label} />
                {group.items.map((tx) => (
                  <TransactionItem key={tx.id} tx={tx} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
