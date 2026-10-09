import type { WorkspaceData } from '../types'

type Decoration = { name: string; skill: string; description: string; glyph: string }
const decorations: Decoration[] = [
  { name: 'Security seal', skill: 'security', description: 'Earned by catching a strong security finding.', glyph: '◉' },
  { name: 'Validation beacon', skill: 'validation', description: 'Earned by protecting a service boundary.', glyph: '✦' },
  { name: 'Test bench card', skill: 'testing', description: 'Earned by recognizing missing proof in tests.', glyph: '▤' },
]

export function ProfileView({ data }: { data: WorkspaceData }) { const earned = new Set(data.skills.filter((skill) => skill.bestScore === 100).map((skill) => skill.skillKey)); return <section className="hq-page"><header className="hq-page__header"><p className="eyebrow">PERSONAL DESK</p><h1>A record of work well done.</h1><p>Decorations are earned mementos from meaningful learning milestones. There is no shop, currency, or gameplay advantage.</p></header><section className="desk-scene"><div className="desk-surface"><span className="desk-lamp" aria-hidden="true">◔</span>{decorations.map((decoration) => <article key={decoration.name} className={earned.has(decoration.skill) ? 'desk-decoration earned' : 'desk-decoration'}><span>{decoration.glyph}</span><strong>{decoration.name}</strong><small>{earned.has(decoration.skill) ? 'Earned' : decoration.description}</small></article>)}</div></section></section> }
