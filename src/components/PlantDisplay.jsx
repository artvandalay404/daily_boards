import { motion } from 'framer-motion'
import rawFlower from '../assets/flower.txt?raw'

function trimLines(lines) {
  const nonEmpty = lines.filter(l => l.trim().length > 0)
  if (!nonEmpty.length) return ''
  const minIndent = Math.min(...nonEmpty.map(l => l.match(/^ */)[0].length))
  return lines.map(l => l.slice(minIndent)).join('\n').trim()
}

// File is 1-indexed in the editor; JS array is 0-indexed.
// Line N in the file = index N-1 in the array.
const ALL_LINES = rawFlower.split('\n')

const STAGE_ARTS = [
  trimLines(ALL_LINES.slice(48, 54)), // lines 49–54: stem tip
  trimLines(ALL_LINES.slice(41, 54)), // lines 42–54: full lower stem
  trimLines(ALL_LINES.slice(34, 54)), // lines 35–54: leaves appear
  trimLines(ALL_LINES.slice(25, 54)), // lines 26–54: upper stem + leaves
  trimLines(ALL_LINES.slice(12, 54)), // lines 13–54: partial flower
  trimLines(ALL_LINES.slice(1,  54)), // lines  2–54: full bloom
]

const LABELS = [
  'Day one.',
  'Growing.',
  'Leaves forming.',
  'Stem strong.',
  'Blooming.',
  'Fully grown.',
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
          {streak} day streak — {LABELS[stageIndex]}
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
          {STAGE_ARTS[stageIndex]}
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
