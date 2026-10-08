import { useState, type FormEvent } from 'react'

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
  const isRegister = mode === 'register'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="auth-title">
        <p className="eyebrow">Sidekick Supply Co.</p>
        <h1 id="auth-title">{isRegister ? 'Create your badge' : 'Sign back in'}</h1>
        <p className="intro">
          {isRegister
            ? 'Juno needs an account so your onboarding and reviews stay attached to you.'
            : 'Use the email and password you registered with.'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
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
            />
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
    </main>
  )
}
