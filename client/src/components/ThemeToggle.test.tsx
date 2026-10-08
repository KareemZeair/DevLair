import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    window.localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('uses the light fallback and persists a learner-selected dark theme', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('devlair-theme')).toBe('dark')
  })
})
