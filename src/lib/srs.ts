// Répétition espacée (FSRS, l'algorithme d'Anki) + construction de la session du jour.
import { createEmptyCard, fsrs, Rating, State, type Card, type Grade } from 'ts-fsrs'
import { WORDS, WORD_BY_ID } from '../data/hsk3'
import {
  FACETS,
  bumpDay,
  cardKey,
  dayKey,
  endOfStudyDay,
  getState,
  setState,
  type AppState,
  type Facet,
  type SCard,
} from './store'

export { Rating }
export type { Grade }

const scheduler = fsrs({ request_retention: 0.9, enable_fuzz: true, maximum_interval: 365 })

function toCard(c: SCard): Card {
  return { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined } as Card
}

function fromCard(c: Card): SCard {
  return {
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? new Date(c.last_review).getTime() : undefined,
  }
}

function emptyCard(): SCard {
  return fromCard(createEmptyCard(new Date()))
}

/** Intervalle prévu pour chaque note, pour l'afficher sous les boutons. */
export function previewIntervals(key: string): Record<Grade, string> {
  const c = getState().cards[key] ?? emptyCard()
  const now = new Date()
  const preview = scheduler.repeat(toCard(c), now)
  const out = {} as Record<Grade, string>
  for (const g of [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as Grade[]) {
    out[g] = formatInterval(preview[g].card.due.getTime() - now.getTime())
  }
  return out
}

export function formatInterval(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60000))
  if (min < 60) return `${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `${h} h`
  const d = Math.round(h / 24)
  if (d < 31) return `${d} j`
  const mo = Math.round(d / 30)
  if (mo < 12) return `${mo} mois`
  return `${(d / 365).toFixed(1).replace('.', ',')} an`
}

/** Enregistre une réponse et renvoie la carte mise à jour. */
export function review(key: string, grade: Grade): SCard {
  const s = getState()
  const c = s.cards[key] ?? emptyCard()
  const next = fromCard(scheduler.next(toCard(c), new Date(), grade).card)
  setState((st) => ({ ...st, cards: { ...st.cards, [key]: next } }))
  bumpDay({ reviews: 1, correct: grade >= Rating.Good ? 1 : 0 })
  return next
}

/** Marque un mot comme découvert et crée ses cartes. */
export function introduce(wordId: string) {
  const s = getState()
  if (s.introduced[wordId]) return
  const cards = { ...s.cards }
  for (const f of FACETS) cards[cardKey(wordId, f)] ??= emptyCard()
  setState((st) => ({ ...st, cards, introduced: { ...st.introduced, [wordId]: dayKey() } }))
  bumpDay({ newWords: 1 })
}

/** Marque un mot comme déjà connu : ses cartes partent directement en révision espacée. */
export function markKnown(wordId: string) {
  const now = new Date()
  const s = getState()
  const cards = { ...s.cards }
  for (const f of FACETS) {
    const r = scheduler.next(createEmptyCard(now), now, Rating.Easy)
    cards[cardKey(wordId, f)] = fromCard(r.card)
  }
  setState((st) => ({ ...st, cards, introduced: { ...st.introduced, [wordId]: st.introduced[wordId] ?? dayKey() } }))
}

// ——— Session ———

export type QueueItem = { kind: 'intro'; wordId: string } | { kind: 'card'; wordId: string; facet: Facet }

export function isDue(c: SCard, now = Date.now()): boolean {
  if (c.state === State.New) return true
  if (c.state === State.Learning || c.state === State.Relearning) return c.due <= now + 60_000
  return c.due <= endOfStudyDay(now)
}

export function enabledFacets(s: AppState): Facet[] {
  return FACETS.filter((f) => s.settings.facets[f])
}

export function dueItems(s: AppState, now = Date.now()): QueueItem[] {
  const facets = enabledFacets(s)
  const items: { item: QueueItem; due: number; learning: boolean }[] = []
  for (const wordId of Object.keys(s.introduced)) {
    for (const facet of facets) {
      const c = s.cards[cardKey(wordId, facet)]
      if (c && isDue(c, now)) {
        items.push({
          item: { kind: 'card', wordId, facet },
          due: c.due,
          learning: c.state !== State.Review,
        })
      }
    }
  }
  // Les cartes en apprentissage d'abord, puis les révisions les plus en retard
  items.sort((a, b) => Number(b.learning) - Number(a.learning) || a.due - b.due)
  return spreadWords(items.map((i) => i.item))
}

export function newWordsLeftToday(s: AppState): number {
  const today = dayKey()
  const introducedToday = Object.values(s.introduced).filter((d) => d === today).length
  return Math.max(0, s.settings.newPerDay - introducedToday)
}

export function nextNewWords(s: AppState, n: number): string[] {
  return WORDS.filter((w) => !s.introduced[w.id])
    .slice(0, n)
    .map((w) => w.id)
}

/** Évite d'enchaîner deux cartes du même mot. */
function spreadWords(items: QueueItem[]): QueueItem[] {
  const out: QueueItem[] = []
  const rest = [...items]
  while (rest.length) {
    const last = out[out.length - 1]
    let idx = rest.findIndex((it) => !last || it.wordId !== last.wordId)
    if (idx < 0) idx = 0
    out.push(rest.splice(idx, 1)[0])
  }
  return out
}

/**
 * File de la session guidée : révisions dues, entrecoupées de nouveaux mots.
 * Chaque nouveau mot = une fiche de découverte, puis ses exercices plus loin dans la file.
 */
export function buildSession(s: AppState, extraNew = 0): QueueItem[] {
  const due = dueItems(s)
  const newIds = nextNewWords(s, newWordsLeftToday(s) + extraNew)
  const facets = enabledFacets(s)
  // Nouveaux mots : découverte, puis ses exercices étalés et entremêlés avec les autres mots
  const slotted: { slot: number; item: QueueItem }[] = []
  newIds.forEach((wordId, i) => {
    slotted.push({ slot: i * 2.2, item: { kind: 'intro', wordId } })
    facets.forEach((facet, j) => slotted.push({ slot: i * 2.2 + 1 + j * 2.4, item: { kind: 'card', wordId, facet } }))
  })
  slotted.sort((a, b) => a.slot - b.slot)
  const fresh = spreadWords(slotted.map((s) => s.item))
  // Alterne révisions et nouveautés pour que ni l'un ni l'autre ne soit sacrifié si le temps manque
  const queue: QueueItem[] = []
  let a = 0
  let b = 0
  while (a < due.length || b < fresh.length) {
    if (a < due.length) queue.push(due[a++])
    if (b < fresh.length) queue.push(fresh[b++])
  }
  return queue
}

export function wordOf(item: QueueItem) {
  return WORD_BY_ID[item.wordId]
}

// ——— Statistiques ———

export type Progress = { introduced: number; mature: number; total: number; dueNow: number }

export function progress(s: AppState): Progress {
  const facets = enabledFacets(s)
  let mature = 0
  for (const id of Object.keys(s.introduced)) {
    const ok = facets.every((f) => {
      const c = s.cards[cardKey(id, f)]
      return c && c.state === State.Review && c.scheduled_days >= 7
    })
    if (ok) mature++
  }
  return {
    introduced: Object.keys(s.introduced).length,
    mature,
    total: WORDS.length,
    dueNow: dueItems(s).length,
  }
}

/** Niveau d'un mot : 0 nouveau, 1 en apprentissage, 2 jeune, 3 solide */
export function wordLevel(s: AppState, wordId: string): 0 | 1 | 2 | 3 {
  if (!s.introduced[wordId]) return 0
  const days = enabledFacets(s).map((f) => s.cards[cardKey(wordId, f)]?.scheduled_days ?? 0)
  const min = Math.min(...days)
  if (min >= 21) return 3
  if (min >= 3) return 2
  return 1
}
