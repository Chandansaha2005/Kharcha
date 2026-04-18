import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarRange, ChevronDown, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import TransactionList from "../components/Transactions/TransactionList";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useToast } from "../components/Shared/ToastProvider";
import { useTransactions } from "../hooks/useTransactions";
import { CATEGORY_OPTIONS, formatMonthYear, getYearOptions, monthOptions } from "../utils/formatters";

const typeOptions = [
  { value: "all", label: "All types" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
];

export default function TransactionsPage() {
  const { openExpenseModal } = useOutletContext();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [mobilePanel, setMobilePanel] = useState(null);
  const selectedMonthDate = new Date(year, month - 1, 1);
  const mobileMonthLabel = formatMonthYear(selectedMonthDate);
  const selectedTypeLabel = typeOptions.find((option) => option.value === type)?.label || "All types";
  const selectedCategoryLabel = category === "all" ? "All categories" : category;

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
          <p className="text-[13px] font-black uppercase tracking-[0.24em] text-muted sm:text-xs sm:tracking-[0.28em]">
            Transaction log
          </p>
          <h1 className="mt-3 text-[1.85rem] font-black leading-tight text-text sm:text-3xl">Every move, grouped by day.</h1>
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
        <div className="space-y-4 sm:hidden">
          <div>
            <button
              type="button"
              onClick={() => setMobilePanel((current) => (current === "month" ? null : "month"))}
              className="flex w-full items-center justify-between rounded-[24px] border border-border bg-surface2 px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <CalendarRange size={18} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Date</p>
                  <p className="mt-1 text-sm font-black text-text">{mobileMonthLabel}</p>
                </div>
              </div>
              <ChevronDown size={18} className={`${mobilePanel === "month" ? "rotate-180" : ""} text-muted`} />
            </button>

            {mobilePanel === "month" ? (
              <div className="mt-3 rounded-[24px] border border-border bg-surface2 p-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setYear((current) => current - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-muted"
                    aria-label="Previous year"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <p className="text-sm font-black text-text">{year}</p>
                  <button
                    type="button"
                    onClick={() => setYear((current) => current + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-muted"
                    aria-label="Next year"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {monthOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setMonth(option.value);
                        setMobilePanel(null);
                      }}
                      className={`rounded-2xl px-3 py-3 text-sm font-black ${
                        month === option.value
                          ? "bg-income text-black shadow-income"
                          : "border border-border bg-surface text-muted"
                      }`}
                    >
                      {option.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMobilePanel((current) => (current === "type" ? null : "type"))}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-black ${
                mobilePanel === "type" ? "border-income/40 bg-income text-black" : "border-border bg-surface2 text-text"
              }`}
            >
              <span>Type</span>
              <span className="text-xs opacity-75">{selectedTypeLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel((current) => (current === "category" ? null : "category"))}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-black ${
                mobilePanel === "category" ? "border-accent/40 bg-accent text-black" : "border-border bg-surface2 text-text"
              }`}
            >
              <span>Category</span>
              <span className="text-xs opacity-75">{selectedCategoryLabel}</span>
            </button>
          </div>

          {mobilePanel === "type" ? (
            <div className="flex flex-wrap gap-2 rounded-[24px] border border-border bg-surface2 p-4">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setType(option.value);
                    setMobilePanel(null);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-sm font-black ${
                    type === option.value
                      ? option.value === "expense"
                        ? "border-expense/40 bg-expense text-white"
                        : "border-income/40 bg-income text-black"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {mobilePanel === "category" ? (
            <div className="flex flex-wrap gap-2 rounded-[24px] border border-border bg-surface2 p-4">
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setMobilePanel(null);
                }}
                className={`rounded-full border px-4 py-2.5 text-sm font-black ${
                  category === "all" ? "border-accent/40 bg-accent text-black" : "border-border bg-surface text-muted"
                }`}
              >
                All categories
              </button>
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCategory(option);
                    setMobilePanel(null);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-sm font-black ${
                    category === option ? "border-income/40 bg-income text-black" : "border-border bg-surface text-muted"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden gap-3 sm:grid md:grid-cols-4">
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
