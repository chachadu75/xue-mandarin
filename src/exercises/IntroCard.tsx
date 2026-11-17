// Découverte d'un nouveau mot : sens, son, ordre des traits, exemple.
import { useEffect, useState } from 'react'
import type { Word } from '../data/hsk3'
import { AudioButton, Example, Hanzi, Pinyin } from '../components/ui'
import { StrokeWriter } from '../components/StrokeWriter'
import { speak } from '../lib/speech'
import { useAppState } from '../lib/store'
import { toneOf, TONE_NAMES } from '../lib/pinyin'
import { Icon } from '../components/icons'

export function IntroCard({ word, onLearn, onKnown }: { word: Word; onLearn: () => void; onKnown?: () => void }) {
  const { settings } = useAppState()
  const chars = [...word.hanzi]
  const [replay, setReplay] = useState(0)

  useEffect(() => {
    if (settings.autoAudio) speak(word.tts ?? word.hanzi)
  }, [word, settings.autoAudio])

  const strokeSize = chars.length === 1 ? 168 : chars.length === 2 ? 132 : chars.length === 3 ? 96 : 74

  return (
    <div className="card intro">
      <div className="intro-badge">
        <Icon name="sparkle" size={14} /> Nouveau mot
      </div>
      <div className="intro-top">
        <Hanzi word={word} size={chars.length > 2 ? 54 : 68} />
        <div className="intro-py">
          <Pinyin syl={word.syl} size={26} />
          <AudioButton text={word.tts ?? word.hanzi} size={44} />
        </div>
        <div className="intro-fr">{word.fr}</div>
      </div>

      <div className="section-label">
        Ordre des traits
        <button className="link-btn small" onClick={() => setReplay((n) => n + 1)}>
          <Icon name="replay" size={14} /> Rejouer
        </button>
      </div>
      <div className="stroke-row" key={replay}>
        {chars.map((c, i) => (
          <div key={c + i} className="stroke-col">
            <StrokeWriter char={c} size={strokeSize} mode="animate" color={`var(--t${toneOf(word.syl[i])})`} />
            <span className={`stroke-py t${toneOf(word.syl[i])}`}>{word.syl[i]}</span>
          </div>
        ))}
      </div>

      <div className="tone-hints">
        {word.syl.map((s, i) => (
          <span key={i} className={`tone-hint t${toneOf(s)}`}>
            {chars[i]} {s} · {TONE_NAMES[toneOf(s)]}
          </span>
        ))}
      </div>

      <div className="section-label">Exemple</div>
      <Example word={word} open />

      <div className="intro-actions">
        {onKnown && (
          <button className="btn btn-ghost" onClick={onKnown}>
            Je le connais déjà
          </button>
        )}
        <button className="btn btn-primary" onClick={onLearn}>
          C'est noté, on pratique
        </button>
      </div>
    </div>
  )
}
