import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div className="app-shell min-h-screen px-margin pb-10 pt-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Logo size={104} />
        <h1 className="wordmark mt-10 text-[34px]">Kharcha</h1>
        <p className="mt-5 max-w-[18rem] text-body-lg text-on-surface-variant">
          Track your savings. Control your spending.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate('/signin')}>Sign In</Button>
        <Button variant="secondary" onClick={() => navigate('/signup')}>
          Create Account
        </Button>
      </div>
    </div>
  )
}
