import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PersonalDeskView } from './PersonalDeskView'

describe('PersonalDeskView', () => {
  it('opens the workstation from the accessible monitor control and shows the employee plaque', () => {
    const openWorkstation = vi.fn()
    render(<PersonalDeskView session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} data={{ tasks: [], skills: [], inbox: [] }} onOpenWorkstation={openWorkstation} onLogout={vi.fn()} />)
    expect(screen.getByLabelText('Employee desk plaque')).toHaveTextContent('SOFTWARE DEVELOPER')
    fireEvent.click(screen.getByRole('button', { name: /Open Workstation/i }))
    expect(openWorkstation).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Enter Workstation' }))
    expect(openWorkstation).toHaveBeenCalledTimes(2)
  })
})
