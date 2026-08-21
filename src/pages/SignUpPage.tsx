import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { authErrorMessage, signInWithGoogle, signUpWithEmail } from '../services/auth'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await signUpWithEmail(name.trim(), email.trim(), password)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      const msg = authErrorMessage(err)
      if (msg) setError(msg)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="app-shell min-h-screen px-margin pb-10 pt-4 bg-[#FDFBF7]">
      <ScreenHeader />
      <div className="mt-6">
        <h1 className="text-2xl font-black text-black">Create Account</h1>
        <p className="mt-2 text-sm font-bold text-gray-700">
          Start tracking your savings with Kharcha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Input
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailing={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((s) => !s)}
              className="text-black"
            >
              {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2.5} /> : <Eye className="h-5 w-5" strokeWidth={2.5} />}
            </button>
          }
        />

        {error && <p className="text-sm font-bold text-[#FF5A36]">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2">
          Create Account
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <div className="h-[2px] flex-1 bg-black" />
        <span className="text-xs font-black text-black">OR</span>
        <div className="h-[2px] flex-1 bg-black" />
      </div>

      <Button variant="ghost" onClick={handleGoogle} loading={googleLoading}>
        <GoogleIcon className="h-5 w-5" />
        Google sign-in
      </Button>

      <p className="mt-auto pt-8 text-center text-sm font-bold text-gray-700">
        Already have an account?{' '}
        <Link to="/signin" className="font-black text-black underline underline-offset-2">
          Sign In
        </Link>
      </p>
    </div>
  )
}
