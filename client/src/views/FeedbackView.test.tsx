import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeedbackView } from './FeedbackView'
import type { ReviewFeedback, ScenarioDetail } from '../types'

const scenario: ScenarioDetail = {
  slug: 'order-details-access',
  title: 'PR #184: Add order details for customers',
  summary: 'Review the change.',
  documents: [],
  files: [{
    path: 'src/OrderService.java',
    originalContent: '',
    proposedContent: Array.from({ length: 15 }, (_, index) => `submitted line ${index + 1}`).join('\n'),
    diff: [],
  }],
}

const feedback: ReviewFeedback = {
  found: [
    {
      filePath: 'src/OrderService.java',
      startLine: 13,
      endLine: 15,
      severity: 'HIGH',
      title: 'Order lookup is not scoped to the authenticated customer',
      explanation: 'Pass the customer id.',
      recommendedCode: 'repo.findByIdAndCustomerId(orderId, customerId);',
    },
  ],
  missed: [
    {
      filePath: 'src/OrderServiceTest.java',
      startLine: 10,
      endLine: 19,
      severity: 'MEDIUM',
      title: 'The test does not prove customer ownership is enforced',
      explanation: 'Add a negative test.',
      recommendedCode: 'assertThatThrownBy(() -> service.getOrderDetails(otherCustomerId, orderId));',
    },
  ],
  unmatchedComments: [{ filePath: 'src/OrderService.java', lineNumber: 1, body: 'Rename this class.' }],
}

describe('FeedbackView', () => {
  it('separates found, missed, and unmatched comments', () => {
    render(<FeedbackView scenario={scenario} feedback={feedback} onReviewAgain={() => undefined} />)

    expect(screen.getByText('Order lookup is not scoped to the authenticated customer')).toBeInTheDocument()
    expect(screen.getByText('The test does not prove customer ownership is enforced')).toBeInTheDocument()
    expect(screen.getAllByText(/submitted line/)).toHaveLength(3)
    expect(screen.getAllByText('Corrected code')).toHaveLength(2)
    fireEvent.click(screen.getAllByRole('button', { name: 'Enlarge code view' })[0])
    expect(screen.getByRole('button', { name: 'Use compact code view' })).toBeInTheDocument()
    expect(screen.getByText('Other comments (1)')).toBeInTheDocument()
  })
})
