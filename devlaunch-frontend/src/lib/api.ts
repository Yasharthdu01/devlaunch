const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function getToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('token') || ''
}

export function getAuthHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  })
}