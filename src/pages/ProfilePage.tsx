import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, LogOut, Pencil, X } from 'lucide-react'
import { useAuth, useUid } from '../context/AuthContext'
import { ScreenHeader } from '../components/ui/ScreenHeader'
import { Avatar } from '../components/ui/Avatar'
import { Input } from '../components/ui/Input'
import { logout } from '../services/auth'
import { updateDisplayName } from '../services/user'

export default function ProfilePage() {
  const uid = useUid()
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  function startEditing() {
    setName(profile?.name ?? '')
    setEditing(true)
  }

  async function handleSaveName() {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await updateDisplayName(uid, trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      setLoggingOut(false)
    }
  }

  const photo = profile?.photoURL ?? user?.photoURL

  return (
    <div className="flex flex-col">
      <ScreenHeader title="Kharcha" onBack={() => navigate('/home')} />

      {/* Identity */}
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="relative">
          <Avatar name={profile?.name} photo={photo} size={104} />
          <button
            type="button"
            aria-label="Edit name"
            onClick={startEditing}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-on-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {editing ? (
          <div className="mt-4 flex w-full max-w-xs items-center gap-2">
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={40}
            />
            <button
              type="button"
              aria-label="Save name"
              onClick={handleSaveName}
              disabled={saving}
              className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary disabled:opacity-50"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Cancel"
              onClick={() => setEditing(false)}
              className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-on-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <h2 className="mt-4 text-headline-mobile text-on-surface">{profile?.name ?? 'User'}</h2>
        )}

        <p className="mt-1 text-body-lg text-on-surface-variant">{profile?.email ?? user?.email}</p>
      </div>

      {/* Account settings */}
      <div className="mt-7">
        <h3 className="mb-3 text-label-caps uppercase text-on-surface-variant">Account Settings</h3>
        <button
          type="button"
          onClick={startEditing}
          className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-surface-container p-4 transition-colors active:bg-surface-container-high"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
            <Pencil className="h-5 w-5 text-on-surface-variant" />
          </span>
          <span className="flex-1 text-left text-body-lg text-on-surface">Edit Name</span>
          <ChevronRight className="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-8 flex items-center justify-center gap-2 py-2 text-body-lg font-semibold text-secondary transition-opacity active:opacity-60 disabled:opacity-50"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  )
}
