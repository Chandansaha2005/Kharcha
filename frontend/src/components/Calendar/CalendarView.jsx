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

import { formatCurrency } from "../../utils/formatters";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({ currentMonth, onMonthChange, calendarData = {}, onSelectDate }) {
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

      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-muted">
        {weekLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const totals = calendarData[key];
          const today = isSameDay(day, new Date());

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={`min-h-[110px] rounded-3xl border p-2 text-left transition-all duration-200 hover:scale-[1.05] hover:bg-surface2 ${
                today ? "border-accent bg-accent/8" : "border-border bg-background/30"
              } ${isSameMonth(day, currentMonth) ? "opacity-100" : "opacity-45"}`}
            >
              <div className="text-sm text-text">{format(day, "d")}</div>
              <div className="mt-4 space-y-2">
                {totals?.income ? (
                  <div className="rounded-2xl bg-income/10 px-2 py-1 text-[10px] text-incomeLight">
                    <div className="mb-1 h-1.5 w-1.5 rounded-full bg-income" />
                    +{formatCurrency(totals.income)}
                  </div>
                ) : null}
                {totals?.expense ? (
                  <div className="rounded-2xl bg-expense/10 px-2 py-1 text-[10px] text-expenseLight">
                    <div className="mb-1 h-1.5 w-1.5 rounded-full bg-expense" />
                    -{formatCurrency(totals.expense)}
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
