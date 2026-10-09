import { useEffect, useState } from 'react'
import { applyThemePreference, readThemePreference, type ThemePreference } from '../preferences'

// Onboarding sits outside the signed-in desktop, so it keeps one compact display control.
export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>(readThemePreference)
  useEffect(() => { applyThemePreference(theme) }, [theme])
  const next = theme === 'dark' ? 'light' : 'dark'
  return <button className="theme-toggle icon-button" type="button" onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`}><span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span><span>{theme === 'dark' ? 'Day shift' : 'Night shift'}</span></button>
}
