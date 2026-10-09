import { useEffect } from 'react'

export function DesktopBoot({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 900)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return <main className="desktop-boot" aria-live="polite"><section><span aria-hidden="true">✦</span><p>Sidekick Supply Co.</p><h1>Preparing your workstation</h1><div className="boot-progress" aria-hidden="true"><i /></div><button type="button" onClick={onComplete}>Skip startup</button></section></main>
}
