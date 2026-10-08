import type { ReviewFeedback, ScenarioDetail } from '../types'

type FeedbackViewProps = {
  scenario: ScenarioDetail
  feedback: ReviewFeedback
  onReviewAgain: () => void
}

export function FeedbackView({ scenario, feedback, onReviewAgain }: FeedbackViewProps) {
  return (
    <main className="welcome-shell">
      <section className="welcome-card feedback-card" aria-labelledby="feedback-title">
        <p className="eyebrow">Review feedback</p>
        <h1 id="feedback-title">{scenario.title}</h1>
        <p className="intro">
          These results come from seeded findings in the scenario, not from an AI guessing whether a bug exists. A
          comment counts as found when it sits on the same file and inside the expected line range.
        </p>
        <FeedbackGroup title="Issues you found" items={feedback.found} empty="You did not match any seeded findings yet." />
        <FeedbackGroup title="Important issues you missed" items={feedback.missed} empty="You covered every seeded finding." />
        <section>
          <h2>Comments that did not match a known issue</h2>
          {feedback.unmatchedComments.length === 0 ? (
            <p>No extra comments.</p>
          ) : (
            <ul className="feedback-list">
              {feedback.unmatchedComments.map((comment) => (
                <li key={`${comment.filePath}-${comment.lineNumber}-${comment.body}`}>
                  <strong>
                    {comment.filePath}:{comment.lineNumber}
                  </strong>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <button type="button" onClick={onReviewAgain}>
          Review again
        </button>
      </section>
    </main>
  )
}

function FeedbackGroup({
  title,
  items,
  empty,
}: {
  title: string
  items: ReviewFeedback['found']
  empty: string
}) {
  return (
    <section>
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p>{empty}</p>
      ) : (
        <ul className="feedback-list">
          {items.map((item) => (
            <li key={item.title}>
              <span className="severity">{item.severity}</span>
              <strong>{item.title}</strong>
              <p>
                {item.filePath} lines {item.startLine}–{item.endLine}
              </p>
              <p>{item.explanation}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
