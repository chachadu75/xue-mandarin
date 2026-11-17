import { useRef, useState } from 'react'
import { canRecognize, canSpeak, speak } from '../lib/speech'
import { exportState, FACET_INFO, FACETS, importState, resetState, setState, useAppState, type Settings as S } from '../lib/store'

export function Settings() {
  const s = useAppState()
  const set = (patch: Partial<S>) => setState((st) => ({ ...st, settings: { ...st.settings, ...patch } }))
  const file = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState('')
  const standalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone)

  function download() {
    const blob = new Blob([exportState()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `xue-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }

  return (
    <div className="screen settings">
      <h1 className="screen-title">Réglages</h1>

      <section className="panel">
        <h2>Session quotidienne</h2>
        <div className="setting">
          <span>Durée</span>
          <div className="seg big">
            {[5, 10, 15, 20].map((m) => (
              <button key={m} className={s.settings.minutes === m ? 'on' : ''} onClick={() => set({ minutes: m })}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className="setting">
          <span>Mots nouveaux par jour</span>
          <div className="stepper">
            <button onClick={() => set({ newPerDay: Math.max(0, s.settings.newPerDay - 1) })}>−</button>
            <b>{s.settings.newPerDay}</b>
            <button onClick={() => set({ newPerDay: Math.min(20, s.settings.newPerDay + 1) })}>+</button>
          </div>
        </div>
        <p className="muted small">Avec 10 minutes par jour, 4 à 6 mots nouveaux est un bon rythme : les révisions prennent vite de la place.</p>
      </section>

      <section className="panel">
        <h2>Exercices</h2>
        {FACETS.map((f) => (
          <label key={f} className="toggle-row">
            <span className="dot" style={{ background: FACET_INFO[f].color }} />
            <span className="tr-text">
              <b>{FACET_INFO[f].label}</b>
              <span className="muted small">{FACET_INFO[f].hint}</span>
            </span>
            <input
              type="checkbox"
              className="switch"
              checked={s.settings.facets[f]}
              onChange={(e) => {
                const facets = { ...s.settings.facets, [f]: e.target.checked }
                if (!Object.values(facets).some(Boolean)) return
                set({ facets })
              }}
            />
          </label>
        ))}
      </section>

      <section className="panel">
        <h2>Audio</h2>
        <label className="toggle-row">
          <span className="tr-text">
            <b>Lecture automatique</b>
            <span className="muted small">Prononcer le mot quand la réponse s'affiche</span>
          </span>
          <input type="checkbox" className="switch" checked={s.settings.autoAudio} onChange={(e) => set({ autoAudio: e.target.checked })} />
        </label>
        <div className="setting col">
          <span>
            Vitesse de la voix : <b>{Math.round(s.settings.rate * 100)}%</b>
          </span>
          <input
            type="range"
            min={0.5}
            max={1.1}
            step={0.05}
            value={s.settings.rate}
            onChange={(e) => set({ rate: Number(e.target.value) })}
          />
        </div>
        <button className="btn btn-ghost btn-block" onClick={() => speak('你好，我们一起学习中文吧！')}>
          Tester la voix
        </button>
        <p className="muted small">
          Voix chinoise : {canSpeak() ? 'disponible' : 'indisponible'} · Reconnaissance vocale : {canRecognize() ? 'disponible' : 'indisponible ici (auto-évaluation)'}
        </p>
      </section>

      {!standalone && (
        <section className="panel install">
          <h2>Installer sur iPhone</h2>
          <ol>
            <li>Ouvre cette page dans Safari.</li>
            <li>
              Touche le bouton <b>Partager</b> (carré avec une flèche).
            </li>
            <li>
              Choisis <b>Sur l'écran d'accueil</b>, puis <b>Ajouter</b>.
            </li>
          </ol>
          <p className="muted small">L'app s'ouvre alors en plein écran, marche hors ligne, et iOS garde tes données.</p>
        </section>
      )}

      <section className="panel">
        <h2>Sauvegarde</h2>
        <p className="muted small">Tes progrès sont stockés sur ce téléphone. Exporte-les de temps en temps.</p>
        <div className="row-btns">
          <button className="btn btn-ghost" onClick={download}>
            Exporter
          </button>
          <button className="btn btn-ghost" onClick={() => file.current?.click()}>
            Importer
          </button>
        </div>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            try {
              importState(await f.text())
              setNote('Sauvegarde importée.')
            } catch {
              setNote('Ce fichier n’est pas une sauvegarde valide.')
            }
            e.target.value = ''
          }}
        />
        {note && <p className="small center">{note}</p>}
        <button
          className="btn btn-danger btn-block"
          onClick={() => {
            if (confirm('Effacer toute ta progression ? Cette action est définitive.')) resetState()
          }}
        >
          Tout réinitialiser
        </button>
      </section>

      <p className="muted small center credits">
        Données de tracé : Make Me a Hanzi (Arphic Public License) · Répétition espacée : FSRS
      </p>
    </div>
  )
}
