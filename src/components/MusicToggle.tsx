import { useEffect, useRef, useState } from 'react'
import { track } from '../lib/analytics'
import { siteConfig } from '../config/site'
import { SOUND_MUTED_KEY as MUTED_KEY } from '../lib/sfx'
// события, которые браузеры считают «действием пользователя» и после которых разрешают звук
const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const

function readMuted() {
  try {
    return localStorage.getItem(MUTED_KEY) === '1'
  } catch {
    return false
  }
}
function writeMuted(v: boolean) {
  try {
    if (v) localStorage.setItem(MUTED_KEY, '1')
    else localStorage.removeItem(MUTED_KEY)
  } catch {
    /* приватный режим — просто не запоминаем */
  }
}

/**
 * Фоновая музыка. Браузеры не дают включать звук сам по себе,
 * поэтому пробуем сразу, а если нельзя — начинаем с первого касания/клика.
 * Если посетитель выключил музыку, выбор запоминается.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let fadeTimer = 0

    const fadeIn = () => {
      audio.volume = 0
      clearInterval(fadeTimer)
      fadeTimer = window.setInterval(() => {
        audio.volume = Math.min(siteConfig.musicVolume, audio.volume + 0.02)
        if (audio.volume >= siteConfig.musicVolume) clearInterval(fadeTimer)
      }, 80)
    }
    const play = () =>
      audio.play().then(
        () => {
          fadeIn()
          return true
        },
        () => false,
      )

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setFailed(true)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    const stopListening = () => GESTURES.forEach((ev) => window.removeEventListener(ev, onGesture, true))
    const onGesture = (e: Event) => {
      // нажатие на саму кнопку музыки обрабатывает её onClick
      const el = e.target instanceof Element ? e.target : e.target instanceof Node ? e.target.parentElement : null
      if (el?.closest('[data-music-toggle]')) return
      if (readMuted() || !audio.paused) {
        stopListening()
        return
      }
      // iPhone разрешает звук только на «отпускании» пальца (touchend/click),
      // поэтому не сдаёмся после первой неудачи — пробуем на каждом касании
      play().then((ok) => {
        if (ok) stopListening()
      })
    }

    if (!readMuted()) {
      play().then((ok) => {
        if (!ok) GESTURES.forEach((ev) => window.addEventListener(ev, onGesture, { capture: true, passive: true }))
      })
    }

    return () => {
      clearInterval(fadeTimer)
      GESTURES.forEach((ev) => window.removeEventListener(ev, onGesture, true))
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      writeMuted(false)
      audio.volume = siteConfig.musicVolume
      audio.play().catch(() => setFailed(true))
      track('music-on')
    } else {
      audio.pause()
      writeMuted(true)
      track('music-off')
    }
  }

  if (!siteConfig.musicUrl || failed) return null

  return (
    <>
      <audio ref={audioRef} src={siteConfig.musicUrl} loop preload="none" />
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'выключить музыку и звуки' : 'включить музыку и звуки'}
        className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/55 bg-burgundy/92 py-2.5 pl-3 pr-4 text-[13px] font-semibold text-ivory shadow-[0_10px_24px_rgb(94_34_48/0.25)] backdrop-blur-md transition-colors [@media(hover:hover)]:hover:bg-burgundy-dark"
      >
        <span aria-hidden="true" className="inline-flex h-3 items-end gap-0.5">
          {[0, 1, 2].map((i) => (
            <i key={i} className={`w-0.5 rounded-[1px] bg-gold ${playing ? 'eq-bar' : ''}`} style={{ height: playing ? undefined : 3 }} />
          ))}
        </span>
        {playing ? 'музыка' : 'включить музыку'}
      </button>
    </>
  )
}
