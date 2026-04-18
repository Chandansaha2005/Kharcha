import { ArrowDownRight, ArrowUpRight, IndianRupee, Wallet } from "lucide-react";

import { useCountUp } from "../../hooks/useCountUp";
import { formatCurrency } from "../../utils/formatters";

const toneMap = {
  accent: {
    border: "border-accent/25 hover:border-accent/60",
    shadow: "shadow-accent",
    value: "text-accent",
    icon: "bg-accent/15 text-accent",
  },
  income: {
    border: "border-income/20 hover:border-income/60",
    shadow: "shadow-income animate-glow-pulse",
    value: "text-income",
    icon: "bg-income/15 text-income",
  },
  expense: {
    border: "border-expense/20 hover:border-expense/60",
    shadow: "shadow-expense animate-pulse",
    value: "text-expense",
    icon: "bg-expense/15 text-expense",
  },
};

const iconMap = {
  balance: Wallet,
  income: ArrowUpRight,
  expense: ArrowDownRight,
};

export default function BalanceCard({ label, amount, tone = "accent", icon = "balance", subtitle }) {
  const countedValue = useCountUp(Number(amount || 0), 1200);
  const styles = toneMap[tone] || toneMap.accent;
  const Icon = iconMap[icon] || Wallet;

  return (
    <div
      className={`stagger-child rounded-[28px] border bg-surface p-6 ${styles.border} ${styles.shadow} ${
        tone === "expense" ? "expense-glow" : ""
      }`}
      style={
        tone === "expense"
          ? { boxShadow: "0 0 0 1px rgba(239,68,68,0.2), 0 18px 36px -18px rgba(239,68,68,0.55)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">{label}</p>
          <div className={`financial-number mt-4 flex items-center gap-1 text-2xl font-extrabold sm:text-3xl ${styles.value}`}>
            <IndianRupee size={22} strokeWidth={2.5} className="sm:h-6 sm:w-6" />
            <span>{formatCurrency(countedValue).replace(/[^\d.,-]/g, "").trim()}</span>
          </div>
          <p className="mt-3 text-xs text-muted">{subtitle}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${styles.icon}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
