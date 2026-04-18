import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { formatCurrency, formatRelativeTime } from "../../utils/formatters";

export default function PendingExpenseCard({ item, onAddDetails, onDelete }) {
  const [removing, setRemoving] = useState(false);

  return (
    <div
      className={`rounded-[28px] border border-border bg-surface p-5 transition-all duration-300 ${
        removing ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="financial-number text-3xl font-extrabold text-accent">{formatCurrency(item.amount)}</p>
          <p className="mt-3 text-sm text-text">{item.note || "No note yet"}</p>
          <p className="mt-2 text-xs text-muted">{formatRelativeTime(item.createdAt)}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onAddDetails(item)}
          className="inline-flex items-center gap-2 rounded-full bg-income px-4 py-3 text-sm font-black text-black"
        >
          <span>Add Details</span>
          <ArrowRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => {
            setRemoving(true);
            window.setTimeout(() => onDelete(item._id), 250);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-expense/30 bg-expense/10 px-4 py-3 text-sm text-expenseLight"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
