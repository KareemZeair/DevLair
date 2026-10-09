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

export type Task = ScenarioSummary & {
  workType: string
  difficulty: string
  companyArea: string
  skills: string[]
  status: 'AVAILABLE' | 'COMPLETED'
  attempts: number
  bestScore: number
}

export type SkillEvidence = {
  skillKey: string
  bestScore: number
  completedTasks: number
}

export type InboxNotice = { title: string; message: string }

export type WorkspaceData = {
  tasks: Task[]
  skills: SkillEvidence[]
  inbox: InboxNotice[]
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

export type ContextFile = { path: string; content: string }
export type PullRequestDescription = { problem: string; solution: string; testing: string }
export type ScenarioHint = { order: number; title: string; content: string }

export type ScenarioDetail = {
  slug: string
  title: string
  summary: string
  pullRequestDescription: PullRequestDescription | null
  documents: ScenarioDocument[]
  files: ScenarioFile[]
  contextFiles: ContextFile[]
  hints: ScenarioHint[]
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
  recommendedCode: string | null
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
