import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock3 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import api from "../api/axios";
import PendingExpenseCard from "../components/Transactions/PendingExpenseCard";
import SkeletonLoader from "../components/Shared/SkeletonLoader";
import { useToast } from "../components/Shared/ToastProvider";

export default function PendingPage() {
  const { openExpenseModal } = useOutletContext();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const pendingQuery = useQuery({
    queryKey: ["pending-expenses"],
    queryFn: async () => {
      const { data } = await api.get("/transactions/pending");
      return data.pendingExpenses;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/transactions/pending/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-expenses"] });
      showToast({ type: "info", title: "Pending expense removed" });
    },
  });

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3">
        <Clock3 className="text-accent" size={22} />
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Pending expenses</p>
          <h1 className="mt-2 text-2xl font-black text-text sm:text-3xl">Save now, fill in details later.</h1>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {pendingQuery.isLoading ? (
          <>
            <SkeletonLoader className="h-40" />
            <SkeletonLoader className="h-40" />
          </>
        ) : pendingQuery.data?.length ? (
          pendingQuery.data.map((item) => (
            <PendingExpenseCard
              key={item._id}
              item={item}
              onAddDetails={(pendingExpense) => openExpenseModal(pendingExpense)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))
        ) : (
          <div className="rounded-[30px] border border-income/20 bg-income/10 px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto text-income" size={28} />
            <p className="mt-4 text-lg font-black text-text">No pending expenses. You&apos;re all caught up! ✓</p>
          </div>
        )}
      </div>
    </div>
  );
}
