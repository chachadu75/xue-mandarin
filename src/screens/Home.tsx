import { WORD_BY_ID } from '../data/hsk3'
import { Icon } from '../components/icons'
import { Hanzi, Ring } from '../components/ui'
import { dueItems, newWordsLeftToday, nextNewWords, progress } from '../lib/srs'
import { dayKey, FACET_INFO, FACETS, streak, useAppState } from '../lib/store'

const DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

export function Home({ onStart }: { onStart: (extraNew?: number) => void }) {
  const s = useAppState()
  const due = dueItems(s)
  const newLeft = newWordsLeftToday(s)
  const nextIds = nextNewWords(s, Math.max(newLeft, 3))
  const p = progress(s)
  const today = s.days[dayKey()]
  const minutesToday = Math.round((today?.ms ?? 0) / 60000)
  const goal = s.settings.minutes
  const st = streak(s)
  const allDone = due.length === 0 && newLeft === 0

  const byFacet = Object.fromEntries(FACETS.map((f) => [f, 0])) as Record<string, number>
  for (const it of due) if (it.kind === 'card') byFacet[it.facet]++

  // 7 derniers jours
  const week = Array.from({ length: 7 }, (_, i) => {
    const t = Date.now() - (6 - i) * 86400_000
    const d = new Date(t - 4 * 3600_000)
    return { label: DAYS[d.getDay()], done: (s.days[dayKey(t)]?.reviews ?? 0) > 0, today: i === 6 }
  })

  const hour = new Date().getHours()
  const hello = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  const helloPy = hour < 12 ? 'Zǎoshang hǎo' : hour < 18 ? 'Xiàwǔ hǎo' : 'Wǎnshang hǎo'

  return (
    <div className="screen home">
      <header className="home-head">
        <div>
          <div className="hello">{hello}</div>
          <div className="hello-py">{helloPy} !</div>
        </div>
        <div className={'streak' + (st > 0 ? ' on' : '')}>
          <Icon name="flame" size={18} fill />
          <b>{st}</b> j
        </div>
      </header>

      <section className="hero">
        <Ring value={minutesToday / goal} size={124}>
          <div className="ring-big">{Math.min(minutesToday, 99)}</div>
          <div className="ring-small">/ {goal} min</div>
        </Ring>
        <div className="hero-right">
          <div className="hero-title">{allDone ? 'Tout est à jour !' : 'Session du jour'}</div>
          <div className="hero-line">
            <span className="num">{due.length}</span> à revoir
          </div>
          <div className="hero-line">
            <span className="num">{newLeft}</span> mot{newLeft > 1 ? 's' : ''} nouveau{newLeft > 1 ? 'x' : ''}
          </div>
        </div>
      </section>

      <button className="start-btn" onClick={() => onStart(allDone ? 3 : 0)}>
        <span>{allDone ? 'Apprendre 3 mots de plus' : 'Commencer'}</span>
        <span className="start-sub">{allDone ? 'bonus' : `≈ ${goal} min`}</span>
      </button>

      {due.length > 0 && (
        <section className="facet-row">
          {FACETS.filter((f) => s.settings.facets[f]).map((f) => (
            <div key={f} className="facet-tile" style={{ ['--tile' as string]: FACET_INFO[f].color }}>
              <b>{byFacet[f]}</b>
              <span>{FACET_INFO[f].label}</span>
            </div>
          ))}
        </section>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>Cette semaine</h2>
        </div>
        <div className="week">
          {week.map((d, i) => (
            <div key={i} className={'week-day' + (d.done ? ' done' : '') + (d.today ? ' today' : '')}>
              <span className="week-dot">{d.done && <Icon name="check" size={14} />}</span>
              <span className="week-label">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>HSK 3</h2>
          <span className="muted small">
            {p.introduced} / {p.total} mots
          </span>
        </div>
        <div className="bar">
          <div className="bar-fill learned" style={{ width: `${(p.introduced / p.total) * 100}%` }} />
          <div className="bar-fill mature" style={{ width: `${(p.mature / p.total) * 100}%` }} />
        </div>
        <div className="legend">
          <span>
            <i className="lg learned" /> découverts {p.introduced}
          </span>
          <span>
            <i className="lg mature" /> solides {p.mature}
          </span>
        </div>
      </section>

      {nextIds.length > 0 && (
        <section className="panel">
          <div className="panel-head">
            <h2>Prochains mots</h2>
          </div>
          <div className="next-words">
            {nextIds.map((id) => (
              <div key={id} className="next-word">
                <Hanzi word={WORD_BY_ID[id]} size={26} />
                <span>{WORD_BY_ID[id].fr.split(/[;,(]/)[0].trim()}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
