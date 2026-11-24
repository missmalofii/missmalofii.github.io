import { Link2, Send } from 'lucide-react'
import { siteConfig, type ContactLink } from '../config/site'
import { Garland } from './Garland'
import { Reveal } from './Reveal'
import { StarField } from './StarField'

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ContactIcon({ icon }: { icon: ContactLink['icon'] }) {
  if (icon === 'instagram') return <InstagramIcon />
  if (icon === 'telegram') return <Send size={16} strokeWidth={1.6} aria-hidden="true" />
  return <Link2 size={16} strokeWidth={1.6} aria-hidden="true" />
}

/** Финал — вариант D «Тёплый акцент» */
export function Finale() {
  const links = siteConfig.contactLinks
  // главная кнопка — telegram (как в выбранном варианте), остальные — контурные
  const sorted = [...links].sort((a, b) => Number(b.icon === 'telegram') - Number(a.icon === 'telegram'))

  return (
    <footer data-track-view="finale" className="relative isolate flex min-h-[100svh] flex-col items-center overflow-hidden bg-burgundy px-6 pb-24 pt-24 text-center text-ivory">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgb(201 164 106 / 0.22), transparent 60%)' }}
      />
      <Garland />
      <StarField snow snowClass="text-ivory/70" stars={false} />

      <Reveal className="my-auto flex flex-col items-center">
        <p className="kicker">с наступающим</p>
        <p className="mt-6 max-w-xl font-serif text-[2rem] italic leading-[1.15] text-ivory [text-wrap:balance] sm:text-[3.4rem]">
          пусть этот декабрь будет к тебе добрым.
        </p>
        <div className="my-8 flex items-center gap-3 text-gold" aria-hidden="true">
          <span className="h-px w-16 bg-gold/70" />✦<span className="h-px w-16 bg-gold/70" />
        </div>
        <p className="font-hand text-[1.7rem] leading-snug text-champagne [text-wrap:balance] sm:text-[2.1rem]">
          с теплом, {siteConfig.authorName}
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.28em] text-ivory/70">
          {siteConfig.authorRole}
        </p>

        {sorted.length > 0 && (
          <>
            <p className="mt-12 text-[0.95rem] text-ivory/75">больше тепла и бережных практик — здесь:</p>
            <ul className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
              {sorted.map((c, i) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    data-track={`click-contact-${(c.icon ?? c.label).toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      i === 0
                        ? 'btn min-w-[13rem] bg-ivory text-burgundy [@media(hover:hover)]:hover:bg-white'
                        : 'btn min-w-[13rem] border border-ivory/35 text-ivory [@media(hover:hover)]:hover:border-gold'
                    }
                  >
                    <ContactIcon icon={c.icon} />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </Reveal>

      <div className="mt-16 flex w-full max-w-3xl flex-col items-center gap-1 border-t border-ivory/15 pt-5 text-[0.8rem] text-ivory/60">
        <p>© {new Date().getFullYear()} {siteConfig.brandName}</p>
        {siteConfig.developerCredit && (
          <p>
            дизайн и разработка —{' '}
            <a
              href={siteConfig.developerCredit.url}
              data-track="click-developer-credit"
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center underline decoration-ivory/30 underline-offset-4 transition-colors hover:text-ivory"
            >
              {siteConfig.developerCredit.label}
            </a>
          </p>
        )}
      </div>
    </footer>
  )
}
