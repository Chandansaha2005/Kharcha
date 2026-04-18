import { useQuery } from "@tanstack/react-query";
import { Outlet, Route, Routes } from "react-router-dom";

import api from "./api/axios";
import LoginPage from "./components/Auth/LoginPage";
import SetupPage from "./components/Auth/SetupPage";
import VerifyPage from "./components/Auth/VerifyPage";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import AddExpenseModal from "./components/Transactions/AddExpenseModal";
import AddIncomeModal from "./components/Transactions/AddIncomeModal";
import QuickAddModal from "./components/Transactions/QuickAddModal";
import FloatingActionButton from "./components/Shared/FloatingActionButton";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import CalendarPage from "./pages/Calendar";
import DashboardPage from "./pages/Dashboard";
import IncomePage from "./pages/Income";
import PendingPage from "./pages/Pending";
import TransactionsPage from "./pages/Transactions";
import { useAuthStore } from "./store/authStore";
import { useState } from "react";

function AppLayout() {
  const { token, setupComplete } = useAuthStore();
  const [expenseModal, setExpenseModal] = useState({ open: false, pendingExpense: null });
  const [incomeModal, setIncomeModal] = useState({ open: false, incomeSource: null });
  const [quickOpen, setQuickOpen] = useState(false);

  const summaryQuery = useQuery({
    queryKey: ["layout-summary"],
    enabled: Boolean(token && setupComplete),
    queryFn: async () => {
      const { data } = await api.get("/dashboard/summary");
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar balance={summaryQuery.data?.totalBalance || 0} />
      <div className="min-h-screen lg:pl-60">
        <main className="mx-auto min-h-screen max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
          <Outlet
            context={{
              openExpenseModal: (pendingExpense = null) => setExpenseModal({ open: true, pendingExpense }),
              openIncomeModal: (incomeSource = null) => setIncomeModal({ open: true, incomeSource }),
              openQuickAddModal: () => setQuickOpen(true),
            }}
          />
        </main>
        <Navbar />
        <FloatingActionButton
          onOpenExpense={() => setExpenseModal({ open: true, pendingExpense: null })}
          onOpenIncome={() => setIncomeModal({ open: true, incomeSource: null })}
          onOpenQuick={() => setQuickOpen(true)}
        />
      </div>

      {expenseModal.open ? (
        <AddExpenseModal
          pendingExpense={expenseModal.pendingExpense}
          onClose={() => setExpenseModal({ open: false, pendingExpense: null })}
        />
      ) : null}

      {incomeModal.open ? (
        <AddIncomeModal
          incomeSource={incomeModal.incomeSource}
          onClose={() => setIncomeModal({ open: false, incomeSource: null })}
        />
      ) : null}

      {quickOpen ? <QuickAddModal onClose={() => setQuickOpen(false)} /> : null}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/verify" element={<VerifyPage />} />
      <Route
        path="/setup"
        element={
          <ProtectedRoute requireSetup={false}>
            <SetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="pending" element={<PendingPage />} />
      </Route>
    </Routes>
  );
}
