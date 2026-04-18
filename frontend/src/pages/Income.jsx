import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useToast } from "../components/Shared/ToastProvider";
import { formatCurrency, formatDateHeader } from "../utils/formatters";

export default function IncomePage() {
  const { openIncomeModal } = useOutletContext();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("recurring");

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
  const tabOptions = [
    { key: "recurring", label: "Recurring", count: recurringSources.length },
    { key: "one-time", label: "One-time", count: oneTimeSources.length },
  ];
  const activeItems = activeTab === "recurring" ? recurringSources : oneTimeSources;

  return (
    <div className="page-enter">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.24em] text-muted sm:text-xs sm:tracking-[0.28em]">
            Income sources
          </p>
          <h1 className="mt-3 text-[1.85rem] font-black leading-tight text-text sm:text-3xl">
            Track what fuels the balance.
          </h1>
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
        <div className="mt-6">
          <div className="inline-flex w-full rounded-full border border-border bg-surface2 p-1 sm:w-auto">
            {tabOptions.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-black sm:flex-none ${
                  activeTab === tab.key ? "bg-income text-black shadow-income" : "text-muted"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <section className="mt-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock size={18} className="text-income" />
              <h2 className="text-xl font-black text-text">
                {activeTab === "recurring" ? "Recurring Sources" : "One-time Income"}
              </h2>
            </div>

            <div className="space-y-3">
              {activeItems.length ? (
                activeItems.map((item) => (
                  <div key={item._id} className="rounded-[24px] border border-border bg-surface p-5 sm:rounded-[28px]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {item.isRecurring ? (
                            <span className="rounded-full bg-income/10 px-3 py-1.5 text-incomeLight">
                              Monthly on day {item.recurringDayOfMonth}
                            </span>
                          ) : (
                            <span className="rounded-full bg-surface2 px-3 py-1.5 text-muted">
                              {formatDateHeader(item.recordedAt)}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-base text-text sm:text-lg">{item.sourceName}</p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => openIncomeModal(item)}
                          className="rounded-full border border-border bg-surface2 p-3 text-muted hover:text-text"
                          aria-label={`Edit ${item.sourceName}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(item._id)}
                          className="rounded-full border border-expense/25 bg-expense/10 p-3 text-expenseLight"
                          aria-label={`Delete ${item.sourceName}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="financial-number mt-4 text-2xl font-extrabold text-income sm:text-3xl">
                      {formatCurrency(item.amount)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                      {item.isRecurring ? (
                        <span>
                          Last reminded: {item.lastRemindedAt ? formatDateHeader(item.lastRemindedAt) : "No reminder yet"}
                        </span>
                      ) : (
                        <span>Recorded {formatDateHeader(item.recordedAt)}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-border bg-surface px-6 py-10 text-center text-sm text-muted sm:rounded-[28px]">
                  {activeTab === "recurring" ? "No recurring income sources yet." : "No one-time income recorded yet."}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
