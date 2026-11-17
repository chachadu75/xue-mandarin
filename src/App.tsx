import { useState } from 'react'
import { Icon } from './components/icons'
import { Home } from './screens/Home'
import { Library } from './screens/Library'
import { Session } from './screens/Session'
import { Settings } from './screens/Settings'
import { Stats } from './screens/Stats'

type Tab = 'home' | 'library' | 'stats' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Aujourd’hui', icon: 'home' },
  { id: 'library', label: 'Lexique', icon: 'book' },
  { id: 'stats', label: 'Progrès', icon: 'chart' },
  { id: 'settings', label: 'Réglages', icon: 'gear' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [session, setSession] = useState<{ extraNew: number } | null>(null)

  if (session) {
    return <Session extraNew={session.extraNew} onExit={() => setSession(null)} />
  }

  return (
    <div className="app">
      <div className="content">
        {tab === 'home' && <Home onStart={(extraNew = 0) => setSession({ extraNew })} />}
        {tab === 'library' && <Library />}
        {tab === 'stats' && <Stats />}
        {tab === 'settings' && <Settings />}
      </div>
      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={24} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
