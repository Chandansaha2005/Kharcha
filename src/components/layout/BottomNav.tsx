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
    <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-white border-[3px] border-black rounded-full p-2 shadow-[6px_6px_0px_#000000] flex justify-around items-center">
      {ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          aria-label={label}
          className={({ isActive }) =>
            cn(
              'flex items-center justify-center transition-all',
              isActive
                ? 'bg-[#FFD200] border-2 border-black rounded-full p-2.5 shadow-[2px_2px_0px_#000000] text-black'
                : 'p-2.5 text-black hover:opacity-70',
            )
          }
        >
          <Icon className="h-6 w-6" strokeWidth={2.5} />
        </NavLink>
      ))}
    </nav>
  )
}
