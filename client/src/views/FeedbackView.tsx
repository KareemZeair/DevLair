import { useState } from 'react'
import './FeedbackView.css'
import { JavaCodeLine } from '../components/JavaCodeLine'
import { MiloMessenger } from '../components/MiloMessenger'
import { OperationsShell } from '../components/OperationsShell'
import type { FindingFeedback, ReviewFeedback, ScenarioDetail } from '../types'

type FeedbackViewProps = { scenario: ScenarioDetail; feedback: ReviewFeedback; onReviewAgain: () => void; onNextMission?: () => void; nextMissionTitle?: string }

export function FeedbackView({ scenario, feedback, onReviewAgain, onNextMission, nextMissionTitle }: FeedbackViewProps) {
  return <OperationsShell mission="Review debrief" status="Mission report filed"><section className="welcome-shell"><section className="welcome-card feedback-card" aria-labelledby="feedback-title"><p className="eyebrow">Review debrief · Sidekick Supply Co.</p><h1 id="feedback-title">Mission report</h1><p className="intro">Here is the exact code each prepared finding covers and the safer direction for it.</p><section className="debrief-totals" aria-label="Review outcome"><div><strong>{feedback.found.length}</strong><span>found</span></div><div><strong>{feedback.missed.length}</strong><span>still open</span></div></section><FindingSection label="Found by your review" findings={feedback.found} scenario={scenario} state="found" /><FindingSection label="Still worth investigating" findings={feedback.missed} scenario={scenario} state="missed" />{feedback.unmatchedComments.length > 0 ? <details className="other-comments"><summary>Other comments ({feedback.unmatchedComments.length})</summary>{feedback.unmatchedComments.map((comment) => <p key={`${comment.filePath}-${comment.lineNumber}`}><code>{comment.filePath}:{comment.lineNumber}</code> - {comment.body}</p>)}</details> : null}<div className="feedback-actions">{onNextMission ? <button type="button" onClick={onNextMission}>Start next mission: {nextMissionTitle}</button> : null}<button type="button" className="secondary" onClick={onReviewAgain}>Return to pull request</button></div></section><MiloMessenger heading="Debrief complete" message="The report is compact on purpose: compare the submitted code with the safer version, then try again whenever you are ready." messageKey="review-feedback" /></section></OperationsShell>
}

function FindingSection({ label, findings, scenario, state }: { label: string; findings: FindingFeedback[]; scenario: ScenarioDetail; state: 'found' | 'missed' }) {
  if (findings.length === 0) return null
  return <section className="finding-section"><h2>{label}</h2>{findings.map((finding) => <FindingCard key={finding.title} finding={finding} scenario={scenario} state={state} />)}</section>
}

function FindingCard({ finding, scenario, state }: { finding: FindingFeedback; scenario: ScenarioDetail; state: 'found' | 'missed' }) {
  const [expanded, setExpanded] = useState(false)
  const file = scenario.files.find((candidate) => candidate.path === finding.filePath)
  const submittedCode = file?.proposedContent.split('\n').slice(finding.startLine - 1, finding.endLine).join('\n') ?? ''
  return <article className={`finding-card ${state} ${expanded ? 'is-expanded' : ''}`}><header><span className="severity">{finding.severity}</span><strong>{finding.title}</strong><small>{shortPath(finding.filePath)} · lines {finding.startLine}-{finding.endLine}</small></header><p>{finding.explanation}</p><CodeComparison submittedCode={submittedCode} correctedCode={finding.recommendedCode} startLine={finding.startLine} /><button className="expand-code" type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>{expanded ? 'Use compact code view' : 'Enlarge code view'}</button></article>
}

function CodeComparison({ submittedCode, correctedCode, startLine }: { submittedCode: string; correctedCode: string | null; startLine: number }) {
  const submittedLines = codeLines(submittedCode, startLine)
  const correctedLines = codeLines(correctedCode, startLine)

  return <section className="teaching-diff" aria-label="Suggested code correction"><header className="teaching-diff__header"><strong>Suggested correction</strong><span>Remove the red lines, then add the green replacement.</span></header><div className="teaching-diff__rows" role="table" aria-label="Suggested code correction"><span className="sr-only">Red rows are submitted code to remove. Green rows are corrected replacement code to add.</span>{submittedLines.map((line) => <DiffLine line={line} state="removed" key={`removed-${line.number}`} />)}{correctedLines.length > 0 ? correctedLines.map((line) => <DiffLine line={line} state="added" key={`added-${line.number}`} />) : <p className="teaching-diff__missing">No corrected code was recorded.</p>}</div></section>
}

function DiffLine({ line, state }: { line: CodeLine; state: 'removed' | 'added' }) {
  return <div className={`teaching-diff__line ${state}`} role="row"><span className="teaching-diff__line-number">{line.number}</span><span className="teaching-diff__marker" aria-hidden="true">{state === 'removed' ? '-' : '+'}</span><code role="cell"><JavaCodeLine text={line.text} /></code></div>
}

type CodeLine = { number: number; text: string }

function codeLines(code: string | null, firstLineNumber: number): CodeLine[] {
  if (!code) return []
  return code.split('\n').map((text, index) => ({ number: firstLineNumber + index, text }))
}

function shortPath(path: string) { return path.split('/').slice(-1)[0] }
