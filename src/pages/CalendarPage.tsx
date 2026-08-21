import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Inbox } from 'lucide-react'
import { useTransactions } from '../hooks/useTransactions'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { formatINR, formatSignedINR } from '../utils/format'
import type { Transaction } from '../types'
import { cn } from '../utils/cn'

function toYYYYMMDD(d: Date | number): string {
  const dateObj = typeof d === 'number' ? new Date(d) : d
  const yyyy = dateObj.getFullYear()
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  const dd = String(dateObj.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

interface CalendarPageProps {
  transactions?: Transaction[]
}

export function CalendarPage({ transactions: propTx }: CalendarPageProps) {
  const { transactions: hookTx } = useTransactions()
  const allTransactions = propTx ?? hookTx ?? []

  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [selectedDateStr, setSelectedDateStr] = useState(() => toYYYYMMDD(new Date()))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNameYear = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()
  }, [currentDate])

  function handlePrevMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  function handleNextMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Monthly totals calculation
  const { monthlySaved, monthlySpent } = useMemo(() => {
    let saved = 0
    let spent = 0
    for (const tx of allTransactions) {
      const txDate = new Date(tx.date)
      if (txDate.getFullYear() === year && txDate.getMonth() === month) {
        if (tx.mode === 'increase') {
          saved += tx.amount
        } else {
          spent += tx.amount
        }
      }
    }
    return { monthlySaved: saved, monthlySpent: spent }
  }, [allTransactions, year, month])

  // Calendar Days Calculation (Monday start)
  const calendarGridDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    // getDay(): 0 is Sunday. Convert to Monday=0, Sunday=6
    const firstDayIndex = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<{ dateStr: string | null; dayNum: number | null }> = []

    // Padding empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dateStr: null, dayNum: null })
    }

    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day)
      cells.push({ dateStr: toYYYYMMDD(d), dayNum: day })
    }

    return cells
  }, [year, month])

  // Map transactions by YYYY-MM-DD for fast micro-amount lookup
  const txByDateMap = useMemo(() => {
    const map: Record<string, { saved: number; spent: number }> = {}
    for (const tx of allTransactions) {
      const key = toYYYYMMDD(tx.date)
      if (!map[key]) map[key] = { saved: 0, spent: 0 }
      if (tx.mode === 'increase') {
        map[key].saved += tx.amount
      } else {
        map[key].spent += tx.amount
      }
    }
    return map
  }, [allTransactions])

  // Selected date transactions
  const selectedDateTransactions = useMemo(() => {
    return allTransactions.filter((tx) => toYYYYMMDD(tx.date) === selectedDateStr)
  }, [allTransactions, selectedDateStr])

  return (
    <div className="flex flex-col">
      <ScreenHeader title="Calendar View" showBack={false} />

      {/* 1. Header Section: Month Switcher & Monthly Stats */}
      <div className="mt-2 flex flex-col gap-4">
        {/* Month Switcher Bar */}
        <div className="bg-white border-[2.5px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_#000000] flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={handlePrevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          </button>
          <span className="text-lg font-black text-black tracking-tight">{monthNameYear}</span>
          <button
            type="button"
            aria-label="Next month"
            onClick={handleNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>

        {/* Monthly Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Saved Badge */}
          <div className="bg-[#10B981] border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000000] flex flex-col">
            <span className="text-[11px] font-black uppercase text-black">Total Saved</span>
            <span className="mt-1 text-lg font-black text-black">+{formatINR(monthlySaved)}</span>
          </div>

          {/* Total Spent Badge */}
          <div className="bg-[#FF5A36] text-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000000] flex flex-col">
            <span className="text-[11px] font-black uppercase text-white">Total Spent</span>
            <span className="mt-1 text-lg font-black text-white">-{formatINR(monthlySpent)}</span>
          </div>
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className="bg-white border-[2.5px] border-black rounded-2xl p-3 shadow-[4px_4px_0px_#000000] mt-5">
        {/* Weekday Headings */}
        <div className="grid grid-cols-7 text-center font-black text-xs text-black pb-2 border-b-2 border-black mb-2">
          {WEEKDAYS.map((w, idx) => (
            <div key={idx} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarGridDays.map((cell, idx) => {
            if (!cell.dateStr || cell.dayNum === null) {
              return <div key={`empty-${idx}`} className="h-14 sm:h-16" />
            }

            const isSelected = cell.dateStr === selectedDateStr
            const microData = txByDateMap[cell.dateStr]

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => setSelectedDateStr(cell.dateStr!)}
                className={cn(
                  'h-14 sm:h-16 flex flex-col justify-between p-1 text-left transition-all rounded-xl border-2',
                  isSelected
                    ? 'bg-[#FFD200] border-black text-black font-black shadow-[2px_2px_0px_#000000]'
                    : 'bg-white border-black text-black hover:bg-gray-50 font-bold',
                )}
              >
                <span className="text-xs font-black leading-none">{cell.dayNum}</span>
                <div className="flex flex-col gap-0.5 overflow-hidden text-[9px] leading-tight font-black">
                  {microData?.saved ? (
                    <span className={isSelected ? 'text-black' : 'text-[#10B981]'}>
                      +₹{Math.round(microData.saved)}
                    </span>
                  ) : null}
                  {microData?.spent ? (
                    <span className={isSelected ? 'text-black' : 'text-[#FF5A36]'}>
                      -₹{Math.round(microData.spent)}
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Selected Date Transaction Feed */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-black uppercase tracking-tight">
            TRANSACTIONS — {selectedDateStr}
          </h2>
          <CalendarIcon className="h-5 w-5 text-black" strokeWidth={2.5} />
        </div>

        {selectedDateTransactions.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-xl p-6 text-center shadow-[3px_3px_0px_#000000] flex flex-col items-center gap-2">
            <Inbox className="h-7 w-7 text-black" strokeWidth={2.5} />
            <p className="text-sm font-extrabold text-black">
              No transactions recorded on this date.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {selectedDateTransactions.map((tx) => {
              const isIncrease = tx.mode === 'increase'
              const title = tx.title || (tx as unknown as { category?: string }).category || 'Expense'
              const paymentTag = tx.type === 'cash' ? 'CASH' : 'ONLINE'

              return (
                <div
                  key={tx.id}
                  className="bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_#000000] flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="truncate text-base font-extrabold text-black">{title}</span>
                    <div className="flex items-center gap-2">
                      <span className="border-2 border-black rounded-full px-2 py-0.5 text-[10px] font-black bg-[#FFD200] text-black shadow-[1px_1px_0px_#000000]">
                        {paymentTag}
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'shrink-0 text-base font-black',
                      isIncrease ? 'text-[#10B981]' : 'text-[#FF5A36]',
                    )}
                  >
                    {formatSignedINR(tx.amount, tx.mode)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarPage

