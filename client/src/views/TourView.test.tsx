import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TourView } from './TourView'

const scenario = { slug: 'order-details-access', title: 'PR #184', summary: 'Review it.', documents: [
  { type: 'TICKET', title: 'SID-184', content: 'Customers need their receipt.' },
  { type: 'ARCHITECTURE', title: 'Order rule', content: 'Customer queries include customer ID.' },
], pullRequestDescription: null, files: [{ path: 'src/OrderService.java', originalContent: '', proposedContent: '', diff: [] }], contextFiles: [], hints: [] }

describe('TourView', () => {
  it("advances Kilo's briefing and moves the tutorial spotlight", () => {
    render(<TourView session={{ id: '1', email: 'dev@example.com', onboardingCompleted: false }} scenario={scenario} error={null} pending={false} onComplete={vi.fn()} />)
    expect(screen.getByText('Welcome to the engineering team.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'What is DevLair, exactly?' }))
    expect(screen.getByText('This is practice through real work.')).toBeInTheDocument()
    expect(screen.getByAltText('Illustrated Sidekick Supply Co. storefront with equipment products')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show me the pull request task' }))
    expect(screen.getByText('Every review starts with the “why.”')).toBeInTheDocument()
    expect(screen.getByText('SID-184')).toBeInTheDocument()
  })
})
