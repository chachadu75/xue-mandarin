// Outils pinyin : tons, placement des diacritiques, comparaison des réponses.

const MARKS: Record<string, string[]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
}

const MARKED: Record<string, [string, number]> = {}
for (const [base, list] of Object.entries(MARKS)) {
  list.forEach((m, i) => {
    MARKED[m] = [base, i + 1]
    MARKED[m.toUpperCase()] = [base.toUpperCase(), i + 1]
  })
}

export type Tone = 1 | 2 | 3 | 4 | 5

/** Ton d'une syllabe (5 = neutre). */
export function toneOf(syl: string): Tone {
  for (const ch of syl.normalize('NFC')) {
    const m = MARKED[ch]
    if (m) return m[1] as Tone
  }
  return 5
}

/** Retire les diacritiques de ton (garde le ü). */
export function stripTones(s: string): string {
  let out = ''
  for (const ch of s.normalize('NFC')) out += MARKED[ch]?.[0] ?? ch
  return out
}

/** Place le ton sur la bonne voyelle (règles a/e > ou > dernière voyelle). */
export function applyTone(letters: string, tone: Tone): string {
  const base = stripTones(letters)
  if (tone === 5) return base
  const lower = base.toLowerCase()
  let idx = -1
  if (lower.includes('a')) idx = lower.indexOf('a')
  else if (lower.includes('e')) idx = lower.indexOf('e')
  else if (lower.includes('ou')) idx = lower.indexOf('o')
  else {
    for (let i = lower.length - 1; i >= 0; i--) {
      if ('aeiouü'.includes(lower[i])) {
        idx = i
        break
      }
    }
  }
  if (idx < 0) return base
  const v = lower[idx]
  let marked = MARKS[v][tone - 1]
  if (base[idx] !== lower[idx]) marked = marked.toUpperCase()
  return base.slice(0, idx) + marked + base.slice(idx + 1)
}

/** Affichage d'un mot : syllabes collées, apostrophe devant a/e/o. */
export function joinSyllables(syl: string[]): string {
  return syl
    .map((s, i) => (i > 0 && /^[aeoāáǎàēéěèōóǒò]/i.test(s.normalize('NFC')) ? "'" + s : s))
    .join('')
}

function clean(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/v/g, 'ü')
    .replace(/[\s'’·\-]/g, '')
}

export type PinyinVerdict = {
  /** correct : tout juste ; neutral : seulement des tons neutres mal notés ;
   *  tone : bonnes syllabes mais tons faux ; wrong : syllabes fausses */
  status: 'correct' | 'neutral' | 'tone' | 'wrong'
  /** pour chaque syllabe : true si juste (null si non évaluable) */
  perSyl: (boolean | null)[]
}

/** Compare la saisie de l'utilisateur au pinyin attendu. */
export function checkPinyin(input: string, syl: string[], hanzi: string): PinyinVerdict {
  const user = clean(input)
  const target = syl.map((s) => clean(s))
  const chars = [...hanzi]
  if (stripTones(user) !== stripTones(target.join(''))) {
    return { status: 'wrong', perSyl: target.map(() => null) }
  }
  // Découpe la saisie selon la longueur de chaque syllabe attendue
  const userChars = [...user]
  let pos = 0
  let toneErr = false
  let neutralErr = false
  const perSyl = target.map((t, i) => {
    const len = [...t].length
    const piece = userChars.slice(pos, pos + len).join('')
    pos += len
    const want = toneOf(t)
    const got = toneOf(piece)
    if (got === want) return true
    // sandhi de 一 et 不 : la forme de dictionnaire est aussi acceptée
    if (chars[i] === '一' && got === 1) return true
    if (chars[i] === '不' && got === 4) return true
    if (want === 5) {
      neutralErr = true
      return false
    }
    toneErr = true
    return false
  })
  return { status: toneErr ? 'tone' : neutralErr ? 'neutral' : 'correct', perSyl }
}

export const TONE_NAMES: Record<Tone, string> = {
  1: '1er ton (haut et plat)',
  2: '2e ton (montant)',
  3: '3e ton (descendant puis montant)',
  4: '4e ton (descendant)',
  5: 'ton neutre (léger)',
}
