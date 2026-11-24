/**
 * Статистика GoatCounter (https://missmalofii.goatcounter.com).
 * Скрипт счётчика подключён в index.html — он сам считает просмотры страницы.
 * Здесь — события: клики и доскролл до блоков. Они видны в панели
 * GoatCounter отдельными строками (галочка «events»).
 *
 * Как добавить новое событие:
 *   - на кнопку/ссылку: атрибут data-track="имя-события"
 *   - на блок (засчитать, что до него долистали): data-track-view="имя"
 *   - из кода: track('имя-события')
 */

type GoatCounter = {
  count?: (vars: { path: string; title?: string; event?: boolean }) => void
}

declare global {
  interface Window {
    goatcounter?: GoatCounter
  }
}

const pending: string[] = []

export function track(name: string, title?: string) {
  const gc = window.goatcounter
  if (gc?.count) {
    gc.count({ path: name, title: title ?? name, event: true })
  } else {
    // скрипт счётчика ещё грузится — отправим, как только появится
    pending.push(name)
  }
}

function flushPending() {
  if (!window.goatcounter?.count || pending.length === 0) return
  pending.splice(0).forEach((name) => track(name))
}

export function initAnalytics() {
  // клики по всему с data-track
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]')
      if (el?.dataset.track) track(el.dataset.track)
    },
    { capture: true },
  )

  // доскролл до блоков — один раз за визит на каждый блок
  const seen = new Set<string>()
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const name = (entry.target as HTMLElement).dataset.trackView
        if (!entry.isIntersecting || !name || seen.has(name)) return
        seen.add(name)
        io.unobserve(entry.target)
        track(`view-${name}`)
      })
    },
    { threshold: 0.35 },
  )
  const observeAll = () =>
    document.querySelectorAll<HTMLElement>('[data-track-view]').forEach((el) => {
      if (!seen.has(el.dataset.trackView!)) io.observe(el)
    })
  // блоки появляются после первого рендера React
  requestAnimationFrame(() => requestAnimationFrame(observeAll))

  // события, случившиеся до загрузки скрипта счётчика
  const timer = setInterval(() => {
    if (window.goatcounter?.count) {
      flushPending()
      clearInterval(timer)
    }
  }, 1000)
  setTimeout(() => clearInterval(timer), 30000)
}
