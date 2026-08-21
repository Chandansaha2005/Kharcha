import { NavLink } from 'react-router-dom'
import { Home, Plus, HandCoins, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

const ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/add', label: 'Add', icon: Plus },
  { to: '/lending', label: 'Lending', icon: HandCoins },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-app px-margin"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="flex items-center justify-between border-2 border-outline bg-surface-container-high px-3 py-3"
        style={{ boxShadow: '5px 5px 0 0 #000' }}
      >
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex h-12 min-w-12 items-center justify-center border-2 px-4 transition-colors',
                isActive
                  ? 'border-black bg-primary text-on-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface',
              )
            }
          >
            <Icon className="h-6 w-6" strokeWidth={2.25} />
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
