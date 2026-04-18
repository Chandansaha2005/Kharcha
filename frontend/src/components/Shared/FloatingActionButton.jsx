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

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="relative flex flex-col items-center">
          {/* Floating menu - expands upward when open */}
          {open && (
            <div className="mb-6 space-y-3 flex flex-col items-center">
              {actions.map((action, index) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => handleAction(action.key)}
                    className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-black shadow-lg ${action.className}`}
                    style={{
                      width: "180px",
                      animation: open ? `scale-pop 0.3s ease-out ${index * 50}ms backwards` : "none",
                    }}
                  >
                    <Icon size={18} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Main plus button */}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className={`flex h-14 w-14 items-center justify-center rounded-full border border-income/30 bg-income shadow-income transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
            style={{
              animation: open ? "spin 0.4s ease-out" : "none",
            }}
            aria-label="Open quick actions"
          >
            <Plus className="text-black" size={28} />
          </button>
        </div>
      </div>
    </>
  );
}
