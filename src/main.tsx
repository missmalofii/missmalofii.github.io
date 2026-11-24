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

armSfx()
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
