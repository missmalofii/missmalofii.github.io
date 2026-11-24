import { Mail } from 'lucide-react'
import { siteConfig } from '../config/site'
import { Garland } from './Garland'
import { StarField } from './StarField'

/** Первый экран в стиле «Тёплый акцент»: винный фон, гирлянда, снег */
export function Hero({ onOpen }: { onOpen: () => void }) {
  return (
    <header data-track-view="hero" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-burgundy px-6 pb-20 pt-24 text-ivory">
      {/* тёплое золотое свечение сверху */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgb(201 164 106 / 0.24), transparent 62%)' }}
      />
      <Garland />
      <StarField snow snowClass="text-ivory/70" stars={false} />

      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <p className="rise-in kicker" style={{ animationDelay: '0.1s' }}>
          с наступающим
        </p>

        <p
          className="rise-in mt-6 font-script text-[3.2rem] leading-none text-champagne sm:text-7xl"
          style={{ animationDelay: '0.2s' }}
          lang="en"
        >
          Christmas mood
        </p>

        <h1
          className="rise-in mt-6 font-serif text-[2.4rem] font-normal italic leading-[1.1] text-ivory [text-wrap:balance] sm:text-6xl"
          style={{ animationDelay: '0.35s' }}
        >
          кажется, декабрь приготовил для тебя кое-что особенное…
        </h1>

        <div className="rise-in my-8 flex items-center gap-3 text-gold" aria-hidden="true" style={{ animationDelay: '0.5s' }}>
          <span className="h-px w-16 bg-gold/70" />✦<span className="h-px w-16 bg-gold/70" />
        </div>

        <p
          className="rise-in max-w-md text-[1.02rem] leading-relaxed text-ivory/80 sm:text-lg"
          style={{ animationDelay: '0.6s' }}
        >
          иногда самые важные слова приходят к нам совершенно неожиданно. возможно, сегодня одно из
          таких посланий найдёт тебя.
        </p>

        <div className="rise-in mt-10" style={{ animationDelay: '0.85s' }}>
          <button
            type="button"
            onClick={onOpen}
            data-track="click-hero-open-message"
            className="btn bg-ivory text-burgundy shadow-[0_12px_30px_-14px_rgb(0_0_0/0.5)] active:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-px [@media(hover:hover)]:hover:bg-white"
          >
            <Mail size={17} strokeWidth={1.6} aria-hidden="true" />
            открыть моё послание
          </button>
        </div>

        <p className="rise-in mt-6 font-hand text-xl text-champagne/90" style={{ animationDelay: '1.05s' }}>
          маленькое зимнее чудо от {siteConfig.brandName}
        </p>
      </div>
    </header>
  )
}
