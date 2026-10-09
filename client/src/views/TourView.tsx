import { useMemo, useState } from 'react'
import { KiloMessenger } from '../components/KiloMessenger'
import { OperationsShell } from '../components/OperationsShell'
import type { ScenarioDetail, Session } from '../types'

type TourViewProps = { session: Session; scenario: ScenarioDetail; error: string | null; pending: boolean; onComplete: () => Promise<void> }
type TourStep = { target: 'welcome' | 'product' | 'ticket' | 'architecture' | 'review'; heading: string; message: string; choice: string }

export function TourView({ session, scenario, error, pending, onComplete }: TourViewProps) {
  const [step, setStep] = useState(0)
  const ticket = scenario.documents.find((document) => document.type === 'TICKET')
  const architecture = scenario.documents.find((document) => document.type === 'ARCHITECTURE')
  const steps = useMemo<TourStep[]>(() => [
    { target: 'welcome', heading: 'Welcome to the engineering team.', message: `Hey ${session.email}. Sidekick Supply Co. builds dependable equipment for working heroes. You are joining the software team that keeps orders, inventory, and customer data working. I am Kilo, your senior developer.`, choice: 'What is DevLair, exactly?' },
    { target: 'product', heading: 'This is practice through real work.', message: 'DevLair teaches engineering through believable tasks. Sidekick Supply Co. is a fictional company with a codebase built for pull request reviews like this. You get context, make your call, then learn from the review feedback.', choice: 'Show me the pull request task' },
    { target: 'ticket', heading: 'Every review starts with the “why.”', message: ticket?.content ?? scenario.summary, choice: 'Show me the rule behind it' },
    { target: 'architecture', heading: 'Here is the rule we cannot break.', message: `${architecture?.content ?? 'Customer-owned queries must include the authenticated customer.'} You do not need to memorize every class. Follow the path and ask: does this change still respect the rule?`, choice: 'Take me to the pull request' },
    { target: 'review', heading: 'The pull request is ready.', message: 'You will inspect the changed files like a real pull request. Click a blue line number when you spot a concern, explain the risk, then submit your review. No code editing in this task. I have enough loose screws to track already.', choice: 'Open PR #184' },
  ], [architecture?.content, scenario.summary, session.email, ticket?.content])
  const current = steps[step]
  const isFinal = step === steps.length - 1
  const advance = () => isFinal ? void onComplete() : setStep((currentStep) => currentStep + 1)

  return <OperationsShell work="First pull request review" status={`Briefing ${step + 1} of ${steps.length}`}>
    <section className="tour-workspace">
      <header className="tour-header"><div><p>DAY ONE · ENGINEERING ORIENTATION</p><h1>Your first task</h1><span className="tour-progress">{step + 1} / {steps.length} briefing cards</span></div></header>
      <div className="tour-content">
        <section className={`tour-panel mission-panel ${current.target === 'welcome' ? 'spotlighted' : ''}`}><span className="panel-label">ENGINEERING TEAM</span><h2>Keep every hero’s gear order private.</h2><p>Before an order-detail change reaches the mobile team, you are the last engineering set of eyes on it.</p><div className="mission-stat"><span>Pull request</span><strong>{scenario.title}</strong></div></section>
        <section className={`tour-panel product-brief ${current.target === 'product' ? 'spotlighted' : ''}`}><span className="panel-label">How DevLair works</span><h2>Learn through a real-world loop.</h2><p>Sidekick Supply Co. runs an online store for practical hero equipment. The engineering team keeps customers, orders, inventory, and replacement requests working safely.</p><img src="/assets/sidekick-storefront-preview.png" alt="Illustrated Sidekick Supply Co. storefront with equipment products" /><div className="flow-map"><span>Context</span><b>→</b><span>Review</span><b>→</b><span>Feedback</span></div></section>
        <section className={`tour-panel ${current.target === 'ticket' ? 'spotlighted' : ''}`}><span className="panel-label">01 · CUSTOMER REQUEST</span><h2>{ticket?.title ?? 'Ticket'}</h2><p>{ticket?.content ?? scenario.summary}</p></section>
        <section className={`tour-panel ${current.target === 'architecture' ? 'spotlighted' : ''}`}><span className="panel-label">02 · System rule</span><h2>{architecture?.title ?? 'Order service boundary'}</h2><p>{architecture?.content}</p><div className="flow-map"><span>Customer</span><b>→</b><span>Controller</span><b>→</b><span>Service</span><b>→</b><span>Repository</span></div></section>
        <section className={`tour-panel pr-preview ${current.target === 'review' ? 'spotlighted' : ''}`}><span className="panel-label">03 · Pull request ready</span><h2>{scenario.title}</h2><p>{scenario.files.length} changed files · line-by-line review enabled</p><ul>{scenario.files.map((file) => <li key={file.path}><span className="file-status">M</span>{file.path}</li>)}</ul></section>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <KiloMessenger heading={current.heading} message={current.message} messageKey={current.target} actionLabel={pending ? 'Saving your progress…' : current.choice} onAction={advance} />
    </section>
  </OperationsShell>
}
