import { motion } from 'framer-motion'
import rawFlower from '../assets/flower.txt?raw'

function trimArt(raw) {
  const lines = raw.split('\n')
  const nonEmpty = lines.filter(l => l.trim().length > 0)
  if (!nonEmpty.length) return raw.trim()
  const minIndent = Math.min(...nonEmpty.map(l => l.match(/^ */)[0].length))
  return lines.map(l => l.slice(minIndent)).join('\n').trim()
}

const fullFlower = trimArt(rawFlower)

const STAGES = [
  {
    art: `\
    .
    |
  __|__
 |     |
 |_____|`,
    label: 'Day one.',
  },
  {
    art: `\
  \\   /
   \\ /
    .
    |
  __|__
 |     |
 |_____|`,
    label: 'First leaves.',
  },
  {
    art: `\
   ,-.
  (   )
   '-'
    |
    |
  __|__
 |     |
 |_____|`,
    label: 'A bud.',
  },
  {
    art: `\
   ,--,
  (    )
  (    )
   '--'
    |
    |
  __|___
 |      |
 |______|`,
    label: 'Opening up.',
  },
  {
    art: `\
    ,---.
   (     )
   ( o o )
   (     )
    '---'
      |
  \\   |   /
   \\  |  /
    __|__
   |     |
   |_____|`,
    label: 'Looking healthy.',
  },
  {
    art: fullFlower,
    label: 'Fully grown.',
  },
]

function getStage(streak) {
  if (streak >= 35) return 5
  if (streak >= 20) return 4
  if (streak >= 10) return 3
  if (streak >= 5)  return 2
  if (streak >= 2)  return 1
  return 0
}

function getNextMilestone(streak) {
  const milestones = [2, 5, 10, 20, 35]
  return milestones.find(m => m > streak) ?? null
}

export default function PlantDisplay({ streak }) {
  const stageIndex = getStage(streak)
  const stage = STAGES[stageIndex]
  const next = getNextMilestone(streak)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-3xl overflow-hidden mb-6"
      style={{ background: 'var(--surface-low)' }}
    >
      <div
        className="px-6 py-4"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dim) 100%)' }}
      >
        <h2 className="font-extrabold text-lg" style={{ color: 'var(--on-primary)' }}>
          Your Plant
        </h2>
        <p className="text-sm mt-0.5 opacity-80" style={{ color: 'var(--on-primary)', fontFamily: 'Work Sans, sans-serif' }}>
          {streak} day streak — {stage.label}
        </p>
      </div>

      <div className="py-8 px-6 flex flex-col items-center overflow-x-auto" style={{ background: 'var(--surface)' }}>
        <pre
          className="select-none"
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            color: 'var(--primary)',
            textAlign: 'left',
          }}
        >
          {stage.art}
        </pre>

        {next && (
          <p
            className="mt-6 text-xs"
            style={{ color: 'var(--text-faint)', fontFamily: 'Work Sans, sans-serif' }}
          >
            {next - streak} more day{next - streak !== 1 ? 's' : ''} until next growth
          </p>
        )}
      </div>
    </motion.div>
  )
}
