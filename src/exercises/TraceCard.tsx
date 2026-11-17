// Tracé : écrire les caractères de mémoire, trait par trait, dans le bon ordre.
import { useState } from 'react'
import type { Word } from '../data/hsk3'
import { AudioButton, Pinyin } from '../components/ui'
import { StrokeWriter, type QuizResult } from '../components/StrokeWriter'
import { Icon } from '../components/icons'
import { FACET_INFO, getState } from '../lib/store'
import { Rating, type Grade } from '../lib/srs'
import { Prompt, ResultPanel, type Verdict } from './common'

export function TraceCard({ word, cardKey, onGrade }: { word: Word; cardKey: string; onGrade: (g: Grade) => void }) {
  const chars = [...word.hanzi]
  // Première fois : on trace avec le modèle en transparence
  const [firstTime] = useState(() => (getState().cards[cardKey]?.reps ?? 0) === 0)
  const [outline, setOutline] = useState(firstTime)
  const [idx, setIdx] = useState(0)
  const [results, setResults] = useState<QuizResult[]>([])
  const [hint, setHint] = useState(0)
  const [reveal, setReveal] = useState(0)
  const [gaveUp, setGaveUp] = useState(false)
  const [verdict, setVerdict] = useState<Verdict | null>(null)

  const size = Math.min(260, Math.round((Math.min(window.innerWidth, 480) - 64) * 0.8))

  function finish(all: QuizResult[], abandoned: boolean, usedOutline: boolean) {
    const mistakes = all.reduce((a, r) => a + r.mistakes, 0)
    const hints = all.reduce((a, r) => a + r.hints, 0)
    const perChar = (mistakes + hints * 2) / chars.length
    let v: Verdict
    if (abandoned) v = { tone: 'bad', title: 'Regarde bien l’ordre des traits', detail: 'Ce mot reviendra très vite.', grade: Rating.Again }
    else if (perChar === 0 && !usedOutline) v = { tone: 'good', title: 'Tracé parfait !', grade: Rating.Good }
    else if (perChar === 0) v = { tone: 'good', title: 'Bien tracé, avec le modèle', detail: 'La prochaine fois, ce sera sans modèle.', grade: Rating.Good }
    else if (perChar <= 3)
      v = { tone: 'mid', title: 'Presque', detail: `${mistakes} erreur${mistakes > 1 ? 's' : ''}${hints ? `, ${hints} indice${hints > 1 ? 's' : ''}` : ''}`, grade: Rating.Hard }
    else v = { tone: 'bad', title: 'Encore un peu d’entraînement', detail: `${mistakes} erreurs de trait`, grade: Rating.Again }
    setVerdict(v)
  }

  function onCharDone(r: QuizResult) {
    const all = [...results, r]
    setResults(all)
    if (idx + 1 < chars.length) {
      setTimeout(() => setIdx(idx + 1), 450)
    } else {
      finish(all, false, outline)
    }
  }

  return (
    <div className="card exercise trace-ex">
      <Prompt facet={FACET_INFO.trace.label} color={FACET_INFO.trace.color}>
        Trace le mot qui signifie :
      </Prompt>
      <div className="trace-q">
        <div className="trace-fr">{word.fr}</div>
        <div className="answer-py center">
          <Pinyin syl={word.syl} size={24} />
          <AudioButton text={word.tts ?? word.hanzi} size={40} />
        </div>
      </div>

      {chars.length > 1 && (
        <div className="trace-progress">
          {chars.map((c, i) => (
            <span key={i} className={'tp-dot' + (i < idx || verdict ? ' done' : i === idx ? ' active' : '')}>
              {i < idx || verdict ? c : '?'}
            </span>
          ))}
        </div>
      )}

      <div className="trace-area">
        <StrokeWriter
          key={`${chars[idx]}-${idx}-${outline}`}
          char={chars[idx]}
          size={size}
          mode={verdict && !gaveUp ? 'static' : 'quiz'}
          outline={outline}
          hintSignal={hint}
          revealSignal={reveal}
          onQuizDone={onCharDone}
        />
      </div>

      {verdict ? (
        <ResultPanel verdict={verdict} cardKey={cardKey} onGrade={onGrade} />
      ) : (
        <div className="trace-tools">
          <button className="tool-btn" onClick={() => setHint((n) => n + 1)}>
            <Icon name="bulb" size={18} />
            Indice
          </button>
          <button className={'tool-btn' + (outline ? ' on' : '')} onClick={() => setOutline((o) => !o)}>
            <Icon name="eye" size={18} />
            Modèle
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setGaveUp(true)
              setReveal((n) => n + 1)
              finish(results, true, outline)
            }}
          >
            <Icon name="play" size={18} />
            Montre-moi
          </button>
        </div>
      )}
    </div>
  )
}
