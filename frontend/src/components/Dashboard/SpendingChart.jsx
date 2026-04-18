import { AlertTriangle } from "lucide-react";

import { formatCurrency } from "../../utils/formatters";

export default function SpendingChart({ items = [] }) {
  return (
    <section className="rounded-[28px] border border-border bg-surface p-6 transition-colors duration-200 hover:border-income/40">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-muted">Spending patterns</p>
        <h2 className="mt-2 text-xl font-black text-text">Frequent spending habits</h2>
      </div>

      <div className="mt-6 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={item.reason}
              className="stagger-child flex flex-col gap-3 rounded-3xl border border-border bg-surface2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-3 w-3 shrink-0 rounded-full ${
                    item.count > 5 ? "bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.45)]" : "bg-income"
                  }`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm text-text">{item.reason}</p>
                  <p className="mt-1 text-xs text-muted">{item.count} times</p>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-3 sm:block sm:w-auto sm:text-right">
                <p className="financial-number text-sm font-extrabold text-expense">{formatCurrency(item.totalAmount)}</p>
                {item.count > 5 ? (
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-orange-300">
                    <AlertTriangle size={12} />
                    <span>High repeat</span>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-border bg-surface2 px-4 py-6 text-sm text-muted">
            Add a few expenses and your habits will show up here.
          </div>
        )}
      </div>
    </section>
  );
}
