import {
  BookOpen,
  BusFront,
  ChevronDown,
  CircleEllipsis,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { formatCurrency, formatDateHeader } from "../../utils/formatters";

const categoryMeta = {
  Food: { icon: UtensilsCrossed, color: "bg-red-500/15 text-red-300" },
  Transport: { icon: BusFront, color: "bg-orange-500/15 text-orange-300" },
  Entertainment: { icon: Clapperboard, color: "bg-pink-500/15 text-pink-300" },
  Health: { icon: HeartPulse, color: "bg-emerald-500/15 text-emerald-300" },
  Shopping: { icon: ShoppingBag, color: "bg-fuchsia-500/15 text-fuchsia-300" },
  Education: { icon: GraduationCap, color: "bg-sky-500/15 text-sky-300" },
  Other: { icon: CircleEllipsis, color: "bg-zinc-500/15 text-zinc-200" },
};

export default function TransactionList({ transactions = [], onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const [revealedId, setRevealedId] = useState(null);
  const pressTimeout = useRef(null);

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const key = transaction.date;
      const header = formatDateHeader(transaction.date);
      const existing = acc.find((group) => group.header === header);

      if (existing) {
        existing.items.push(transaction);
      } else {
        acc.push({ header, key, items: [transaction] });
      }

      return acc;
    }, []);
  }, [transactions]);

  const handlePressStart = (id) => {
    pressTimeout.current = window.setTimeout(() => setRevealedId(id), 450);
  };

  const clearPress = () => {
    if (pressTimeout.current) {
      window.clearTimeout(pressTimeout.current);
    }
  };

  return (
    <div className="space-y-6">
      {groupedTransactions.map((group) => (
        <section key={`${group.header}-${group.key}`}>
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-muted">{group.header}</p>
          <div className="space-y-3">
            {group.items.map((transaction) => {
              const meta = categoryMeta[transaction.category] || categoryMeta.Other;
              const Icon = transaction.type === "income" ? TrendingUp : meta.icon;
              const isExpanded = expandedId === transaction._id;
              const isRevealed = revealedId === transaction._id;

              return (
                <div
                  key={transaction._id}
                  className="rounded-[26px] border border-border bg-surface p-4"
                  onPointerDown={() => handlePressStart(transaction._id)}
                  onPointerUp={clearPress}
                  onPointerLeave={clearPress}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        transaction.type === "income" ? "bg-income/15 text-income" : meta.color
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : transaction._id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm text-text">{transaction.reason}</p>
                        <span className="rounded-full bg-surface2 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                          {transaction.category}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted">{new Date(transaction.date).toLocaleString("en-IN")}</p>
                    </button>

                    <div className="ml-auto text-right">
                      <p
                        className={`financial-number text-lg font-extrabold ${
                          transaction.type === "income" ? "text-income" : "text-expense"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : transaction._id)}
                        className="mt-2 inline-flex text-muted"
                      >
                        <ChevronDown className={`${isExpanded ? "rotate-180" : ""}`} size={16} />
                      </button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 rounded-2xl border border-border bg-surface2 px-4 py-3 animate-slide-up">
                      <div className="flex items-start justify-between gap-4">
                        <div className="text-sm text-muted">
                          {transaction.note ? transaction.note : "No note for this transaction."}
                        </div>
                        <BookOpen size={16} className="text-muted" />
                      </div>
                    </div>
                  ) : null}

                  {isRevealed ? (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onDelete(transaction._id)}
                        className="inline-flex items-center gap-2 rounded-full border border-expense/30 bg-expense/10 px-4 py-3 text-sm text-expenseLight"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
