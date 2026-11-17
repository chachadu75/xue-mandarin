// Pinyin : écrire le pinyin avec les tons grâce au clavier intégré. Corrigé automatiquement.
import { useCallback, useState } from 'react'
import type { Word } from '../data/hsk3'
import { AudioButton, Hanzi, Pinyin } from '../components/ui'
import { PinyinKeyboard, emptyInput, inputText, type PinyinInput } from '../components/PinyinKeyboard'
import { checkPinyin, joinSyllables, toneOf, TONE_NAMES } from '../lib/pinyin'
import { speak } from '../lib/speech'
import { FACET_INFO } from '../lib/store'
import { Rating, type Grade } from '../lib/srs'
import { Prompt, ResultPanel, type Verdict } from './common'

export function PinyinCard({ word, cardKey, onGrade }: { word: Word; cardKey: string; onGrade: (g: Grade) => void }) {
  const [input, setInput] = useState<PinyinInput>(emptyInput)
  const [verdict, setVerdict] = useState<(Verdict & { perSyl: (boolean | null)[] }) | null>(null)

  const submit = useCallback(() => {
    if (verdict) return
    const text = inputText(input)
    if (!text) return
    const r = checkPinyin(text, word.syl, word.hanzi)
    const wrongTones = r.perSyl.filter((x) => x === false).length
    let v: Verdict
    if (r.status === 'correct') {
      v = { tone: 'good', title: 'Parfait !', detail: joinSyllables(word.syl), grade: Rating.Good }
    } else if (r.status === 'neutral') {
      v = {
        tone: 'mid',
        title: 'Presque : attention au ton neutre',
        detail: 'Les syllabes en gris se prononcent légères, sans ton.',
        grade: Rating.Hard,
      }
    } else if (r.status === 'tone') {
      const bad = word.syl.filter((_, i) => r.perSyl[i] === false).map((s) => `${s} : ${TONE_NAMES[toneOf(s)]}`)
      v = {
        tone: wrongTones < word.syl.length ? 'mid' : 'bad',
        title: 'Bonnes syllabes, mauvais ton',
        detail: bad.join(' · '),
        grade: wrongTones < word.syl.length && word.syl.length > 1 ? Rating.Hard : Rating.Again,
      }
    } else {
      v = { tone: 'bad', title: 'Pas tout à fait', detail: `Réponse : ${joinSyllables(word.syl)}`, grade: Rating.Again }
    }
    setVerdict({ ...v, perSyl: r.perSyl })
    speak(word.tts ?? word.hanzi)
  }, [input, verdict, word])

  return (
    <div className="card exercise pinyin-ex">
      <Prompt facet={FACET_INFO.pinyin.label} color={FACET_INFO.pinyin.color}>
        Écris le pinyin, avec les tons
      </Prompt>
      <div className="pinyin-q">
        <Hanzi word={word} size={[...word.hanzi].length > 2 ? 52 : 64} colored={!!verdict} />
        <div className="pinyin-fr">{word.fr}</div>
      </div>

      <div className={'pinyin-field' + (verdict ? ` pf-${verdict.tone}` : '')}>
        {inputText(input) ? (
          <span className="pf-text">
            {input.done.map((seg, i) => (
              <span key={i} className={`t${toneOf(seg)}`}>
                {seg}
              </span>
            ))}
            {input.current && <span>{input.current}</span>}
          </span>
        ) : (
          <span className="ph">ex. : xué → x, u, e, puis la touche á</span>
        )}
        {!verdict && <span className="caret" />}
      </div>

      {verdict ? (
        <div className="fade-in">
          <div className="answer-py center">
            <Pinyin syl={word.syl} size={30} marks={verdict.perSyl} />
            <AudioButton text={word.tts ?? word.hanzi} />
          </div>
          <ResultPanel verdict={verdict} cardKey={cardKey} onGrade={onGrade} />
        </div>
      ) : (
        <>
          <div className="spacer" />
          <button
            className="link-btn"
            onClick={() => {
              setVerdict({
                tone: 'bad',
                title: 'Voici la réponse',
                detail: 'Ce mot reviendra très vite.',
                grade: Rating.Again,
                perSyl: word.syl.map(() => null),
              })
              speak(word.tts ?? word.hanzi)
            }}
          >
            Je ne sais pas
          </button>
          <PinyinKeyboard value={input} onChange={setInput} onSubmit={submit} />
        </>
      )}
    </div>
  )
}
