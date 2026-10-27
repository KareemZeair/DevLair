import { useEffect, useState } from 'react'
import type { Session, WorkspaceData } from '../types'

type ScenePeriod = 'morning' | 'day' | 'sunset' | 'night'

function periodAt(date: Date): ScenePeriod {
  const hour = date.getHours()
  if (hour < 7) return 'night'
  if (hour < 11) return 'morning'
  if (hour < 18) return 'day'
  if (hour < 21) return 'sunset'
  return 'night'
}

type PersonalDeskProps = {
  session: Session
  data: WorkspaceData
  onOpenWorkstation: () => void
  onLogout: () => void
}

export function PersonalDeskView({ session, data, onOpenWorkstation, onLogout }: PersonalDeskProps) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  const period = periodAt(now)
  const completed = data.tasks.filter((task) => task.status === 'COMPLETED').length

  return (
    <main className={`personal-desk personal-desk--${period}`}>
      <header className="personal-desk__header">
        <div>
          <span className="personal-desk__eyebrow">SIDEKICK SUPPLY CO.</span>
          <h1>Personal Desk</h1>
        </div>
        <details className="personal-desk__account">
          <summary>{session.email}</summary>
          <button type="button" onClick={onLogout}>Sign out</button>
        </details>
      </header>
      {/* Artwork, plaque text, and monitor share one coordinate space as the scene scales. */}
      <div className="personal-desk__scene">
        <div className="desk-art" aria-hidden="true" />
        <div className="desk-lighting" aria-hidden="true" />
        <section className="desk-monitor-zone" aria-label="Your workstation">
          <button type="button" onClick={onOpenWorkstation}>
            <span>Open Workstation</span>
            <small>Your work queue and review tools</small>
          </button>
        </section>
        <svg className="employee-plaque" viewBox="0 0 1672 941" role="img" aria-label="Employee desk plaque">
          <title>{session.email}, Software Developer at Sidekick Supply Co.</title>
          {/* The affine transform follows the four corners of the illustrated brass face. */}
          <g transform="matrix(1 0.065 -0.2 1 969 769)" textAnchor="middle">
            <text className="employee-plaque__company" x="101" y="9">SIDEKICK SUPPLY CO.</text>
            <text className="employee-plaque__name" x="101" y="21" textLength={Math.min(session.email.length * 6.2, 183)} lengthAdjust="spacingAndGlyphs">{session.email}</text>
            <text className="employee-plaque__role" x="101" y="30">SOFTWARE DEVELOPER</text>
          </g>
        </svg>
      </div>
      <footer className="desk-caption">
        <div className="desk-caption__status">
          <span className="desk-caption__dot" aria-hidden="true" />
          <span>Workstation ready</span>
          <span className="desk-caption__progress">{completed} task{completed === 1 ? '' : 's'} completed</span>
        </div>
        <button type="button" onClick={onOpenWorkstation}>Enter Workstation <span aria-hidden="true">↗</span></button>
      </footer>
    </main>
  )
}
