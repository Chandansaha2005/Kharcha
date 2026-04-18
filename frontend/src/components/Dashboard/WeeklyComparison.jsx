import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatCurrency, formatPercent } from "../../utils/formatters";

export default function WeeklyComparison({ comparison }) {
  const thisWeek = comparison?.thisWeek || 0;
  const lastWeek = comparison?.lastWeek || 0;
  const percentChange = comparison?.percentChange || 0;
  const spendingMore = thisWeek > lastWeek;

  return (
    <section className="rounded-[24px] border border-border bg-surface p-5 transition-colors duration-200 hover:border-accent/40 sm:rounded-[28px] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Weekly comparison</p>
          <h2 className="mt-2 text-lg font-black text-text sm:text-xl">This week vs last week</h2>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-2 text-xs ${
            spendingMore ? "bg-expense/10 text-expenseLight" : "bg-income/10 text-incomeLight"
          }`}
        >
          {formatPercent(percentChange)}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-border bg-surface2 p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">This Week</p>
          <p className="financial-number mt-3 text-2xl font-extrabold text-expense sm:text-3xl">
            {formatCurrency(thisWeek)}
          </p>
        </div>
        <div className="rounded-[24px] border border-border bg-surface2 p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Last Week</p>
          <p className="financial-number mt-3 text-2xl font-extrabold text-text sm:text-3xl">{formatCurrency(lastWeek)}</p>
        </div>
      </div>

      <div
        className={`mt-4 flex flex-col items-start gap-3 rounded-[24px] border px-4 py-4 text-sm sm:mt-5 sm:rounded-3xl sm:flex-row sm:items-center ${
          spendingMore
            ? "border-expense/25 bg-expense/10 text-expenseLight"
            : "border-income/25 bg-income/10 text-incomeLight"
        }`}
      >
        {spendingMore ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
        <span>{spendingMore ? "You're spending more" : "You're spending less"}</span>
      </div>
    </section>
  );
}
