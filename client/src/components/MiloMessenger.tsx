import { useEffect, useRef, useState } from 'react'

type MiloMessengerProps = { heading: string; message: string; messageKey: string; actionLabel?: string; onAction?: () => void }
const muteKey = 'devlair-milo-muted'

function playChime() {
  const Audio = window.AudioContext
  if (!Audio) return
  const context = new Audio()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(523.25, context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(783.99, context.currentTime + 0.12)
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.24)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.25)
}

export function MiloMessenger({ heading, message, messageKey, actionLabel, onAction }: MiloMessengerProps) {
  const [open, setOpen] = useState(true)
  const [muted, setMuted] = useState(() => window.localStorage.getItem(muteKey) === 'true')
  const lastMessage = useRef(messageKey)

  useEffect(() => {
    if (lastMessage.current !== messageKey) {
      lastMessage.current = messageKey
      setOpen(true)
      if (!muted) playChime()
    }
  }, [messageKey, muted])

  function toggleMute() {
    setMuted((current) => {
      window.localStorage.setItem(muteKey, String(!current))
      return !current
    })
  }

  return <aside className={`milo-messenger ${open ? 'is-open' : ''}`} aria-label="Milo, your operations guide">
    {open ? <section className="milo-card"><div className="milo-card__top"><img src="/assets/milo-vale.png" alt="Milo Vale" /><div><span>OPERATIONS GUIDE</span><strong>Milo Vale</strong></div><button className="milo-close" type="button" onClick={() => setOpen(false)} aria-label="Minimize Milo's message">×</button></div><h2>{heading}</h2><p>{message}</p>{actionLabel && onAction ? <button className="milo-action" type="button" onClick={onAction}>{actionLabel}</button> : null}<button className="milo-sound" type="button" onClick={toggleMute} aria-pressed={muted}>{muted ? '🔇 Alerts muted' : '🔊 Alerts on'}</button></section> : null}
    <button className={`milo-dock ${open ? 'has-open-card' : ''}`} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}><img src="/assets/milo-vale.png" alt="" /><span>{open ? 'Milo online' : 'New message from Milo'}</span>{!open ? <b aria-hidden="true" /> : null}</button>
  </aside>
}
