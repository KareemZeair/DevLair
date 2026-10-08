import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const storageKey = 'devlair-theme'

function preferredTheme(): Theme {
  const saved = window.localStorage.getItem(storageKey)
  if (saved === 'light' || saved === 'dark') return saved
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(preferredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(storageKey, theme)
  }, [theme])

  return <button className="theme-toggle icon-button" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
    <span aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span><span>{theme === 'light' ? 'Night shift' : 'Day shift'}</span>
  </button>
}
