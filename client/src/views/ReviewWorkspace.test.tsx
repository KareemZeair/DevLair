import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReviewWorkspace } from './ReviewWorkspace'

const scenario = { slug: 'order-details-access', title: 'PR #184', summary: 'Review it.', documents: [{ type: 'TICKET', title: 'SID-184', content: 'Ticket context.' }], files: [{ path: 'src/OrderService.java', originalContent: 'class A {}', proposedContent: 'class A {\n  void save() {}\n}', diff: [{ type: 'UNCHANGED' as const, originalLineNumber: 1, proposedLineNumber: 1, text: 'class A {' }, { type: 'ADDED' as const, originalLineNumber: null, proposedLineNumber: 2, text: '  void save() {}' }] }] }

describe('ReviewWorkspace', () => {
  it('shows changed files and opens an inline comment from a diff line', () => {
    render(<ReviewWorkspace session={{ id: '1', email: 'dev@example.com', onboardingCompleted: true }} scenario={scenario} error={null} pending={false} onLogout={vi.fn()} onSubmit={vi.fn()} onReplayTour={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /Files changed/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Add comment on line 2' }))
    expect(screen.getByLabelText('Comment on line 2')).toBeInTheDocument()
  })
})
