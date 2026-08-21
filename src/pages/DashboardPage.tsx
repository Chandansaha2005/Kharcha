import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Wallet, Building2, Inbox } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { useTransactions } from '../hooks/useTransactions'
import { formatINR, groupTransactionsByMonth } from '../utils/format'
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

  const show = (value: number) => (visible ? formatINR(value) : '₹ ****')

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
        <h1 className="text-2xl font-black text-black">Hello, {firstName(profile?.name)}</h1>
        <p className="mt-1 text-sm font-bold text-gray-700">
          Here's your current savings overview
        </p>
      </div>

      {/* Total balance card */}
      <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000000] mt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wide text-black">Total Balance</span>
          <button
            type="button"
            aria-label={visible ? 'Hide balance' : 'Show balance'}
            onClick={() => setVisible((v) => !v)}
            className="bg-[#FFD200] border-2 border-black rounded-full p-2 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-black"
          >
            {visible ? <EyeOff className="h-4 w-4" strokeWidth={2.5} /> : <Eye className="h-4 w-4" strokeWidth={2.5} />}
          </button>
        </div>
        <div className="mt-3">
          {visible ? (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-black">₹</span>
              <span className="text-4xl font-black text-black tracking-tight">
                {formatINR(balance.totalBalance).replace('₹', '').trim()}
              </span>
            </div>
          ) : (
            <div className="inline-block bg-gray-100 border-2 border-black rounded-full px-4 py-1 font-extrabold text-black shadow-[2px_2px_0px_#000000] text-lg">
              ₹ ****
            </div>
          )}
        </div>
      </div>

      {/* Cash / Online sub-cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-[#FFD200] text-black border-[2.5px] border-black rounded-xl p-4 shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
            <Wallet className="h-4 w-4" strokeWidth={2.5} />
            <span>Cash</span>
          </div>
          <p className="mt-2 truncate text-xl font-black">
            {show(balance.cashBalance)}
          </p>
        </div>
        <div className="bg-[#2B52FF] text-white border-[2.5px] border-black rounded-xl p-4 shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
            <Building2 className="h-4 w-4" strokeWidth={2.5} />
            <span>Online</span>
          </div>
          <p className="mt-2 truncate text-xl font-black">
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
          <h2 className="text-xl font-black text-black">Last Transactions</h2>
          {(transactions.length === 10 || showAll) && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="text-xs font-black text-black underline underline-offset-2 hover:opacity-80"
            >
              {showAll ? 'Show less' : 'See all'}
            </button>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 bg-white border-2 border-dashed border-black rounded-2xl py-10 px-4 text-center shadow-[3px_3px_0px_#000000]">
            <Inbox className="h-8 w-8 text-black" strokeWidth={2.5} />
            <div>
              <p className="text-base font-extrabold text-black">No transactions yet.</p>
              <p className="text-xs font-bold text-gray-600">
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
