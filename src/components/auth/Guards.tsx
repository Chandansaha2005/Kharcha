import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FullScreenLoader } from '../ui/Spinner'

/** Blocks unauthenticated users; sends them to the welcome screen. */
export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!user) return <Navigate to="/" replace />
  return <Outlet />
}

/**
 * Enforces the first-time setup step.
 * - If setup not complete -> redirect to /setup (unless already there).
 * Assumes it is nested inside ProtectedRoute, so a user always exists.
 */
export function SetupGate() {
  const { profile, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullScreenLoader />

  const setupDone = profile?.setupCompleted === true
  const onSetup = location.pathname === '/setup'

  if (!setupDone && !onSetup) return <Navigate to="/setup" replace />
  if (setupDone && onSetup) return <Navigate to="/home" replace />
  return <Outlet />
}

/** Redirects already-authenticated users away from the public auth screens. */
export function PublicOnlyRoute() {
  const { user, profile, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to={profile?.setupCompleted ? '/home' : '/setup'} replace />
  return <Outlet />
}
