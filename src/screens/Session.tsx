// Session guidée : révisions + nouveaux mots, arrêt automatique au bout du temps choisi.
import { useEffect, useRef, useState } from 'react'
import { WORD_BY_ID } from '../data/hsk3'
import { Icon } from '../components/icons'
import { Hanzi, Ring } from '../components/ui'
import { IntroCard } from '../exercises/IntroCard'
import { ReadCard } from '../exercises/ReadCard'
import { PinyinCard } from '../exercises/PinyinCard'
import { TraceCard } from '../exercises/TraceCard'
import { SpeakCard } from '../exercises/SpeakCard'
import { buildSession, enabledFacets, introduce, markKnown, nextNewWords, review, Rating, type Grade, type QueueItem } from '../lib/srs'
import { bumpDay, cardKey, FACET_INFO, getState, requestPersistence } from '../lib/store'

type Item = QueueItem & { uid: number }
let uidSeq = 1
const tag = (q: QueueItem): Item => ({ ...q, uid: uidSeq++ })

export function Session({ extraNew = 0, onExit }: { extraNew?: number; onExit: () => void }) {
  const [queue, setQueue] = useState<Item[]>(() => buildSession(getState(), extraNew).map(tag))
  const [budget, setBudget] = useState(() => getState().settings.minutes * 60_000)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [tally, setTally] = useState({ cards: 0, good: 0, learned: [] as string[] })
  const startedAt = useRef(Date.now())
  const logged = useRef(0)

  useEffect(() => {
    requestPersistence()
    const t = setInterval(() => setElapsed(Date.now() - startedAt.current), 1000)
    return () => clearInterval(t)
  }, [])

  // Enregistre le temps passé (à la fin ou en quittant)
  const logTime = () => {
    const ms = Date.now() - startedAt.current
    bumpDay({ ms: ms - logged.current })
    logged.current = ms
  }
  useEffect(() => () => logTime(), [])

  const current = queue[0]

  function advance(nextQueue: Item[]) {
    const timeUp = Date.now() - startedAt.current >= budget
    if (!nextQueue.length || timeUp) {
      setQueue(nextQueue)
      setFinished(true)
      logTime()
    } else {
      setQueue(nextQueue)
    }
  }

  function onGrade(g: Grade) {
    if (!current || current.kind !== 'card') return
    const next = review(cardKey(current.wordId, current.facet), g)
    setTally((t) => ({ ...t, cards: t.cards + 1, good: t.good + (g >= Rating.Good ? 1 : 0) }))
    const rest = queue.slice(1)
    // Carte encore en apprentissage (revient dans moins de 20 min) : elle repasse dans cette session
    if (next.due - Date.now() < 20 * 60_000) {
      const at = Math.min(rest.length, g === Rating.Again ? 3 : 6)
      rest.splice(at, 0, tag({ kind: 'card', wordId: current.wordId, facet: current.facet }))
    }
    advance(rest)
  }

  function onLearn() {
    if (!current) return
    introduce(current.wordId)
    setTally((t) => ({ ...t, learned: [...t.learned, current.wordId] }))
    advance(queue.slice(1))
  }

  function onKnown() {
    if (!current) return
    markKnown(current.wordId)
    advance(queue.slice(1).filter((q) => q.wordId !== current.wordId))
  }

  function skipSpeaking() {
    // On retire l'oral pour le reste de la session
    advance(queue.slice(1).filter((q) => !(q.kind === 'card' && q.facet === 'speak')))
  }

  function keepGoing(minutes: number) {
    setBudget((b) => Math.max(b, Date.now() - startedAt.current) + minutes * 60_000)
    let q = queue
    if (!q.length) {
      // Plus rien à réviser : on ajoute quelques mots nouveaux
      const s = getState()
      const ids = nextNewWords(s, 3)
      const facets = enabledFacets(s)
      q = ids.flatMap((id) => [{ kind: 'intro', wordId: id } as QueueItem, ...facets.map((f) => ({ kind: 'card', wordId: id, facet: f }) as QueueItem)]).map(tag)
    }
    setQueue(q)
    setFinished(!q.length)
  }

  const progress = Math.min(1, elapsed / budget)
  const remaining = queue.length

  if (finished || !current) {
    return (
      <Summary
        tally={tally}
        minutes={Math.round(elapsed / 60000)}
        hasMore={remaining > 0}
        onMore={() => keepGoing(5)}
        onExit={onExit}
      />
    )
  }

  const word = WORD_BY_ID[current.wordId]
  const key = current.kind === 'card' ? cardKey(current.wordId, current.facet) : ''

  return (
    <div className="session">
      <header className="session-top">
        <button className="icon-btn" onClick={onExit} aria-label="Quitter la session">
          <Icon name="close" size={22} />
        </button>
        <div className="session-bar">
          <div className="session-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="session-meta">
          {current.kind === 'card' && <span className="dot" style={{ background: FACET_INFO[current.facet].color }} />}
          {remaining}
        </div>
      </header>
      <main className="session-main" key={current.uid}>
        {current.kind === 'intro' && <IntroCard word={word} onLearn={onLearn} onKnown={onKnown} />}
        {current.kind === 'card' && current.facet === 'read' && <ReadCard word={word} cardKey={key} onGrade={onGrade} />}
        {current.kind === 'card' && current.facet === 'pinyin' && <PinyinCard word={word} cardKey={key} onGrade={onGrade} />}
        {current.kind === 'card' && current.facet === 'trace' && <TraceCard word={word} cardKey={key} onGrade={onGrade} />}
        {current.kind === 'card' && current.facet === 'speak' && (
          <SpeakCard word={word} cardKey={key} onGrade={onGrade} onSkip={skipSpeaking} />
        )}
      </main>
    </div>
  )
}

function Summary({
  tally,
  minutes,
  hasMore,
  onMore,
  onExit,
}: {
  tally: { cards: number; good: number; learned: string[] }
  minutes: number
  hasMore: boolean
  onMore: () => void
  onExit: () => void
}) {
  const rate = tally.cards ? Math.round((tally.good / tally.cards) * 100) : 0
  return (
    <div className="summary fade-in">
      <div className="summary-emoji">🎉</div>
      <h1>Session terminée</h1>
      <p className="muted">太棒了！ Tài bàng le ! Excellent travail.</p>
      <div className="summary-ring">
        <Ring value={tally.cards ? tally.good / tally.cards : 0} size={150}>
          <div className="ring-big">{rate}%</div>
          <div className="ring-small">réussite</div>
        </Ring>
      </div>
      <div className="summary-stats">
        <div>
          <b>{tally.cards}</b>
          <span>cartes</span>
        </div>
        <div>
          <b>{tally.learned.length}</b>
          <span>mots nouveaux</span>
        </div>
        <div>
          <b>{Math.max(1, minutes)}</b>
          <span>min</span>
        </div>
      </div>
      {tally.learned.length > 0 && (
        <div className="summary-words">
          {tally.learned.map((id) => (
            <span key={id} className="chip">
              <Hanzi word={WORD_BY_ID[id]} size={22} /> <span className="chip-fr">{WORD_BY_ID[id].fr.split(/[;,]/)[0]}</span>
            </span>
          ))}
        </div>
      )}
      <div className="summary-actions">
        <button className="btn btn-primary btn-block" onClick={onExit}>
          Terminer
        </button>
        <button className="btn btn-ghost btn-block" onClick={onMore}>
          {hasMore ? 'Continuer 5 minutes' : 'Apprendre 3 mots de plus'}
        </button>
      </div>
    </div>
  )
}
