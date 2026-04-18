import { useQuery } from "@tanstack/react-query";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import BalanceCard from "../components/Dashboard/BalanceCard";
import CategoryBreakdown from "../components/Dashboard/CategoryBreakdown";
import SpendingChart from "../components/Dashboard/SpendingChart";
import WeeklyComparison from "../components/Dashboard/WeeklyComparison";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useAuthStore } from "../store/authStore";

export default function DashboardPage() {
  const { openExpenseModal, openIncomeModal, openQuickAddModal } = useOutletContext();
  const { user } = useAuthStore();

  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/summary");
      return data;
    },
  });

  return (
    <div className="page-enter">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-incomeLight/70 sm:hidden">Welcome back</p>
          <p className="text-sm text-muted sm:hidden">{user?.email}</p>
          <p className="hidden text-xs uppercase tracking-[0.28em] text-incomeLight/70 sm:block">Money command center</p>
          <h1 className="mt-2 text-xl font-black text-text sm:mt-3 sm:text-4xl">See your money move clearly.</h1>
          <p className="hidden text-sm leading-6 text-muted sm:mt-3 sm:block sm:max-w-2xl sm:leading-7">
            Balance, spending momentum, and habit signals all in one place.
          </p>
        </div>

        <div className="hidden gap-3 sm:flex sm:flex-wrap md:grid">
          <button
            type="button"
            onClick={() => openExpenseModal()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-expense px-5 py-3 text-sm font-black text-white shadow-expense sm:w-auto"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
          <button
            type="button"
            onClick={() => openIncomeModal()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-income px-5 py-3 text-sm font-black text-black shadow-income sm:w-auto"
          >
            <TrendingUp size={16} />
            <span>Add Income</span>
          </button>
          <button
            type="button"
            onClick={openQuickAddModal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-black text-accent sm:w-auto"
          >
            <Sparkles size={16} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {summaryQuery.isLoading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SkeletonLoader className="h-40" />
          <SkeletonLoader className="h-40" />
          <SkeletonLoader className="h-40" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <BalanceCard
              label="Total Balance"
              amount={summaryQuery.data?.totalBalance}
              tone="accent"
              icon="balance"
              subtitle="Updated just now"
            />
            <BalanceCard
              label="This Month's Income"
              amount={summaryQuery.data?.totalIncome}
              tone="income"
              icon="income"
              subtitle="Fresh inflows this month"
            />
            <BalanceCard
              label="This Month's Expenses"
              amount={summaryQuery.data?.totalExpenses}
              tone="expense"
              icon="expense"
              subtitle="What went out this month"
            />
          </div>

          <div className="mt-3 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <CategoryBreakdown items={summaryQuery.data?.categoryBreakdown || []} />
            <WeeklyComparison comparison={summaryQuery.data?.weeklyComparison} />
          </div>

          <div className="mt-6">
            <SpendingChart items={summaryQuery.data?.frequentSpending || []} />
          </div>
        </>
      )}
    </div>
  );
}
