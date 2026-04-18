import { useEffect, useRef } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import api from "../../api/axios";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useAuthStore } from "../../store/authStore";

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setupComplete, login } = useAuthStore();
  const hasVerifiedRef = useRef(false);

  const searchParams = new URLSearchParams(location.search);
  const magicToken = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get("/auth/verify", {
        params: {
          token: magicToken,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate(data.setupComplete ? "/" : "/setup", { replace: true });
    },
  });

  useEffect(() => {
    if (!token && magicToken && !hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      mutation.mutate();
    }
  }, [token, magicToken]);

  if (token) {
    return <Navigate to={setupComplete ? "/" : "/setup"} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-[28px] border border-border bg-surface p-8 text-center shadow-2xl">
        {!magicToken || mutation.isError ? (
          <div className="space-y-4">
            <p className="text-2xl font-black text-text">Link expired or invalid.</p>
            <p className="text-sm text-muted">Request a new one and try again.</p>
            <Link
              to="/login"
              className="inline-flex rounded-full border border-border px-5 py-3 text-sm text-text hover:border-income hover:text-income"
            >
              Back to login
            </Link>
          </div>
        ) : mutation.isPending ? (
          <LoadingSpinner label="Verifying your magic link..." />
        ) : (
          <LoadingSpinner label="Preparing your workspace..." />
        )}
      </div>
    </div>
  );
}
