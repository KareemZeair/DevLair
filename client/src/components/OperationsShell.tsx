import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'

type OperationsShellProps = { children: ReactNode; mission?: string; status?: string }

export function OperationsShell({ children, mission = 'Orientation protocol', status = 'Mission briefing' }: OperationsShellProps) {
  return <main className="operations-shell"><div className="hq-backdrop" aria-hidden="true" /><header className="operations-hud"><div className="brand-lockup"><span className="brand-mark">✦</span><div><strong>Sidekick Supply Co.</strong><small>Engineering operations</small></div></div><div className="hud-objective"><span>ACTIVE OBJECTIVE</span><strong>{mission}</strong><small>{status}</small></div><ThemeToggle /></header><section className="operations-content">{children}</section></main>
}
