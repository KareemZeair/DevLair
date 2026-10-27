import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DesktopShell } from './DesktopShell'

const task = { slug: 'order-details', title: 'PR #184 Order details access', summary: 'Review access.', workType: 'PULL_REQUEST_REVIEW', difficulty: 'FOUNDATION', companyArea: 'Orders', skills: ['security'], status: 'AVAILABLE' as const, attempts: 0, bestScore: 0 }

describe('DesktopShell', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(cleanup)

  it('launches real work, explains unavailable apps, and restores a minimized browser', () => {
    const navigate = vi.fn()
    render(<DesktopShell active="home" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} onNavigate={navigate} onOpenTask={vi.fn()} onReturnToDesk={vi.fn()} onLogout={vi.fn()}><p>Today content</p></DesktopShell>)
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
    const { rerender } = render(<DesktopShell active="home" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} onNavigate={vi.fn()} onOpenTask={vi.fn()} onReturnToDesk={vi.fn()} onLogout={vi.fn()}><p>Today content</p></DesktopShell>)
    rerender(<DesktopShell active="review" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} scenarioSlug={task.slug} scenarioTitle={task.title} onNavigate={vi.fn()} onOpenTask={vi.fn()} onReturnToDesk={vi.fn()} onLogout={vi.fn()}><p>Review content</p></DesktopShell>)
    expect(screen.getByRole('button', { name: `GitGrub · ${task.title}` })).toBeInTheDocument()
  })

  it('maximizes without starting a drag and restores the saved window position', () => {
    window.localStorage.setItem('devlair-workstation-layout-v1', JSON.stringify({ x: 160, y: 96, minimized: false, maximized: false }))
    renderDesktop()
    const browser = screen.getByLabelText('Sidekick Supply company browser')
    const titlebar = browser.querySelector<HTMLElement>('.browser-titlebar')!
    const capture = vi.fn()
    titlebar.setPointerCapture = capture

    expect(browser).toHaveStyle({ left: '160px', top: '96px' })
    const maximize = screen.getByRole('button', { name: 'Maximize browser' })
    pointerEvent('pointerdown', maximize)
    expect(capture).not.toHaveBeenCalled()
    pointerEvent('pointerup', maximize)
    fireEvent.click(maximize)

    expect(browser).toHaveClass('is-maximized')
    expect(browser.style.left).toBe('')
    expect(browser.style.top).toBe('')
    expect(JSON.parse(window.localStorage.getItem('devlair-workstation-layout-v1')!)).toMatchObject({ maximized: true })

    const restore = screen.getByRole('button', { name: 'Restore browser' })
    pointerEvent('pointerdown', restore)
    pointerEvent('pointerup', restore)
    fireEvent.click(restore)
    expect(browser).not.toHaveClass('is-maximized')
    expect(browser).toHaveStyle({ left: '160px', top: '96px' })
  })

  it('keeps the minimize control out of the draggable title bar', () => {
    renderDesktop()
    const browser = screen.getByLabelText('Sidekick Supply company browser')
    const titlebar = browser.querySelector<HTMLElement>('.browser-titlebar')!
    const capture = vi.fn()
    titlebar.setPointerCapture = capture

    const minimize = screen.getByRole('button', { name: 'Minimize browser' })
    pointerEvent('pointerdown', minimize)
    expect(capture).not.toHaveBeenCalled()
    pointerEvent('pointerup', minimize)
    fireEvent.click(minimize)
    expect(browser).toHaveClass('is-minimized')
  })

  it('still drags from the title text and stops moving when the pointer is released', () => {
    renderDesktop()
    const browser = screen.getByLabelText('Sidekick Supply company browser')
    const titlebar = browser.querySelector<HTMLElement>('.browser-titlebar')!
    const capture = vi.fn()
    titlebar.setPointerCapture = capture

    pointerEvent('pointerdown', titlebar.querySelector('strong')!, 200, 150)
    expect(capture).toHaveBeenCalledWith(1)
    pointerEvent('pointermove', titlebar, 240, 190)
    expect(browser).toHaveStyle({ left: '112px', top: '92px' })
    pointerEvent('pointerup', titlebar)
    pointerEvent('pointermove', titlebar, 260, 210)
    expect(browser).toHaveStyle({ left: '112px', top: '92px' })
  })
})

function renderDesktop() {
  return render(<DesktopShell active="home" session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} tasks={[task]} onNavigate={vi.fn()} onOpenTask={vi.fn()} onReturnToDesk={vi.fn()} onLogout={vi.fn()}><p>Today content</p></DesktopShell>)
}

// jsdom does not implement pointer capture or the full PointerEvent constructor.
function pointerEvent(type: string, target: Element, clientX = 0, clientY = 0) {
  const event = Object.assign(new Event(type, { bubbles: true }), { pointerId: 1, button: 0, clientX, clientY })
  fireEvent(target, event)
}
