import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

type OperationsShellProps = { children: ReactNode; work?: string; status?: string }

export function OperationsShell({ children, work = 'Engineering orientation', status = 'Getting started' }: OperationsShellProps) {
  return <main className="operations-shell"><div className="hq-backdrop" aria-hidden="true" /><header className="operations-hud"><div className="brand-lockup"><span className="brand-mark">✦</span><div><strong>Sidekick Supply Co.</strong><small>Engineering team</small></div></div><div className="hud-objective"><span>CURRENT FOCUS</span><strong>{work}</strong><small>{status}</small></div><ThemeToggle /></header><section className="operations-content">{children}</section></main>
}
