type WelcomeViewProps = {
  onRegister: () => void
  onLogin: () => void
}

export function WelcomeView({ onRegister, onLogin }: WelcomeViewProps) {
  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <p className="eyebrow">Sidekick Supply Co. · Engineering</p>
        <div className="juno-avatar" aria-hidden="true">
          J
        </div>
        <p className="guide-name">Juno · Junior Field Tester</p>
        <h1 id="welcome-title">Welcome to the team.</h1>
        <p className="intro">
          We build dependable gear for people who run toward trouble. Your job is to make sure the software behind
          every order is just as dependable.
        </p>
        <div className="assignment-preview">
          <span className="assignment-label">Your first assignment</span>
          <strong>PR #184: Add order details for customers</strong>
          <p>Review a small change before the mobile team ships it.</p>
        </div>
        <div className="button-row">
          <button type="button" onClick={onRegister}>
            Create an account
          </button>
          <button type="button" className="secondary" onClick={onLogin}>
            I already have an account
          </button>
        </div>
      </section>
    </main>
  )
}
