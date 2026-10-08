export type Session = {
  id: string
  email: string
  onboardingCompleted: boolean
}

export type ScenarioSummary = {
  slug: string
  title: string
  summary: string
}

export type ScenarioDocument = {
  type: string
  title: string
  content: string
}

export type DiffLine = {
  type: 'UNCHANGED' | 'ADDED' | 'REMOVED'
  originalLineNumber: number | null
  proposedLineNumber: number | null
  text: string
}

export type ScenarioFile = {
  path: string
  originalContent: string
  proposedContent: string
  diff: DiffLine[]
}

export type ScenarioDetail = {
  slug: string
  title: string
  summary: string
  documents: ScenarioDocument[]
  files: ScenarioFile[]
}

export type DraftComment = {
  filePath: string
  lineNumber: number
  body: string
}

export type FindingFeedback = {
  filePath: string
  startLine: number
  endLine: number
  severity: string
  title: string
  explanation: string
}

export type UnmatchedComment = {
  filePath: string
  lineNumber: number
  body: string
}

export type ReviewFeedback = {
  found: FindingFeedback[]
  missed: FindingFeedback[]
  unmatchedComments: UnmatchedComment[]
}
