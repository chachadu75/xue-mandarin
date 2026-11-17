// Barre de notation façon Anki + panneau de résultat.
import { useMemo, useState } from 'react'
import { previewIntervals, Rating, type Grade } from '../lib/srs'
import { Icon } from '../components/icons'

const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: Rating.Again, label: 'À revoir', cls: 'g-again' },
  { g: Rating.Hard, label: 'Difficile', cls: 'g-hard' },
  { g: Rating.Good, label: 'Bien', cls: 'g-good' },
  { g: Rating.Easy, label: 'Facile', cls: 'g-easy' },
]

export function GradeBar({ cardKey, onGrade, highlight }: { cardKey: string; onGrade: (g: Grade) => void; highlight?: Grade }) {
  const iv = useMemo(() => previewIntervals(cardKey), [cardKey])
  return (
    <div className="grade-bar">
      {GRADES.map(({ g, label, cls }) => (
        <button key={g} className={`grade ${cls}` + (highlight === g ? ' grade-hl' : '')} onClick={() => onGrade(g)}>
          <span className="grade-label">{label}</span>
          <span className="grade-iv">{iv[g]}</span>
        </button>
      ))}
    </div>
  )
}

export type Verdict = { tone: 'good' | 'mid' | 'bad'; title: string; detail?: string; grade: Grade }

/** Résultat d'un exercice corrigé automatiquement : un bouton Continuer, et la note modifiable. */
export function ResultPanel({ verdict, cardKey, onGrade }: { verdict: Verdict; cardKey: string; onGrade: (g: Grade) => void }) {
  const [adjust, setAdjust] = useState(false)
  const icon = verdict.tone === 'good' ? 'check' : verdict.tone === 'mid' ? 'bulb' : 'replay'
  return (
    <div className={`result result-${verdict.tone}`}>
      <div className="result-head">
        <span className="result-icon">
          <Icon name={icon} size={20} />
        </span>
        <div>
          <div className="result-title">{verdict.title}</div>
          {verdict.detail && <div className="result-detail">{verdict.detail}</div>}
        </div>
      </div>
      {adjust ? (
        <GradeBar cardKey={cardKey} onGrade={onGrade} highlight={verdict.grade} />
      ) : (
        <>
          <button className="btn btn-primary btn-block" onClick={() => onGrade(verdict.grade)} autoFocus>
            Continuer
          </button>
          <button className="link-btn" onClick={() => setAdjust(true)}>
            Changer la note
          </button>
        </>
      )}
    </div>
  )
}

export function Prompt({ facet, color, children }: { facet: string; color: string; children: React.ReactNode }) {
  return (
    <div className="prompt">
      <span className="prompt-tag" style={{ ['--tag' as string]: color }}>
        {facet}
      </span>
      <span className="prompt-text">{children}</span>
    </div>
  )
}
