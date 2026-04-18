import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, X } from "lucide-react";
import { useMemo } from "react";

import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useToast } from "../Shared/ToastProvider";

export default function DayTransactionsPanel({ date, onClear }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: ["calendar-transactions", date],
    enabled: Boolean(date),
    queryFn: async () => {
      const { data } = await api.get(`/transactions/day/${date}`);
      return data.transactions;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-transactions", date] });
      queryClient.invalidateQueries({ queryKey: ["income-sources"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["layout-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showToast({
        type: "info",
        title: "Transaction deleted",
      });
    },
  });

  const summary = useMemo(() => {
    const items = query.data || [];
    const earned = items.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const spent = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

    return {
      earned,
      spent,
      net: earned - spent,
    };
  }, [query.data]);

  if (!date) {
    return (
      <section className="rounded-[24px] border border-border bg-surface px-4 py-6 text-sm text-muted sm:rounded-[28px] sm:px-6">
        Tap a date to see that day's transactions here.
      </section>
    );
  }

  return (
    <section className="rounded-[24px] border border-border bg-surface p-4 sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Selected day</p>
          <h2 className="mt-2 text-lg font-black text-text sm:text-2xl">{format(new Date(date), "EEEE, MMMM d")}</h2>
          <p className="mt-2 text-sm text-muted">Daily income, spending, and transactions in one lightweight view.</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface2 text-muted hover:text-text"
          aria-label="Clear selected date"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[22px] border border-income/20 bg-income/10 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-incomeLight">Income</p>
          <p className="financial-number mt-2 text-xl font-extrabold text-income">{formatCurrency(summary.earned)}</p>
        </div>
        <div className="rounded-[22px] border border-expense/20 bg-expense/10 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-expenseLight">Expenses</p>
          <p className="financial-number mt-2 text-xl font-extrabold text-expense">{formatCurrency(summary.spent)}</p>
        </div>
        <div className="rounded-[22px] border border-border bg-surface2 px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Net</p>
          <p className={`financial-number mt-2 text-xl font-extrabold ${summary.net >= 0 ? "text-income" : "text-expense"}`}>
            {formatCurrency(summary.net)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {query.isLoading ? (
          <LoadingSpinner label="Loading the day..." />
        ) : query.data?.length ? (
          query.data.map((transaction) => (
            <div
              key={transaction._id}
              className="rounded-[24px] border border-border bg-surface2 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-text">{transaction.reason}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded-full bg-background px-2 py-1">{transaction.category}</span>
                    <span>{format(new Date(transaction.date), "p")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(transaction._id)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-expense/25 bg-expense/10 text-expenseLight"
                  aria-label={`Delete ${transaction.reason}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <p
                className={`financial-number mt-4 text-lg font-extrabold ${
                  transaction.type === "income" ? "text-income" : "text-expense"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-border bg-surface2 px-4 py-8 text-center text-sm text-muted">
            No transactions recorded for this day.
          </div>
        )}
      </div>
    </section>
  );
}
