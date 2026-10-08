import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('explains invalid email and short password before submitting', () => {
    const onSubmit = vi.fn()
    const view = render(<AuthView mode="register" error={null} pending={false} onSubmit={onSubmit} onBack={() => undefined} />)
    const form = within(view.container)
    fireEvent.change(form.getByLabelText('Email'), { target: { value: 'not-an-email' } })
    fireEvent.change(form.getByLabelText('Password'), { target: { value: 'short' } })
    fireEvent.click(form.getByRole('button', { name: 'Create account' }))
    expect(form.getByText('Enter an email address in the format name@example.com.')).toBeInTheDocument()
    expect(form.getByText('Your password needs at least 8 characters.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
