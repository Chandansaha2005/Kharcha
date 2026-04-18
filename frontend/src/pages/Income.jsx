import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useToast } from "../components/Shared/ToastProvider";
import { formatCurrency, formatDateHeader } from "../utils/formatters";

export default function IncomePage() {
  const { openIncomeModal } = useOutletContext();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const incomeQuery = useQuery({
    queryKey: ["income-sources"],
    queryFn: async () => {
      const { data } = await api.get("/income");
      return data.incomeSources;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/income/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-sources"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["layout-summary"] });
      showToast({ type: "info", title: "Income source deleted" });
    },
  });

  const recurringSources = (incomeQuery.data || []).filter((item) => item.isRecurring);
  const oneTimeSources = (incomeQuery.data || []).filter((item) => !item.isRecurring);

  return (
    <div className="page-enter">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Income sources</p>
          <h1 className="mt-3 text-2xl font-black text-text sm:text-3xl">Track what fuels the balance.</h1>
        </div>
        <button
          type="button"
          onClick={() => openIncomeModal()}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-income px-5 py-3 text-sm font-black text-black shadow-income sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Income</span>
        </button>
      </div>

      {incomeQuery.isLoading ? (
        <div className="mt-6 space-y-4">
          <SkeletonLoader className="h-36" />
          <SkeletonLoader className="h-36" />
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock size={18} className="text-income" />
              <h2 className="text-xl font-black text-text">Recurring Sources</h2>
            </div>
            <div className="space-y-3">
              {recurringSources.length ? (
                recurringSources.map((item) => (
                  <div key={item._id} className="rounded-[28px] border border-border bg-surface p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg text-text">{item.sourceName}</p>
                        <p className="financial-number mt-2 text-2xl font-extrabold text-income sm:text-3xl">
                          {formatCurrency(item.amount)}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span className="rounded-full bg-income/10 px-3 py-2 text-incomeLight">
                            Monthly on day {item.recurringDayOfMonth}
                          </span>
                          <span>
                            Last reminded:{" "}
                            {item.lastRemindedAt ? formatDateHeader(item.lastRemindedAt) : "No reminder yet"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 sm:self-start">
                        <button
                          type="button"
                          onClick={() => openIncomeModal(item)}
                          className="rounded-full border border-border bg-surface2 p-3 text-muted hover:text-text"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item._id)}
                          className="rounded-full border border-expense/25 bg-expense/10 p-3 text-expenseLight"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-border bg-surface px-6 py-10 text-center text-sm text-muted">
                  No recurring income sources yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black text-text">One-time Income</h2>
            <div className="space-y-3">
              {oneTimeSources.length ? (
                oneTimeSources.map((item) => (
                  <div key={item._id} className="rounded-[28px] border border-border bg-surface px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-text">{item.sourceName}</p>
                        <p className="mt-2 text-xs text-muted">{formatDateHeader(item.recordedAt)}</p>
                      </div>
                      <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <p className="financial-number text-lg font-extrabold text-income sm:text-xl">
                          {formatCurrency(item.amount)}
                        </p>
                        <button
                          type="button"
                          onClick={() => openIncomeModal(item)}
                          className="rounded-full border border-border bg-surface2 p-3 text-muted hover:text-text"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item._id)}
                          className="rounded-full border border-expense/25 bg-expense/10 p-3 text-expenseLight"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-border bg-surface px-6 py-10 text-center text-sm text-muted">
                  No one-time income recorded yet.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
