import { useState, type FormEvent } from 'react'
import { OperationsShell } from '../components/OperationsShell'

type AuthViewProps = {
  mode: 'register' | 'login'
  error: string | null
  pending: boolean
  onSubmit: (email: string, password: string) => Promise<void>
  onBack: () => void
}

export function AuthView({ mode, error, pending, onSubmit, onBack }: AuthViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const isRegister = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validate(email, password)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    await onSubmit(email, password)
  }

  function validateEmail(value: string) { setFieldErrors((current) => ({ ...current, email: validate(value, password).email })) }
  function validatePassword(value: string) { setFieldErrors((current) => ({ ...current, password: validate(email, value).password })) }

  return (
    <OperationsShell work={isRegister ? 'Create your account' : 'Return to the engineering team'} status="Secure sign in">
      <section className="welcome-shell">
      <section className="welcome-card" aria-labelledby="auth-title">
        <p className="eyebrow">Sidekick Supply Co.</p>
        <h1 id="auth-title">{isRegister ? 'Create your account' : 'Sign back in'}</h1>
        <p className="intro">
          {isRegister
            ? 'Create an account so your onboarding, completed work, and feedback stay attached to you.'
            : 'Use the email and password you registered with.'}
        </p>
      <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={(event) => validateEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email ? <span className="field-error" id="email-error" role="alert">{fieldErrors.email}</span> : null}
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={8}
              maxLength={72}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={(event) => validatePassword(event.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password ? <span className="field-error" id="password-error" role="alert">{fieldErrors.password}</span> : null}
          </label>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="button-row">
            <button type="submit" disabled={pending}>
              {pending ? 'Working…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
            <button type="button" className="secondary" onClick={onBack} disabled={pending}>
              Back
            </button>
          </div>
        </form>
      </section>
      </section>
    </OperationsShell>
  )
}

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {}
  const normalizedEmail = email.trim()
  if (!normalizedEmail) errors.email = 'Enter your email address so we can save your engineering progress.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) errors.email = 'Enter an email address in the format name@example.com.'
  if (!password) errors.password = 'Choose a password for your account.'
  else if (password.length < 8) errors.password = 'Your password needs at least 8 characters.'
  else if (password.length > 72) errors.password = 'Your password must be 72 characters or fewer.'
  return errors
}
