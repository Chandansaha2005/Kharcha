import { useQuery } from "@tanstack/react-query";

import api from "../api/axios";
import BalanceCard from "../components/Dashboard/BalanceCard";
import CategoryBreakdown from "../components/Dashboard/CategoryBreakdown";
import SpendingChart from "../components/Dashboard/SpendingChart";
import WeeklyComparison from "../components/Dashboard/WeeklyComparison";
import SkeletonLoader from "../components/Shared/SkeletonLoader";

export default function DashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/summary");
      return data;
    },
  });

  return (
    <div className="page-enter">
      <div>
        <div>
          <p className="text-[13px] font-black uppercase tracking-[0.24em] text-incomeLight/70 sm:text-xs sm:tracking-[0.28em]">
            Money command center
          </p>
          <h1 className="mt-3 text-[1.85rem] font-black leading-tight text-text sm:mt-3 sm:text-4xl">
            See your money move clearly.
          </h1>
          <p className="hidden text-sm leading-6 text-muted sm:mt-3 sm:block sm:max-w-2xl sm:leading-7">
            Balance, spending momentum, and habit signals all in one place.
          </p>
        </div>
      </div>

      {summaryQuery.isLoading ? (
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3">
          <SkeletonLoader className="h-40" />
          <SkeletonLoader className="h-40" />
          <SkeletonLoader className="h-40" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4">
            <BalanceCard
              label="Current Balance"
              amount={summaryQuery.data?.totalBalance}
              tone="accent"
              icon="balance"
              subtitle="Updated just now"
              maskable
            />
            <BalanceCard
              label="This Month Income"
              amount={summaryQuery.data?.totalIncome}
              tone="income"
              icon="income"
              subtitle="Fresh inflows this month"
            />
            <BalanceCard
              label="This Month Expense"
              amount={summaryQuery.data?.totalExpenses}
              tone="expense"
              icon="expense"
              subtitle="What went out this month"
            />
          </div>

          <div className="mt-4 grid gap-5 sm:mt-3 sm:gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <CategoryBreakdown items={summaryQuery.data?.categoryBreakdown || []} />
            <WeeklyComparison comparison={summaryQuery.data?.weeklyComparison} />
          </div>

          <div className="mt-5 sm:mt-6">
            <SpendingChart items={summaryQuery.data?.frequentSpending || []} />
          </div>
        </>
      )}
    </div>
  );
}
