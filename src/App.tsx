import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute, SetupGate } from './components/auth/Guards'
import { AppLayout } from './components/layout/AppLayout'
import WelcomePage from './pages/WelcomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SetupPage from './pages/SetupPage'
import DashboardPage from './pages/DashboardPage'
import AddTransactionPage from './pages/AddTransactionPage'
import CalendarPage from './pages/CalendarPage'
import LendingPage from './pages/LendingPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      {/* Public auth screens — redirect away if already signed in */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* Authenticated area */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SetupGate />}>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/add" element={<AddTransactionPage />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<DashboardPage />} />
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/lending" element={<LendingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
