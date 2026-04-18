import { CalendarDays, Clock3, LayoutDashboard, TrendingUp, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

import { formatCurrency } from "../../utils/formatters";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Wallet },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/pending", label: "Pending", icon: Clock3 },
];

export default function Sidebar({ balance = 0 }) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-border bg-surface px-5 py-6 lg:flex">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,#4ade80,#14532d_72%)] text-2xl font-black text-white shadow-income">
            ₹
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Personal Finance</p>
            <h1 className="mt-1 text-lg font-black text-text">ExpenseTracker</h1>
          </div>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl border-l-4 px-4 py-3 text-sm ${
                  isActive
                    ? "border-income bg-income/10 text-incomeLight"
                    : "border-transparent text-muted hover:bg-surface2 hover:text-text"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-income/20 bg-[linear-gradient(135deg,rgba(34,197,94,0.14),rgba(8,8,8,0.2))] p-5 shadow-income">
        <p className="text-xs uppercase tracking-[0.28em] text-incomeLight/70">Current Balance</p>
        <p className="financial-number mt-3 text-2xl font-extrabold text-incomeLight">{formatCurrency(balance)}</p>
      </div>
    </aside>
  );
}
