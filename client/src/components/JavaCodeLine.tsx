import type { ReactNode } from 'react'

const tokenPattern = /("(?:\\.|[^"\\])*")|(\/\/.*$)|(\b(?:class|public|private|protected|static|final|void|return|new|if|else|for|while|boolean|int|long|String|null|true|false)\b)|(\b\d+\b)/g

export function JavaCodeLine({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let cursor = 0
  for (const match of text.matchAll(tokenPattern)) {
    const index = match.index ?? 0
    if (index > cursor) parts.push(text.slice(cursor, index))
    const token = match[0]
    const className = match[1] ? 'code-string' : match[2] ? 'code-comment' : match[3] ? 'code-keyword' : 'code-number'
    parts.push(<span className={className} key={`${index}-${token}`}>{token}</span>)
    cursor = index + token.length
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}
