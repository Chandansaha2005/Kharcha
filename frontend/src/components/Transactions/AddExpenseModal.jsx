import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import api from "../../api/axios";
import { useToast } from "../Shared/ToastProvider";
import { CATEGORY_OPTIONS, formatCurrency, formatInputDate } from "../../utils/formatters";

export default function AddExpenseModal({ onClose, pendingExpense = null }) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const amountRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [amount, setAmount] = useState(pendingExpense?.amount || "");
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(formatInputDate(new Date()));
  const [note, setNote] = useState(pendingExpense?.note || "");
  const [showNotes, setShowNotes] = useState(Boolean(pendingExpense?.note));

  useEffect(() => {
    window.setTimeout(() => amountRef.current?.focus(), 80);
  }, []);

  const closeModal = () => {
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  const suggestionsQuery = useQuery({
    queryKey: ["expense-suggestions"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await api.get("/transactions/suggestions");
      return data.suggestions;
    },
  });

  const filteredSuggestions = useMemo(() => {
    const query = reason.trim().toLowerCase();
    if (!query) {
      return suggestionsQuery.data?.slice(0, 6) || [];
    }
    return (suggestionsQuery.data || [])
      .filter((item) => item.reason.toLowerCase().includes(query))
      .slice(0, 6);
  }, [reason, suggestionsQuery.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (pendingExpense?._id) {
        const { data } = await api.patch(`/transactions/pending/${pendingExpense._id}/convert`, {
          amount: Number(amount),
          reason,
          category,
          date,
          note,
        });
        return data;
      }

      const { data } = await api.post("/transactions", {
        type: "expense",
        amount: Number(amount),
        reason,
        category,
        date,
        note,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["layout-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["pending-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-transactions"] });
      showToast({
        type: "error",
        title: `${formatCurrency(amount)} added to expenses`,
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

        <p className="text-xs uppercase tracking-[0.28em] text-expenseLight/70">
          {pendingExpense ? "Complete pending expense" : "Add expense"}
        </p>
        <h2 className="mt-3 text-2xl font-black text-text">Capture the spend with context.</h2>

        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Amount</span>
            <div className="flex items-center gap-4 rounded-[28px] border border-expense/30 bg-surface2 px-5 py-4">
              <span className="text-3xl font-black text-expense">₹</span>
              <input
                ref={amountRef}
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="financial-number w-full bg-transparent text-3xl font-extrabold text-text outline-none"
                placeholder="0.00"
                required
              />
            </div>
          </label>

          <label className="relative block">
            <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Reason</span>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface2 px-4 py-4">
              <Search size={16} className="text-muted" />
              <input
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="w-full bg-transparent text-sm text-text outline-none"
                placeholder="Swiggy, Auto, Coffee..."
                required
              />
            </div>

            {filteredSuggestions.length ? (
              <div className="absolute z-10 mt-2 w-full rounded-3xl border border-border bg-surface shadow-2xl">
                {filteredSuggestions.map((item) => (
                  <button
                    key={`${item.reason}-${item.category}`}
                    type="button"
                    onClick={() => {
                      setReason(item.reason);
                      setCategory(item.category);
                    }}
                    className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-surface2"
                  >
                    <div>
                      <p className="text-sm text-text">{item.reason}</p>
                      <p className="mt-1 text-xs text-muted">
                        {item.category} · {item.count} times
                      </p>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 text-muted" />
                  </button>
                ))}
              </div>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-expense"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.24em] text-muted">Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-expense"
              />
            </label>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowNotes((current) => !current)}
              className="text-xs uppercase tracking-[0.24em] text-muted hover:text-text"
            >
              {showNotes ? "Hide note" : "Add note"}
            </button>
            {showNotes ? (
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="mt-3 w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-expense"
                placeholder="Anything worth remembering?"
              />
            ) : null}
          </div>

          {mutation.error ? (
            <div className="rounded-2xl border border-expense/20 bg-expense/10 px-4 py-3 text-sm text-expenseLight">
              {mutation.error.response?.data?.error || "Unable to add expense"}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-2xl bg-expense px-4 py-4 text-sm font-black text-white shadow-expense hover:-translate-y-0.5"
          >
            {mutation.isPending ? "Saving..." : pendingExpense ? "Add Expense Details" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
