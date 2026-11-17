// Lecture : voir les caractères, se souvenir du son et du sens, puis se noter (Anki).
import { useEffect, useState } from 'react'
import type { Word } from '../data/hsk3'
import { AudioButton, Example, Hanzi, Pinyin } from '../components/ui'
import { speak } from '../lib/speech'
import { FACET_INFO, useAppState } from '../lib/store'
import type { Grade } from '../lib/srs'
import { GradeBar, Prompt } from './common'

export function ReadCard({ word, cardKey, onGrade }: { word: Word; cardKey: string; onGrade: (g: Grade) => void }) {
  const [shown, setShown] = useState(false)
  const { settings } = useAppState()

  useEffect(() => {
    if (shown && settings.autoAudio) speak(word.tts ?? word.hanzi)
  }, [shown, word, settings.autoAudio])

  return (
    <div className="card exercise" onClick={() => !shown && setShown(true)}>
      <Prompt facet={FACET_INFO.read.label} color={FACET_INFO.read.color}>
        Comment se lit ce mot, et que veut-il dire ?
      </Prompt>
      <div className="big-hanzi">
        <Hanzi word={word} size={[...word.hanzi].length > 2 ? 64 : 84} colored={shown} />
      </div>
      {shown ? (
        <div className="answer fade-in">
          <div className="answer-py">
            <Pinyin syl={word.syl} size={28} />
            <AudioButton text={word.tts ?? word.hanzi} />
          </div>
          <div className="answer-fr">{word.fr}</div>
          <Example word={word} open />
          <div className="spacer" />
          <GradeBar cardKey={cardKey} onGrade={onGrade} />
        </div>
      ) : (
        <>
          <div className="spacer" />
          <button className="btn btn-primary btn-block" onClick={() => setShown(true)}>
            Afficher la réponse
          </button>
        </>
      )}
    </div>
  )
}
