import { Sparkle } from './Sparkle'

type Props = {
  open: boolean
  leaving: boolean
  onOpen: () => void
  /** начало послания, которое видно на выезжающем письме */
  preview: string
}

// салют при открытии: снежинки, звёздочки и огоньки разлетаются по кругу
const BURST = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2 + (i % 2 ? 0.15 : -0.1)
  const dist = 120 + ((i * 37) % 80)
  return {
    glyph: ['✦', '❄', '•', '❅', '✧'][i % 5],
    x: Math.round(Math.cos(angle) * dist),
    y: Math.round(Math.sin(angle) * dist * 0.85 - 40),
    r: (i % 2 ? 1 : -1) * (90 + i * 10),
    size: 16 + ((i * 7) % 14),
    delay: (i % 4) * 0.04,
    color: ['text-gold', 'text-burgundy', 'text-gold', 'text-[#ffd27a]', 'text-rose'][i % 5],
  }
})

const AROUND = [
  { top: '8%', left: '-4%', size: 14, delay: 0 },
  { top: '-6%', left: '84%', size: 18, delay: 1.1 },
  { top: '78%', left: '96%', size: 12, delay: 0.6 },
  { top: '92%', left: '6%', size: 10, delay: 1.7 },
]

/** Праздничный винный конверт с маркой и печатью; при открытии — салют */
export function Envelope({ open, leaving, onOpen, preview }: Props) {
  return (
    <div className={`envelope-wrap flex flex-col items-center ${leaving ? 'is-leaving' : ''}`}>
      <div className="relative mt-36">
        {/* звёздочки вокруг */}
        {AROUND.map((s, i) => (
          <Sparkle
            key={i}
            size={s.size}
            className="star absolute text-gold"
            style={{ top: s.top, left: s.left, '--d': '3.2s', '--delay': `${s.delay}s` } as React.CSSProperties}
          />
        ))}

        <button
          type="button"
          onClick={onOpen}
          data-track="click-envelope-open"
          disabled={open}
          aria-label="открыть конверт с посланием"
          className={`envelope group relative block aspect-[3/2] w-[min(84vw,360px)] rounded-[8px] focus-visible:rounded-[8px] ${open ? 'is-open' : ''}`}
          style={{ filter: 'drop-shadow(0 26px 30px rgb(94 34 48 / 0.35))' }}
        >
          <span className="envelope-nudge absolute inset-0 block">
            {/* задняя стенка */}
            <span className="envelope__body absolute inset-0 rounded-[8px] bg-burgundy-dark" />

            {/* письмо внутри — с началом настоящего послания */}
            <span className="envelope__letter absolute inset-x-[7%] top-[6%] bottom-[5%] z-10 flex flex-col items-center overflow-hidden rounded-[3px] border border-gold/60 bg-[#FCF8F2] px-5 pt-4 shadow-[0_-6px_18px_-8px_rgb(60_20_28/0.35)]">
              <span className="kicker !text-[9px]">для тебя</span>
              <span className="mt-2 block h-px w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <span
                className="mt-3 block font-serif text-[1.05rem] italic leading-snug text-cocoa"
                style={{ maskImage: 'linear-gradient(#000 55%, transparent)', WebkitMaskImage: 'linear-gradient(#000 55%, transparent)' }}
              >
                {preview}
              </span>
            </span>

            {/* передний «карман» */}
            <span
              className="envelope__body absolute inset-0 z-20 rounded-[8px]"
              style={{
                clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)',
                background: 'linear-gradient(165deg, #8a3644 0%, #7a2e3a 50%, #692734 100%)',
              }}
            />
            {/* золотые линии и окантовка */}
            <svg aria-hidden="true" viewBox="0 0 300 200" preserveAspectRatio="none" className="envelope__body pointer-events-none absolute inset-0 z-20 h-full w-full">
              <path d="M0 200 L150 112 L300 200" fill="none" stroke="#c9a46a" strokeOpacity="0.7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d="M4 10 V191 Q4 196 9 196 H291 Q296 196 296 191 V10" fill="none" stroke="#c9a46a" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* почтовая марка: «перфорация» — пунктирная рамка цвета бумаги */}
            <span className="envelope__body absolute bottom-[9%] right-[6%] z-20 h-[24%] w-[17%] rotate-6 border-[3px] border-dotted border-ivory bg-ivory p-[3px] shadow-[0_2px_6px_rgb(0_0_0/0.25)]">
              <span className="flex h-full w-full flex-col items-center justify-center border border-gold/70 bg-ivory-deep leading-none">
                <span className="text-[0.8rem] text-gold">❄</span>
                <span className="mt-0.5 font-serif text-[0.55rem] italic text-burgundy">2026</span>
              </span>
            </span>

            {/* клапан: снаружи винный, внутри — подкладка цвета шампань со звёздочками */}
            <span
              className="envelope__flap envelope__body absolute inset-x-0 top-0 h-full"
              style={{
                zIndex: open ? 5 : 30,
                transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), z-index 0s linear 0.22s',
              }}
            >
              <span
                className="envelope__face rounded-t-[8px]"
                style={{ background: 'linear-gradient(180deg, #93404e 0%, #6f2a36 100%)' }}
              />
              <span
                className="envelope__face envelope__face--inner rounded-t-[8px]"
                style={{
                  background:
                    'radial-gradient(circle, rgb(201 164 106 / 0.55) 1.2px, transparent 1.6px) 0 0 / 14px 14px, linear-gradient(0deg, #f3d9b4 0%, #f7efe6 100%)',
                }}
              />
            </span>

            {/* золотая печать */}
            <span className="envelope__seal absolute left-1/2 top-[56%] z-40 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-burgundy shadow-[0_6px_14px_-4px_rgb(60_20_28/0.6),inset_0_-3px_6px_rgb(0_0_0/0.15)] ring-4 ring-gold/30 transition-transform [@media(hover:hover)]:group-hover:scale-110"
              style={{ background: 'radial-gradient(circle at 35% 30%, #f3d9b4, #c9a46a 60%, #a8844c)' }}
            >
              <span className="text-xl leading-none">✦</span>
            </span>
          </span>
        </button>

        {/* салют */}
        {open && (
          <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 z-50">
            {BURST.map((b, i) => (
              <span
                key={i}
                className={`burst-piece absolute left-0 top-0 leading-none ${b.color}`}
                style={
                  {
                    fontSize: b.size,
                    '--bx': `${b.x}px`,
                    '--by': `${b.y}px`,
                    '--br': `${b.r}deg`,
                    '--bd': `${0.15 + b.delay}s`,
                  } as React.CSSProperties
                }
              >
                {b.glyph}
              </span>
            ))}
          </span>
        )}
      </div>

      <p className={`hint mt-9 text-center text-[0.95rem] text-cocoa-soft transition-opacity duration-500 ${open ? 'opacity-0' : ''}`}>
        <span className="font-hand text-xl text-burgundy">тук-тук, тебе письмо ✦</span>
        <br />
        <span className="text-sm">нажми на конверт, чтобы открыть</span>
      </p>
    </div>
  )
}
