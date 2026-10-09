import { useEffect, useState } from 'react'
import { ApiError, completeOnboarding, ensureCsrfToken, getScenario, loadSession, loadWorkspace, login, logout, register, submitReview } from './api'
import { DesktopBoot } from './components/DesktopBoot'
import { DesktopShell, readRestoredDesktopTab, type DesktopDestination } from './components/DesktopShell'
import { applyMotionPreference, applyThemePreference, readMotionPreference, readThemePreference } from './preferences'
import { AuthView } from './views/AuthView'
import { FeedbackView } from './views/FeedbackView'
import { HomeView } from './views/HomeView'
import { WorkView } from './views/WorkView'
import { ProfileView } from './views/ProfileView'
import { ProgressView } from './views/ProgressView'
import { ReviewWorkspace } from './views/ReviewWorkspace'
import { TourView } from './views/TourView'
import { WelcomeView } from './views/WelcomeView'
import type { DraftComment, ReviewFeedback, ScenarioDetail, Session, Task, WorkspaceData } from './types'
import './App.css'

type Screen = 'loading' | 'welcome' | 'register' | 'login' | 'tour' | 'boot' | DesktopDestination

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [session, setSession] = useState<Session | null>(null)
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null)
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null)
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => { applyThemePreference(readThemePreference()); applyMotionPreference(readMotionPreference()); void bootstrap() }, [])

  async function bootstrap() {
    try {
      await ensureCsrfToken()
      const current = await loadSession()
      if (!current) { setScreen('welcome'); return }
      await enterAuthenticated(current)
    } catch (cause) { setError(messageFrom(cause)); setScreen('welcome') }
  }

  async function enterAuthenticated(current: Session) {
    setSession(current)
    const data = await refreshWorkspaceData()
    if (!current.onboardingCompleted) {
      const first = data.tasks[0]
      if (!first) throw new Error('No pull request tasks are seeded yet. Start Spring Boot against PostgreSQL so Flyway can load the review tasks.')
      setScenario(await getScenario(first.slug))
      setScreen('tour')
      return
    }
    setScreen('boot')
  }

  async function refreshWorkspaceData() { const data = await loadWorkspace(); setWorkspaceData(data); return data }
  async function openTask(task: Task) { setPending(true); setError(null); try { setScenario(await getScenario(task.slug)); setFeedback(null); setScreen('review') } catch (cause) { setError(messageFrom(cause)) } finally { setPending(false) } }
  async function handleRegister(email: string, password: string) { setPending(true); setError(null); try { await register(email, password); await enterAuthenticated(await login(email, password)) } catch (cause) { setError(messageFrom(cause)) } finally { setPending(false) } }
  async function handleLogin(email: string, password: string) { setPending(true); setError(null); try { await enterAuthenticated(await login(email, password)) } catch (cause) { setError(messageFrom(cause)) } finally { setPending(false) } }
  async function handleCompleteOnboarding() { setPending(true); setError(null); try { setSession(await completeOnboarding()); await refreshWorkspaceData(); setScreen('boot') } catch (cause) { setError(messageFrom(cause)) } finally { setPending(false) } }
  async function handleSubmit(comments: DraftComment[]) { if (!scenario) return; setPending(true); setError(null); try { setFeedback(await submitReview(scenario.slug, comments)); await refreshWorkspaceData(); setScreen('feedback') } catch (cause) { setError(messageFrom(cause)) } finally { setPending(false) } }
  async function handleLogout() { await logout().catch(() => undefined); setSession(null); setWorkspaceData(null); setScenario(null); setFeedback(null); setError(null); setScreen('welcome') }
  async function finishStartup() {
    const restored = readRestoredDesktopTab()
    if (restored?.taskSlug) {
      const task = workspaceData?.tasks.find((item) => item.slug === restored.taskSlug)
      if (task) { await openTask(task); return }
    }
    setScreen(restored?.destination === 'feedback' ? 'home' : restored?.destination ?? 'home')
  }

  if (screen === 'loading') return <main className="welcome-shell"><p>Loading session…</p></main>
  if (screen === 'welcome') return <WelcomeView onRegister={() => setScreen('register')} onLogin={() => setScreen('login')} />
  if (screen === 'register' || screen === 'login') return <AuthView mode={screen} error={error} pending={pending} onSubmit={screen === 'register' ? handleRegister : handleLogin} onBack={() => { setError(null); setScreen('welcome') }} />
  if (!session || !workspaceData) return <main className="welcome-shell"><p className="form-error">{error ?? 'Your workspace could not be loaded.'}</p><button type="button" onClick={() => setScreen('welcome')}>Back</button></main>
  if (screen === 'tour' && scenario) return <TourView session={session} scenario={scenario} error={error} pending={pending} onComplete={handleCompleteOnboarding} />
  if (screen === 'boot') return <DesktopBoot onComplete={() => void finishStartup()} />

  const active: DesktopDestination = screen === 'work' || screen === 'progress' || screen === 'profile' || screen === 'review' || screen === 'feedback' ? screen : 'home'
  const content = screen === 'work' ? <WorkView tasks={workspaceData.tasks} onOpenTask={(task) => void openTask(task)} />
    : screen === 'progress' ? <ProgressView data={workspaceData} />
    : screen === 'profile' ? <ProfileView data={workspaceData} />
    : screen === 'feedback' && feedback && scenario ? <FeedbackView scenario={scenario} feedback={feedback} onReviewAgain={() => setScreen('review')} onNextTask={() => setScreen('work')} nextTaskTitle="Work queue" />
    : screen === 'review' && scenario ? <ReviewWorkspace session={session} scenario={scenario} error={error} pending={pending} onSubmit={handleSubmit} onReplayTour={() => setScreen('tour')} />
    : <HomeView data={workspaceData} onOpenTask={(task) => void openTask(task)} onBrowse={() => setScreen('work')} />
  return <DesktopShell active={active} session={session} tasks={workspaceData.tasks} scenarioTitle={scenario?.title} scenarioSlug={scenario?.slug} onNavigate={setScreen} onOpenTask={(slug) => { const task = workspaceData.tasks.find((item) => item.slug === slug); if (task) void openTask(task) }} onLogout={() => void handleLogout()}>{content}</DesktopShell>
}

function messageFrom(cause: unknown): string { if (cause instanceof ApiError) return cause.message; if (cause instanceof Error) return cause.message; return 'Something went wrong.' }
