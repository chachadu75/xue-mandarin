// Clavier pinyin intégré : lettres + touches de ton qui placent l'accent tout seul.
import { useEffect, useRef } from 'react'
import { applyTone, stripTones, type Tone } from '../lib/pinyin'
import { Icon } from './icons'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnmü']
const TONES: { t: Tone; mark: string; label: string }[] = [
  { t: 1, mark: 'ā', label: '1' },
  { t: 2, mark: 'á', label: '2' },
  { t: 3, mark: 'ǎ', label: '3' },
  { t: 4, mark: 'à', label: '4' },
]

/**
 * La saisie est une liste de segments ; un segment se termine quand on choisit un ton
 * ou qu'on tape un espace. La touche de ton s'applique au segment en cours.
 */
export type PinyinInput = { done: string[]; current: string }

export const emptyInput: PinyinInput = { done: [], current: '' }

export function inputText(v: PinyinInput) {
  return [...v.done, v.current].filter(Boolean).join(' ')
}

function press(v: PinyinInput, key: string): PinyinInput {
  if (key === 'back') {
    if (v.current) return { ...v, current: v.current.slice(0, -1) }
    if (!v.done.length) return v
    // Revient sur le dernier segment, sans son ton
    const last = v.done[v.done.length - 1]
    return { done: v.done.slice(0, -1), current: stripTones(last) }
  }
  if (key === 'space') {
    if (!v.current) return v
    return { done: [...v.done, v.current], current: '' }
  }
  if (key.startsWith('tone')) {
    const t = Number(key.slice(4)) as Tone
    if (!v.current) {
      // Pas de segment en cours : on change le ton du dernier segment
      if (!v.done.length) return v
      const last = v.done[v.done.length - 1]
      return { done: [...v.done.slice(0, -1), applyTone(last, t)], current: '' }
    }
    return { done: [...v.done, applyTone(v.current, t)], current: '' }
  }
  if (v.current.length > 7) return v
  return { ...v, current: v.current + key }
}

type Props = {
  value: PinyinInput
  onChange: (v: PinyinInput) => void
  onSubmit: () => void
  disabled?: boolean
}

export function PinyinKeyboard({ value, onChange, onSubmit, disabled }: Props) {
  // Référence à jour : plusieurs touches peuvent arriver avant le rendu suivant
  const latest = useRef(value)
  latest.current = value
  const apply = (k: string) => {
    const next = press(latest.current, k)
    latest.current = next
    onChange(next)
  }
  const tap = (k: string) => {
    if (disabled) return
    apply(k)
  }

  // Clavier physique (pratique sur ordinateur) : chiffres 1-4 = tons, v = ü
  useEffect(() => {
    if (disabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toLowerCase()
      let mapped: string | null = null
      if (/^[a-z]$/.test(k)) mapped = k === 'v' ? 'ü' : k
      else if (k === 'ü') mapped = 'ü'
      else if (/^[1-4]$/.test(k)) mapped = 'tone' + k
      else if (k === '5' || k === ' ') mapped = 'space'
      else if (k === 'backspace') mapped = 'back'
      else if (k === 'enter') {
        e.preventDefault()
        onSubmit()
        return
      }
      if (mapped) {
        e.preventDefault()
        apply(mapped)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, onSubmit, disabled])

  return (
    <div className={'kb' + (disabled ? ' kb-disabled' : '')}>
      <div className="kb-tones">
        {TONES.map(({ t, mark, label }) => (
          <button key={t} className={`kb-key kb-tone t${t}`} onClick={() => tap('tone' + t)} aria-label={`Ton ${label}`}>
            <span className="kb-tone-mark">{mark}</span>
            <span className="kb-tone-num">{label}</span>
          </button>
        ))}
      </div>
      {ROWS.map((row, i) => (
        <div className="kb-row" key={i}>
          {[...row].map((k) => (
            <button key={k} className="kb-key" onClick={() => tap(k)}>
              {k}
            </button>
          ))}
          {i === 2 && (
            <button className="kb-key kb-wide" onClick={() => tap('back')} aria-label="Effacer">
              <Icon name="delete" size={20} />
            </button>
          )}
        </div>
      ))}
      <div className="kb-row">
        <button className="kb-key kb-space" onClick={() => tap('space')}>
          espace · ton neutre
        </button>
        <button className="kb-key kb-submit" onClick={onSubmit}>
          Vérifier
        </button>
      </div>
    </div>
  )
}
