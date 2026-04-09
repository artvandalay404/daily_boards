import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import Greeting from './components/Greeting'
import StreakBadge from './components/StreakBadge'
import CardDisplay from './components/CardDisplay'
import RevealButton from './components/RevealButton'
import PlantDisplay from './components/PlantDisplay'
import { useDailyCard } from './hooks/useDailyCard'
import { useStreak } from './hooks/useStreak'
import { fetchClue } from './utils/anthropic'

const THEMES = [
  { id: 'forest',   label: 'Forest',   icon: '🌿' },
  { id: 'sunny',    label: 'Sunny',    icon: '☀️' },
  { id: 'midnight', label: 'Midnight', icon: '🌙' },
]

const CONFETTI_COLORS = {
  forest:   ['#176a21', '#9df197', '#8f4816', '#ffc5a5', '#39653f'],
  sunny:    ['#d97706', '#fcd34d', '#be185d', '#fce7f3', '#f59e0b'],
  midnight: ['#818cf8', '#6366f1', '#f472b6', '#c4b5fd', '#a5b4fc'],
}

function SetupScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
         style={{ background: 'var(--bg)' }}>
      <div className="max-w-md w-full rounded-3xl shadow-xl p-8 text-center"
           style={{ background: 'var(--surface)' }}>
        <h1 className="text-2xl font-extrabold mb-3" style={{ color: 'var(--text)' }}>
          Cards not found!
        </h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          Run the extraction script to generate{' '}
          <code className="px-1 py-0.5 rounded text-xs"
                style={{ background: 'var(--surface-low)', color: 'var(--primary)' }}>
            public/cards.json
          </code>{' '}
          from the AnKing deck.
        </p>
        <pre className="text-xs rounded-2xl p-4 text-left overflow-x-auto"
             style={{ background: 'var(--surface-mid)', color: 'var(--primary)' }}>
{`pip install beautifulsoup4
python scripts/extract_cards.py \\
  "AnKing V11 updated.apkg" \\
  public/cards.json`}
        </pre>
      </div>
    </div>
  )
}

export default function App() {
  const { card, loading, error } = useDailyCard()
  const streak = useStreak()
  const [debugStreak, setDebugStreak] = useState(null)
  const displayStreak = import.meta.env.DEV && debugStreak !== null ? debugStreak : streak
  const [revealed, setRevealed] = useState(false)
  const [clue, setClue] = useState(null)
  const [clueLoading, setClueLoading] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    const hour = new Date().getHours()
    if (hour < 12) return 'sunny'
    if (hour < 19) return 'forest'
    return 'midnight'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function handleReveal() {
    setRevealed(true)
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS[theme],
    })
  }

  async function handleClue() {
    setClueLoading(true)
    try {
      const hint = await fetchClue(card)
      setClue(hint)
    } catch {
      setClue('Think about the underlying mechanism...')
    } finally {
      setClueLoading(false)
    }
  }

  function copyCard() {
    const strip = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    const text = `Q: ${strip(card.front)}\n\nA: ${strip(card.back)}`
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
               style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          <p className="font-medium text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading today's card...
          </p>
        </div>
      </div>
    )
  }

  if (error) return <SetupScreen />

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-300"
         style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Theme switcher + debug */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <div className="flex items-center gap-1 rounded-full px-2 py-1.5"
               style={{ background: 'var(--surface-low)' }}>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all duration-200"
                style={{
                  background: theme === t.id ? 'var(--primary)' : 'transparent',
                  fontSize: '1rem',
                  transform: theme === t.id ? 'scale(1.1)' : 'scale(1)',
                }}
                aria-label={`Switch to ${t.label} theme`}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </div>

        <Greeting />
        <StreakBadge streak={streak} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardDisplay card={card} revealed={revealed} />

          {!revealed ? (
            <>
              {/* Clue box */}
              {clue && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl px-5 py-3 mb-3 flex items-start gap-3"
                  style={{ background: 'var(--secondary-container)' }}
                >
                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--secondary)', fontFamily: 'Work Sans, sans-serif' }}>
                    {clue}
                  </p>
                </motion.div>
              )}

              {/* Clue button */}
              {!clue && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleClue}
                  disabled={clueLoading}
                  className="w-full py-3 rounded-full font-semibold text-sm mb-3 transition-opacity"
                  style={{
                    background: 'var(--secondary-container)',
                    color: 'var(--secondary)',
                    opacity: clueLoading ? 0.6 : 1,
                    fontFamily: 'Work Sans, sans-serif',
                  }}
                >
                  {clueLoading ? 'Thinking...' : 'Get a Clue'}
                </motion.button>
              )}

              <RevealButton onClick={handleReveal} />
            </>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={copyCard}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-colors mb-6"
              style={{
                background: 'var(--surface-low)',
                color: 'var(--text-muted)',
                border: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-mid)'; e.currentTarget.style.color = 'var(--primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-low)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              Copy card to clipboard
            </motion.button>
          )}
        </motion.div>

        {import.meta.env.DEV && (
          <div className="flex items-center justify-center gap-3 mb-3">
            <button
              onClick={() => setDebugStreak(d => Math.max(1, (d ?? streak) - 1))}
              className="w-7 h-7 rounded-full font-mono text-sm flex items-center justify-center"
              style={{ background: 'var(--surface-mid)', color: 'var(--text-muted)' }}
            >−</button>
            <span className="text-xs font-mono" style={{ color: 'var(--text-faint)' }}>
              day {displayStreak}
            </span>
            <button
              onClick={() => setDebugStreak(d => (d ?? streak) + 1)}
              className="w-7 h-7 rounded-full font-mono text-sm flex items-center justify-center"
              style={{ background: 'var(--surface-mid)', color: 'var(--text-muted)' }}
            >+</button>
          </div>
        )}
        <PlantDisplay streak={displayStreak} />

        <p className="text-center text-xs mt-8 mb-4" style={{ color: 'var(--text-faint)' }}>
          you got this :)) -sn
        </p>
      </div>
    </div>
  )
}
