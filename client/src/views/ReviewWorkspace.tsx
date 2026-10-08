import { useMemo, useState } from 'react'
import type { DraftComment, ScenarioDetail, Session } from '../types'

type ReviewWorkspaceProps = {
  session: Session
  scenario: ScenarioDetail
  error: string | null
  pending: boolean
  onLogout: () => void
  onSubmit: (comments: DraftComment[]) => Promise<void>
}

export function ReviewWorkspace({ session, scenario, error, pending, onLogout, onSubmit }: ReviewWorkspaceProps) {
  const [activePath, setActivePath] = useState(scenario.files[0]?.path ?? '')
  const [activeDoc, setActiveDoc] = useState(scenario.documents[0]?.type ?? '')
  const [comments, setComments] = useState<DraftComment[]>([])
  const activeFile = scenario.files.find((file) => file.path === activePath) ?? scenario.files[0]
  const activeDocument = scenario.documents.find((document) => document.type === activeDoc) ?? scenario.documents[0]
  const commentsOnFile = useMemo(
    () => comments.filter((comment) => comment.filePath === activeFile?.path),
    [comments, activeFile],
  )

  function startComment(lineNumber: number) {
    if (!activeFile) {
      return
    }
    setComments((current) => {
      if (current.some((comment) => comment.filePath === activeFile.path && comment.lineNumber === lineNumber)) {
        return current
      }
      return [...current, { filePath: activeFile.path, lineNumber, body: '' }]
    })
  }

  function updateComment(lineNumber: number, body: string) {
    if (!activeFile) {
      return
    }
    setComments((current) =>
      current.map((comment) =>
        comment.filePath === activeFile.path && comment.lineNumber === lineNumber ? { ...comment, body } : comment,
      ),
    )
  }

  function removeComment(lineNumber: number) {
    if (!activeFile) {
      return
    }
    setComments((current) =>
      current.filter((comment) => !(comment.filePath === activeFile.path && comment.lineNumber === lineNumber)),
    )
  }

  const readyComments = comments.filter((comment) => comment.body.trim().length > 0)

  return (
    <div className="workspace">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Sidekick Supply Co. · Review</p>
          <h1>{scenario.title}</h1>
          <p className="signed-in">Signed in as {session.email}</p>
        </div>
        <button type="button" className="secondary" onClick={onLogout}>
          Sign out
        </button>
      </header>
      <div className="workspace-grid">
        <aside className="file-nav">
          <h2>Ticket & architecture</h2>
          <ul>
            {scenario.documents.map((document) => (
              <li key={document.type}>
                <button
                  type="button"
                  className={document.type === activeDocument?.type ? 'active' : undefined}
                  onClick={() => setActiveDoc(document.type)}
                >
                  {document.title}
                </button>
              </li>
            ))}
          </ul>
          <h2>Changed files</h2>
          <ul>
            {scenario.files.map((file) => (
              <li key={file.path}>
                <button
                  type="button"
                  className={file.path === activeFile?.path ? 'active' : undefined}
                  onClick={() => setActivePath(file.path)}
                >
                  {file.path.split('/').slice(-1)[0]}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="workspace-main">
          {activeDocument ? (
            <article className="doc-panel">
              <h2>{activeDocument.title}</h2>
              <p>{activeDocument.content}</p>
            </article>
          ) : null}
          {activeFile ? (
            <article className="diff-panel">
              <h2>{activeFile.path}</h2>
              <p className="hint">Click a proposed line number to leave a draft comment. Comments target the new file.</p>
              <ol className="diff">
                {activeFile.diff.map((line, index) => {
                  const commentable = line.proposedLineNumber !== null
                  const draft = commentsOnFile.find((comment) => comment.lineNumber === line.proposedLineNumber)
                  return (
                    <li key={`${line.type}-${index}`} className={`diff-line ${line.type.toLowerCase()}`}>
                      <button
                        type="button"
                        className="line-gutter"
                        disabled={!commentable}
                        onClick={() => commentable && startComment(line.proposedLineNumber!)}
                        aria-label={
                          commentable
                            ? `Comment on line ${line.proposedLineNumber}`
                            : `Removed line ${line.originalLineNumber}`
                        }
                      >
                        {line.proposedLineNumber ?? ''}
                      </button>
                      <pre>{line.text || ' '}</pre>
                      {draft ? (
                        <div className="draft-comment">
                          <label>
                            Comment on line {draft.lineNumber}
                            <textarea
                              value={draft.body}
                              onChange={(event) => updateComment(draft.lineNumber, event.target.value)}
                              rows={3}
                            />
                          </label>
                          <button type="button" className="secondary" onClick={() => removeComment(draft.lineNumber)}>
                            Remove
                          </button>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ol>
            </article>
          ) : (
            <p>This scenario has no files yet.</p>
          )}
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="submit-bar">
            <p>{readyComments.length} comment{readyComments.length === 1 ? '' : 's'} ready to submit.</p>
            <button type="button" disabled={pending} onClick={() => void onSubmit(readyComments)}>
              {pending ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
