import { ArrowDownToLine } from 'lucide-react'
import { siteConfig } from '../config/site'
import { GuideCover } from './GuideCover'
import { Ornament } from './Ornament'
import { Reveal } from './Reveal'

export function GuideSection() {
  if (!siteConfig.guideUrl) return null

  return (
    <section id="guide" data-track-view="guide" aria-labelledby="guide-title" className="relative scroll-mt-6 px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <Reveal className="md:order-2">
          <GuideCover />
        </Reveal>

        <Reveal className="text-center md:text-left" delay={120}>
          <p className="eyebrow">подарок для тебя</p>
          <h2 id="guide-title" className="mt-4 font-serif text-[2.1rem] font-light italic leading-[1.1] text-burgundy sm:text-5xl">
            твой маленький путеводитель по волшебному декабрю
          </h2>
          <Ornament className="mt-6 md:justify-start" />
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-cocoa-soft md:mx-0">
            я подготовила для тебя небольшой гайд, который поможет провести декабрь не в бесконечной
            гонке за итогами года, а в контакте с собой, своими желаниями и маленькими радостями.
          </p>
          <a
            href={siteConfig.guideUrl}
            download={siteConfig.guideFileName}
            data-track="click-guide-download"
            target="_blank"
            rel="noopener"
            className="btn btn-primary mt-9"
          >
            <ArrowDownToLine size={17} strokeWidth={1.6} aria-hidden="true" />
            забрать мой гайд
          </a>
          <p className="mt-3 text-[0.78rem] text-cocoa-soft">pdf · 12 страниц · бесплатно</p>
        </Reveal>
      </div>
    </section>
  )
}
