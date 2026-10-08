import { useState } from 'react'
import type { ScenarioDetail, Session } from '../types'

type TourViewProps = {
  session: Session
  scenario: ScenarioDetail
  error: string | null
  pending: boolean
  onComplete: () => Promise<void>
}

export function TourView({ session, scenario, error, pending, onComplete }: TourViewProps) {
  const [step, setStep] = useState(0)
  const ticket = scenario.documents.find((document) => document.type === 'TICKET')
  const architecture = scenario.documents.find((document) => document.type === 'ARCHITECTURE')
  const steps = [
    {
      title: 'You are in the building now.',
      body: `Sidekick Supply Co. outfits people who respond to emergencies. ${session.email} is on the engineering roster. Orders, customers, and warehouse jobs all flow through a small Java/Spring API — not a maze of microservices.`,
    },
    {
      title: 'How we keep customer data boringly safe.',
      body: architecture?.content ?? 'Customer-owned queries must include the authenticated customer.',
    },
    {
      title: 'Your first ticket.',
      body: ticket?.content ?? scenario.summary,
    },
    {
      title: 'Then you review the diff.',
      body: 'You will see the proposed files, leave comments on specific lines, and submit. The platform already knows the important issues. It will tell you what you found, what you missed, and which comments did not match a known problem.',
    },
  ]
  const current = steps[step]
  const lastStep = step === steps.length - 1

  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="tour-title">
        <p className="eyebrow">Onboarding · {step + 1} / {steps.length}</p>
        <div className="juno-avatar" aria-hidden="true">
          J
        </div>
        <p className="guide-name">Juno · Junior Field Tester</p>
        <h1 id="tour-title">{current.title}</h1>
        <p className="intro">{current.body}</p>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="button-row">
          {step > 0 ? (
            <button type="button" className="secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : null}
          {lastStep ? (
            <button type="button" onClick={() => void onComplete()} disabled={pending}>
              {pending ? 'Saving…' : 'Open the pull request'}
            </button>
          ) : (
            <button type="button" onClick={() => setStep(step + 1)}>
              Next
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
