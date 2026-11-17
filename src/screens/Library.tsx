// Lexique : tous les mots HSK 3 par thème, recherche, fiche détaillée avec entraînement libre.
import { useMemo, useState } from 'react'
import { LESSONS, WORD_BY_ID, WORDS, type Word } from '../data/hsk3'
import { Icon } from '../components/icons'
import { AudioButton, Example, Hanzi, Pinyin } from '../components/ui'
import { StrokeWriter } from '../components/StrokeWriter'
import { joinSyllables, stripTones, toneOf } from '../lib/pinyin'
import { formatInterval, introduce, markKnown, wordLevel } from '../lib/srs'
import { cardKey, FACET_INFO, FACETS, useAppState } from '../lib/store'

const LEVELS = ['Nouveau', 'En cours', 'Jeune', 'Solide']

export function Library() {
  const s = useAppState()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const query = q.trim().toLowerCase()
  const match = (w: Word) => {
    if (!query) return true
    const py = joinSyllables(w.syl).toLowerCase()
    return w.hanzi.includes(query) || py.includes(query) || stripTones(py).includes(stripTones(query)) || w.fr.toLowerCase().includes(query)
  }

  return (
    <div className="screen library">
      <h1 className="screen-title">Lexique</h1>
      <div className="search">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="汉字, pinyin ou français" />
      </div>
      {LESSONS.map((l) => {
        const list = l.wordIds.map((id) => WORD_BY_ID[id]).filter(match)
        if (!list.length) return null
        const known = l.wordIds.filter((id) => s.introduced[id]).length
        return (
          <section key={l.id} className="lesson">
            <div className="lesson-head">
              <h2>{l.title}</h2>
              <span className="muted small">
                {known}/{l.wordIds.length}
              </span>
            </div>
            <div className="word-list">
              {list.map((w) => {
                const lvl = wordLevel(s, w.id)
                return (
                  <button key={w.id} className="word-row" onClick={() => setOpen(w.id)}>
                    <span className="wr-hz">
                      <Hanzi word={w} size={26} />
                    </span>
                    <span className="wr-text">
                      <Pinyin syl={w.syl} size={15} />
                      <span className="wr-fr">{w.fr}</span>
                    </span>
                    <span className={`lvl lvl-${lvl}`} title={LEVELS[lvl]} />
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
      {query && !WORDS.some(match) && <p className="muted center">Aucun mot trouvé.</p>}
      {open && <WordSheet word={WORD_BY_ID[open]} onClose={() => setOpen(null)} />}
    </div>
  )
}

function WordSheet({ word, onClose }: { word: Word; onClose: () => void }) {
  const s = useAppState()
  const chars = [...word.hanzi]
  const [ci, setCi] = useState(0)
  const [mode, setMode] = useState<'animate' | 'quiz'>('animate')
  const [nonce, setNonce] = useState(0)
  const [outline, setOutline] = useState(true)
  const [msg, setMsg] = useState('')
  const introduced = !!s.introduced[word.id]

  const statuses = useMemo(
    () =>
      FACETS.map((f) => {
        const c = s.cards[cardKey(word.id, f)]
        let text = 'pas encore vu'
        if (c && c.reps > 0) {
          const ms = c.due - Date.now()
          text = ms <= 0 ? 'à revoir maintenant' : `dans ${formatInterval(ms)}`
        } else if (c) text = 'à découvrir'
        return { f, text }
      }),
    [s.cards, word.id],
  )

  return (
    <div className="sheet fade-in">
      <header className="sheet-head">
        <button className="icon-btn" onClick={onClose} aria-label="Retour">
          <Icon name="back" size={24} />
        </button>
        <span className="muted small">{LEVELS[wordLevel(s, word.id)]}</span>
      </header>
      <div className="sheet-body">
        <div className="intro-top">
          <Hanzi word={word} size={chars.length > 2 ? 56 : 72} />
          <div className="intro-py">
            <Pinyin syl={word.syl} size={26} />
            <AudioButton text={word.tts ?? word.hanzi} size={44} />
          </div>
          <div className="intro-fr">{word.fr}</div>
        </div>

        <div className="section-label">
          Entraînement au tracé
          <span className="seg">
            {chars.map((c, i) => (
              <button key={i} className={i === ci ? 'on' : ''} onClick={() => setCi(i)}>
                {c}
              </button>
            ))}
          </span>
        </div>
        <div className="trace-area">
          <StrokeWriter
            key={`${ci}-${nonce}-${outline}`}
            char={chars[ci]}
            size={220}
            mode={mode}
            outline={outline}
            color={`var(--t${toneOf(word.syl[ci])})`}
            onQuizDone={(r) => setMsg(r.mistakes === 0 ? 'Parfait !' : `${r.mistakes} erreur${r.mistakes > 1 ? 's' : ''}`)}
          />
        </div>
        <div className="trace-tools">
          <button
            className="tool-btn"
            onClick={() => {
              setMsg('')
              setMode('animate')
              setNonce((n) => n + 1)
            }}
          >
            <Icon name="play" size={18} /> Animation
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setMsg('')
              setMode('quiz')
              setNonce((n) => n + 1)
            }}
          >
            <Icon name="pencil" size={18} /> Tracer
          </button>
          <button className={'tool-btn' + (outline ? ' on' : '')} onClick={() => setOutline((o) => !o)}>
            <Icon name="eye" size={18} /> Modèle
          </button>
        </div>
        {msg && <p className="center ok-msg">{msg}</p>}

        <div className="section-label">Exemple</div>
        <Example word={word} open />

        <div className="section-label">Révisions</div>
        <div className="status-list">
          {statuses.map(({ f, text }) => (
            <div key={f} className="status-row">
              <span className="dot" style={{ background: FACET_INFO[f].color }} />
              <span>{FACET_INFO[f].label}</span>
              <span className="muted">{text}</span>
            </div>
          ))}
        </div>

        {!introduced && (
          <div className="intro-actions">
            <button className="btn btn-ghost" onClick={() => markKnown(word.id)}>
              Je le connais déjà
            </button>
            <button className="btn btn-primary" onClick={() => introduce(word.id)}>
              Ajouter aux révisions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
