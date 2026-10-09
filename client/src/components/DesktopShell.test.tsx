import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DesktopShell } from './DesktopShell'

const task = { slug: 'order-details', title: 'PR #184 Order details access', summary: 'Review access.', workType: 'PULL_REQUEST_REVIEW', difficulty: 'FOUNDATION', companyArea: 'Orders', skills: ['security'], status: 'AVAILABLE' as const, attempts: 0, bestScore: 0 }

describe('DesktopShell', () => {
  it('launches real work, explains unavailable apps, and restores a minimized browser', () => {
    const navigate = vi.fn()
    render(<DesktopShell active="home" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} onNavigate={navigate} onOpenTask={vi.fn()} onLogout={vi.fn()}><p>Today content</p></DesktopShell>)
    expect(screen.getAllByRole('button', { name: 'Today' })).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /GitGrub/i }))
    expect(navigate).toHaveBeenCalledWith('work')
    fireEvent.click(screen.getByRole('button', { name: /Incident Desk/i }))
    expect(screen.getByRole('dialog')).toHaveTextContent('real alerts, logs, and timelines')
    fireEvent.click(screen.getByRole('button', { name: 'Back to desktop' }))
    fireEvent.click(screen.getByRole('button', { name: 'Minimize browser' }))
    expect(screen.getByLabelText('Sidekick Supply company browser')).toHaveClass('is-minimized')
    fireEvent.click(screen.getByRole('button', { name: /Sidekick Workspace/i }))
    expect(screen.getByLabelText('Sidekick Supply company browser')).not.toHaveClass('is-minimized')
  })

  it('opens a named GitGrub tab for a pull request', () => {
    const { rerender } = render(<DesktopShell active="home" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} onNavigate={vi.fn()} onOpenTask={vi.fn()} onLogout={vi.fn()}><p>Today content</p></DesktopShell>)
    rerender(<DesktopShell active="review" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} scenarioSlug={task.slug} scenarioTitle={task.title} onNavigate={vi.fn()} onOpenTask={vi.fn()} onLogout={vi.fn()}><p>Review content</p></DesktopShell>)
    expect(screen.getByRole('button', { name: `GitGrub · ${task.title}` })).toBeInTheDocument()
  })
})
