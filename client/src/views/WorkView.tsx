import { useMemo, useState } from 'react'
import type { Task } from '../types'
import { labelSkill } from './HomeView'

export function WorkView({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (task: Task) => void }) {
  const [status, setStatus] = useState('ALL')
  const [skill, setSkill] = useState('ALL')
  const skills = [...new Set(tasks.flatMap((task) => task.skills))]
  const shown = useMemo(() => tasks.filter((task) => (status === 'ALL' || task.status === status) && (skill === 'ALL' || task.skills.includes(skill))), [tasks, status, skill])
  return <section className="hq-page"><header className="hq-page__header"><p className="eyebrow">WORK</p><h1>Your work queue.</h1><p>Each task is a focused piece of realistic engineering work. Pull request reviews are available now; debugging tasks and incident response will be added only when their workspaces are ready.</p></header><div className="mission-filters"><label>Status <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="ALL">All tasks</option><option value="AVAILABLE">Available</option><option value="COMPLETED">Completed</option></select></label><label>Skill <select value={skill} onChange={(event) => setSkill(event.target.value)}><option value="ALL">All skills</option>{skills.map((item) => <option key={item} value={item}>{labelSkill(item)}</option>)}</select></label></div><div className="mission-cards">{shown.map((task) => <article key={task.slug} className="mission-card"><div><span className={`mission-status ${task.status.toLowerCase()}`}>{task.status === 'COMPLETED' ? 'COMPLETED WORK' : 'READY FOR REVIEW'}</span><h2>{task.title}</h2><p>{task.summary}</p><div className="tag-row">{task.skills.map((item) => <small key={item}>{labelSkill(item)}</small>)}<small>{task.difficulty.toLowerCase()}</small><small>{task.companyArea}</small></div></div><footer><span>{task.attempts ? `${task.attempts} attempt${task.attempts === 1 ? '' : 's'} · best ${task.bestScore}%` : 'Not started'}</span><button type="button" onClick={() => onOpenTask(task)}>{task.status === 'COMPLETED' ? 'Practice again' : 'Open pull request'}</button></footer></article>)}</div></section>
}
