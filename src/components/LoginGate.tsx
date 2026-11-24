import { useState, type FormEvent, type ReactNode } from 'react'
import { Lock } from 'lucide-react'

/**
 * ВРЕМЕННЫЙ ЗАКРЫТЫЙ ДОСТУП.
 * Это не настоящая защита: он только прячет сайт от случайных посетителей.
 * Чтобы открыть сайт для всех, поставьте GATE_ENABLED = false.
 *
 * Хранится не пароль, а SHA-256 от строки «логин:пароль».
 * Новый хэш:  printf '%s' 'логин:пароль' | shasum -a 256
 */
export const GATE_ENABLED = true
const CREDENTIALS_HASH = '60a1ab5b7781b34dc9dac639ddcfa57ebc3e46f2af16cbcf72020534487f1d70'
const STORAGE_KEY = 'mm-gate'

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

function isUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === CREDENTIALS_HASH
  } catch {
    return false
  }
}

export function LoginGate({ children, onUnlock }: { children: ReactNode; onUnlock?: () => void }) {
  const [unlocked, setUnlocked] = useState(() => !GATE_ENABLED || isUnlocked())
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  if (unlocked) return <>{children}</>

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const hash = await sha256(`${login.trim()}:${password}`)
    setBusy(false)
    if (hash !== CREDENTIALS_HASH) {
      setError(true)
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, hash)
    } catch {
      /* приватный режим — просто пускаем без запоминания */
    }
    setUnlocked(true)
    onUnlock?.()
  }

  const field =
    'w-full rounded-full border border-gold/50 bg-ivory/95 px-5 py-3 text-[0.95rem] text-burgundy outline-none placeholder:text-cocoa-soft/70 focus:border-gold'

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-burgundy px-6 text-ivory">
      <form onSubmit={submit} className="flex w-full max-w-xs flex-col items-center gap-3 text-center">
        <Lock size={26} strokeWidth={1.4} className="mb-2 text-gold" aria-hidden="true" />
        <h1 className="font-serif text-3xl font-light italic">скоро откроется</h1>
        <p className="mb-4 text-[0.85rem] text-ivory/70">сайт пока в закрытом доступе</p>
        <input
          className={field}
          placeholder="логин"
          autoComplete="username"
          autoCapitalize="none"
          value={login}
          onChange={(e) => (setLogin(e.target.value), setError(false))}
        />
        <input
          className={field}
          type="password"
          placeholder="пароль"
          autoComplete="current-password"
          value={password}
          onChange={(e) => (setPassword(e.target.value), setError(false))}
        />
        <p className="min-h-5 text-[0.8rem] text-champagne" role="status">
          {error && 'неверный логин или пароль'}
        </p>
        <button type="submit" disabled={busy} className="btn w-full bg-ivory text-burgundy [@media(hover:hover)]:hover:bg-white">
          войти
        </button>
      </form>
    </main>
  )
}
