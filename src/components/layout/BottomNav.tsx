import { NavLink, useLocation } from 'react-router-dom'
import { Home, Calendar, Plus, HandCoins, User } from 'lucide-react'
import { cn } from '../../utils/cn'

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white border-[2.5px] border-black rounded-2xl p-2 shadow-[4px_4px_0px_#000000] z-50 flex items-center justify-between">
      {/* 1. Home */}
      <NavLink
        to="/home"
        aria-label="Home"
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            'flex flex-col items-center justify-center p-2 transition-colors',
            isActive || location.pathname === '/dashboard' ? 'text-[#10B981]' : 'text-black hover:opacity-75',
          )
        }
      >
        <Home className="h-6 w-6" strokeWidth={2.5} />
      </NavLink>

      {/* 2. Calendar */}
      <NavLink
        to="/calendar"
        aria-label="Calendar"
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            'flex flex-col items-center justify-center p-2 transition-colors',
            isActive ? 'text-[#10B981]' : 'text-black hover:opacity-75',
          )
        }
      >
        <Calendar className="h-6 w-6" strokeWidth={2.5} />
      </NavLink>

      {/* 3. Add (Center Oversized Floating FAB) */}
      <div className="relative flex justify-center">
        <NavLink
          to="/add"
          aria-label="Add Transaction"
          className="relative -top-6 w-14 h-14 bg-[#FFD200] border-[3px] border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-black"
        >
          <Plus className="h-7 w-7 text-black" strokeWidth={3.5} />
        </NavLink>
      </div>

      {/* 4. Lending */}
      <NavLink
        to="/lending"
        aria-label="Lending"
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            'flex flex-col items-center justify-center p-2 transition-colors',
            isActive ? 'text-[#10B981]' : 'text-black hover:opacity-75',
          )
        }
      >
        <HandCoins className="h-6 w-6" strokeWidth={2.5} />
      </NavLink>

      {/* 5. Profile */}
      <NavLink
        to="/profile"
        aria-label="Profile"
        className={({ isActive }: { isActive: boolean }) =>
          cn(
            'flex flex-col items-center justify-center p-2 transition-colors',
            isActive ? 'text-[#10B981]' : 'text-black hover:opacity-75',
          )
        }
      >
        <User className="h-6 w-6" strokeWidth={2.5} />
      </NavLink>
    </nav>
  )
}
