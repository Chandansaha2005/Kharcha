import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

import api from "../../api/axios";
import { formatCurrency, formatInputDate } from "../../utils/formatters";
import { useToast } from "../Shared/ToastProvider";

export default function AddIncomeModal({ onClose, incomeSource = null }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [closing, setClosing] = useState(false);
  const [sourceName, setSourceName] = useState(incomeSource?.sourceName || "");
  const [amount, setAmount] = useState(incomeSource?.amount || "");
  const [isRecurring, setIsRecurring] = useState(Boolean(incomeSource?.isRecurring));
  const [recurringDayOfMonth, setRecurringDayOfMonth] = useState(incomeSource?.recurringDayOfMonth || 1);
  const [date, setDate] = useState(formatInputDate(incomeSource?.recordedAt || new Date()));

  const closeModal = () => {
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        sourceName,
        amount: Number(amount),
        isRecurring,
        recurringDayOfMonth: isRecurring ? Number(recurringDayOfMonth) : null,
        date,
      };

      if (incomeSource?._id) {
        const { data } = await api.patch(`/income/${incomeSource._id}`, payload);
        return data;
      }

      const { data } = await api.post("/income", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-sources"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["layout-summary"] });
      showToast({
        type: "success",
        title: incomeSource ? "Income updated" : `${formatCurrency(amount)} income added`,
      });
      closeModal();
    },
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <button type="button" className="absolute inset-0 cursor-default backdrop-fade" onClick={closeModal} />
      <div
        data-state={closing ? "closing" : "open"}
        className="modal-panel relative z-10 w-full max-w-lg rounded-[30px] border border-border bg-surface p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full bg-surface2 p-2 text-muted hover:text-text"
        >
          <X size={18} />
        </button>

        <p className="text-xs uppercase tracking-[0.28em] text-incomeLight/70">
          {incomeSource ? "Edit income" : "Add income"}
        </p>
        <h2 className="mt-3 text-2xl font-black text-text">Log what came in.</h2>

        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Source name</span>
            <input
              type="text"
              value={sourceName}
              onChange={(event) => setSourceName(event.target.value)}
              className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-income"
              placeholder="Internship, Tuition, Freelance..."
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Amount</span>
              <div className="flex items-center gap-3 rounded-2xl border border-income/30 bg-surface2 px-4 py-4">
                <span className="text-2xl font-black text-income">₹</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="financial-number w-full bg-transparent text-2xl font-extrabold text-text outline-none"
                  placeholder="0.00"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-income"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-border bg-surface2 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text">Is recurring?</p>
                <p className="mt-1 text-xs text-muted">Send yourself a monthly reminder.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsRecurring((current) => !current)}
                className={`relative h-8 w-14 rounded-full ${isRecurring ? "bg-income" : "bg-border"}`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${
                    isRecurring ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {isRecurring ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">
                  Remind me on day ___ of every month
                </span>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={recurringDayOfMonth}
                  onChange={(event) => setRecurringDayOfMonth(event.target.value)}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-4 text-sm text-text outline-none focus:border-income"
                  required={isRecurring}
                />
              </label>
            ) : null}
          </div>

          {mutation.error ? (
            <div className="rounded-2xl border border-expense/20 bg-expense/10 px-4 py-3 text-sm text-expenseLight">
              {mutation.error.response?.data?.error || "Unable to save income"}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-2xl bg-income px-4 py-4 text-sm font-black text-black shadow-income hover:-translate-y-0.5"
          >
            {mutation.isPending ? "Saving..." : incomeSource ? "Save Income Changes" : "Add Income"}
          </button>
        </form>
      </div>
    </div>
  );
}
