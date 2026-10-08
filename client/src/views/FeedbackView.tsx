import { useState } from 'react'
import './FeedbackView.css'
import { JavaCodeLine } from '../components/JavaCodeLine'
import { MiloMessenger } from '../components/MiloMessenger'
import { OperationsShell } from '../components/OperationsShell'
import type { FindingFeedback, ReviewFeedback, ScenarioDetail } from '../types'

type FeedbackViewProps = { scenario: ScenarioDetail; feedback: ReviewFeedback; onReviewAgain: () => void }

export function FeedbackView({ scenario, feedback, onReviewAgain }: FeedbackViewProps) {
  return <OperationsShell mission="Review debrief" status="Mission report filed"><section className="welcome-shell"><section className="welcome-card feedback-card" aria-labelledby="feedback-title"><p className="eyebrow">Review debrief · Sidekick Supply Co.</p><h1 id="feedback-title">Mission report</h1><p className="intro">Here is the exact code each prepared finding covers and the safer direction for it.</p><section className="debrief-totals" aria-label="Review outcome"><div><strong>{feedback.found.length}</strong><span>found</span></div><div><strong>{feedback.missed.length}</strong><span>still open</span></div></section><FindingSection label="Found by your review" findings={feedback.found} scenario={scenario} state="found" /><FindingSection label="Still worth investigating" findings={feedback.missed} scenario={scenario} state="missed" />{feedback.unmatchedComments.length > 0 ? <details className="other-comments"><summary>Other comments ({feedback.unmatchedComments.length})</summary>{feedback.unmatchedComments.map((comment) => <p key={`${comment.filePath}-${comment.lineNumber}`}><code>{comment.filePath}:{comment.lineNumber}</code> - {comment.body}</p>)}</details> : null}<button type="button" onClick={onReviewAgain}>Return to pull request</button></section><MiloMessenger heading="Debrief complete" message="The report is compact on purpose: compare the submitted code with the safer version, then try again whenever you are ready." messageKey="review-feedback" /></section></OperationsShell>
}

function FindingSection({ label, findings, scenario, state }: { label: string; findings: FindingFeedback[]; scenario: ScenarioDetail; state: 'found' | 'missed' }) {
  if (findings.length === 0) return null
  return <section className="finding-section"><h2>{label}</h2>{findings.map((finding) => <FindingCard key={finding.title} finding={finding} scenario={scenario} state={state} />)}</section>
}

function FindingCard({ finding, scenario, state }: { finding: FindingFeedback; scenario: ScenarioDetail; state: 'found' | 'missed' }) {
  const [expanded, setExpanded] = useState(false)
  const file = scenario.files.find((candidate) => candidate.path === finding.filePath)
  const submittedCode = file?.proposedContent.split('\n').slice(finding.startLine - 1, finding.endLine).join('\n') ?? ''
  return <article className={`finding-card ${state} ${expanded ? 'is-expanded' : ''}`}><header><span className="severity">{finding.severity}</span><strong>{finding.title}</strong><small>{shortPath(finding.filePath)} · lines {finding.startLine}-{finding.endLine}</small></header><p>{finding.explanation}</p><div className="code-comparison"><CodeSample label="Submitted" code={submittedCode} /><CodeSample label="Corrected code" code={finding.recommendedCode} /></div><button className="expand-code" type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{expanded ? 'Use compact code view' : 'Enlarge code view'}</button></article>
}

function CodeSample({ label, code }: { label: string; code: string | null }) {
  return <section><span>{label}</span><pre>{code ? code.split('\n').map((line, index) => <span className="code-sample-line" key={index}><JavaCodeLine text={line} /></span>) : 'No code sample recorded.'}</pre></section>
}

function shortPath(path: string) { return path.split('/').slice(-1)[0] }
