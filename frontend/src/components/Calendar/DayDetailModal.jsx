import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatters";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useToast } from "../Shared/ToastProvider";

export default function DayDetailModal({ date, onClose }) {
  const [closing, setClosing] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const closeModal = () => {
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  const query = useQuery({
    queryKey: ["calendar-transactions", date],
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

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-6 backdrop-blur-sm sm:items-center sm:px-4 sm:pb-0">
      <button type="button" className="absolute inset-0 cursor-default backdrop-fade" onClick={closeModal} />
      <div
        data-state={closing ? "closing" : "open"}
        className="modal-panel relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-border bg-surface p-4 shadow-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full bg-surface2 p-2 text-muted hover:text-text"
        >
          <X size={18} />
        </button>

        <p className="pr-10 text-xl font-black text-text sm:text-2xl">{format(new Date(date), "EEEE, MMMM d")}</p>
        <p className="mt-4 text-sm leading-6 text-muted">
          Earned <span className="text-income">{formatCurrency(summary.earned)}</span> - Spent{" "}
          <span className="text-expense">{formatCurrency(summary.spent)}</span> - Net{" "}
          <span className={summary.net >= 0 ? "text-income" : "text-expense"}>{formatCurrency(summary.net)}</span>
        </p>

        <div className="mt-6 space-y-3">
          {query.isLoading ? (
            <LoadingSpinner label="Loading the day..." />
          ) : query.data?.length ? (
            query.data.map((transaction) => (
              <div
                key={transaction._id}
                className="flex flex-col gap-3 rounded-3xl border border-border bg-surface2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-text">{transaction.reason}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span className="rounded-full bg-background px-2 py-1">{transaction.category}</span>
                    <span>{format(new Date(transaction.date), "p")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
                  <p
                    className={`financial-number text-base font-extrabold sm:text-lg ${
                      transaction.type === "income" ? "text-income" : "text-expense"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(transaction._id)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-expense/25 bg-expense/10 px-3 py-2 text-xs text-expenseLight"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-border bg-surface2 px-4 py-8 text-center text-sm text-muted">
              No transactions recorded for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
