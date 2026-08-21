import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

/** Shell for the authenticated app: centered column + floating 5-button navbar. */
export function AppLayout() {
  return (
    <div className="app-shell">
      {/* Bottom padding leaves room for the floating navbar (pb-32 safeguard). */}
      <main className="flex-1 px-margin pb-32 pt-3">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
