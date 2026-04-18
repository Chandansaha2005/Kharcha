import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Filter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import TransactionList from "../components/Transactions/TransactionList";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useToast } from "../components/Shared/ToastProvider";
import { useTransactions } from "../hooks/useTransactions";
import { CATEGORY_OPTIONS, getYearOptions, monthOptions } from "../utils/formatters";

export default function TransactionsPage() {
  const { openExpenseModal } = useOutletContext();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  const filters = useMemo(
    () => ({
      month,
      year,
      category,
      type,
    }),
    [month, year, category, type]
  );

  const transactionsQuery = useTransactions(filters);

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["income-sources"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["layout-summary"] });
      showToast({ type: "info", title: "Transaction deleted" });
    },
  });

  return (
    <div className="page-enter">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Transaction log</p>
          <h1 className="mt-3 text-2xl font-black text-text sm:text-3xl">Every move, grouped by day.</h1>
        </div>
        <button
          type="button"
          onClick={() => openExpenseModal()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-expense px-5 py-3 text-sm font-black text-white shadow-expense sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="mt-6 rounded-[28px] border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted">
          <Filter size={16} />
          <span>Filters</span>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-text"
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-text"
          >
            {getYearOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-text"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-text"
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        {transactionsQuery.isLoading ? (
          <div className="space-y-3">
            <SkeletonLoader className="h-28" />
            <SkeletonLoader className="h-28" />
            <SkeletonLoader className="h-28" />
          </div>
        ) : transactionsQuery.data?.length ? (
          <TransactionList transactions={transactionsQuery.data} onDelete={(id) => deleteMutation.mutate(id)} />
        ) : (
          <div className="rounded-[28px] border border-border bg-surface px-6 py-12 text-center text-sm text-muted">
            No transactions match these filters yet.
          </div>
        )}
      </div>
    </div>
  );
}
