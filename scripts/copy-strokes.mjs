// Copie dans public/strokes les données de tracé (hanzi-writer-data) des seuls
// caractères utilisés par le vocabulaire, pour que le tracé marche hors ligne.
import { readFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'src/data/hsk3.ts'), 'utf8')
const raw = src.slice(src.indexOf('const RAW = `') + 13, src.indexOf('`\n\nexport type Word'))
const chars = new Set()
for (const line of raw.split('\n')) {
  if (!line.trim() || line.startsWith('## ')) continue
  for (const c of line.split('|')[0]) chars.add(c)
}
const out = join(root, 'public/strokes')
mkdirSync(out, { recursive: true })
let missing = []
for (const c of chars) {
  const from = join(root, 'node_modules/hanzi-writer-data', `${c}.json`)
  if (existsSync(from)) copyFileSync(from, join(out, `${c}.json`))
  else missing.push(c)
}
console.log(`strokes: ${chars.size - missing.length} caractères copiés` + (missing.length ? `, manquants : ${missing.join('')}` : ''))
