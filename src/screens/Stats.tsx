import { WORDS } from '../data/hsk3'
import { FACET_INFO, FACETS, cardKey, dayKey, streak, useAppState } from '../lib/store'
import { wordLevel } from '../lib/srs'

const WEEKS = 15

export function Stats() {
  const s = useAppState()
  const days = Object.values(s.days)
  const totalReviews = days.reduce((a, d) => a + d.reviews, 0)
  const totalGood = days.reduce((a, d) => a + d.correct, 0)
  const totalMin = Math.round(days.reduce((a, d) => a + d.ms, 0) / 60000)
  const activeDays = days.filter((d) => d.reviews > 0).length

  // Grille d'activité : colonnes = semaines, lignes = jours (lundi en haut)
  const today = new Date(Date.now() - 4 * 3600_000)
  const offset = (today.getDay() + 6) % 7
  const cells: { key: string; n: number; future: boolean }[] = []
  for (let i = WEEKS * 7 - 1; i >= 0; i--) {
    const back = i - (6 - offset)
    const t = Date.now() - back * 86400_000
    cells.push({ key: dayKey(t), n: s.days[dayKey(t)]?.reviews ?? 0, future: back < 0 })
  }
  const levelOf = (n: number) => (n === 0 ? 0 : n < 15 ? 1 : n < 35 ? 2 : n < 60 ? 3 : 4)

  const levels = [0, 0, 0, 0]
  for (const w of WORDS) levels[wordLevel(s, w.id)]++

  // Solidité moyenne par compétence (stabilité FSRS, en jours)
  const facetStats = FACETS.map((f) => {
    const cards = Object.keys(s.introduced)
      .map((id) => s.cards[cardKey(id, f)])
      .filter((c) => c && c.reps > 0)
    const avg = cards.length ? cards.reduce((a, c) => a + c.stability, 0) / cards.length : 0
    return { f, n: cards.length, avg }
  })
  const maxAvg = Math.max(10, ...facetStats.map((x) => x.avg))

  return (
    <div className="screen stats">
      <h1 className="screen-title">Progrès</h1>

      <div className="stat-grid">
        <div className="stat">
          <b>{streak(s)}</b>
          <span>jours d'affilée</span>
        </div>
        <div className="stat">
          <b>{activeDays}</b>
          <span>jours actifs</span>
        </div>
        <div className="stat">
          <b>{totalReviews}</b>
          <span>révisions</span>
        </div>
        <div className="stat">
          <b>{totalReviews ? Math.round((totalGood / totalReviews) * 100) : 0}%</b>
          <span>réussite</span>
        </div>
        <div className="stat">
          <b>{totalMin}</b>
          <span>minutes</span>
        </div>
        <div className="stat">
          <b>{Object.keys(s.introduced).length}</b>
          <span>mots vus</span>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Activité</h2>
          <span className="muted small">{WEEKS} dernières semaines</span>
        </div>
        <div className="heatmap" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
          {cells.map((c) => (
            <span key={c.key} className={`hm hm-${c.future ? 'f' : levelOf(c.n)}`} title={`${c.key} : ${c.n}`} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Mots</h2>
        </div>
        <div className="stack-bar">
          {[3, 2, 1].map((l) => (
            <span key={l} className={`sb sb-${l}`} style={{ flex: levels[l] }} />
          ))}
          <span className="sb sb-0" style={{ flex: levels[0] }} />
        </div>
        <div className="legend">
          <span>
            <i className="lg sb-3" /> solides {levels[3]}
          </span>
          <span>
            <i className="lg sb-2" /> jeunes {levels[2]}
          </span>
          <span>
            <i className="lg sb-1" /> en cours {levels[1]}
          </span>
          <span>
            <i className="lg sb-0" /> à découvrir {levels[0]}
          </span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Mémoire par compétence</h2>
        </div>
        <p className="muted small">Durée moyenne pendant laquelle tu retiens un mot (stabilité FSRS).</p>
        {facetStats.map(({ f, n, avg }) => (
          <div key={f} className="facet-stat">
            <span className="fs-label">{FACET_INFO[f].label}</span>
            <div className="fs-bar">
              <div style={{ width: `${(avg / maxAvg) * 100}%`, background: FACET_INFO[f].color }} />
            </div>
            <span className="fs-val">{n ? `${avg < 1 ? '<1' : Math.round(avg)} j` : '–'}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
