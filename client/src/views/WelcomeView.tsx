import { OperationsShell } from '../components/OperationsShell'

type WelcomeViewProps = {
  onRegister: () => void
  onLogin: () => void
}
export function WelcomeView({ onRegister, onLogin }: WelcomeViewProps) {
  return (
    <OperationsShell work="Join the engineering team" status="Orientation">
      <section className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <p className="eyebrow">Sidekick Supply Co. · B-tier hero support</p>
        <div className="guide-name"><img src="/assets/kilo-vale.png" alt="" /> Kilo Vale · senior developer</div>
        <h1 id="welcome-title">Keep the overlooked heroes equipped.</h1>
        <p className="intro">
          We are the scrappy equipment subsidiary that keeps the superhero league's B-tier heroes supplied, patched,
          and ready. Your job is to make sure the software behind every order holds up too.
        </p>
        <div className="assignment-preview">
          <span className="assignment-label">Your first pull request</span>
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
      </section>
    </OperationsShell>
  )
}

