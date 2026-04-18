import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function SetupPage() {
  const navigate = useNavigate();
  const { token, setupComplete, updateUser } = useAuthStore();
  const [initialSavings, setInitialSavings] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/setup", {
        initialSavings: Number(initialSavings),
      });
      return data;
    },
    onSuccess: (data) => {
      updateUser(data.user);
      navigate("/", { replace: true });
    },
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (setupComplete) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-border bg-surface p-8 shadow-2xl animate-slide-up">
        <p className="text-xs uppercase tracking-[0.28em] text-incomeLight/70">First-time setup</p>
        <h1 className="mt-4 text-3xl font-black text-text">Welcome! Let&apos;s set up your tracker.</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          This is your starting balance. You can change it later.
        </p>

        <form
          className="mt-8"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-3 block text-sm text-text">What&apos;s your current savings? (₹)</span>
            <div className="flex items-center gap-4 rounded-[28px] border border-accent/30 bg-surface2 px-6 py-5">
              <span className="text-4xl font-black text-accent">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={initialSavings}
                onChange={(event) => setInitialSavings(event.target.value)}
                className="financial-number w-full bg-transparent text-4xl font-extrabold text-text outline-none placeholder:text-muted"
                placeholder="0.00"
                required
              />
            </div>
          </label>

          {mutation.error ? (
            <div className="mt-4 rounded-2xl border border-expense/20 bg-expense/10 px-4 py-3 text-sm text-expenseLight">
              {mutation.error.response?.data?.error || "Unable to finish setup"}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-4 text-sm font-black text-black shadow-accent hover:-translate-y-0.5"
          >
            <span>{mutation.isPending ? "Saving..." : "Start Tracking"}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
