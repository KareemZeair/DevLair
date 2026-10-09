import { useEffect, useState } from 'react'
import { ApiError, completeOnboarding, ensureCsrfToken, getScenario, listScenarios, loadSession, login, logout, register, submitReview } from './api'
import { AuthView } from './views/AuthView'
import { FeedbackView } from './views/FeedbackView'
import { ReviewWorkspace } from './views/ReviewWorkspace'
import { TourView } from './views/TourView'
import { WelcomeView } from './views/WelcomeView'
import type { DraftComment, ReviewFeedback, ScenarioDetail, ScenarioSummary, Session } from './types'
import './App.css'

type Screen = 'loading' | 'welcome' | 'register' | 'login' | 'tour' | 'review' | 'feedback'

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [session, setSession] = useState<Session | null>(null)
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([])
  const [scenario, setScenario] = useState<ScenarioDetail | null>(null)
  const [feedback, setFeedback] = useState<ReviewFeedback | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    void bootstrap()
  }, [])

  async function bootstrap() {
    try {
      await ensureCsrfToken()
      const current = await loadSession()
      if (!current) {
        setScreen('welcome')
        return
      }
      await enterAuthenticated(current)
    } catch (cause) {
      setError(messageFrom(cause))
      setScreen('welcome')
    }
  }

  async function enterAuthenticated(current: Session) {
    setSession(current)
    const detail = await loadAssignedScenario()
    setScenario(detail)
    setScreen(current.onboardingCompleted ? 'review' : 'tour')
  }

  async function loadAssignedScenario(): Promise<ScenarioDetail> {
    const availableScenarios = await listScenarios()
    setScenarios(availableScenarios)
    const assigned = availableScenarios[0]
    if (!assigned) {
      throw new Error('No scenarios are seeded yet. Start Spring Boot against PostgreSQL so Flyway can load PR #184.')
    }
    return getScenario(assigned.slug)
  }

  async function handleNextMission() {
    if (!scenario) return
    const currentIndex = scenarios.findIndex((candidate) => candidate.slug === scenario.slug)
    const nextScenario = scenarios[currentIndex + 1]
    if (!nextScenario) return

    setPending(true)
    setError(null)
    try {
      setScenario(await getScenario(nextScenario.slug))
      setFeedback(null)
      setScreen('review')
    } catch (cause) {
      setError(messageFrom(cause))
    } finally {
      setPending(false)
    }
  }

  async function handleRegister(email: string, password: string) {
    setPending(true)
    setError(null)
    try {
      await register(email, password)
      const current = await login(email, password)
      await enterAuthenticated(current)
    } catch (cause) {
      setError(messageFrom(cause))
    } finally {
      setPending(false)
    }
  }

  async function handleLogin(email: string, password: string) {
    setPending(true)
    setError(null)
    try {
      const current = await login(email, password)
      await enterAuthenticated(current)
    } catch (cause) {
      setError(messageFrom(cause))
    } finally {
      setPending(false)
    }
  }

  async function handleCompleteOnboarding() {
    setPending(true)
    setError(null)
    try {
      const current = await completeOnboarding()
      setSession(current)
      setScreen('review')
    } catch (cause) {
      setError(messageFrom(cause))
    } finally {
      setPending(false)
    }
  }

  async function handleSubmit(comments: DraftComment[]) {
    if (!scenario) {
      return
    }
    setPending(true)
    setError(null)
    try {
      const result = await submitReview(scenario.slug, comments)
      setFeedback(result)
      setScreen('feedback')
    } catch (cause) {
      setError(messageFrom(cause))
    } finally {
      setPending(false)
    }
  }

  async function handleLogout() {
    await logout().catch(() => undefined)
    setSession(null)
    setScenario(null)
    setFeedback(null)
    setError(null)
    setScreen('welcome')
  }

  if (screen === 'loading') {
    return (
      <main className="welcome-shell">
        <p>Loading session…</p>
      </main>
    )
  }

  if (screen === 'welcome') {
    return <WelcomeView onRegister={() => setScreen('register')} onLogin={() => setScreen('login')} />
  }

  if (screen === 'register' || screen === 'login') {
    return (
      <AuthView
        mode={screen}
        error={error}
        pending={pending}
        onSubmit={screen === 'register' ? handleRegister : handleLogin}
        onBack={() => {
          setError(null)
          setScreen('welcome')
        }}
      />
    )
  }

  if (!session || !scenario) {
    return (
      <main className="welcome-shell">
        <p className="form-error">{error ?? 'The assignment could not be loaded.'}</p>
        <button type="button" onClick={() => setScreen('welcome')}>
          Back
        </button>
      </main>
    )
  }

  if (screen === 'tour') {
    return (
      <TourView
        session={session}
        scenario={scenario}
        error={error}
        pending={pending}
        onComplete={handleCompleteOnboarding}
      />
    )
  }

  if (screen === 'feedback' && feedback) {
    const scenarioIndex = scenarios.findIndex((candidate) => candidate.slug === scenario.slug)
    const nextScenario = scenarios[scenarioIndex + 1]
    return <FeedbackView scenario={scenario} feedback={feedback} onReviewAgain={() => setScreen('review')} onNextMission={nextScenario ? () => void handleNextMission() : undefined} nextMissionTitle={nextScenario?.title} />
  }

  return (
    <ReviewWorkspace
      session={session}
      scenario={scenario}
      error={error}
      pending={pending}
      onLogout={() => void handleLogout()}
      onSubmit={handleSubmit}
      onReplayTour={() => setScreen('tour')}
    />
  )
}

function messageFrom(cause: unknown): string {
  if (cause instanceof ApiError) {
    return cause.message
  }
  if (cause instanceof Error) {
    return cause.message
  }
  return 'Something went wrong.'
}
