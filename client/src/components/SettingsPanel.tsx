import { useEffect, useState } from 'react'
import { applyMotionPreference, applyThemePreference, readAlertsMuted, readMotionPreference, readThemePreference, setAlertsMuted, type MotionPreference, type ThemePreference } from '../preferences'

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<ThemePreference>(readThemePreference)
  const [motion, setMotion] = useState<MotionPreference>(readMotionPreference)
  const [muted, setMuted] = useState(readAlertsMuted)
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [fullscreenError, setFullscreenError] = useState(false)

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  function changeTheme(next: ThemePreference) { setTheme(next); applyThemePreference(next) }
  function changeMotion(next: MotionPreference) { setMotion(next); applyMotionPreference(next) }
  function changeMuted(next: boolean) { setMuted(next); setAlertsMuted(next) }
  async function toggleFullscreen() {
    setFullscreenError(false)
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else setFullscreenError(true)
    } catch { setFullscreenError(true) }
  }

  return <section className="settings-panel" aria-label="Workstation settings"><header><div><small>WORKSTATION</small><h2>Settings</h2></div><button type="button" onClick={onClose} aria-label="Close settings">×</button></header><fieldset><legend>Appearance</legend><div className="segmented" role="group" aria-label="Appearance"><button type="button" className={theme === 'system' ? 'active' : ''} onClick={() => changeTheme('system')}>System</button><button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => changeTheme('light')}>Day shift</button><button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => changeTheme('dark')}>Night shift</button></div></fieldset><fieldset><legend>Alerts</legend><label className="settings-toggle"><span><strong>Kilo message sounds</strong><small>Play a gentle chime for a new message after browser interaction.</small></span><input type="checkbox" checked={!muted} onChange={(event) => changeMuted(!event.target.checked)} /><b aria-hidden="true" /></label></fieldset><fieldset><legend>Motion</legend><div className="segmented" role="group" aria-label="Motion"><button type="button" className={motion === 'system' ? 'active' : ''} onClick={() => changeMotion('system')}>Follow device</button><button type="button" className={motion === 'reduce' ? 'active' : ''} onClick={() => changeMotion('reduce')}>Reduce motion</button></div></fieldset><fieldset><legend>Display</legend><button className="fullscreen-action" type="button" onClick={() => void toggleFullscreen()}>{fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}</button>{fullscreenError ? <p role="alert">Fullscreen is not available in this browser.</p> : <small>Press Escape at any time to exit fullscreen.</small>}</fieldset></section>
}
