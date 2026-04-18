import { CalendarDays, Clock3, LayoutDashboard, TrendingUp, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/transactions", label: "Moves", icon: Wallet },
  { to: "/calendar", label: "Month", icon: CalendarDays },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/pending", label: "Pending", icon: Clock3 },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] leading-none ${
                  isActive ? "bg-income/10 text-income" : "text-muted"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
