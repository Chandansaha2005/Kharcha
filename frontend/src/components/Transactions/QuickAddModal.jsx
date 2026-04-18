import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import api from "../../api/axios";
import { formatCurrency } from "../../utils/formatters";
import { useToast } from "../Shared/ToastProvider";

export default function QuickAddModal({ onClose }) {
  const amountRef = useRef(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [closing, setClosing] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    window.setTimeout(() => amountRef.current?.focus(), 80);
  }, []);

  const closeModal = () => {
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/transactions/quick", {
        amount: Number(amount),
        note,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-expenses"] });
      showToast({
        type: "warning",
        title: "Saved as pending",
        message: `${formatCurrency(amount)} is waiting for details.`,
      });
      closeModal();
    },
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 px-4 pb-24 backdrop-blur-sm sm:items-center sm:pb-0">
      <button type="button" className="absolute inset-0 cursor-default backdrop-fade" onClick={closeModal} />
      <div
        data-state={closing ? "closing" : "open"}
        className="modal-panel relative z-10 w-full max-w-md rounded-[30px] border border-border bg-surface p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-5 top-5 rounded-full bg-surface2 p-2 text-muted hover:text-text"
        >
          <X size={18} />
        </button>

        <p className="text-xs uppercase tracking-[0.28em] text-accent/70">Quick add</p>
        <h2 className="mt-3 text-2xl font-black text-text">Save now, categorize later.</h2>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="flex items-center gap-4 rounded-[28px] border border-accent/30 bg-surface2 px-5 py-4">
            <span className="text-3xl font-black text-accent">₹</span>
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

          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-sm text-text outline-none focus:border-accent"
            placeholder="Short note"
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-2xl bg-accent px-4 py-4 text-sm font-black text-black shadow-accent"
          >
            {mutation.isPending ? "Saving..." : "Save for Later"}
          </button>
        </form>
      </div>
    </div>
  );
}
