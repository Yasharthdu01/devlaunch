// Client-side view of the logged-in user, their active organization and what
// they're allowed to do. The backend enforces every permission; this is only
// for deciding what to show.
import API_URL from './config'

export type OrgRole = 'org_admin' | 'developer' | 'client'

export interface SessionUser {
  id: number
  name: string
  email: string
  company_name?: string | null
  industry?: string | null
  role: string // legacy: 'admin' | 'developer' | 'client' | 'none'
  org_role: OrgRole | null
  is_super_admin: boolean
  org: { id: number; name: string; slug: string; status: string } | null
  orgs: { id: number; name: string; slug: string; role: OrgRole }[]
  permissions: string[]
}

export const ROLE_LABELS: Record<string, string> = {
  org_admin: 'Admin',
  developer: 'Developer',
  client: 'Client',
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('user')
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function saveSession(token: string | null, user: SessionUser) {
  try {
    if (token) localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event('session-changed'))
  } catch {}
}

export function can(user: SessionUser | null, permission: string): boolean {
  return Boolean(user?.permissions?.includes(permission))
}

// Where to land after login / signup.
export function homePathFor(user: SessionUser | null): string {
  if (!user) return '/login'
  if (user.is_super_admin && !user.org) return '/platform'
  if (user.org_role === 'org_admin' || user.is_super_admin) return '/admin'
  if (user.org_role === 'developer') return '/collab'
  return '/dashboard'
}

// Re-read roles from the server, so a role change or removal shows up
// without logging out. Returns null (and clears the session) if the token
// is no longer valid.
export async function refreshUser(): Promise<SessionUser | null> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return null
  try {
    const res = await fetch(API_URL + '/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
    if (!res.ok) return getStoredUser()
    const user = (await res.json()) as SessionUser
    saveSession(null, user)
    return user
  } catch {
    return getStoredUser()
  }
}
