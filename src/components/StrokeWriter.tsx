// Grille de tracé (米字格) autour de Hanzi Writer.
import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

const BASE = import.meta.env.BASE_URL

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadChar(char: string, onLoad: (d: any) => void, onError: (e?: unknown) => void) {
  fetch(`${BASE}strokes/${encodeURIComponent(char)}.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('local'))))
    .catch(() => fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`).then((r) => r.json()))
    .then(onLoad, onError)
}

function css(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export type QuizResult = { mistakes: number; hints: number }

type Props = {
  char: string
  size: number
  mode: 'animate' | 'quiz' | 'static'
  /** afficher le modèle en gris pendant le quiz */
  outline?: boolean
  /** couleur du trait (par ex. la couleur du ton) */
  color?: string
  /** incrémenter pour demander un indice (quiz) ou rejouer l'animation */
  hintSignal?: number
  /** incrémenter pour abandonner : montre l'animation complète */
  revealSignal?: number
  onQuizDone?: (r: QuizResult) => void
}

export function StrokeWriter({ char, size, mode, outline = false, color, hintSignal = 0, revealSignal = 0, onQuizDone }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const writer = useRef<HanziWriter | null>(null)
  const nextStroke = useRef(0)
  const hints = useRef(0)
  const doneCb = useRef(onQuizDone)
  doneCb.current = onQuizDone

  useEffect(() => {
    if (!host.current) return
    host.current.innerHTML = ''
    nextStroke.current = 0
    hints.current = 0
    // Hanzi Writer interpole les couleurs : il lui faut une vraie valeur, pas var(--x)
    const varName = color?.match(/^var\((--[\w-]+)\)$/)?.[1]
    const stroke = varName ? css(varName, '#1C2024') : (color ?? css('--ink', '#1C2024'))
    const w = HanziWriter.create(host.current, char, {
      width: size,
      height: size,
      padding: Math.round(size * 0.06),
      charDataLoader: loadChar,
      showCharacter: mode === 'static',
      showOutline: mode === 'animate' || outline,
      strokeColor: stroke,
      outlineColor: css('--outline', '#E4E6EE'),
      drawingColor: css('--accent', '#7C5CFF'),
      highlightColor: css('--accent-2', '#FF7AB6'),
      drawingWidth: Math.max(14, size / 14),
      strokeAnimationSpeed: 1.4,
      delayBetweenStrokes: 180,
      highlightOnComplete: true,
      renderer: 'svg',
    })
    writer.current = w
    if (mode === 'animate') {
      w.animateCharacter()
    } else if (mode === 'quiz') {
      w.quiz({
        leniency: 1.15,
        showHintAfterMisses: 3,
        onCorrectStroke: (d) => {
          nextStroke.current = d.strokeNum + 1
        },
        onComplete: (summary) => {
          doneCb.current?.({ mistakes: summary.totalMistakes, hints: hints.current })
        },
      })
    }
    return () => {
      try {
        w.cancelQuiz()
      } catch {
        /* rien */
      }
      writer.current = null
    }
  }, [char, size, mode, outline, color])

  // Indice : surligne le trait attendu (quiz) ou rejoue l'animation
  useEffect(() => {
    if (!hintSignal || !writer.current) return
    if (mode === 'quiz') {
      hints.current++
      writer.current.highlightStroke(nextStroke.current)
    } else {
      writer.current.animateCharacter()
    }
  }, [hintSignal, mode])

  useEffect(() => {
    if (!revealSignal || !writer.current) return
    const w = writer.current
    w.cancelQuiz()
    w.hideCharacter({ duration: 0 })
    w.showOutline()
    w.animateCharacter()
  }, [revealSignal])

  return (
    <div className="stroke-box" style={{ width: size, height: size }}>
      <svg className="grid" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <rect x="1" y="1" width="98" height="98" rx="6" />
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="50" y1="0" x2="50" y2="100" />
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />
      </svg>
      <div
        ref={host}
        className="stroke-host"
        onClick={() => mode === 'animate' && writer.current?.animateCharacter()}
      />
    </div>
  )
}
