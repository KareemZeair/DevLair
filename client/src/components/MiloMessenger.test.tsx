import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MiloMessenger } from './MiloMessenger'

describe('MiloMessenger', () => {
  it('can be minimized, reopened, and mute alerts', () => {
    render(<MiloMessenger heading="A dispatch" message="Read the ticket." messageKey="ticket" />)
    fireEvent.click(screen.getByRole('button', { name: "Minimize Milo's message" }))
    expect(screen.getByRole('button', { name: 'New message from Milo' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'New message from Milo' }))
    fireEvent.click(screen.getByRole('button', { name: '🔊 Alerts on' }))
    expect(screen.getByRole('button', { name: '🔇 Alerts muted' })).toHaveAttribute('aria-pressed', 'true')
  })
})
