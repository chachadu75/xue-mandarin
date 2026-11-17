// État persistant de l'app (localStorage) + petit store réactif.
import { useSyncExternalStore } from 'react'

export type Facet = 'read' | 'pinyin' | 'trace' | 'speak'
export const FACETS: Facet[] = ['read', 'pinyin', 'trace', 'speak']

export const FACET_INFO: Record<Facet, { label: string; short: string; color: string; hint: string }> = {
  read: { label: 'Lecture', short: 'Lire', color: 'var(--c-read)', hint: 'Reconnaître le mot écrit' },
  pinyin: { label: 'Pinyin', short: 'Pinyin', color: 'var(--c-pinyin)', hint: 'Écrire le pinyin avec les tons' },
  trace: { label: 'Tracé', short: 'Tracer', color: 'var(--c-trace)', hint: 'Tracer les caractères de mémoire' },
  speak: { label: 'Oral', short: 'Dire', color: 'var(--c-speak)', hint: 'Prononcer le mot' },
}

/** Carte FSRS sérialisée (dates en millisecondes). */
export type SCard = {
  due: number
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: number
  last_review?: number
}

export type DayStat = { reviews: number; correct: number; ms: number; newWords: number }

export type Settings = {
  minutes: number
  newPerDay: number
  facets: Record<Facet, boolean>
  rate: number
  autoAudio: boolean
}

export type AppState = {
  version: 1
  cards: Record<string, SCard>
  /** mot -> date (AAAA-MM-JJ) de sa découverte */
  introduced: Record<string, string>
  days: Record<string, DayStat>
  settings: Settings
}

const KEY = 'xue:v1'

export const DEFAULT_SETTINGS: Settings = {
  minutes: 10,
  newPerDay: 5,
  facets: { read: true, pinyin: true, trace: true, speak: true },
  rate: 0.8,
  autoAudio: true,
}

function fresh(): AppState {
  return { version: 1, cards: {}, introduced: {}, days: {}, settings: { ...DEFAULT_SETTINGS } }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fresh()
    const parsed = JSON.parse(raw) as AppState
    return {
      ...fresh(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings, facets: { ...DEFAULT_SETTINGS.facets, ...parsed.settings?.facets } },
    }
  } catch {
    return fresh()
  }
}

let state: AppState = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* stockage plein ou bloqué : on garde l'état en mémoire */
  }
}

export function getState() {
  return state
}

export function setState(update: (s: AppState) => AppState) {
  state = update(state)
  persist()
  listeners.forEach((l) => l())
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

export function exportState(): string {
  return JSON.stringify(state)
}

export function importState(json: string) {
  const parsed = JSON.parse(json) as AppState
  if (!parsed || parsed.version !== 1 || typeof parsed.cards !== 'object') throw new Error('Fichier invalide')
  setState(() => ({ ...fresh(), ...parsed }))
}

export function resetState() {
  setState(() => fresh())
}

/** Demande au navigateur de ne pas effacer les données (utile sur iOS). */
export function requestPersistence() {
  try {
    navigator.storage?.persist?.()
  } catch {
    /* ignoré */
  }
}

// ——— Dates ———

/** Journée « d'étude » : elle bascule à 4 h du matin, comme Anki. */
export function dayKey(t = Date.now()): string {
  const d = new Date(t - 4 * 3600_000)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export function endOfStudyDay(t = Date.now()): number {
  const d = new Date(t - 4 * 3600_000)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + 28 * 3600_000
}

export function cardKey(wordId: string, facet: Facet) {
  return `${wordId}:${facet}`
}

export function bumpDay(patch: Partial<DayStat>) {
  const k = dayKey()
  setState((s) => {
    const cur = s.days[k] ?? { reviews: 0, correct: 0, ms: 0, newWords: 0 }
    return {
      ...s,
      days: {
        ...s.days,
        [k]: {
          reviews: cur.reviews + (patch.reviews ?? 0),
          correct: cur.correct + (patch.correct ?? 0),
          ms: cur.ms + (patch.ms ?? 0),
          newWords: cur.newWords + (patch.newWords ?? 0),
        },
      },
    }
  })
}

/** Nombre de jours consécutifs avec au moins une révision (aujourd'hui ou hier inclus). */
export function streak(s: AppState): number {
  let n = 0
  let t = Date.now()
  if (!s.days[dayKey(t)]?.reviews) t -= 86400_000
  while (s.days[dayKey(t)]?.reviews) {
    n++
    t -= 86400_000
  }
  return n
}
