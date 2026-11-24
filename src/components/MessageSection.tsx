import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '../lib/analytics'
import { ChevronDown, Download, Share2, Sparkles } from 'lucide-react'
import { messages } from '../config/messages'
import { siteConfig } from '../config/site'
import { useMessageDeck } from '../hooks/useMessageDeck'
import { canShareFiles, renderCard, saveOrShareCard } from '../lib/cardImage'
import { playSfx } from '../lib/sfx'
import { Envelope } from './Envelope'
import { MessageCard } from './MessageCard'
import { StarField } from './StarField'

type Phase = 'sealed' | 'opening' | 'leaving' | 'open'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function MessageSection({ openRequest }: { openRequest: number }) {
  const { message, next, markSeen, restarted } = useMessageDeck(messages)
  const [phase, setPhase] = useState<Phase>('sealed')
  const [fading, setFading] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const [shareable] = useState(canShareFiles)
  const timers = useRef<number[]>([])
  const blobCache = useRef(new Map<string, Promise<Blob>>())

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const open = useCallback(() => {
    if (phase !== 'sealed') return
    if (prefersReducedMotion()) {
      playSfx('paper')
      setPhase('open')
      return
    }
    setPhase('opening')
    playSfx('paper')
    playSfx('sparkle', 150)
    later(() => setPhase('leaving'), 1050)
    later(() => setPhase('open'), 1350)
  }, [phase])

  // кнопка «открыть моё послание» на первом экране
  useEffect(() => {
    if (openRequest === 0) return
    later(open, prefersReducedMotion() ? 0 : 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRequest])

  const getBlob = useCallback((m = message) => {
    let p = blobCache.current.get(m.id)
    if (!p) {
      p = renderCard(m)
      p.catch(() => blobCache.current.delete(m.id))
      blobCache.current.set(m.id, p)
    }
    return p
  }, [message])

  // показанное послание запоминаем, чтобы больше его не показывать
  useEffect(() => {
    if (phase === 'open' && message) {
      markSeen(message.id)
      track(`message-shown-${message.id}`, message.text)
    }
  }, [phase, message, markSeen])

  // заранее готовим картинку, чтобы меню «поделиться» открывалось мгновенно
  useEffect(() => {
    if (phase === 'open') getBlob().catch(() => {})
  }, [phase, getBlob])

  const another = () => {
    setSaveState('idle')
    playSfx('page')
    if (prefersReducedMotion()) {
      next()
      return
    }
    setFading(true)
    later(() => {
      next()
      setFading(false)
    }, 320)
  }

  const save = async () => {
    setSaveState('busy')
    try {
      const blob = await getBlob()
      setSaveState('idle') // картинка готова — дальше системное меню или скачивание
      const result = await saveOrShareCard(blob)
      track(`card-${result}`)
      if (result !== 'cancelled') setSaveState('done')
    } catch {
      setSaveState('error')
      track('card-error')
    }
  }

  return (
    <section
      id="message"
      data-track-view="message"
      aria-label="твоё послание"
      className="relative isolate scroll-mt-4 overflow-hidden px-5 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgb(216 191 193 / 0.35), transparent 65%), linear-gradient(180deg, transparent, #F2E9DD 50%, transparent)',
        }}
      />
      <StarField snow snowClass="text-burgundy/25" />

      <div className="mx-auto flex min-h-[540px] max-w-xl flex-col items-center justify-center">
        {phase !== 'open' ? (
          <>
            <p className={`eyebrow text-center transition-opacity duration-500 ${phase !== 'sealed' ? 'opacity-0' : ''}`}>письмо, которое ждало тебя</p>
            <Envelope open={phase !== 'sealed'} leaving={phase === 'leaving'} onOpen={open} preview={message.text} />
          </>
        ) : (
          <>
            {restarted && (
              <p className="text-in mb-5 text-center text-[0.8rem] text-cocoa-soft">
                ты уже открыл(а) все послания ✦ начинаем новый круг
              </p>
            )}
            <MessageCard message={message} fading={fading} />

            <p className="text-in mt-9 max-w-sm px-2 text-center font-serif text-xl italic text-burgundy" style={{ animationDelay: '0.5s' }}>
              если эти слова нашли отклик, сохрани их для себя.
            </p>

            <div className="text-in mt-6 flex w-full flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.7s' }}>
              <button type="button" onClick={save} data-track="click-save-card" disabled={saveState === 'busy'} className="btn btn-primary w-full max-w-xs sm:w-auto">
                {shareable ? <Share2 size={17} strokeWidth={1.6} aria-hidden="true" /> : <Download size={17} strokeWidth={1.6} aria-hidden="true" />}
                {saveState === 'busy' ? 'готовлю карточку…' : shareable ? 'сохранить или поделиться' : 'сохранить карточку'}
              </button>
              <button type="button" onClick={another} data-track="click-another-message" disabled={fading} className="btn btn-ghost w-full max-w-xs sm:w-auto">
                <Sparkles size={17} strokeWidth={1.6} aria-hidden="true" />
                получить ещё одно послание
              </button>
            </div>

            <p className="mt-4 min-h-5 text-center text-[0.8rem] text-cocoa-soft" role="status">
              {saveState === 'done' && (shareable ? 'готово ✦' : 'карточка сохранена в загрузки ✦')}
              {saveState === 'error' && 'не получилось сохранить карточку — попробуй ещё раз'}
            </p>

            {siteConfig.instagramHandle && (
              <p className="text-in mt-1 max-w-xs text-center text-[0.8rem] leading-relaxed text-cocoa-soft" style={{ animationDelay: '0.9s' }}>
                поделись посланием в stories и отметь{' '}
                <a
                  href={siteConfig.instagramUrl}
                  data-track="click-instagram-mention"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-burgundy underline decoration-burgundy/30 underline-offset-4 [@media(hover:hover)]:hover:decoration-burgundy"
                >
                  @{siteConfig.instagramHandle}
                </a>{' '}
                — мне будет очень приятно ♡
              </p>
            )}

            {/* ненавязчивая подсказка, что ниже есть продолжение */}
            <button
              type="button"
              data-track="click-scroll-to-guide"
              onClick={() => document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-in group mt-8 flex min-h-11 flex-col items-center gap-1 px-4 text-cocoa-soft transition-colors hover:text-burgundy"
              style={{ animationDelay: '1.2s' }}
            >
              <span className="text-[0.72rem] tracking-[0.18em]">дальше — подарок для тебя</span>
              <ChevronDown size={22} strokeWidth={1.2} className="scroll-hint text-gold" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
