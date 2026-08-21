import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

/** Shell for the authenticated app: centered column + floating bottom nav. */
export function AppLayout() {
  return (
    <div className="app-shell">
      {/* Bottom padding leaves room for the floating nav (80px + safe area). */}
      <main className="flex-1 px-margin pb-28 pt-3">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
