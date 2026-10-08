import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthView } from './AuthView'

describe('AuthView', () => {
  it('submits the email and password the learner typed', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<AuthView mode="login" error={null} pending={false} onSubmit={onSubmit} onBack={() => undefined} />)

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'dev@example.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onSubmit).toHaveBeenCalledWith('dev@example.com', 'password1')
  })

  it('shows an API error from the parent', () => {
    render(
      <AuthView
        mode="register"
        error="An account already exists for that email address."
        pending={false}
        onSubmit={async () => undefined}
        onBack={() => undefined}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('An account already exists for that email address.')
  })
})
