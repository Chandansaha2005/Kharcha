import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    accent: "border-income/40 bg-income/10 text-incomeLight",
  },
  error: {
    icon: AlertCircle,
    accent: "border-expense/40 bg-expense/10 text-expenseLight",
  },
  warning: {
    icon: AlertTriangle,
    accent: "border-accent/40 bg-accent/10 text-yellow-100",
  },
  info: {
    icon: Info,
    accent: "border-sky-500/40 bg-sky-500/10 text-sky-100",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast))
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 220);
  }, []);

  const showToast = useCallback(
    ({ title, message, type = "info" }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, title, message, type, closing: false }]);

      window.setTimeout(() => dismissToast(id), 3000);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-24 right-4 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl ${
                style.accent
              } ${toast.closing ? "opacity-0 transition-opacity duration-200" : "animate-slide-in-right"}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/20">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-text">{toast.title}</p>
                  {toast.message ? <p className="mt-1 text-xs text-current/85">{toast.message}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-full p-1 text-current/75 hover:bg-black/20 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
};
