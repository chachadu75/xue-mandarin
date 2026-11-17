// Audio : synthèse vocale (modèle), reconnaissance vocale et enregistrement.
import { pinyin } from 'pinyin-pro'
import { stripTones } from './pinyin'
import { getState } from './store'

// ——— Synthèse vocale ———

let zhVoice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (!('speechSynthesis' in window)) return
  const voices = speechSynthesis.getVoices()
  const zh = voices.filter((v) => /^zh[-_](CN|Hans)/i.test(v.lang) || v.lang === 'zh')
  const preferred = ['Tingting', 'Ting-Ting', 'Lili', 'Yu-shu', 'Google 普通话', 'Xiaoxiao', 'Yunxi']
  zhVoice = zh.find((v) => preferred.some((p) => v.name.includes(p))) ?? zh[0] ?? null
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, rate?: number): Promise<void> {
  return new Promise((resolve) => {
    if (!canSpeak()) return resolve()
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    if (!zhVoice) pickVoice()
    if (zhVoice) u.voice = zhVoice
    u.rate = rate ?? getState().settings.rate
    u.onend = () => resolve()
    u.onerror = () => resolve()
    speechSynthesis.speak(u)
  })
}

// ——— Reconnaissance vocale ———

type SR = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

function SRClass(): (new () => SR) | null {
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function canRecognize() {
  return typeof window !== 'undefined' && !!SRClass()
}

export type Listening = { stop(): void; result: Promise<string[]> }

/** Écoute l'utilisateur ; renvoie les transcriptions candidates. */
export function listen(): Listening {
  const Cls = SRClass()
  if (!Cls) return { stop() {}, result: Promise.reject(new Error('unsupported')) }
  const rec = new Cls()
  rec.lang = 'zh-CN'
  rec.interimResults = false
  rec.maxAlternatives = 5
  rec.continuous = false
  const result = new Promise<string[]>((resolve, reject) => {
    let done = false
    rec.onresult = (e) => {
      const out: string[] = []
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        for (let j = 0; j < r.length; j++) out.push(r[j].transcript.trim())
      }
      done = true
      resolve(out.filter(Boolean))
    }
    rec.onerror = (e) => {
      done = true
      reject(new Error(e.error))
    }
    rec.onend = () => {
      if (!done) resolve([])
    }
  })
  rec.start()
  return { stop: () => rec.stop(), result }
}

export type SpeechVerdict = {
  status: 'correct' | 'tone' | 'wrong' | 'silence'
  heard: string
  heardPinyin: string
}

const PUNCT = /[\s，。！？、,.!?]/g

/** Compare ce que la reconnaissance a entendu au mot attendu. */
export function judgeSpeech(alternatives: string[], hanzi: string, syl: string[]): SpeechVerdict {
  if (!alternatives.length) return { status: 'silence', heard: '', heardPinyin: '' }
  const target = syl.join(' ').toLowerCase()
  const targetBare = stripTones(target).replace(/ü/g, 'v')
  let best: SpeechVerdict | null = null
  for (const alt of alternatives) {
    const text = alt.replace(PUNCT, '')
    const py = pinyin(text, { type: 'array' }).join(' ').toLowerCase()
    if (text.includes(hanzi) || py === target || (' ' + py + ' ').includes(' ' + target + ' ')) {
      return { status: 'correct', heard: text, heardPinyin: py }
    }
    const bare = stripTones(py).replace(/ü/g, 'v')
    if (bare === targetBare || (' ' + bare + ' ').includes(' ' + targetBare + ' ')) {
      best ??= { status: 'tone', heard: text, heardPinyin: py }
    }
  }
  if (best) return best
  const first = alternatives[0].replace(PUNCT, '')
  return { status: 'wrong', heard: first, heardPinyin: pinyin(first) }
}

// ——— Enregistrement pour se réécouter ———

export type Recording = { stop(): Promise<string | null> }

export async function startRecording(): Promise<Recording | null> {
  try {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') return null
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const rec = new MediaRecorder(stream)
    const chunks: Blob[] = []
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
    rec.start()
    return {
      stop: () =>
        new Promise((resolve) => {
          rec.onstop = () => {
            stream.getTracks().forEach((t) => t.stop())
            resolve(chunks.length ? URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })) : null)
          }
          try {
            rec.stop()
          } catch {
            resolve(null)
          }
        }),
    }
  } catch {
    return null
  }
}
