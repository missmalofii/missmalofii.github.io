import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../config/site'
import { Ornament } from './Ornament'
import { Reveal } from './Reveal'

export function SessionSection() {
  const hasLink = Boolean(siteConfig.bookingUrl)

  return (
    <section data-track-view="session" aria-labelledby="session-title" className="relative px-5 py-20 sm:py-28">
      <Reveal className="relative mx-auto max-w-2xl overflow-hidden rounded-[28px] bg-burgundy px-6 py-14 text-center text-ivory sm:px-14 sm:py-20">
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[20px] border border-gold/40" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(216 191 193 / 0.28), transparent 70%)' }}
        />

        <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">личная встреча</p>
        <h2 id="session-title" className="relative mt-4 font-serif text-[2.1rem] font-light italic leading-[1.1] sm:text-5xl">
          а если декабрь станет началом чего-то большего?
        </h2>
        <Ornament className="relative mt-6" />
        <div className="relative mx-auto mt-6 max-w-lg space-y-4 leading-relaxed text-ivory/85">
          <p>
            иногда одного послания достаточно, чтобы остановиться и услышать себя. а иногда хочется
            разобраться глубже — в своих чувствах, желаниях, отношениях и внутреннем состоянии.
          </p>
          <p>
            я приглашаю тебя на индивидуальную психологическую сессию, где можно бережно исследовать
            себя и найти больше внутренней опоры.
          </p>
        </div>

        {hasLink && (
          <a
            href={siteConfig.bookingUrl}
            data-track="click-booking"
            target="_blank"
            rel="noopener noreferrer"
            className="btn relative mt-10 bg-ivory text-burgundy shadow-[0_12px_30px_-14px_rgb(0_0_0/0.5)] active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:bg-white"
          >
            записаться на сессию
            <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
          </a>
        )}
        {!hasLink && import.meta.env.DEV && (
          <p className="relative mx-auto mt-10 max-w-sm rounded-xl border border-dashed border-gold/60 p-3 text-xs text-ivory/80">
            [видно только в режиме разработки] кнопка записи появится, когда вы укажете bookingUrl в
            src/config/site.ts
          </p>
        )}
      </Reveal>
    </section>
  )
}
