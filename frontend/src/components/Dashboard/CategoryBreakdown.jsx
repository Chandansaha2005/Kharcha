import { useEffect, useState } from "react";

import { formatCurrency } from "../../utils/formatters";

export default function CategoryBreakdown({ items = [] }) {
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setAnimateBars(true), 60);
    return () => window.clearTimeout(timeoutId);
  }, [items]);

  return (
    <section className="rounded-[28px] border border-border bg-surface p-6 transition-colors duration-200 hover:border-expense/40">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Spending by category</p>
          <h2 className="mt-2 text-xl font-black text-text">Where the month is going</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={item.category}
              className="stagger-child"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-text">{item.category}</span>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="financial-number text-expenseLight">{formatCurrency(item.amount)}</span>
                  <span>{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="h-3 rounded-full bg-surface2">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#ef4444_0%,#f87171_100%)] transition-all duration-700 ease-out"
                  style={{ width: animateBars ? `${item.percentage}%` : "0%" }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-border bg-surface2 px-4 py-6 text-sm text-muted">
            No spending categories yet for this month.
          </div>
        )}
      </div>
    </section>
  );
}
