// Oral : lire le mot à voix haute. La reconnaissance vocale vérifie ; on peut se réécouter.
import { useEffect, useRef, useState } from 'react'
import type { Word } from '../data/hsk3'
import { Hanzi, Pinyin } from '../components/ui'
import { Icon } from '../components/icons'
import { canRecognize, judgeSpeech, listen, speak, startRecording, type Listening, type Recording } from '../lib/speech'
import { FACET_INFO } from '../lib/store'
import { Rating, type Grade } from '../lib/srs'
import { GradeBar, Prompt, ResultPanel, type Verdict } from './common'

type Phase = 'idle' | 'listening' | 'done'

export function SpeakCard({ word, cardKey, onGrade, onSkip }: { word: Word; cardKey: string; onGrade: (g: Grade) => void; onSkip: () => void }) {
  const recognize = canRecognize()
  const [phase, setPhase] = useState<Phase>('idle')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [heard, setHeard] = useState<string>('')
  const [myAudio, setMyAudio] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [tries, setTries] = useState(0)
  // Écouter le modèle avant de parler aide : la note maximale devient « Difficile »
  const [peeked, setPeeked] = useState(false)
  const listening = useRef<Listening | null>(null)
  const recording = useRef<Recording | null>(null)

  useEffect(
    () => () => {
      listening.current?.stop()
      recording.current?.stop()
    },
    [],
  )

  async function start() {
    setError('')
    setPhase('listening')
    speechSynthesis?.cancel?.()
    // Enregistre en parallèle pour pouvoir se réécouter (ignoré si le navigateur refuse)
    if (!recognize) {
      recording.current = await startRecording()
      if (!recording.current) {
        setError('Micro indisponible. Autorise le micro dans les réglages du navigateur.')
        setPhase('idle')
      }
      return
    }
    try {
      recording.current = await startRecording()
    } catch {
      recording.current = null
    }
    const l = listen()
    listening.current = l
    try {
      const alts = await l.result
      const url = await recording.current?.stop()
      recording.current = null
      if (url) setMyAudio(url)
      const v = judgeSpeech(alts, word.hanzi, word.syl)
      setHeard(v.heard ? `${v.heard} (${v.heardPinyin})` : '')
      if (v.status === 'silence') {
        setError('Je n’ai rien entendu. Appuie et parle juste après.')
        setPhase('idle')
        return
      }
      const n = tries + 1
      setTries(n)
      if (v.status === 'correct') setVerdict({ tone: 'good', title: 'Bien prononcé !', grade: n === 1 && !peeked ? Rating.Good : Rating.Hard, detail: peeked ? 'Avec le modèle écouté avant.' : undefined })
      else if (v.status === 'tone')
        setVerdict({ tone: 'mid', title: 'Syllabes reconnues, tons à travailler', detail: 'Réécoute le modèle et compare avec ton enregistrement.', grade: Rating.Hard })
      else setVerdict({ tone: 'bad', title: 'Ce n’est pas ce que j’ai compris', detail: 'Écoute le modèle, puis réessaie.', grade: Rating.Again })
      setPhase('done')
    } catch (e) {
      await recording.current?.stop()
      recording.current = null
      const msg = (e as Error).message
      setError(
        msg === 'not-allowed' || msg === 'service-not-allowed'
          ? 'Accès au micro refusé. Autorise-le dans Réglages › Safari › Micro.'
          : 'La reconnaissance vocale n’a pas marché. Réessaie.',
      )
      setPhase('idle')
    }
  }

  async function stopManual() {
    // Mode sans reconnaissance : fin de l'enregistrement, auto-évaluation
    if (!recognize) {
      const url = await recording.current?.stop()
      recording.current = null
      if (url) setMyAudio(url)
      setPhase('done')
    } else {
      listening.current?.stop()
    }
  }

  return (
    <div className="card exercise speak-ex">
      <Prompt facet={FACET_INFO.speak.label} color={FACET_INFO.speak.color}>
        Lis ce mot à voix haute
      </Prompt>
      <div className="big-hanzi">
        <Hanzi word={word} size={[...word.hanzi].length > 2 ? 60 : 80} colored={phase === 'done'} />
      </div>

      {phase === 'done' ? (
        <div className="fade-in">
          <div className="answer-py center">
            <Pinyin syl={word.syl} size={28} />
          </div>
          <div className="answer-fr center">{word.fr}</div>
          {heard && <div className="heard">J’ai entendu : {heard}</div>}
          <div className="compare">
            <button className="compare-btn" onClick={() => speak(word.tts ?? word.hanzi)}>
              <Icon name="speaker" size={18} /> Modèle
            </button>
            {myAudio && (
              <button className="compare-btn mine" onClick={() => new Audio(myAudio).play()}>
                <Icon name="play" size={18} /> Ma voix
              </button>
            )}
            {recognize && (
              <button
                className="compare-btn"
                onClick={() => {
                  setVerdict(null)
                  setPhase('idle')
                }}
              >
                <Icon name="replay" size={18} /> Réessayer
              </button>
            )}
          </div>
          {verdict ? (
            <ResultPanel verdict={verdict} cardKey={cardKey} onGrade={onGrade} />
          ) : (
            <>
              <p className="muted center small">Compare les deux, puis note-toi.</p>
              <GradeBar cardKey={cardKey} onGrade={onGrade} />
            </>
          )}
        </div>
      ) : (
        <div className="mic-zone">
          <button
            className={'mic' + (phase === 'listening' ? ' mic-on' : '')}
            onClick={() => (phase === 'listening' ? stopManual() : start())}
            aria-label={phase === 'listening' ? 'Arrêter' : 'Parler'}
          >
            <Icon name="mic" size={38} />
          </button>
          <div className="mic-label">{phase === 'listening' ? 'Je t’écoute…' : 'Appuie et prononce le mot'}</div>
          {!recognize && (
            <p className="muted small center">
              La reconnaissance vocale n’est pas disponible ici : enregistre-toi, compare avec le modèle et note-toi.
            </p>
          )}
          {error && <p className="error small center">{error}</p>}
          <div className="speak-alt">
            <button className="link-btn" onClick={() => { setPeeked(true); speak(word.tts ?? word.hanzi) }}>
              <Icon name="speaker" size={14} /> Écouter d’abord
            </button>
            <button className="link-btn" onClick={onSkip}>
              <Icon name="skip" size={14} /> Je ne peux pas parler maintenant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
