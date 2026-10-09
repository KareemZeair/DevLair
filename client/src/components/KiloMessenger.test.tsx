import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { KiloMessenger } from './KiloMessenger'

describe('KiloMessenger', () => {
  it('can be minimized, reopened, and mute alerts', () => {
    render(<KiloMessenger heading="A pull request" message="Read the ticket." messageKey="ticket" />)
    fireEvent.click(screen.getByRole('button', { name: "Minimize Kilo's message" }))
    expect(screen.getByRole('button', { name: 'New message from Kilo' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'New message from Kilo' }))
    fireEvent.click(screen.getByRole('button', { name: '🔊 Alerts on' }))
    expect(screen.getByRole('button', { name: '🔇 Alerts muted' })).toHaveAttribute('aria-pressed', 'true')
  })
})
