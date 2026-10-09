import { type MouseEvent, type PointerEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import type { Session, Task } from '../types'
import { SettingsPanel } from './SettingsPanel'

export type DesktopDestination = 'home' | 'work' | 'progress' | 'profile' | 'review' | 'feedback'
type BrowserTab = { id: string; title: string; destination: DesktopDestination; taskSlug?: string; pinned?: boolean }
type WindowState = { x: number; y: number; minimized: boolean; maximized: boolean }
const layoutKey = 'devlair-workstation-layout-v1'
const tabsKey = 'devlair-workstation-tabs-v1'

function defaultWindow(): WindowState { return { x: 72, y: 52, minimized: false, maximized: false } }
function loadWindow(): WindowState {
  try {
    const saved = JSON.parse(window.localStorage.getItem(layoutKey) ?? '') as Partial<WindowState>
    if (typeof saved.x === 'number' && typeof saved.y === 'number' && typeof saved.minimized === 'boolean' && typeof saved.maximized === 'boolean') return { x: Math.max(0, Math.min(saved.x, 320)), y: Math.max(0, Math.min(saved.y, 180)), minimized: saved.minimized, maximized: saved.maximized }
  } catch { /* Start with a safe layout. */ }
  return defaultWindow()
}

function baseTab(destination: DesktopDestination): BrowserTab {
  const labels: Record<Exclude<DesktopDestination, 'review' | 'feedback'>, string> = { home: 'Today', work: 'GitGrub · Pull requests', progress: 'Progress', profile: 'Profile' }
  return { id: destination, title: labels[destination as Exclude<DesktopDestination, 'review' | 'feedback'>], destination, pinned: destination === 'home' }
}

function isDestination(value: unknown): value is DesktopDestination { return value === 'home' || value === 'work' || value === 'progress' || value === 'profile' || value === 'review' || value === 'feedback' }
function loadTabs(): { tabs: BrowserTab[]; activeTab: string } {
  try {
    const saved = JSON.parse(window.localStorage.getItem(tabsKey) ?? '') as { tabs?: BrowserTab[]; activeTab?: string }
    const valid = saved.tabs?.filter((tab) => typeof tab.id === 'string' && typeof tab.title === 'string' && isDestination(tab.destination) && (tab.taskSlug === undefined || typeof tab.taskSlug === 'string')) ?? []
    const tabs = valid.some((tab) => tab.id === 'home') ? valid : [baseTab('home'), ...valid]
    const activeTab = tabs.some((tab) => tab.id === saved.activeTab) ? saved.activeTab! : 'home'
    return { tabs, activeTab }
  } catch { return { tabs: [baseTab('home')], activeTab: 'home' } }
}

export function readRestoredDesktopTab(): BrowserTab | null {
  const restored = loadTabs()
  return restored.tabs.find((tab) => tab.id === restored.activeTab) ?? null
}

export function DesktopShell({ children, active, session, tasks, scenarioTitle, scenarioSlug, onNavigate, onOpenTask, onLogout }: { children: ReactNode; active: DesktopDestination; session: Session; tasks: Task[]; scenarioTitle?: string; scenarioSlug?: string; onNavigate: (destination: DesktopDestination) => void; onOpenTask: (slug: string) => void; onLogout: () => void }) {
  const [windowState, setWindowState] = useState<WindowState>(loadWindow)
  const [tabs, setTabs] = useState<BrowserTab[]>(() => loadTabs().tabs)
  const [activeTab, setActiveTab] = useState(() => loadTabs().activeTab)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [unavailable, setUnavailable] = useState<string | null>(null)
  const [dragging, setDragging] = useState<{ offsetX: number; offsetY: number } | null>(null)

  useEffect(() => { window.localStorage.setItem(layoutKey, JSON.stringify(windowState)) }, [windowState])
  useEffect(() => { window.localStorage.setItem(tabsKey, JSON.stringify({ tabs, activeTab })) }, [tabs, activeTab])
  useEffect(() => {
    const tab = active === 'review' || active === 'feedback'
      ? scenarioSlug ? { id: `review-${scenarioSlug}`, title: scenarioTitle ?? 'GitGrub review', destination: active, taskSlug: scenarioSlug } : baseTab('work')
      : baseTab(active)
    setTabs((current) => current.some((item) => item.id === tab.id) ? current.map((item) => item.id === tab.id ? { ...item, ...tab } : item) : [...current, tab])
    setActiveTab(tab.id)
    setWindowState((current) => ({ ...current, minimized: false }))
  }, [active, scenarioSlug, scenarioTitle])

  const browserStyle = useMemo(() => windowState.maximized ? undefined : { left: `${windowState.x}px`, top: `${windowState.y}px` }, [windowState])
  const taskForTab = (tab: BrowserTab) => tab.taskSlug ? tasks.find((task) => task.slug === tab.taskSlug) : undefined

  function chooseTab(tab: BrowserTab) {
    setActiveTab(tab.id)
    if (tab.taskSlug) onOpenTask(tab.taskSlug)
    else onNavigate(tab.destination)
  }
  function closeTab(event: MouseEvent, tab: BrowserTab) {
    event.stopPropagation()
    if (tab.pinned) return
    const remaining = tabs.filter((item) => item.id !== tab.id)
    setTabs(remaining)
    if (tab.id === activeTab) chooseTab(remaining[Math.max(0, tabs.indexOf(tab) - 1)] ?? baseTab('home'))
  }
  function startDrag(event: PointerEvent<HTMLElement>) {
    if (windowState.maximized || window.innerWidth <= 850) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging({ offsetX: event.clientX - windowState.x, offsetY: event.clientY - windowState.y })
  }
  function drag(event: PointerEvent<HTMLElement>) {
    if (!dragging) return
    setWindowState((current) => ({ ...current, x: Math.max(0, Math.min(event.clientX - dragging.offsetX, Math.max(0, window.innerWidth - 360))), y: Math.max(0, Math.min(event.clientY - dragging.offsetY, Math.max(0, window.innerHeight - 180))) }))
  }

  return <main className="desktop-shell"><div className="desktop-wallpaper" aria-hidden="true" /><section className="desktop-icons" aria-label="Workstation applications"><DesktopIcon icon="◈" label="Today" onClick={() => onNavigate('home')} /><DesktopIcon icon="⌘" label="GitGrub" subtitle="Pull requests" onClick={() => onNavigate('work')} /><DesktopIcon icon="!" label="Incident Desk" subtitle="Coming later" onClick={() => setUnavailable('Incident Desk will open when incident-response tasks are ready. It will contain real alerts, logs, and timelines, not a pretend monitoring screen.')} /><DesktopIcon icon="▣" label="Supply Store" subtitle="Coming later" onClick={() => setUnavailable('Supply Store will open when testing tasks need a runnable product. For now, the onboarding preview explains the product context.')} /></section><aside className="desktop-desk" aria-label="Personal desk"><span>PERSONAL DESK</span><p>Earned mementos will appear here as your work history grows.</p></aside>{unavailable ? <section className="desktop-dialog" role="dialog" aria-modal="true" aria-label="Application unavailable"><h2>Not available yet</h2><p>{unavailable}</p><button type="button" onClick={() => setUnavailable(null)}>Back to desktop</button></section> : null}{settingsOpen ? <SettingsPanel onClose={() => setSettingsOpen(false)} /> : null}<section className={`company-browser ${windowState.maximized ? 'is-maximized' : ''} ${windowState.minimized ? 'is-minimized' : ''}`} style={browserStyle} aria-label="Sidekick Supply company browser"><header className="browser-titlebar" onPointerDown={startDrag} onPointerMove={drag} onPointerUp={() => setDragging(null)}><div><span className="browser-mark" aria-hidden="true">✦</span><strong>Sidekick Workspace</strong></div><div className="browser-controls"><button type="button" onClick={() => setWindowState((current) => ({ ...current, minimized: true }))} aria-label="Minimize browser">−</button><button type="button" onClick={() => setWindowState((current) => ({ ...current, maximized: !current.maximized }))} aria-label={windowState.maximized ? 'Restore browser' : 'Maximize browser'}>{windowState.maximized ? '▣' : '□'}</button></div></header><nav className="browser-tabs" aria-label="Open browser tabs">{tabs.map((tab) => <div className={`browser-tab ${tab.id === activeTab ? 'active' : ''}`} key={tab.id}><button type="button" onClick={() => chooseTab(tab)}>{taskForTab(tab) ? `GitGrub · ${taskForTab(tab)?.title}` : tab.title}</button>{!tab.pinned ? <button className="browser-tab-close" type="button" onClick={(event) => closeTab(event, tab)} aria-label={`Close ${tab.title}`}>×</button> : null}</div>)}</nav><section className="browser-content">{children}</section></section><footer className="desktop-taskbar"><button className={windowState.minimized ? '' : 'active'} type="button" onClick={() => setWindowState((current) => ({ ...current, minimized: false }))}><span aria-hidden="true">◈</span> Sidekick Workspace</button><button type="button" onClick={() => setSettingsOpen(true)} aria-label="Open workstation settings">⚙ Settings</button><details><summary>{session.email}</summary><button type="button" onClick={onLogout}>Sign out</button></details></footer></main>
}

function DesktopIcon({ icon, label, subtitle, onClick }: { icon: string; label: string; subtitle?: string; onClick: () => void }) { return <button type="button" onClick={onClick}><b aria-hidden="true">{icon}</b><strong>{label}</strong>{subtitle ? <small>{subtitle}</small> : null}</button> }
