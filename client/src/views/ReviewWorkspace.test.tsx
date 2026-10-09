import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReviewWorkspace } from './ReviewWorkspace'

const scenario = { slug: 'order-details-access', title: 'PR #184', summary: 'Review it.', pullRequestDescription: { problem: 'P', solution: 'S', testing: 'T' }, documents: [{ type: 'TICKET', title: 'SID-184', content: 'Ticket context.' }], files: [{ path: 'src/OrderService.java', originalContent: 'class A {}', proposedContent: 'class A {\n  void save() {}\n}', diff: [{ type: 'UNCHANGED' as const, originalLineNumber: 1, proposedLineNumber: 1, text: 'class A {' }, { type: 'ADDED' as const, originalLineNumber: null, proposedLineNumber: 2, text: '  void save() {}' }] }], contextFiles: [{ path: 'src/OrderRepository.java', content: 'interface OrderRepository {}' }], hints: [{ order: 1, title: 'Start', content: 'Read the ticket.' }] }

describe('ReviewWorkspace', () => {
  it('keeps hints optional and separates changed files from read-only codebase context', () => {
    render(<ReviewWorkspace session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} scenario={scenario} error={null} pending={false} onSubmit={vi.fn()} onReplayTour={vi.fn()} />)
    expect(screen.getByText('Pull request description')).toBeInTheDocument()
    expect(screen.getByText(/Open a hint only when you want support/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show a nudge' }))
    expect(screen.getByText('Read the ticket.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Files changed/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Add comment on line 2' }))
    expect(screen.getByLabelText('Comment on line 2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Codebase/ }))
    expect(screen.getByText('Read-only context')).toBeInTheDocument()
    expect(screen.getByText('interface OrderRepository {}')).toBeInTheDocument()
  })
})
