import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatCompactCurrency, formatCurrency } from "../../utils/formatters";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({ currentMonth, onMonthChange, calendarData = {}, onSelectDate, selectedDate }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  return (
    <section className="rounded-[28px] border border-border bg-surface p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Month view</p>
          <h2 className="mt-2 text-xl font-black text-text">{format(currentMonth, "MMMM yyyy")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="rounded-full border border-border bg-surface2 p-3 text-muted hover:border-income hover:text-income"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="rounded-full border border-border bg-surface2 p-3 text-muted hover:border-income hover:text-income"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="min-w-0">
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-[0.16em] text-muted sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
            {weekLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const totals = calendarData[key];
              const today = isSameDay(day, new Date());
              const isSelected = key === selectedDate;
              const hasIncome = Boolean(totals?.income);
              const hasExpense = Boolean(totals?.expense);
              const activityClasses = hasIncome && hasExpense
                ? "border-accent/35 bg-[linear-gradient(135deg,rgba(34,197,94,0.14),rgba(239,68,68,0.12))]"
                : hasIncome
                  ? "border-income/35 bg-income/10"
                  : hasExpense
                    ? "border-expense/35 bg-expense/10"
                    : "border-border bg-background/30";

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectDate(key)}
                  className={`min-h-[78px] rounded-[20px] border p-1.5 text-left transition-all duration-200 sm:min-h-[110px] sm:rounded-3xl sm:p-2 sm:hover:scale-[1.05] sm:hover:bg-surface2 ${
                    activityClasses
                  } ${today ? "ring-1 ring-accent/70" : ""} ${isSelected ? "border-accent ring-2 ring-accent/55" : ""} ${
                    isSameMonth(day, currentMonth) ? "opacity-100" : "opacity-45"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-sm text-text">{format(day, "d")}</div>
                    {hasIncome || hasExpense ? (
                      <div className="flex items-center gap-1">
                        {hasIncome ? <div className="h-1.5 w-1.5 rounded-full bg-income" /> : null}
                        {hasExpense ? <div className="h-1.5 w-1.5 rounded-full bg-expense" /> : null}
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-2.5 space-y-1 sm:mt-4 sm:space-y-2">
                    {totals?.income ? (
                      <>
                        <div className="rounded-xl bg-income/15 px-1.5 py-1 text-[9px] text-incomeLight sm:hidden">
                          +{formatCompactCurrency(totals.income)}
                        </div>
                        <div className="hidden rounded-2xl bg-income/10 px-2 py-1 text-[10px] text-incomeLight sm:block">
                          <div className="mb-1 h-1.5 w-1.5 rounded-full bg-income" />
                          +{formatCurrency(totals.income)}
                        </div>
                      </>
                    ) : null}
                    {totals?.expense ? (
                      <>
                        <div className="rounded-xl bg-expense/15 px-1.5 py-1 text-[9px] text-expenseLight sm:hidden">
                          -{formatCompactCurrency(totals.expense)}
                        </div>
                        <div className="hidden rounded-2xl bg-expense/10 px-2 py-1 text-[10px] text-expenseLight sm:block">
                          <div className="mb-1 h-1.5 w-1.5 rounded-full bg-expense" />
                          -{formatCurrency(totals.expense)}
                        </div>
                      </>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
