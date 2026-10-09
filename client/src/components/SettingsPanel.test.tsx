import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  beforeEach(() => { window.localStorage.clear(); delete document.documentElement.dataset.theme })

  it('persists display and alert preferences', () => {
    render(<SettingsPanel onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Night shift' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('devlair-theme')).toBe('dark')
    fireEvent.click(screen.getByRole('checkbox', { name: /Kilo message sounds/i }))
    expect(window.localStorage.getItem('devlair-kilo-muted')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Reduce motion' }))
    expect(document.documentElement.dataset.motion).toBe('reduce')
  })

  it('requests browser fullscreen from a learner action', () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(document.documentElement, 'requestFullscreen', { configurable: true, value: requestFullscreen })
    render(<SettingsPanel onClose={vi.fn()} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Enter fullscreen' }).at(-1)!)
    expect(requestFullscreen).toHaveBeenCalled()
  })
})
