// Petits composants d'affichage partagés.
import { useMemo, type ReactNode } from 'react'
import { pinyin } from 'pinyin-pro'
import type { Word } from '../data/hsk3'
import { joinSyllables, toneOf } from '../lib/pinyin'
import { speak } from '../lib/speech'
import { Icon } from './icons'

/** Caractères colorés par ton, avec pinyin au-dessus en option. */
export function Hanzi({
  word,
  size = 72,
  colored = true,
  ruby = false,
}: {
  word: Word
  size?: number
  colored?: boolean
  ruby?: boolean
}) {
  const chars = [...word.hanzi]
  return (
    <span className="hanzi" style={{ fontSize: size }}>
      {chars.map((c, i) => {
        const t = toneOf(word.syl[i] ?? '')
        return (
          <span key={i} className={'hz' + (colored ? ` t${t}` : '')}>
            {ruby && <span className={`ruby t${t}`}>{word.syl[i]}</span>}
            {c}
          </span>
        )
      })}
    </span>
  )
}

/** Pinyin d'un mot, syllabes colorées par ton. */
export function Pinyin({ syl, size = 22, marks }: { syl: string[]; size?: number; marks?: (boolean | null)[] }) {
  const display = joinSyllables(syl)
  // Re-découpe l'affichage (avec apostrophes) en syllabes pour les colorer
  const parts: string[] = []
  let rest = display
  for (const s of syl) {
    const withApos = rest.startsWith("'") ? "'" + s : s
    parts.push(withApos)
    rest = rest.slice(withApos.length)
  }
  return (
    <span className="pinyin" style={{ fontSize: size }}>
      {parts.map((p, i) => (
        <span
          key={i}
          className={`t${toneOf(syl[i])}` + (marks?.[i] === false ? ' syl-bad' : marks?.[i] === true ? ' syl-ok' : '')}
        >
          {p}
        </span>
      ))}
    </span>
  )
}

export function AudioButton({ text, size = 48, label }: { text: string; size?: number; label?: string }) {
  return (
    <button
      className="audio-btn"
      style={{ width: size, height: size }}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      aria-label={label ?? 'Écouter'}
    >
      <Icon name="speaker" size={size * 0.46} />
    </button>
  )
}

/** Phrase d'exemple : le mot étudié est surligné, pinyin et traduction sur demande. */
export function Example({ word, open }: { word: Word; open: boolean }) {
  const parts = useMemo(() => {
    const i = word.ex.indexOf(word.hanzi)
    if (i < 0) return [word.ex, '', '']
    return [word.ex.slice(0, i), word.hanzi, word.ex.slice(i + word.hanzi.length)]
  }, [word])
  const py = useMemo(() => {
    // Syllabe par syllabe, en fusionnant l'erhua (哪儿 → nǎr, pas nǎ ér)
    const parts: string[] = []
    const all = pinyin(word.ex, { type: 'all' })
    for (let i = 0; i < all.length; i++) {
      const t = all[i]
      const prev = parts.length - 1
      if (t.origin === '儿' && prev >= 0 && /[哪这那点会玩边]/.test(all[i - 1]?.origin ?? '')) {
        parts[prev] += 'r'
      } else parts.push(t.isZh ? t.pinyin : t.origin)
    }
    const raw = parts.join(' ')
    const PUNCT: Record<string, string> = { '，': ',', '。': '.', '！': ' !', '？': ' ?', '、': ',', '：': ' :', '；': ' ;' }
    const s = raw
      .replace(/\s*([，。！？、：；])\s*/g, (_, p: string) => PUNCT[p] + ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/([.!?]\s+)(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase())
    return s.charAt(0).toUpperCase() + s.slice(1)
  }, [word])
  return (
    <div className="example">
      <div className="example-row">
        <p className="example-zh">
          {parts[0]}
          {parts[1] && <mark>{parts[1]}</mark>}
          {parts[2]}
        </p>
        <AudioButton text={word.ex} size={36} label="Écouter la phrase" />
      </div>
      {open && (
        <>
          <p className="example-py">{py}</p>
          <p className="example-fr">{word.exFr}</p>
        </>
      )}
    </div>
  )
}

export function Pill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="pill" style={{ ['--pill' as string]: color }}>
      {children}
    </span>
  )
}

export function Ring({ value, size = 120, stroke = 12, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--ring-track)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .6s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-inner">{children}</div>
    </div>
  )
}
