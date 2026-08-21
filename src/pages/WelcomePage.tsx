import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div className="app-shell min-h-screen px-margin pb-8 pt-6 bg-[#FDFBF7] flex flex-col justify-between items-center select-none">
      {/* Top Header: Logo + App Name + Tagline */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">
            KHARCHA
          </h1>
        </div>
        <p className="mt-2 text-sm font-bold text-gray-700">
          Track your savings. Control your spending.
        </p>
      </div>

      {/* Center Hero Section: Full size hero illustration filling available space */}
      <div className="flex-1 flex items-center justify-center w-full my-2">
        <img
          src="/icons/hero.png"
          alt="Kharcha Hero Illustration"
          className="w-full max-h-[70vh] object-contain mix-blend-multiply pointer-events-none drop-shadow-sm"
        />
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Button onClick={() => navigate('/signin')}>Sign In</Button>
        <Button variant="ghost" onClick={() => navigate('/signup')}>
          Create Account
        </Button>
      </div>
    </div>
  )
}