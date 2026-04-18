import { ArrowDownRight, ArrowUpRight, Eye, EyeOff, IndianRupee, Wallet } from "lucide-react";
import { useState } from "react";

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

function maskLeadingDigits(value, digitsToHide = 2) {
  const numericValue = Number(value || 0);
  const integerDigits = Math.abs(Math.trunc(numericValue)).toString();
  const hiddenCount = Math.min(digitsToHide, integerDigits.length);
  const maskedValue = `${"X".repeat(hiddenCount)}${integerDigits.slice(hiddenCount)}`;

  return `${numericValue < 0 ? "-" : ""}${maskedValue}`;
}

export default function BalanceCard({
  label,
  amount,
  tone = "accent",
  icon = "balance",
  subtitle,
  maskable = false,
  compact = false,
}) {
  const countedValue = useCountUp(Number(amount || 0), 1200);
  const [isAmountVisible, setIsAmountVisible] = useState(!maskable);
  const styles = toneMap[tone] || toneMap.accent;
  const Icon = iconMap[icon] || Wallet;
  const amountText = formatCurrency(countedValue).replace(/[^\d.,-]/g, "").trim();
  const maskedText = maskLeadingDigits(amount);
  const displayText = maskable && !isAmountVisible ? maskedText : amountText;
  const resolvedSubtitle = maskable && !isAmountVisible ? "Hidden for privacy" : subtitle;
  const iconSize = compact ? 20 : 24;

  return (
    <div
      className={`stagger-child border bg-surface ${
        compact ? "rounded-[24px] p-4" : "rounded-[24px] p-5 sm:rounded-[28px] sm:p-6"
      } ${styles.border} ${styles.shadow} ${tone === "expense" ? "expense-glow" : ""}`}
      style={
        tone === "expense"
          ? { boxShadow: "0 0 0 1px rgba(239,68,68,0.2), 0 18px 36px -18px rgba(239,68,68,0.55)" }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">{label}</p>
          <div
            className={`financial-number flex items-center gap-1 ${
              compact ? "mt-3 text-xl sm:text-2xl" : "mt-4 text-2xl sm:text-3xl"
            } font-extrabold ${styles.value}`}
          >
            <IndianRupee size={compact ? 20 : 22} strokeWidth={2.5} className="sm:h-6 sm:w-6" />
            <span>{displayText}</span>
          </div>
          <p className={`${compact ? "mt-2" : "mt-3"} text-xs text-muted`}>{resolvedSubtitle}</p>
        </div>
        {maskable ? (
          <button
            type="button"
            onClick={() => setIsAmountVisible((currentValue) => !currentValue)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface2 text-muted hover:border-accent/45 hover:text-text"
            aria-label={isAmountVisible ? "Hide current balance" : "Show current balance"}
            aria-pressed={isAmountVisible}
          >
            {isAmountVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : (
          <div
            className={`flex items-center justify-center rounded-2xl ${
              compact ? "h-11 w-11" : "h-12 w-12 sm:h-14 sm:w-14"
            } ${styles.icon}`}
          >
            <Icon size={iconSize} />
          </div>
        )}
      </div>

      {maskable ? (
        <div className="mt-4 flex items-center justify-end">
          <div
            className={`flex items-center justify-center rounded-2xl ${
              compact ? "h-10 w-10" : "h-11 w-11"
            } ${styles.icon}`}
          >
            <Icon size={compact ? 18 : 20} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
