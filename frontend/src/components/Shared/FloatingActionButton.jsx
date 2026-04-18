import { Plus, TrendingUp, Wallet, Zap } from "lucide-react";
import { useState } from "react";

const actions = [
  {
    key: "expense",
    label: "Add Expense",
    icon: Wallet,
    className: "bg-expense text-white",
  },
  {
    key: "income",
    label: "Add Income",
    icon: TrendingUp,
    className: "bg-income text-black",
  },
  {
    key: "quick",
    label: "Quick Add",
    icon: Zap,
    className: "bg-accent text-black",
  },
];

export default function FloatingActionButton({ onOpenExpense, onOpenIncome, onOpenQuick }) {
  const [open, setOpen] = useState(false);

  const handleAction = (key) => {
    setOpen(false);

    if (key === "expense") onOpenExpense();
    if (key === "income") onOpenIncome();
    if (key === "quick") onOpenQuick();
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Close quick actions"
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-50 flex justify-end px-4 md:hidden">
        <div
          className={`mb-3 w-full max-w-sm rounded-[28px] border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
            open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
          }`}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-muted">Quick Actions</p>
          <div className="space-y-3">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handleAction(action.key)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-black shadow-lg ${action.className}`}
                  style={{
                    animationDelay: `${index * 90}ms`,
                    animation: open ? "slide-up 0.3s ease forwards" : "none",
                  }}
                >
                  <span>{action.label}</span>
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`flex h-14 w-14 items-center justify-center rounded-full border border-income/30 bg-income shadow-income sm:h-16 sm:w-16 ${
            open ? "rotate-45" : ""
          }`}
          aria-label="Open quick actions"
        >
          <Plus className="text-black" size={28} />
        </button>
      </div>
    </>
  );
}
