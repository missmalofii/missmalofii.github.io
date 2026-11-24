import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/cormorant-garamond/index.css'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/manrope/index.css'
import '@fontsource/marck-script/400.css'
import '@fontsource/mrs-saint-delafield/400.css'
import './index.css'
import App from './App.tsx'
import { armSfx } from './lib/sfx'
import { initAnalytics } from './lib/analytics'
import { LoginGate, GATE_ENABLED } from './components/LoginGate'

armSfx()

let analyticsStarted = false
const startAnalytics = () => {
  if (analyticsStarted) return
  analyticsStarted = true
  initAnalytics()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginGate onUnlock={startAnalytics}>
      <App />
    </LoginGate>
  </StrictMode>,
)

// уже вошли раньше (или вход выключен) — статистика стартует сразу
try {
  if (!GATE_ENABLED || localStorage.getItem('mm-gate')) startAnalytics()
} catch {
  /* нет доступа к localStorage */
}
