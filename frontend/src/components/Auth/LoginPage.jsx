import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import api from "../../api/axios";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useAuthStore } from "../../store/authStore";

export default function LoginPage() {
  const { token, setupComplete } = useAuthStore();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const configQuery = useQuery({
    queryKey: ["public-config"],
    queryFn: async () => {
      const { data } = await api.get("/auth/config");
      return data;
    },
  });

  useEffect(() => {
    if (configQuery.data?.ownerEmail) {
      setEmail(configQuery.data.ownerEmail);
    }
  }, [configQuery.data?.ownerEmail]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/request-magic-link", payload);
      return data;
    },
    onSuccess: () => {
      setSuccess(true);
    },
  });

  if (token) {
    return <Navigate to={setupComplete ? "/" : "/setup"} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md animate-slide-up rounded-[28px] border border-border bg-surface p-8 shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[radial-gradient(circle_at_top,#4ade80,#14532d_72%)] text-4xl font-black text-white shadow-income">
          ₹
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-black text-text">{configQuery.data?.appName || "ExpenseTracker"}</h1>
          <p className="mt-2 text-sm text-muted">Track. Understand. Improve.</p>
        </div>

        {configQuery.isLoading ? (
          <div className="mt-10">
            <LoadingSpinner label="Loading login..." />
          </div>
        ) : success ? (
          <div className="mt-10 rounded-3xl border border-income/25 bg-income/10 p-6 text-center animate-bounce-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-income/15 text-income">
              <Mail size={24} />
            </div>
            <p className="mt-4 text-lg font-black text-text">Check your inbox.</p>
            <p className="mt-2 text-sm text-muted">Link expires in 15 minutes.</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-5 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted hover:border-income hover:text-income"
            >
              Send again
            </button>
          </div>
        ) : (
          <form
            className="mt-10 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              mutation.mutate({ email });
            }}
          >
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-muted">Owner Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border bg-surface2 px-4 py-4 text-base text-text outline-none focus:border-income focus:ring-2 focus:ring-income/20"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            {mutation.error ? (
              <div className="rounded-2xl border border-expense/20 bg-expense/10 px-4 py-3 text-sm text-expenseLight">
                {mutation.error.response?.data?.error || "Unable to send magic link"}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-income px-4 py-4 text-sm font-black text-black shadow-income hover:-translate-y-0.5"
            >
              {mutation.isPending ? (
                <span className="h-5 w-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              ) : (
                <Send size={18} />
              )}
              <span>{mutation.isPending ? "Sending..." : "Send Magic Link"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
