import type { ReviewFeedback, ScenarioDetail, ScenarioSummary, Session } from './types'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function readCookie(name: string): string | undefined {
  const prefix = `${name}=`
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const csrf = readCookie('XSRF-TOKEN')
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(csrf ? { 'X-XSRF-TOKEN': decodeURIComponent(csrf) } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : `Request failed (${response.status})`
    throw new ApiError(response.status, message)
  }

  return payload as T
}

let csrfReady: Promise<void> | undefined

export function ensureCsrfToken(): Promise<void> {
  csrfReady ??= request('/api/csrf').then(() => undefined)
  return csrfReady
}

export async function loadSession(): Promise<Session | null> {
  try {
    return await request<Session>('/api/auth/session')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}

export function register(email: string, password: string): Promise<{ id: string; email: string }> {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function login(email: string, password: string): Promise<Session> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function completeOnboarding(): Promise<Session> {
  return request('/api/auth/onboarding/complete', { method: 'POST' })
}

export function logout(): Promise<void> {
  return request('/api/auth/logout', { method: 'POST' })
}

export function listScenarios(): Promise<ScenarioSummary[]> {
  return request('/api/scenarios')
}

export function getScenario(slug: string): Promise<ScenarioDetail> {
  return request(`/api/scenarios/${slug}`)
}

export function submitReview(
  slug: string,
  comments: { filePath: string; lineNumber: number; body: string }[],
): Promise<ReviewFeedback> {
  return request(`/api/scenarios/${slug}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ comments }),
  })
}
