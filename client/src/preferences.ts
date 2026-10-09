export type ThemePreference = 'system' | 'light' | 'dark'
export type MotionPreference = 'system' | 'reduce'

export const preferenceKeys = {
  theme: 'devlair-theme',
  muted: 'devlair-kilo-muted',
  motion: 'devlair-motion',
} as const

export function readThemePreference(): ThemePreference {
  const saved = window.localStorage.getItem(preferenceKeys.theme)
  return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
}

export function applyThemePreference(preference: ThemePreference) {
  const systemDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.dataset.theme = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
  window.localStorage.setItem(preferenceKeys.theme, preference)
}

export function readMotionPreference(): MotionPreference {
  return window.localStorage.getItem(preferenceKeys.motion) === 'reduce' ? 'reduce' : 'system'
}

export function applyMotionPreference(preference: MotionPreference) {
  document.documentElement.dataset.motion = preference
  window.localStorage.setItem(preferenceKeys.motion, preference)
}

export function readAlertsMuted() { return window.localStorage.getItem(preferenceKeys.muted) === 'true' }

export function setAlertsMuted(muted: boolean) {
  window.localStorage.setItem(preferenceKeys.muted, String(muted))
  window.dispatchEvent(new Event('devlair-preferences-change'))
}
