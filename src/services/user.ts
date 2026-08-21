import { updateProfile, type User } from 'firebase/auth'
import { doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { UserProfile } from '../types'

/** Reference to the single balance document: users/{uid}/private/balance */
export function balanceRef(uid: string) {
  return doc(db, 'users', uid, 'private', 'balance')
}

export function userRef(uid: string) {
  return doc(db, 'users', uid)
}

/**
 * First-time setup: write the starting balance and mark setup complete.
 * Done as a batch so the balance and the setup flag commit together.
 */
export async function completeSetup(
  uid: string,
  cashBalance: number,
  onlineBalance: number,
): Promise<void> {
  const batch = writeBatch(db)
  batch.set(balanceRef(uid), {
    cashBalance,
    onlineBalance,
    totalBalance: cashBalance + onlineBalance,
    updatedAt: serverTimestamp(),
  })
  batch.set(
    userRef(uid),
    { setupCompleted: true, updatedAt: serverTimestamp() },
    { merge: true },
  )
  await batch.commit()
}

/**
 * Hardening: ensure the user's profile document exists and carries its identity
 * fields (name/email/photo). If the original sign-up write failed (network blip,
 * rules not yet deployed, etc.) the doc can be missing or partial — this backfills
 * the gaps from the authenticated user.
 *
 * - Writes with `merge`, so it never clobbers existing data (e.g. `setupCompleted`).
 * - Only writes when something is actually missing → no-op in the normal case and
 *   converges in one pass (the next snapshot is complete, so it won't re-trigger).
 */
export async function backfillProfile(user: User, existing: UserProfile | null): Promise<void> {
  const patch: Record<string, unknown> = {}

  if (!existing) {
    // Doc never got created — recreate it as a fresh, un-set-up profile.
    patch.id = user.uid
    patch.name = user.displayName || 'User'
    patch.email = user.email || ''
    patch.photoURL = user.photoURL ?? null
    patch.setupCompleted = false
    patch.createdAt = serverTimestamp()
  } else {
    if (!existing.name) patch.name = user.displayName || 'User'
    if (!existing.email) patch.email = user.email || ''
    if (existing.photoURL == null && user.photoURL) patch.photoURL = user.photoURL
  }

  if (Object.keys(patch).length === 0) return
  patch.updatedAt = serverTimestamp()
  await setDoc(userRef(user.uid), patch, { merge: true })
}

/** Update the user's display name in both Firestore and the Auth profile. */
export async function updateDisplayName(uid: string, name: string): Promise<void> {
  await setDoc(userRef(uid), { name, updatedAt: serverTimestamp() }, { merge: true })
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name })
  }
}
